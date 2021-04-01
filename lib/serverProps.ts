import serializable from './serializable';
import Cart from './cart/CartController';
import Payments from '../lib/payment/paymentController';
import FundingSession from '../lib/fundingSession/fundingSessionController';


const ServerProps = {
  getUser: async (reqUser) => {
    let user = serializable(reqUser) || {};
    if(user._id){
      const donations = await Payments.getGroupedDonationsByUser(reqUser._id, ServerProps.currentSessionId);
      user = {...serializable(user) ,...{donations}};
    }
    return user;
  },
  getCurrentSession: async () => {
    if(!ServerProps.currentSession) ServerProps.currentSession = await FundingSession.getCurrent();
    ServerProps.currentSessionId = ServerProps.currentSession._id;
    return serializable(ServerProps.currentSession);
  },
  getCart: async (reqCart) => {
    if(!ServerProps.cart) ServerProps.cart = await Cart.get(reqCart);
    return serializable(ServerProps.cart);
  },
  getCurrentSessionInfo: async () => {
    if(!ServerProps.currentSessionInfo) ServerProps.currentSessionInfo = await FundingSession.getCurrentSessionInfo();
    ServerProps.currentSessionId = ServerProps.currentSessionInfo._id;
    return serializable(ServerProps.currentSessionInfo);
  },
  cart:null,
  currentSessionId:null,
  currentSession:null,
  currentSessionInfo:null,
}

export default ServerProps
