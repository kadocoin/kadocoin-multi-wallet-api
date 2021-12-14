import fs from 'fs';
import readline from 'readline';
import ConsoleLog from './console-log';

export default function getLastLine(file: string): Promise<number> {
  return new Promise(resolve => {
    const inStream = fs.createReadStream(file);
    const rl = readline.createInterface(inStream);

    let lastLine = '';
    rl.on('line', function (line) {
      if (line.length >= 1) {
        lastLine = line;
      }
    });

    rl.on('error', err => ConsoleLog(`Error reading last line: ${err}`));

    rl.on('close', function () {
      if (lastLine) {
        resolve(JSON.parse(lastLine).blockchainHeight);
      }
      resolve(0);
    });
  });
}
