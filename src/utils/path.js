import { fileURLToPath } from 'url';
import { dirname } from 'path';

export function currentDir() {
  const stack = new Error().stack.split('\n')[2].trim();
  const callerFile = stack.match(/at .*?(file:.*?\.js):\d+:\d+/)[1];
  const callerFilePath = fileURLToPath(callerFile);
  return dirname(callerFilePath);
}
