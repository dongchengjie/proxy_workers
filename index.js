import dotenv from 'dotenv';
import { getInput } from '@actions/core';
import yudou from './src/core/workers/yudou.js';
import fromzero from './src/core/workers/fromzero.js';
import { push } from './src/utils/gfp.js';
import logger from './src/utils/logger.js';

const getActionInput = names => {
  dotenv.config();
  return names.map(name => process.env[name] || getInput(name));
};

(async () => {
  // 接收Github Action参数
  const [repository, branch, token, directory] = getActionInput(['repository', 'branch', 'token', 'directory']);

  let arr = [yudou, fromzero];
  let contents = await Promise.all(
    arr.map(
      item =>
        new Promise(async (resolve, reject) => {
          try {
            resolve({ file: item.getFileName(), content: await item.getContent() });
          } catch {
            resolve(null);
          }
        })
    )
  );
  contents = contents.filter(Boolean);
  const files = contents.map(info => {
    return { path: (directory ? directory : 'subs/') + info.file, content: '123123' };
  });
  await push(files, repository, branch, token);
})();
