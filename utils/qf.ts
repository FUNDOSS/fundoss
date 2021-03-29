/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-properties */
const Qf = {
  calculate: (
    amount: number, averageDonation:number = null, averageMatch:number = null, power = 2.6, adjust = 0.7
  ) => {
    const am = averageMatch || Qf.averageMatch || 120;
    const ad = averageDonation || Qf.averageDonation || 120;
    return amount < ad
      ? (am * Math.pow(amount / ad, power)) * adjust
      : (am + am * Math.pow((amount - ad) / ad, 1/power)) * adjust
  },
  init:(
    averageDonation:number,
    averageMatch:number,
  ) => {
    Qf.averageDonation = averageDonation;
    Qf.averageMatch = averageMatch;
  },
  averageDonation:15,
  averageMatch:25,
};


export default Qf;
