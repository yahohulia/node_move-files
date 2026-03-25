/* eslint-disable no-console */
'use strict';

const fs = require('fs/promises');
const path = require('path');

async function moveFile() {
  const args = process.argv.slice(2);

  const originPath = args[0];
  const pathToMove = args[1];

  if (!originPath) {
    console.error('File does not exist');

    return;
  }

  if (!pathToMove) {
    console.error('Path to move does not exist');

    return;
  }

  if (originPath === pathToMove) {
    return;
  }

  try {
    await fs.access(originPath);

    let finalDest = pathToMove;

    try {
      const destStat = await fs.stat(pathToMove);

      if (destStat.isDirectory()) {
        finalDest = path.join(pathToMove, path.basename(originPath));
      }
    } catch (e) {
      if (pathToMove.endsWith('/') || pathToMove.endsWith('\\')) {
        console.error('Path does not exist');

        return;
      }
    }

    await fs.rename(originPath, finalDest);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('File does not exist');
    } else {
      console.error('Error:', error.message);
    }
  }
}

moveFile();
