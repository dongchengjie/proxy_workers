import core from '@actions/core';

const log = (func, message) => {
  if (process.env.GITHUB_ACTIONS) {
    func(message);
  } else {
    console.log(`${func.name} ': '${message}`);
  }
};

export default {
  debug: message => log(core.debug, message),
  error: message => log(core.error, message),
  warning: message => log(core.warning, message),
  notice: message => log(core.notice, message),
  info: message => log(core.info, message)
};
