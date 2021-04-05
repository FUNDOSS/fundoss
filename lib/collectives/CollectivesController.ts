import { GraphQLClient, gql } from 'graphql-request';
import moment from 'moment';
import mongoose from 'mongoose';
import Collective, { ICollective } from './CollectiveModel';
import FundingSessions from '../fundingSession/fundingSessionController';
import Donation from '../payment/donationModel';
import CollectiveSessionTotals from '../payment/collectiveSessionTotalsModel';
import dbConnect from '../dbConnect';

export async function findBySlug(slug:string):Promise<any> {
  await dbConnect();
  const collective = await Collective.findOne({ slug });
  const totals = await CollectiveSessionTotals.find({ collective: collective._id });
  collective.sessionTotals = totals;
  return collective;
}

export async function updateCollectivesTotals(ids:Array<string>, session:string) {
  await dbConnect();
  const donations = (await Donation
    .aggregate([
      {
        $match: {
          collective: {
            $in: ids.map((id) => mongoose.Types.ObjectId(id)),
          },
          session: mongoose.Types.ObjectId(session),
        },
      },
      { $group: { _id: { user: '$user', collective: '$collective' }, amount: { $sum: '$amount' } } },
      { $group: { _id: { collective: '$_id.collective' }, amount: { $sum: '$amount' }, donations: { $push: '$amount' } } },
    ])).map(
    async (collective) => {
      const totalsUpdate = await CollectiveSessionTotals.findOneAndUpdate(
        { session, collective: collective._id.collective },
        { amount: collective.amount, donations: collective.donations },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      return totalsUpdate;
    },
  );
  return donations;
}

export async function similarCollectives() {
  await dbConnect();
  return (await FundingSessions.getCurrent()).collectives.filter(() => (Math.random() > 0.9));
}

export async function getCollective(slug:string):Promise<any> {
  await dbConnect();
  const savedCollective = await Collective.findOne({ slug });
  if (savedCollective) {
    if (moment().diff(moment(savedCollective.lastUpdate), 'days') < 2) {
      return savedCollective;
    }
  }

  const query = gql`
  query collectives($slug: String!) {
    collective(slug: $slug) {
      name
      twitterHandle
      githubHandle
      imageUrl
      backgroundImageUrl
      website
      tags
      slug
      description
      longDescription
      categories
      members {
        nodes {
          account{
            imageUrl
          }
        }
      }
    }
  }
    `;
  const variables = { slug };
  const endpoint = `https://api.opencollective.com/graphql/v2/${process.env.OPENCOLLECTIVE_API_KEY}`;
  const client = new GraphQLClient(endpoint);
  try {
    const data = await client.request(query, variables);
    data.collective.members = data.collective.members.nodes
      .map((member) => member.account.imageUrl);
    data.collective.lastUpdate = new Date();
    data.collective.slug = slug;
    if (!savedCollective) {
      return Collective.create(data.collective);
    }
    await Collective.updateOne({ _id: savedCollective._id }, data.collective);
    return await findBySlug(slug);
  } catch (error) {
    return { error: error.response.errors[0].message, slug };
  }
}

export default class Collectives {
    static get = getCollective;

    static findBySlug = findBySlug;

    static updateTotals = updateCollectivesTotals;

    static similar = similarCollectives;
}
