import GhostContentAPI from '@tryghost/content-api';

const Ghost = {
  init: () => {
    if (!Ghost.api) {
      Ghost.api = new GhostContentAPI({
        url: process.env.GHOST_URL,
        key: process.env.GHOST_READ_KEY,
        version: 'v3',
      });
    }
    return Ghost.api;
  },
  getPage: async (slug) => Ghost.init()
    .pages.read({ slug })
    .catch((err) => { console.error(err); }),
  getPost: async (slug) => Ghost.init().posts.read({ slug }),
  getPosts: async () => Ghost.init().posts.browse({ limit: 'all' }),
  api: null,
};

export default Ghost;
