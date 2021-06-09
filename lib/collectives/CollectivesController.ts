import { GraphQLClient, gql } from 'graphql-request';
import moment from 'moment';
import mongoose from 'mongoose';
import Collective from './CollectiveModel';
import CollectiveSessionTotals from '../payment/collectiveSessionTotalsModel';
import dbConnect from '../dbConnect';
import NominationModel from './NominationModel';
import Donation from '../payment/donationModel';

export async function findBySlug(slug:string):Promise<any> {
  await dbConnect();
  const collective = await Collective.findOne({ slug });
  if (collective) {
    collective.sessionTotals = await CollectiveSessionTotals.find({ collective: collective._id });
  }
  return collective;
}

export async function getIdBySlug(slug:string):Promise<any> {
  await dbConnect();
  const collective = await Collective.findOne({ slug }).select('_id');
  return collective?._id;
}

export async function updateCollective(id, collective):Promise<any> {
  await dbConnect();
  return Collective.updateOne({ _id: id }, collective);
}

export async function nominateCollective(
  session:string,
  collective:string,
  user,
) {
  await dbConnect();
  const nominateUpdate = await NominationModel.findOneAndUpdate(
    { session, collective, user },
    { session, collective, user },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return nominateUpdate;
}

export async function getNominations(
  collective:string,
  user,
):Promise<any> {
  await dbConnect();
  return NominationModel.find({ collective, user });
}

export async function hasNominated(
  collective:string,
  session:string,
  user:string,
):Promise<any> {
  await dbConnect();
  const has = await NominationModel.countDocuments({ collective, user, session });
  return has;
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
          cancelled: {$ne: true},
          session: mongoose.Types.ObjectId(session),
        },
      },
      { $group: { _id: { user: '$user', collective: '$collective' }, amount: { $sum: '$amount' } } },
      { $group: { _id: { collective: '$_id.collective' }, amount: { $sum: '$amount' }, donations: { $push: '$amount' } } },
    ]));
  const result = donations.map(
    async (collective) => {
      const totalsUpdate = await CollectiveSessionTotals.findOneAndUpdate(
        { session, collective: collective._id.collective },
        { amount: collective.amount, donations: collective.donations },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      return totalsUpdate;
    },
  );
  return result;
}

export async function similarCollectives(session, collectives, max = 6) {
  await dbConnect();
  const userDonnations = await Donation.aggregate(
    [
      {
        $match: {
          cancelled: { $ne: true },
          session: mongoose.Types.ObjectId(session),
          collective: { $in: collectives.map((col) => mongoose.Types.ObjectId(col)) },
        },
      },
      {
        $group: {
          _id: '$session',
          users: {
            $addToSet: '$user',
          },
          amount: {
            $sum: '$amount',
          },
        },
      },
    ],
  );
  if (userDonnations?.length && userDonnations[0].users) {
    const similarAggregate = await Donation.aggregate(
      [
        { $limit: 100 },
        {
          $match: {
            collective: { $nin: collectives.map((col) => mongoose.Types.ObjectId(col)) },
            user: { $in: userDonnations[0].users },
            session: mongoose.Types.ObjectId(session),
            cancelled: { $ne: true },
          },
        },
        {
          $group: {
            _id: '$collective',
            amount: {
              $sum: '$amount',
            },
          },
        },
        {
          $lookup: {
            from: 'collectives',
            localField: '_id',
            foreignField: '_id',
            as: 'collective',
          },
        },
      ],
    );
    return similarAggregate.filter((item, idx) => idx < max).map((s) => s.collective[0]);
  }

  return [];
}

export async function getCollective(slug:string):Promise<any> {
  await dbConnect();
  const savedCollective = await Collective.findOne({ slug });
  if (savedCollective) {
    if (moment().diff(moment(savedCollective.lastUpdate), 'hours') < 2) {
      return savedCollective;
    }
  }

  const query = gql`
  query accounts($slug: String!) {
    account(slug: $slug) {
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
      members (limit:20){
        totalCount
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
    if (data.account?.members.totalCount) {
      data.account.membersCount = data.account.members.totalCount;
      data.account.members = data.account.members.nodes
        .map((member) => member.account.imageUrl);
    }
    data.account.lastUpdate = new Date();
    data.account.slug = slug;
    if (!savedCollective) {
      return Collective.create(data.account);
    }
    await Collective.updateOne({ _id: savedCollective._id }, data.account);
    return await findBySlug(slug);
  } catch (error) {
    console.log(error);
    return { error: error.response.errors[0].message, slug };
  }
}

export default class Collectives {
    static get = getCollective;

    static findBySlug = findBySlug;

    static update = updateCollective;

    static updateTotals = updateCollectivesTotals;

    static similar = similarCollectives;

    static nominate = nominateCollective;

    static getNominations = getNominations;

    static hasNominated = hasNominated;

    static getIdBySlug = getIdBySlug;
}
