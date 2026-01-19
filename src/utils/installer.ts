import { execa } from 'execa';
import { Logger } from './logger.js';

export class Installer {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Install npm dependencies
   */
  async installNpmDeps(projectPath: string): Promise<void> {
    try {
      this.logger.info('Installing dependencies...');
      await execa('npm', ['install'], {
        cwd: projectPath,
        stdio: 'inherit',
      });
      this.logger.success('Dependencies installed');
    } catch (error) {
      throw new Error(
        `Failed to install dependencies: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Initialize Git repository
   */
  async initGit(projectPath: string): Promise<void> {
    try {
      await execa('git', ['init'], { cwd: projectPath });
      await execa('git', ['add', '.'], { cwd: projectPath });
      await execa('git', ['commit', '-m', 'Initial commit'], {
        cwd: projectPath,
      });
      this.logger.success('Git repository initialized');
    } catch (error) {
      this.logger.warn('Git initialization failed. You can initialize it manually.');
    }
  }

  /**
   * Check if command exists
   */
  async commandExists(command: string): Promise<boolean> {
    try {
      await execa(command, ['--version']);
      return true;
    } catch {
      return false;
    }
  }
}