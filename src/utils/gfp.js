import { getOctokit } from '@actions/github';
import { logger } from './logger.js';
/**
 * 推送文件到Github仓库
 * @param {string} repository 仓库（包含owner和repo）
 * @param {string} path 文件路径
 * @param {string} branch 分支
 * @param {string} token 仓库token
 * @param {string} content 文件内容
 * @param {string} message 提交信息
 * @param {string} committer 提交者名称
 * @param {string} committerEmail 提交者邮箱
 */
export const push = async (files, repository, branch, token, message, committer, committerEmail) => {
  const [owner, repo] = repository.split('/');
  branch = branch || process.env['GITHUB_REF_NAME'] || 'main';
  const octokit = getOctokit(token);
  // 推送文件
  return await commitFiles(files, octokit, owner, repo, branch, message);
};

const commitFiles = async (files, octokit, owner, repo, branch, message, committer, committerEmail) => {
  try {
    // 获取当前分支引用
    const branchRef = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
    logger.info(`Current branch ref: ${branchRef.data.object.sha}.`);

    // 获取当前分支树引用
    const branchTree = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branchRef.data.object.sha,
      recursive: true
    });
    logger.info(`Current tree ref: ${branchTree.data.sha}.`);

    // 创建一个新的树对象，包含上传的多个文件
    const newTree = await octokit.rest.git.createTree({
      owner,
      repo,
      tree: files.map(file => ({
        path: file.path,
        mode: '100644', // 100644 blob, 100755 executable, 040000 subdirectory, 160000 submodule, 120000 symlink
        type: 'blob',
        content: file.content
      })),
      base_tree: branchTree.data.sha
    });
    logger.info(`New tree is created.`);

    // 创建一个新的提交对象
    const newCommit = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: message ? message : "Added/Updated by Github Action 'subs-puller'",
      author: {
        name: committer ? committer : 'subs-puller',
        email: committerEmail ? committerEmail : 'github@actions.com'
      },
      tree: newTree.data.sha,
      parents: [branchRef.data.object.sha]
    });
    logger.info(`New commit created.`);

    // 更新分支引用指向新的提交
    logger.info('Committing Files.');
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.data.sha
    });
    logger.info('Committing Files success.');
  } catch (error) {
    logger.error('Error committing files:', error.message);
  }
};
