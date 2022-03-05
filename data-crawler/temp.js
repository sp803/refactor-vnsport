const imageCrawler = require('./image.craw');
const fs = require('fs');
const { threadPool } = require('./crawler.utils');

(async () => {
  const products = JSON.parse(
    await fs.promises.readFile(__dirname + '/products.json')
  );

  await imageCrawler.cleanImageFolder();

  await threadPool(
    products.map((product) => {
      return async () => {
        console.log(`downloading ${product.mainImageName} image`);
        await imageCrawler.download(product.imageLink, product.mainImageName);
      };
    }),
    10
  );

  console.log('done');
  process.exit();
})();
