import sharp from 'sharp';
import got from 'got';
import path from 'path';

const Images = {
  create: async (collective) => {
    const illu = path.resolve('./public', 'twitter-collective.png');
    const file = path.resolve('./public/twitter/c', `${collective.slug}.jpg`);
    const image = sharp(illu);
    const circle = Buffer.from(
      '<svg><rect x="0" y="0" width="128" height="128" rx="64" ry="64"/></svg>',
    );
    const logo = await got(collective.imageUrl).buffer();
    const circleLogo = await sharp(logo)
      .composite([{ input: circle, blend: 'dest-in' }])
      .toBuffer();

    const composites = [{ input: circleLogo }];
    return image.composite(composites)
      .jpeg({quality: 100})
      .toFile(file);
  },
};
export default Images;
