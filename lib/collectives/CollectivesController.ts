import { GraphQLClient, gql } from 'graphql-request';
import Collective, { ICollective } from './CollectiveModel';
import FundingSessions from '../fundingSession/fundingSessionController';
import dbConnect from '../dbConnect';

export async function findBySlug(slug:string):Promise<ICollective> {
  await dbConnect();
  const currentSessionId:string = await FundingSessions.getCurrentId();
  const collective = await Collective.findOne({ slug });
  collective.totals = collective.totals?.get(currentSessionId);
  return collective;
}

export async function updateCollectiveTotals(id:string, session:string, totals:any) {
  await dbConnect();
  // const collectiveTotals = await Collective.findOne({ _id: id }).select('totals');
  // console.log(collectiveTotals, totals);
  return Collective.updateOne({ _id: id }, { totals: { [session]: totals } });
}

export async function getCollective(slug:string):Promise<any> {
  await dbConnect();
  const savedCollective = await findBySlug(slug);
  if (savedCollective) return savedCollective;
  const query = gql`
  query collectives($slug: String!) {
    collective(slug: $slug) {
      name
      twitterHandle
      githubHandle
      imageUrl
      backgroundImageUrl
      website
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
    return Collective.create(data.collective);
  } catch (error) {
    return { error: error.response.errors[0].message, slug };
  }
}

export default class Collectives {
    static get = getCollective;

    static findBySlug = findBySlug;

    static updateTotals = updateCollectiveTotals;
}
