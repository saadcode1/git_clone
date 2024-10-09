import fs from 'fs/promises';
import path from 'path';

const init = async () => {
  const rootPath = path.resolve(process.cwd(), '.firstGit');
  const commitPath = path.join(rootPath, 'commits');
  const configPath = path.join(rootPath, 'config.json');

  try {
    await fs.mkdir(rootPath, { recursive: true });
    await fs.mkdir(commitPath, { recursive: true });
    const config = { bucket: 's3 Bucket' };
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    console.log('Initialization is complete!');
  } catch (err) {
    console.error('Error while initializing files:', err);
  }
};

export { init };