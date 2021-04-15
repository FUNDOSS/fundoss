/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-properties */
const Qf = {
  calculate: (
    amount: number,
    averageDonation:number = null,
    averageMatch:number = null,
    exp:number = null,
    fudge:number = null,
    symetric:boolean = null,
  ) => {
    const am = averageMatch || Qf.averageMatch || 20;
    const ad = averageDonation || Qf.averageDonation || 20;
    const f = fudge || Qf.fudge || 1;
    const e = exp || Qf.exp || 2;
    const s = symetric || Qf.symetric;
    if (s) {
      return amount < ad
        ? (am * Math.pow(amount / ad, e)) * f
        : (am + am * Math.pow((amount - ad) / ad, 1 / e)) * f;
    }
    return (am * Math.pow(amount / ad, 1 / e)) * f;
  },
  init: (
    averageDonation:number,
    averageMatch:number,
    fudge:number,
    symetric:boolean,
    exp:number,
  ) => {
    Qf.averageDonation = averageDonation;
    Qf.averageMatch = averageMatch;
    Qf.fudge = fudge;
    Qf.symetric = symetric;
    Qf.exp = exp;
  },
  averageDonation: 15,
  averageMatch: 25,
  fudge: 1,
  exp: 2,
  symetric: false,
};

export default Qf;
