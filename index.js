import dotenv from 'dotenv';
import { getInput } from '@actions/core';
import yudou from './src/core/workers/yudou.js';
import fromzero from './src/core/workers/fromzero.js';
import maskedman from './src/core/workers/maskedman.js';
import getafreenode from './src/core/workers/getafreenode.js';
import shunfeng from './src/core/workers/shunfeng.js';
import { push } from './src/utils/gfp.js';

const getActionInput = names => {
  dotenv.config();
  return names.map(name => process.env[name] || getInput(name));
};

(async () => {
  // 接收Github Action参数
  const [repository, branch, token, directory] = getActionInput(['repository', 'branch', 'token', 'directory']);

  // worker列表
  let arr = [yudou, fromzero, maskedman, getafreenode, shunfeng];
  let whiteList = [];

  // 获取content
  let contents = await Promise.all(
    arr
      .filter(item => (whiteList && whiteList.length > 0 ? whiteList.includes(item) : item.enable))
      .map(
        item =>
          new Promise(async resolve => {
            try {
              resolve({ file: item.getFileName(), content: await item.getContent() });
            } catch {
              resolve(null);
            }
          })
      )
  );
  contents = contents.filter(Boolean);

  // 推送到仓库
  const files = contents
    .map(info => {
      return info.content ? { path: (directory ? directory : 'subs/') + info.file, content: info.content } : null;
    })
    .filter(Boolean);
  if (files.length > 0) {
    await push(files, repository, branch, token);
  }
})();
