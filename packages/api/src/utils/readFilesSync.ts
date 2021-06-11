import fs from "fs";
import path from "path";

export interface File {
  filepath: string;
  name: string;
  ext: string;
  stat: fs.Stats;
}

export const readFilesSync = (dir: string): File[] => {
  const files: File[] = [];

  fs.readdirSync(dir).forEach((filename) => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    if (isFile) {
      files.push({ filepath, name, ext, stat });
    }
  });

  files.sort((a, b) => {
    // natural sort alphanumeric strings
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return files;
};
