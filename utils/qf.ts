/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-properties */
export default {
  calculate: (
    amount: number, averageDonation = 35, averageMatch = 35,
  ) => (amount < averageDonation
    ? averageMatch * Math.pow(amount / averageDonation, 2)
    : (averageMatch) + (averageMatch * Math.sqrt((amount - averageDonation) / averageDonation) / 2)
  ),
};
