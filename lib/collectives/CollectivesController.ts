import { GraphQLClient, gql } from 'graphql-request';
import moment from 'moment';
import mongoose from 'mongoose';
import Collective, { ICollective } from './CollectiveModel';
import FundingSessions from '../fundingSession/fundingSessionController';
import Donation from '../payment/donationModel';
import dbConnect from '../dbConnect';


export async function findBySlug(slug:string):Promise<ICollective> {
  await dbConnect();
  const currentSessionId:string = await FundingSessions.getCurrentId();
  const collective = await Collective.findOne({ slug });
  console.log(collective.totals)
  collective.totals = collective.totals ? collective.totals[currentSessionId] : {amount:0, donations:[]};

  return collective;
}

export async function updateCollectivesTotals(ids:Array<string>, session:string) {
  await dbConnect();
  console.log('updateCollectivesTotals', ids, session);
  const donations = (await Donation
    .aggregate([
      {$match: {collective:{$in: ids.map(id => mongoose.Types.ObjectId(id)) }, session: mongoose.Types.ObjectId(session)}},
      {$group: {_id:{user:'$user', collective:'$collective'},  amount:{$sum:'$amount' }}},
      {$group: {_id:{collective:'$_id.collective'}, amount:{$sum:'$amount' }, donations:{$push:'$amount'}}},
    ])).map(
      async (collective)=>{
        const collectiveTotals = await Collective.findOne({ _id: collective._id.collective }).select('totals');
        const totals = { totals: {...(collectiveTotals?.totals || {}), ...{ [session]: {amount:collective.amount, donations:collective.donations} } } }
        console.log(collective, totals)
        return await Collective.updateOne({ _id: collective._id.collective },totals );
      }
    );
    return donations;
}


export async function similarCollectives() {
  await dbConnect();
  return (await FundingSessions.getCurrent()).collectives.filter( () => (Math.random() > 0.9) );
}



export async function getCollective(slug:string):Promise<any> {
  await dbConnect();
  const savedCollective = await findBySlug(slug);
  if (savedCollective) {
    if ( moment().diff(moment(savedCollective.lastUpdate), 'days') < 2) {
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
    if(!savedCollective){
      return Collective.create(data.collective);
    } else {
      await Collective.updateOne({_id: savedCollective._id}, data.collective);
      return await findBySlug(slug);
    }

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
