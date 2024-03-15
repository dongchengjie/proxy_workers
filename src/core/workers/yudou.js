import axios from 'axios';
import logger from '../../utils/logger.js';
import cracker from '../../utils/cracker.js';
import CryptoJS from 'crypto-js';

export default {
  getFileName: () => 'yudou.yaml',
  getContent: async () => {
    try {
      const html = await axios.get('https://www.yudou66.com').then(response => response.data);
      const regex = /<h2 class='entry-title'>.*<a\s*href='(.*?)'/;
      const match = regex.exec(html);
      const link = match ? match[1] : null;
      logger.info('链接: ' + link);

      const detail = await axios.get(link).then(response => response.data);
      let encrypted = detail.substring(detail.indexOf('var encryption = ['));
      encrypted = encrypted.substring(encrypted.indexOf('"') + 1);
      encrypted = encrypted.substr(0, encrypted.indexOf('"'));
      logger.info('加密串: ' + encrypted);

      let arr = await Promise.all(
        cracker.numberCrack(4).map(password => {
          return new Promise((resolve, reject) => {
            try {
              const res = decodeURIComponent(CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8));
              logger.info('密码: ' + password);
              resolve(res);
            } catch (err) {
              resolve(null);
            }
          });
        })
      );
      arr = arr.filter(Boolean);
      if (arr && arr.length > 0) {
        const decrypted = arr[0];
        let link2 = decrypted.substring(decrypted.indexOf('clash订阅'));
        link2 = link2.substring(link2.indexOf('http'));
        link2 = link2.substring(0, link2.indexOf('<'));
        return await axios.get(link2).then(response => response.data);
      }
    } catch {
      return null;
    }
  }
};
