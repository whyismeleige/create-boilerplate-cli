import fs from 'fs-extra';
import path from 'path';
import { DirectoryStructure } from '../types/index.js';

export class FileSystem {
  /**
   * Create directory structure recursively
   */
  async createStructure(
    basePath: string,
    structure: DirectoryStructure
  ): Promise<void> {
    await fs.ensureDir(basePath);

    for (const [key, value] of Object.entries(structure)) {
      const currentPath = path.join(basePath, key);

      if (value === null) {
        // It's a file placeholder
        await fs.ensureFile(currentPath);
      } else {
        // It's a directory, recurse
        await this.createStructure(currentPath, value);
      }
    }
  }

  /**
   * Write file with content
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Check if directory exists
   */
  exists(dirPath: string): boolean {
    return fs.existsSync(dirPath);
  }

  /**
   * Resolve full path
   */
  resolve(...paths: string[]): string {
    return path.resolve(...paths);
  }
}