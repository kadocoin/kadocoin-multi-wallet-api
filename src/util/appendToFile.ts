import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function appendToFile(array: any[], file: string): void {
  const fileStream = fs.createWriteStream(file, { flags: 'a' });

  fileStream.on('error', err => console.log({ type: 'filesystem', file, err }));

  array.forEach((blk: any) => fileStream.write(JSON.stringify(blk) + '\n'));

  fileStream.end();
}
