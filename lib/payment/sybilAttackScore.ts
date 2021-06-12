import mongoose from 'mongoose';
import Payment from './paymentModel';

const calculateSybilAttackScore = async (payment) => {
  let score = 0;
  const sameCard = await Payment
    .aggregate([
      {
        $match: {
          cardFingerprint: payment.cardFingerprint,
          user: { $ne: mongoose.Types.ObjectId(payment.user._id || payment.user) },
        },
      },
      { $group: { _id: null, count: { $sum: 1 }} },
    ]);
  const sameBrowser = await Payment
    .aggregate([
      {
        $match: {
          browserFingerprint: payment.browserFingerprint,
          user: { $ne: mongoose.Types.ObjectId(payment.user._id || payment.user) },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
  if (sameCard.length) score += sameCard[0].count;
  if (sameBrowser.length) score += sameBrowser[0].count;
  return score;
};

export default calculateSybilAttackScore;
