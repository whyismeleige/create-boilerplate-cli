import fs from 'fs-extra';
import path from 'path';
import { DirectoryStructure } from '../types';

export class FileSystemService {
  /**
   * Create project directory structure recursively
   */
  async createProjectStructure(
    basePath: string,
    structure: DirectoryStructure
  ): Promise<void> {
    await fs.ensureDir(basePath);

    for (const [key, value] of Object.entries(structure)) {
      const currentPath = path.join(basePath, key);

      if (value === null) {
        // It's a file placeholder, create empty file
        await fs.ensureFile(currentPath);
      } else {
        // It's a directory, recurse
        await this.createProjectStructure(currentPath, value);
      }
    }
  }

  /**
   * Write content to a file
   */
  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Resolve project path
   */
  resolveProjectPath(basePath: string, projectName: string): string {
    return path.resolve(basePath, projectName);
  }

  /**
   * Check if directory exists
   */
  directoryExists(dirPath: string): boolean {
    return fs.existsSync(dirPath);
  }

  /**
   * Check if path is writable
   */
  async isWritable(dirPath: string): Promise<boolean> {
    try {
      await fs.access(dirPath, fs.constants.W_OK);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Copy file from source to destination
   */
  async copyFile(src: string, dest: string): Promise<void> {
    await fs.copy(src, dest);
  }

  /**
   * Remove directory recursively
   */
  async removeDirectory(dirPath: string): Promise<void> {
    if (this.directoryExists(dirPath)) {
      await fs.remove(dirPath);
    }
  }

  /**
   * Read file content
   */
  async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  /**
   * Get list of files in directory
   */
  async listFiles(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch {
      return [];
    }
  }
}