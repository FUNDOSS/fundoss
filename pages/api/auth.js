import nc from 'next-connect';
import { all } from '../../middleware/index';

const handler = nc();

handler.use(all);

handler.delete((req, res) => {
  req.logOut();
  res.status(204).end();
});

export default handler;
