import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { ProjectConfig, CreateOptions, TemplateType } from '../types/index.js';
import { FileSystem } from '../utils/fileSystem.js';
import { Installer } from '../utils/installer.js';
import { Logger } from '../utils/logger.js';
import { getMernTemplate } from '../templates/mern.js';
import { getPernTemplate } from '../templates/pern.js';
import { getNextjsTemplate } from '../templates/nextjs.js';

export async function createProject(
  projectName?: string,
  options?: CreateOptions
): Promise<void> {
  const logger = new Logger();
  const fileSystem = new FileSystem();
  const installer = new Installer();

  try {
    // Get project configuration
    const config = await getProjectConfig(projectName, options);

    logger.title(`🚀 Creating ${config.name}...`);

    // Check if directory exists
    const projectPath = fileSystem.resolve(config.path, config.name);
    if (fileSystem.exists(projectPath)) {
      logger.error(`Directory ${config.name} already exists!`);
      process.exit(1);
    }

    // Get template
    const template = getTemplate(config.template);
    
    // Create project structure
    const spinner = ora('Creating project structure...').start();
    await fileSystem.createStructure(projectPath, template.structure);
    spinner.succeed('Project structure created');

    // Generate files
    spinner.start('Generating configuration files...');
    for (const file of template.files) {
      const filePath = fileSystem.resolve(projectPath, file.path);
      await fileSystem.writeFile(filePath, file.content);
    }
    spinner.succeed('Configuration files generated');

    // Install dependencies
    if (config.installDeps) {
      if (config.template === 'nextjs') {
        await installer.installNpmDeps(projectPath);
      } else {
        // MERN and PERN have separate frontend/backend
        await installer.installNpmDeps(`${projectPath}/frontend`);
        await installer.installNpmDeps(`${projectPath}/backend`);
      }
    }

    // Initialize Git
    if (config.initGit) {
      spinner.start('Initializing Git repository...');
      await installer.initGit(projectPath);
      spinner.succeed();
    }

    // Success message
    logger.newLine();
    logger.success('🎉 Success! Your project is ready!');
    logger.newLine();
    logger.info('Next steps:');
    logger.log(`  cd ${config.name}`);
    logger.newLine();
    
    displayNextSteps(config);
    
    logger.newLine();
    logger.log(chalk.cyan('Happy coding! 🚀'));
    logger.newLine();

  } catch (error) {
    logger.error('Failed to create project');
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
}

async function getProjectConfig(
  projectName?: string,
  options?: CreateOptions
): Promise<ProjectConfig> {
  let name = projectName;
  let template: TemplateType | undefined = options?.template as TemplateType;

  // Interactive prompts if not provided
  if (!name) {
    const nameAnswer = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter project name:',
        default: 'my-app',
        validate: (input: string) => {
          if (!input.trim()) return 'Project name cannot be empty';
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Project name can only contain lowercase letters, numbers, and hyphens';
          }
          return true;
        },
      },
    ]);
    name = nameAnswer.name;
  }

  if (!template) {
    const templateAnswer = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Select template:',
        choices: [
          {
            name: 'MERN (MongoDB + Express + React + Node.js)',
            value: 'mern',
          },
          {
            name: 'PERN (PostgreSQL + Express + React + Node.js)',
            value: 'pern',
          },
          {
            name: 'Next.js (Full-stack React framework)',
            value: 'nextjs',
          },
        ],
      },
    ]);
    template = templateAnswer.template;
  }

  return {
    name: name!,
    template: template!,
    path: process.cwd(),
    installDeps: options?.install !== false,
    initGit: options?.git !== false,
  };
}

function getTemplate(templateType: TemplateType) {
  switch (templateType) {
    case 'mern':
      return getMernTemplate();
    case 'pern':
      return getPernTemplate();
    case 'nextjs':
      return getNextjsTemplate();
    default:
      throw new Error(`Unknown template: ${templateType}`);
  }
}

function displayNextSteps(config: ProjectConfig): void {
  const logger = new Logger();

  switch (config.template) {
    case 'mern':
    case 'pern':
      logger.log('  # Start backend (Terminal 1)');
      logger.log('  cd backend && npm run dev');
      logger.newLine();
      logger.log('  # Start frontend (Terminal 2)');
      logger.log('  cd frontend && npm run dev');
      logger.newLine();
      logger.info('Frontend: http://localhost:5173');
      logger.info('Backend: http://localhost:5000');
      break;

    case 'nextjs':
      logger.log('  npm run dev');
      logger.newLine();
      logger.info('App: http://localhost:3000');
      break;
  }
}