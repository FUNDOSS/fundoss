import mongoose from 'mongoose';
import Payment from './paymentModel';

const calculateSybilAttackScore = async (payment) => {
  let score = 0;
  const agg = await Payment
    .aggregate([
      {
        $match: {
          $or: {
            cardFingerprint: payment.cardFingerprint,
            browserFingerprint: payment.browserFingerprint,
            ipAddress: payment.ipAddress,
          },
          user: { $ne: mongoose.Types.ObjectId(payment.user._id || payment.user) },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
  if (agg.length) score += agg[0].count;
  return score;
};

export default calculateSybilAttackScore;
