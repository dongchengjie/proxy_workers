import axios from 'axios';
import logger from '../../utils/logger.js';

export default {
  enable: true,
  getFileName: () => 'getafreenode.yaml',
  getContent: async () => {
    try {
      const html = await axios.get('https://getafreenode.com/').then(response => response.data);
      const regex = /<a href=".*uuid=(.+?)"/;
      const match = regex.exec(html);
      const uuid = match ? match[1] : null;
      logger.info('getafreenode的uuid: ' + uuid);

      return await axios.get('https://getafreenode.com/subscribe/?uuid=' + uuid).then(response => response.data);
    } catch {
      return null;
    }
  }
};
