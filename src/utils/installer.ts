import { execa } from 'execa';
import { ProjectConfig } from '../types';
import { Logger } from './logger';

export class InstallService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  /**
   * Install dependencies based on project configuration
   */
  async installDependencies(
    projectPath: string,
    config: ProjectConfig
  ): Promise<void> {
    if (config.stack === 'flask' || config.stack === 'django') {
      // Python dependencies
      await this.installPipDependencies(projectPath);
    } else if (['mern', 'pern'].includes(config.stack)) {
      // Monorepo structure - install for both client and server
      await this.installNpmDependencies(`${projectPath}/server`);
      await this.installNpmDependencies(`${projectPath}/client`);
    } else {
      // Single npm project
      await this.installNpmDependencies(projectPath);
    }
  }

  /**
   * Install npm dependencies
   */
  async installNpmDependencies(projectPath: string): Promise<void> {
    try {
      await execa('npm', ['install'], {
        cwd: projectPath,
        stdio: 'inherit',
      });
    } catch (error) {
      throw new Error(
        `Failed to install npm dependencies: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Install pip dependencies
   */
  async installPipDependencies(projectPath: string): Promise<void> {
    try {
      // Create virtual environment
      await execa('python3', ['-m', 'venv', 'venv'], {
        cwd: projectPath,
        stdio: 'inherit',
      });

      this.logger.success('Virtual environment created');

      // Note: Dependencies will be installed when user activates venv
      this.logger.info(
        'Activate virtual environment and run: pip install -r requirements.txt'
      );
    } catch (error) {
      throw new Error(
        `Failed to create Python virtual environment: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * Initialize Git repository
   */
  async initializeGit(projectPath: string): Promise<void> {
    try {
      await execa('git', ['init'], { cwd: projectPath });
      await execa('git', ['add', '.'], { cwd: projectPath });
      await execa('git', ['commit', '-m', 'Initial commit'], {
        cwd: projectPath,
      });
    } catch (error) {
      // Git initialization is not critical, just log warning
      this.logger.warn(
        'Git initialization failed. You can initialize it manually later.'
      );
    }
  }

  /**
   * Check if command is available
   */
  async isCommandAvailable(command: string): Promise<boolean> {
    try {
      await execa(command, ['--version']);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check prerequisites
   */
  async checkPrerequisites(stack: string): Promise<void> {
    const nodeAvailable = await this.isCommandAvailable('node');
    if (!nodeAvailable) {
      throw new Error('Node.js is not installed. Please install Node.js first.');
    }

    if (stack === 'flask' || stack === 'django') {
      const pythonAvailable = await this.isCommandAvailable('python3');
      if (!pythonAvailable) {
        throw new Error(
          'Python is not installed. Please install Python 3 first.'
        );
      }
    }
  }
}