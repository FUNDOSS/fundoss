/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-properties */
const Qf = {
  calculate: (
    amount: number,
    averageDonation:number = null,
    averageMatch:number = null,
    exp = 2,
    fudge:number = null,
    inout = false,
  ) => {
    const am = averageMatch || Qf.averageMatch || 120;
    const ad = averageDonation || Qf.averageDonation || 120;
    const f = fudge || Qf.fudge || 1;
    if (inout) {
      return amount < ad
        ? (am * Math.pow(amount / ad, exp)) * f
        : (am + am * Math.pow((amount - ad) / ad, 1 / exp)) * f;
    }
    return (am * Math.pow(amount / ad, 1 / exp)) * f;
  },
  init: (
    averageDonation:number,
    averageMatch:number,
    fudge:number,
  ) => {
    Qf.averageDonation = averageDonation;
    Qf.averageMatch = averageMatch;
    Qf.fudge = fudge;
  },
  averageDonation: 15,
  averageMatch: 25,
  fudge:1,
};

export default Qf;
