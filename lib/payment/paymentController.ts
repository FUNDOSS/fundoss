import Payment from './paymentModel';
import Donation from './donationModel';
import dbConnect from '../dbConnect';
import FundingSessions from '../fundingSession/fundingSessionController';
import Collectives from '../collectives/CollectivesController';
import fundingSessionModel from '../fundingSession/fundingSessionModel';

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

export async function getPayments() {
  await dbConnect();
  return Payment.find().select('user amount donations fee status time')
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

export default class Payments {
    static insert = insertPayment

    static findById = findById

    static update = updatePayment

    static get = getPayments

    static getByUser = getPaymentsByUser
}
