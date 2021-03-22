import { MongoClient } from 'mongodb';


export class Mongo{
  private static mongoClient:MongoClient;
  public static async getClient():Promise<MongoClient> {
    if (!Mongo.mongoClient) {
      Mongo.mongoClient = new MongoClient(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await Mongo.mongoClient.connect();
    }
    return Mongo.mongoClient;
  }
}

export default async function database(req, res, next) {
  req.db = await Mongo.getClient()
  console.log(req.db)
  return next();
}
