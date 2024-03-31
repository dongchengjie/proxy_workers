import { exec } from 'child_process';

export const unzip = async (zipFilePath, extractPath, password) => {
  return new Promise((resolve, reject) => {
    // 使用 unzip 命令解压缩文件
    const command = `7za -o${extractPath} -y -p${password} x ${zipFilePath}`;
    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        reject({ flag: false, message: stderr || error });
      } else {
        resolve({ flag: true, message: stdout, password: password });
      }
    });
  });
};
