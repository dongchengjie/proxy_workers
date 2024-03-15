import axios from 'axios';
import logger from '../../utils/logger.js';
import cracker from '../../utils/cracker.js';
import unirest from 'unirest';

export default {
  enable: true,
  getFileName: () => 'maskedman.yaml',
  getContent: async () => {
    try {
      const arr = cracker.numberCrack(2);
      const concurrencyLimit = 10;

      let link = null;
      for (let i = 0; i < arr.length; i += concurrencyLimit) {
        const tasks = arr.slice(i, i + concurrencyLimit).map(async password => {
          return await new Promise(async resolve => {
            try {
              const regex = /(https?:\/\/.*?\.yaml)(?=\")/gm;
              const body = await getBody(password);
              logger.info(password);
              const link = regex.exec(body)[1];
              console.log('maskedman密码: ' + password);
              console.log('maskedman链接: ' + link);
              resolve(link);
            } catch {}
          });
        });
        link = await Promise.race(tasks);
        if (link) {
          break;
        }
      }
      return link ? await axios.get(link).then(response => response.data) : null;
    } catch (err) {
      return null;
    }
  }
};

const getBody = async password => {
  const cookie = await new Promise((resolve, reject) => {
    unirest('POST', 'https://halekj.top/wp-login.php?action=postpass')
      .send('post_password=0011')
      .send('Submit=提交')
      .end(response => {
        if (response.error) {
          reject(response.error);
        } else {
          let cookie;
          let arr = response.headers['set-cookie'];
          cookie = arr.filter(str => str.includes('wp-postpass'))[0];
          cookie = cookie.substr(0, cookie.indexOf(';'));
          resolve(cookie);
        }
      });
  });
  logger.info(cookie);
  return await new Promise(async (resolve, reject) => {
    unirest('GET', 'https://halekj.top/mfjd/')
      .headers({
        Cookie: 'wordpress_test_cookie=WP%20Cookie%20check; ' + cookie
      })
      .end(response => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.body);
        }
      });
  });
};
