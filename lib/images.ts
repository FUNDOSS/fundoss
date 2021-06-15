import sharp from 'sharp';
import got from 'got';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const Images = {
  create: async (type:string, params:any) => {
    if (type === 'collective') {
      const collective = params;
      const illu = path.resolve('./public/static', 'twitter-collective.png');
      const file = path.resolve('./public/static/collective', `${collective.slug}.jpg`);
      const image = sharp(illu);
      const circle = Buffer.from(
        '<svg><rect x="0" y="0" width="128" height="128" rx="64" ry="64"/></svg>',
      );
      const logo = await got(collective.imageUrl).buffer();
      const circleLogo = await sharp(logo)
        // .composite([{ input: circle, blend: 'dest-in' }])
        .toBuffer().catch((err) => console.log(err));
      const composites = [{ input: circleLogo }];
      return image.composite(composites)
        .jpeg({ quality: 100 })
        .toFile(file).catch((err) => console.log(err));
    }
    if (type === 'payment') {
      const payment = params;
      const file = path.resolve('./public/static/share', `${payment.sid}.jpg`);
      const illu = path.resolve('./public/static', 'twitter-collective.png');
      const circle = sharp(Buffer.from(
        '<svg><rect x="0" y="0" width="300" height="300" rx="150" ry="150"/></svg>',
      ));
      const image = sharp(illu);

      const user = await sharp(
        await got(payment.user.avatar).buffer(),
      ).resize({ width: 300 }).toBuffer();

      const circleUser = await circle.composite([{ input: user, blend: 'in' }])
        .ensureAlpha(0)
        .toBuffer();
      const composites = [{ input: circleUser }];
      return image.composite(composites)
        .jpeg({ quality: 100 })
        .toFile(file).catch((err) => console.log(err));
    }
  },
};
export default Images;
