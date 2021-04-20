import GhostContentAPI from '@tryghost/content-api';
// Create API instance with site credentials

const Ghost = {
  getPage: async (slug) => {
    const api = new GhostContentAPI({
      url: process.env.GHOST_URL,
      key: process.env.GHOST_READ_KEY,
      version: 'v3',
    });
    return api.pages.read({ slug });
  },
};

export default Ghost;
