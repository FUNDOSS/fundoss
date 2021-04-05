import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import dbConnect from '../lib/dbConnect';

const MongoStore = connectMongo(session);

export default async function sessionMiddleware(req, res, next) {
  await dbConnect();
  const mongoStore = new MongoStore({
    mongooseConnection: mongoose.connection,
  });
  return session({
    secure: true,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: mongoStore,
  })(req, res, next);
}
