import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';
import Collectives from '../../../../lib/collectives/CollectivesController';
import Images from '../../../../lib/images';
import { all } from '../../../../middleware/index';

const handler = nextConnect();
handler.use(all);

handler.get(async (req: any, res: any) => {
  const collective = await Collectives.findBySlug(req.query.slug);
  const file = path.resolve('./public/static/collective', `${collective.slug}.jpg`);
  const imgUrl = `/static/collective/${collective.slug}.jpg`;
  if (!fs.existsSync(file)) {
    await Images.create('collective', collective );
    Collectives.update(collective._id, {shareImage: imgUrl})
  }
  return res.redirect(imgUrl);
});

export default handler;
