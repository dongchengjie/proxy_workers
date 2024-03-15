import dotenv from 'dotenv';
import { getInput } from '@actions/core';
import yudou from './src/core/workers/yudou.js';
import fromzero from './src/core/workers/fromzero.js';
import logger from './src/utils/logger.js';
import { push } from './src/utils/gfp.js';

const getActionInput = names => {
  dotenv.config();
  return names.map(name => process.env[name] || getInput(name));
};

(async () => {
  // 接收Github Action参数
  const [repository, branch, token, directory] = getActionInput(['repository', 'branch', 'token', 'directory']);

  let arr = [yudou, fromzero];
  const contents = await Promise.all(
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
  contents.map(info => {
    return { path: info.file, content: info.content };
  });
  await push(files, repository ? directory : 'subs/', branch, token);
})();
