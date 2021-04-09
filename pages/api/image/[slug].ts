import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';

import Collectives from '../../../lib/collectives/CollectivesController';
import Images from '../../../lib/images';
import { all } from '../../../middleware/index';

const handler = nextConnect();
handler.use(all);

handler.get(async (req: any, res: any) => {
  const collective = await Collectives.findBySlug(req.query.slug);
  const file = path.resolve('./public/twitter/c', `${collective.slug}.jpg`);
  if (!fs.existsSync(file)) {
    await Images.create(collective)
  }
  return res.redirect(`/twitter/c/${collective.slug}.jpg`);
});

export default handler;
