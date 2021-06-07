import serializable from './serializable';
import Cart from './cart/CartController';
import Payments from './payment/paymentController';
import FundingSession, { getPredictedAverages } from './fundingSession/fundingSessionController';

const ServerProps = {
  getUser: async (reqUser, session) => {
    let user = serializable(reqUser) || {};
    if (user._id && session) {
      const donations = await Payments.getGroupedDonationsByUser(
        reqUser._id,
        session,
      );
      user = { ...serializable(user), ...{ donations } };
    }
    return user;
  },
  getCurrentSession: async () => {
    const session = await FundingSession.getCurrent();
    return session ? serializable(session) : null;
  },
  getCart: async (reqCart) => {
    const cart = await Cart.get(reqCart);
    return serializable(cart);
  },
  getCurrentSessionInfo: async () => {
    const info = await FundingSession.getCurrentSessionInfo();
    return info ? serializable(info) : null;
  },
  getUpcoming: async () => {
    const info = await FundingSession.getUpcomingSession();
    return info ? serializable(info) : null;
  },
  getFinished: async () => {
    const info = await FundingSession.getFinished();
    return info ? serializable(info) : null;
  },
  getUpcomingInfo: async () => {
    const info = await FundingSession.getUpcomingSessionInfo();
    return info ? serializable(info) : null;
  },
  getNominations: async (session, user) => {
    const nominations = await FundingSession.getNominations(session);
    nominations.user = user
      ? await FundingSession.getUserNominations(user, session)
      : [];
    return serializable(nominations);
  },
  getPredicted: async (info) => {
    const defaultPrediction = {
      fudge: 1, average: 10, match: 10, exp: 2, symetric: false,
    };
    return serializable(info ? getPredictedAverages(info) : defaultPrediction);
  },
  getAppState: async (reqUser, sessionCart) => {
    const currentInfo = await FundingSession.getCurrentSessionInfo();
    let user = serializable(reqUser) || {};
    if (user._id && currentInfo) {
      const donations = await Payments.getGroupedDonationsByUser(
        reqUser._id,
        currentInfo._id,
      );
      user = { ...serializable(user), ...{ donations } };
    }
    const current = currentInfo ? {
      ...serializable(currentInfo),
      ...{ predicted: getPredictedAverages(currentInfo) },
      ...{ donateConfig: FundingSession.getDonationsConfig()}
    } : null;

    const cart = await Cart.get(sessionCart);
    const upcoming = await FundingSession.getUpcomingSession();
    return {
      cart: serializable(cart),
      user: serializable(user),
      current,
      upcoming: serializable(upcoming),
      siteUrl: process.env.HOSTING_URL,
      gtag: process.env.GOOGLE_ANALYTICS,
    };
  },
  cart: null,
  currentSessionId: null,
  currentSession: null,
  currentSessionInfo: null,
  predicted: null,
};

export default ServerProps;
