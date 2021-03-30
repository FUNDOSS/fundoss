import mongoose from 'mongoose';
import Payment from './paymentModel';
import Donation from './donationModel';
import dbConnect from '../dbConnect';
import FundingSessions from '../fundingSession/fundingSessionController';
import Collectives from '../collectives/CollectivesController';
import fundingSessionModel from '../fundingSession/fundingSessionModel';
import Qf from '../../utils/qf';

export async function insertPayment(payment) {
  await dbConnect();
  const currentSession = await FundingSessions.getCurrent();
  return Payment.create({ ...payment, session: currentSession._id });
}

export async function updatePayment(payment) {
  await dbConnect();
  const paymentUpdates: any = {};
  if (payment.donations) {
    const fee = payment.confirmation.charges.data
      .reduce((acc, charge) => acc + (charge.balance_transaction.fee / 100), 0);
    console.log('payment fee', fee)
    console.log('payment charge', payment.confirmation.charges.data)
    const donations = await Promise.all(
      Object.keys(payment.donations)
        .map(async (collectiveId) => {
          const amt = payment.donations[collectiveId];
          const donation = await Donation.create(
            {
              payment: payment._id,
              session: payment.session,
              collective: collectiveId,
              amount: amt,
              user: payment.user,
              fee: Math.ceil((amt / payment.amount) * fee * 100) / 100,
            },
          );

          const collectiveTotals = (await Donation.find(
            { collective: collectiveId, session: payment.session },
          )).reduce((acc, don) => ({
            donations: acc.donations + 1,
            amount: acc.amount + don.amount,
          }), { donations: 0, amount: 0 });

          await Collectives.updateTotals(collectiveId, payment.session, collectiveTotals);
          return donation._id;
        }),
    );

    const sessionTotals = (await Donation.find(
      { session: payment.session },
    )).reduce((acc, don) => ({
      donations: acc.donations + 1,
      amount: acc.amount + don.amount,
    }), { donations: 0, amount: 0 });

    await fundingSessionModel.updateOne({ _id: payment.session }, { totals: sessionTotals });

    paymentUpdates.donations = donations;
    paymentUpdates.fee = fee;
  }

  return Payment.updateOne({ _id: payment._id }, { ...payment, ...paymentUpdates });
}

export async function findById(id:string) {
  await dbConnect();
  return Payment.findOne({ _id: id });
}

export async function getPayments(query) {
  await dbConnect();
  return Payment.find(query).select('user amount donations fee status time')
    .populate({ path: 'user', select: 'avatar username' })
    .populate({
      path: 'donations',
      populate: {
        path: 'collective',
        select: 'slug imageUrl',
      },
    })
    .sort('field -time')
    .limit(20);
}

export async function getSessionDisbursement(sessionId){
  const ObjectId = mongoose.Types.ObjectId;
  const session = await FundingSessions.getById(sessionId);
  const donations = await Donation
    .aggregate([
      {$match: {session:ObjectId(sessionId)}},
      {$group: {_id:{user:'$user', collective: '$collective'}, amount:{$sum:'$amount' }, fee:{$sum:'$fee' }}},
    ]);
    const numDonations = donations.length;
    const totalDonations = donations.reduce((total, d) => total += d.amount ,0);
    const averageDonation = totalDonations / numDonations;
    const averageMatch = session.matchedFunds / numDonations;
    const matches = donations.map(d => ({
      collective: d._id.collective,
      amount: d.amount,
      match: Qf.calculate(d.amount,averageDonation,averageMatch),
      fee: d.fee,
    }))
    const totalMatches = matches.reduce((total, m) => total += m.match, 0)
    const matchRatio = totalMatches/session.matchedFunds
    const collectivesTotalsInit = session.collectives.reduce(
      (cols,col)=> ({...cols, ...{[col._id]: {donation: 0, match:0, fee:0 } }})
    , {})
    const collectiveTotals = matches.reduce( (totals, m) => {
      totals[m.collective].donation += m.amount;
      totals[m.collective].match += m.match / matchRatio;
      totals[m.collective].fee += m.fee;
      return totals;
    }, collectivesTotalsInit);
    const disbursments = session.collectives.map(c=>{
      const totals = collectiveTotals[c._id];
      const matched = Math.round(totals.match*100)/100
      const fee = Math.round(totals.fee*100)/100
      const donation = Math.round(totals.donation*100)/100
      return {
        slug: c.slug,
        donation,
        matched,
        fee,
        total: Math.round((donation + matched - fee)*100)/100
      }})

  return disbursments;
}

export async function getPaymentsByUser(userId:string) {
  await dbConnect();
  return Payment.find({ user: userId, status: 'succeeded' }).select('user amount donations fee status time')
    .populate({ path: 'user', select: 'avatar username' })
    .populate({
      path: 'donations',
      populate: {
        path: 'collective',
        select: 'slug imageUrl',
      },
    })
    .sort('field -time')
    .limit(20);
}

export async function getDonationsByUser(userId:string){
  await dbConnect();
  return Donation.find({ user: userId })
    .populate({
      path: 'collective',
      select: 'name imageUrl slug',
    })
    .populate({
      path: 'payment',
      select: 'time',
    })
    .sort('field -_id');
}

export async function getLastPaymentByUser(userId:string) {
  await dbConnect();
  const payment = await Payment.findOne({ user: userId, status: 'succeeded' })
    .populate({
      path: 'donations',
      populate: {
        path: 'collective',
        select: 'imageUrl name slug',
      },
    })
    .sort('field -time');
  return payment;
}

export async function getSharedPayment(sid:string) {
  await dbConnect();
  const payment = await Payment.findOne({ sid })
    .populate({
      path: 'donations',
      populate: {
        path: 'collective',
        select: 'imageUrl name slug',
      },
    })
    .populate(
      {
        path: 'user',
        select: 'name avatar',
      }
    )
    .sort('field -time');
  return payment;
}

export default class Payments {
    static insert = insertPayment

    static findById = findById

    static update = updatePayment

    static get = getPayments

    static getByUser = getPaymentsByUser

    static getLastByUser = getLastPaymentByUser

    static getDonationsByUser = getDonationsByUser

    static getSessionDisbursement = getSessionDisbursement

    static getShared = getSharedPayment
}
