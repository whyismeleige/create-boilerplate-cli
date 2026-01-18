import chalk from 'chalk';
import ora from 'ora';
import { promptProjectDetails } from '../prompts';
import { ProjectConfig } from '../types';
import { TemplateManager } from '../templates/manager';
import { FileSystemService } from '../utils/fileSystem';
import { InstallService } from '../utils/installer';
import { Logger } from '../utils/logger';

interface CreateOptions {
  stack?: string;
  typescript?: boolean;
  docker?: boolean;
  git?: boolean;
  path?: string;
}

export async function createProject(
  projectName?: string,
  options?: CreateOptions
) {
  const logger = new Logger();

  try {
    // Get project configuration (either from prompts or options)
    let config: ProjectConfig;

    if (projectName && options?.stack) {
      // Non-interactive mode
      config = {
        name: projectName,
        description: '',
        author: '',
        stack: options.stack as any,
        features: {
          typescript: options.typescript || false,
          eslint: true,
          prettier: true,
          docker: options.docker || false,
          githubActions: false,
          testing: 'jest',
        },
        path: options.path || process.cwd(),
      };
    } else {
      // Interactive mode
      config = await promptProjectDetails(projectName);
    }

    logger.info(`Creating project: ${chalk.cyan(config.name)}`);

    // Initialize services
    const templateManager = new TemplateManager();
    const fileSystemService = new FileSystemService();
    const installService = new InstallService();

    // Step 1: Validate and prepare
    const spinner = ora('Validating configuration...').start();
    const template = templateManager.getTemplate(config.stack);
    const projectPath = fileSystemService.resolveProjectPath(
      config.path,
      config.name
    );

    // Check if directory exists
    if (fileSystemService.directoryExists(projectPath)) {
      spinner.fail();
      logger.error(`Directory ${projectPath} already exists!`);
      process.exit(1);
    }
    spinner.succeed('Configuration validated');

    // Step 2: Create directory structure
    spinner.start('Creating project structure...');
    await fileSystemService.createProjectStructure(
      projectPath,
      template.structure
    );
    spinner.succeed('Project structure created');

    // Step 3: Generate files
    spinner.start('Generating configuration files...');
    await templateManager.generateFiles(projectPath, config, template);
    spinner.succeed('Configuration files generated');

    // Step 4: Install dependencies
    if (options?.git !== false) {
      spinner.start('Installing dependencies...');
      await installService.installDependencies(projectPath, config);
      spinner.succeed('Dependencies installed');

      // Step 5: Initialize Git
      spinner.start('Initializing Git repository...');
      await installService.initializeGit(projectPath);
      spinner.succeed('Git repository initialized');
    }

    // Success message
    logger.success('\n🎉 Success! Your project is ready!\n');
    logger.info('Next steps:');
    logger.info(`  cd ${config.name}`);

    // Display stack-specific instructions
    displayNextSteps(config);

    logger.info('\nHappy coding! 🚀\n');
  } catch (error) {
    logger.error('Failed to create project');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
}

function displayNextSteps(config: ProjectConfig) {
  const logger = new Logger();

  switch (config.stack) {
    case 'mern':
    case 'pern':
      logger.info('\n  # Start the backend');
      logger.info('  cd server && npm run dev');
      logger.info('\n  # Start the frontend (in another terminal)');
      logger.info('  cd client && npm run dev');
      break;

    case 'nextjs':
      logger.info('  npm run dev');
      break;

    case 'flask':
      logger.info('  python -m venv venv');
      logger.info('  source venv/bin/activate  # On Windows: venv\\Scripts\\activate');
      logger.info('  pip install -r requirements.txt');
      logger.info('  python run.py');
      break;
  }
}