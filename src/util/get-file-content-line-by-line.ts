import fs from 'fs';
import readline from 'readline';
import logger from './logger';

export default function getFileContentLineByLine(filename: string): Promise<Array<any>> {
  return new Promise(resolve => {
    const inStream = fs.createReadStream(filename);
    const rl = readline.createInterface(inStream);
    const fileContent: Array<any> = [];

    rl.on('line', function (line) {
      if (line.length >= 1) {
        fileContent.push(JSON.parse(line));
      }
    });

    rl.on('error', err => logger.error(`Error reading file: ${err}`));

    rl.on('close', function () {
      if (fileContent.length) {
        resolve(fileContent);
      }

      resolve([]);
    });
  });
}
