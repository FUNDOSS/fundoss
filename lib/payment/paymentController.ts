import mongoose from 'mongoose';
import Payment from './paymentModel';
import Donation from './donationModel';
import dbConnect from '../dbConnect';
import FundingSessions from '../fundingSession/fundingSessionController';
import Collectives from '../collectives/CollectivesController';
import Qf from '../../utils/qf';
import calculateSybilAttackScore from './sybilAttackScore';

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
          await Collectives.updateTotals([collectiveId], payment.session);
          return donation._id;
        }),
    );
    FundingSessions.updateSessionTotals(payment.session);
    paymentUpdates.sybilAttackScore = await calculateSybilAttackScore(payment);
    paymentUpdates.donations = donations;
    paymentUpdates.browserFingerprint = payment.browserFingerprint;
    paymentUpdates.fee = fee;
  }

  return Payment.updateOne({ _id: payment._id }, { ...payment, ...paymentUpdates });
}

export async function getSessionTotals(session) {
  const sessionTotals = (await Donation
    .aggregate([
      { $match: { session: mongoose.Types.ObjectId(session), cancelled: { $ne: true } } },
      { $group: { _id: { user: '$user', collective: '$collective' }, amount: { $sum: '$amount' } } },
    ]));
  const totals = sessionTotals.reduce((acc, don) => ({
    donations: [...acc.donations, don.amount],
    amount: acc.amount + don.amount,
  }), { donations: [], amount: 0 });
  return totals;
}

export async function findById(id:string) {
  await dbConnect();
  return Payment.findOne({ _id: id }).select('user sid intentId session amount donations fee status time confirmation cardFingerprint browserFingerprint sybilAttackScore ipAddress stripeRisk error refund')
    .populate({ path: 'user' })
    .populate({ path: 'session', select: 'name slug' })
    .populate({
      path: 'donations',
      populate: {
        path: 'collective',
        select: 'slug imageUrl name',
      },
    });
}

export async function getPage(query, pageSize = 10) {
  await dbConnect();
  const sort = query.sort ? query.sort : '-time';
  const q = { ...query };
  const page = query.page ? Number(query.page) : 1;
  if (q.collective) {
    const donations = await donationModel.find(
      { collective: mongoose.Types.ObjectId(q.collective) },
    );
    q._id = { $in: donations.map((d) => d.payment) };
    delete q.collective;
  }
  if (q.session) {
    q.session = mongoose.Types.ObjectId(q.session);
  }
  if (q.user) {
    q.user = mongoose.Types.ObjectId(q.user);
  }
  delete q.sort;
  delete q.page;
  const count = await Payment.aggregate([

    { $match: q },
    { $group: { _id: null, count: { $sum: 1 } } },

  ]);

  const res = await Payment.find(q).select('user session amount donations fee status time sybilAttackScore stripeRisk')
    .populate({ path: 'session', select: 'name' })
    .populate({ path: 'user', select: 'avatar username name' })
    .populate({
      path: 'donations',
      populate: {
        path: 'collective',
        select: 'slug imageUrl',
      },
    })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(`field ${sort}`);

  return { count: count[0].count, payments: res, page };
}

export async function getPayments(query, skip = 0, limit = 10000) {
  await dbConnect();
  const sort = query.sort ? query.sort : '-time';
  const q = { ...query };
  if (q.collective) {
    const donations = await donationModel.find(
      { collective: mongoose.Types.ObjectId(q.collective) },
    );
    q._id = { $in: donations.map((d) => d.payment) };
    delete q.collective;
  }
  delete q.sort;
  return Payment.find(q).select('user session amount donations fee status time sybilAttackScore stripeRisk')
    .populate({ path: 'session', select: 'name' })
    .populate({ path: 'user', select: 'avatar username name' })
    .populate({
      path: 'donations',
      populate: {
        path: 'collective',
        select: 'slug imageUrl',
      },
    })
    .limit(limit)
    .skip(skip)
    .sort(`field ${sort}`);
}

export async function getDonationsBySession(sessionId) {
  const donations = Donation
    .aggregate([
      { $match: { session: mongoose.Types.ObjectId(sessionId), cancelled: { $ne: true } } },
      { $unwind: { path: '$user' } },
      {
        $group: {
          _id: { user: '$user', collective: '$collective' },
          amount: { $sum: '$amount' },
          fee: { $sum: '$fee' },
          avatar: { $first: '$avatar' },
        },
      },

    ]);
  return Donation.populate(donations, { path: '_id.user' });
}

export async function getSessionDisbursement(sessionId) {
  const session = await FundingSessions.getById(sessionId);
  const donations = await Donation
    .aggregate([
      { $match: { session: mongoose.Types.ObjectId(sessionId), cancelled: { $ne: true } } },
      { $group: { _id: { user: '$user', collective: '$collective' }, amount: { $sum: '$amount' }, fee: { $sum: '$fee' } } },
    ]);
  const numDonations = donations.length;
  const totalDonations = donations.reduce((total, d) => total + d.amount, 0);
  const averageDonation = totalDonations / numDonations;
  const averageMatch = session.matchedFunds / numDonations;
  const matches = donations.map((d) => ({
    collective: d._id.collective,
    amount: d.amount,
    match: Qf.calculate(
      d.amount,
      averageDonation,
      averageMatch,
      session.matchingCurve.exp,
      1,
      session.matchingCurve.exp,
      ),
    fee: d.fee,
  }));
  const totalMatches = matches.reduce((total, m) => total + m.match, 0);
  const matchRatio = totalMatches / session.matchedFunds;
  const collectivesTotalsInit = session.collectives.reduce(
    (cols, col) => ({ ...cols, ...{ [col._id]: { donation: 0, match: 0, fee: 0 } } }),
    {},
  );
  const collectiveTotals = matches.reduce((totals, m) => {
    const total = totals[m.collective] ? totals[m.collective] : { donation: 0, match: 0, fee: 0 };
    const collective = {
      donation: total.donation + m.amount,
      match: total.match + (m.match / matchRatio),
      fee: total.fee + m.fee,
    };
    return { ...totals, ...{ [m.collective]: collective } };
  }, collectivesTotalsInit);
  const disbursments = session.collectives.map((c) => {
    const totals = collectiveTotals[c._id];
    const matched = Math.round(totals.match * 100) / 100;
    const fee = Math.round(totals.fee * 100) / 100;
    const donation = Math.round(totals.donation * 100) / 100;
    return {
      slug: c.slug,
      donation,
      matched,
      fee,
      total: Math.round((donation + matched - fee) * 100) / 100,
    };
  });

  return disbursments;
}

export async function getPaymentsByUser(userId:string) {
  await dbConnect();
  return Payment.find({ user: userId, status: 'succeeded' }).select('sid session user amount donations fee status time')
    .populate({ path: 'session', select: 'slug name' })
    .populate({
      path: 'donations',
      populate: {
        path: 'collective',
        select: 'slug imageUrl name description',
      },
    })
    .sort('field -time');
}

export async function getDonationsByUser(userId:string) {
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

export async function getGroupedDonationsByUser(userId:string, sessionId:string) {
  await dbConnect();
  return (await Donation.aggregate([
    {
      $match: {
        session: mongoose.Types.ObjectId(sessionId),
        user: mongoose.Types.ObjectId(userId),
        cancelled: { $ne: true },
      },
    },
    { $group: { _id: { collective: '$collective' }, amount: { $sum: '$amount' } } },
  ])).reduce((collectives, donation) => (
    { ...collectives, ...{ [donation._id.collective]: donation.amount } }
  ), {});
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
      },
    )
    .populate(
      {
        path: 'session',
        select: 'sponsors',
      },
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

    static getPaymentsByUser = getPaymentsByUser

    static getDonationsByUser = getDonationsByUser

    static getSessionDisbursement = getSessionDisbursement

    static getShared = getSharedPayment

    static getGroupedDonationsByUser = getGroupedDonationsByUser

    static getDonationsBySession = getDonationsBySession

    static getSessionTotals = getSessionTotals

    static getPage = getPage
}
