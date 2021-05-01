import GhostContentAPI from '@tryghost/content-api';
import GhostAdminAPI from '@tryghost/admin-api';

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
  initAdmin: () => {
    if (!Ghost.adminApi) {
      Ghost.adminApi = new GhostAdminAPI({
        url: process.env.GHOST_URL,
        key: process.env.GHOST_ADMIN_KEY,
        version: 'v3',
      });
    }
    return Ghost.adminApi;
  },
  getPage: async (slug) => Ghost.init()
    .pages.read({ slug })
    .catch((err) => { console.error(err); }),
  getPost: async (slug) => Ghost.init().posts.read({ slug }),
  getPosts: async () => Ghost.init().posts.browse({ limit: 'all' }),
  subscribe: async (member) => {
    const existing = await Ghost.getMember(member.email);
    if (!existing) {
      return Ghost.initAdmin().members.add({
        ...member,
        ...{ subscribed: member.subscribed },
      }).catch((e) => console.log(e));
    }
    return Ghost.initAdmin().members.edit(
      { id: existing.id, subscribed: member.subscribed },
    ).catch((e) => console.log(e));
    return existing;
  },
  getMember: async (email) => {
    const subs = await Ghost.initAdmin()
      .members.browse({ filter: `email:${email}` })
      .catch((e) => console.log(e));
    return subs?.length ? subs[0] : false;
  },
  api: null,
  adminApi: null,
};

export default Ghost;
