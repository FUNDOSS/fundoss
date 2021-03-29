/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-properties */
const Qf = {
  calculate: (
    amount: number, averageDonation:number = null, averageMatch:number = null,
  ) => {
    const am = averageMatch || Qf.averageMatch || 120;
    const ad = averageDonation || Qf.averageDonation || 120;
    return amount < ad
      ? am * Math.pow(amount / ad, 2)
      : am + am * Math.sqrt((amount - ad) / ad) / 2
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
