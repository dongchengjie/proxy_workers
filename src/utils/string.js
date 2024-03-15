// Base64编码
export const base64Encode = str => bytesToBase64(new TextEncoder().encode(str));
// Base64解码
export const base64Decode = str => new TextDecoder().decode(base64ToBytes(str));
// 是否为Base64编码
export const isBase64 = str => /^[A-Za-z0-9+\/]*={0,2}$/.test(str);
// UUID
export const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => ((Math.random() * 16) | 0).toString(16));

const bytesToBase64 = bytes => btoa(new Uint8Array(bytes).reduce((data, byte) => data + String.fromCharCode(byte), ''));

const base64ToBytes = base64 => new Uint8Array([...atob(base64)].map(char => char.charCodeAt(0)));

export const substringBeforeLast = (str, delimiter) => {
  const lastIndex = str.lastIndexOf(delimiter);
  return lastIndex === -1 ? str : str.substring(0, lastIndex);
};

/**
 *重命名序号后缀
 * @param {Array} list 对象列表
 * @param {Function} identifier 标识符
 * @param {Function} callback 新名称回调(item,newName)
 */
export const idSuffixNames = (list, identifier, callback) => {
  const ids = new Map();
  list = list.forEach(item => {
    const id = identifier(item);
    const count = ids.has(id) ? ids.get(id) + 1 : 0;
    ids.set(id, count);
    callback && callback(item, count > 0 ? `${id}_${count}` : id);
  });
};
