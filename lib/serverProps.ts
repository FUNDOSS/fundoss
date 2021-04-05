import serializable from './serializable';
import Cart from './cart/CartController';
import Payments from './payment/paymentController';
import FundingSession, { getPredictedAverages } from './fundingSession/fundingSessionController';

const ServerProps = {
  getUser: async (reqUser) => {
    let user = serializable(reqUser) || {};
    if (user._id) {
      const donations = await Payments.getGroupedDonationsByUser(
        reqUser._id,
        ServerProps.currentSessionId,
      );
      user = { ...serializable(user), ...{ donations } };
    }
    return user;
  },
  getCurrentSession: async () => {
    if (!ServerProps.currentSession) {
      ServerProps.currentSession = await FundingSession.getCurrent();
      ServerProps.predicted = serializable(getPredictedAverages(ServerProps.currentSession));
    }
    ServerProps.currentSessionId = ServerProps.currentSession._id;
    return ServerProps.currentSession;
  },
  getCart: async (reqCart) => {
    if (!ServerProps.cart) ServerProps.cart = await Cart.get(reqCart);
    return serializable(ServerProps.cart);
  },
  getCurrentSessionInfo: async () => {
    if (!ServerProps.currentSessionInfo) {
      const info = await FundingSession.getCurrentSessionInfo();
      ServerProps.currentSessionId = info._id;
      ServerProps.predicted = serializable(getPredictedAverages(info));
      ServerProps.currentSessionInfo = info;
    }
    return serializable(ServerProps.currentSessionInfo);
  },
  cart: null,
  currentSessionId: null,
  currentSession: null,
  currentSessionInfo: null,
  predicted: null,
};

export default ServerProps;
