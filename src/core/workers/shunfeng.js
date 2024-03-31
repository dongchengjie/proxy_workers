import axios from 'axios';
import logger from '../../utils/logger.js';

export default {
  enable: true,
  getFileName: () => 'shunfeng.yaml',
  getContent: async () => {
    try {
      const videos = await axios.get('https://www.youtube.com/@SFZY666/videos').then(response => response.data);
      // 找到最新视频链接
      const videoId = videos.substr(videos.indexOf('"url":"/watch?v=') + 16, 11);
      if (videoId.length != 11) {
        throw new Error('获取视频链接失败');
      }
      logger.info('视频ID:' + videoId);

      // 获取视频信息
      const videoLink = 'https://www.youtube.com/watch?v=' + videoId;
      let videoInfo = await axios.get(videoLink).then(response => response.data);

      // 获取博客链接
      videoInfo = videoInfo.substr(videoInfo.indexOf('本期免费节点获取：') + 9);
      const blogLink = videoInfo.substring(0, videoInfo.indexOf('",'));
      if (!blogLink.startsWith('http')) {
        throw new Error('获取博客链接失败');
      }
      logger.info('博客链接:' + blogLink);

      // 获取clash配置文件地址
      let blogInfo = await fetch(blogLink, { method: 'GET' }).then(res => res.text());
      blogInfo = blogInfo.substr(blogInfo.indexOf('https://drive.google.com/uc?export=download'));
      const configLink = blogInfo.substring(0, blogInfo.indexOf('<br'));
      if (!configLink.startsWith('http')) {
        throw new Error('获取配置文件链接失败');
      }
      logger.info('配置文件链接:' + configLink);

      // 获取配置内容
      return await axios.get(configLink).then(response => response.data);
    } catch (err) {
      return null;
    }
  }
};
