import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

const getCommitDirectory = async (commitId) => {
  const rootPath = path.resolve(process.cwd(), '.firstGit');
  const commitPath = path.join(rootPath, 'commits');
  const commitDir = path.join(commitPath, commitId);

  return commitDir;
};

const revertFiles = async (commitDir) => {
  const files = await fs.readdir(commitDir);
  console.log(files);
  const parentPath = path.resolve(commitDir, '../../..');
  for (const file of files) {
    const src = path.join(commitDir, file);
    const dest = path.join(parentPath, file);
  
    try {
      await fs.copyFile(src, dest);
      console.log(`File ${file} reverted successfully`);
    } catch (err) {
      console.error(`Error reverting file ${file}: ${err.message}`);
    }
  }
};

const revert = async (commitId) => {
  try {
    const commitDir = await getCommitDirectory(commitId);
    console.log(commitDir,"return")
    await revertFiles(commitDir);
  } catch (err) {
    console.error(`Error while reverting files: ${err.message}`);
  }
};

export { revert };