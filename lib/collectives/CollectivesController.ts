import { GraphQLClient, gql } from 'graphql-request';
import Collective, { ICollective } from './CollectiveModel';
import dbConnect from '../dbConnect';

export async function findBySlug(slug:string):Promise<ICollective> {
  await dbConnect();
  return Collective.findOne({ slug });
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
    return Collective.create(data.collective);
  } catch (error) {
    return { error, slug };
  }
}

export default class Collectives {
    static get = getCollective;

    static findBySlug = findBySlug;
}
