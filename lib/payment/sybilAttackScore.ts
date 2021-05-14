import mongoose from 'mongoose';
import Payment from './paymentModel';

const calculateSybilAttackScore = async (payment) => {
  const sameCard = await Payment
    .aggregate([
      {
        $match: {
          cardFingerPrint: payment.cardFingerPrint,
          user: { $ne: mongoose.Types.ObjectId(payment.user) },
        },
      },
      { $group: { _id: { card: '$cardFingerPrint', user: '$user' } } },
    ]);
  const sameBrowser = await Payment
    .aggregate([
      {
        $match: {
          browserFingerPrint: payment.browserFingerPrint,
          user: { $ne: mongoose.Types.ObjectId(payment.user) },
        },
      },
      { $group: { _id: { browser: '$browserFingerPrint', user: '$user' } } },
    ]);
  const cardScore = sameCard.reduce((s) => s + 1, 0);
  const browserScore = sameBrowser.reduce((s) => s + 1, 0);
  return cardScore + browserScore;
};

export default calculateSybilAttackScore;
