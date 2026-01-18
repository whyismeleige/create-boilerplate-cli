import inquirer from 'inquirer';
import { ProjectConfig, StackType, TestingFramework } from '../types';
import { validateProjectNamePrompt } from './validators';
import {
  supportsTypeScript,
  getStackDisplayName,
  getProjectSummary,
} from '../utils/helpers';
import chalk from 'chalk';

/**
 * Prompt user for project details
 */
export async function promptProjectDetails(
  projectName?: string
): Promise<ProjectConfig> {
  console.log(
    chalk.cyan('\n📝 Let\'s create your project!\n')
  );

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your project name?',
      default: projectName || 'my-app',
      validate: validateProjectNamePrompt,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Project description?',
      default: 'A new project',
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name?',
      default: '',
    },
    {
      type: 'list',
      name: 'stack',
      message: 'Select your tech stack:',
      choices: [
        {
          name: getStackDisplayName('mern'),
          value: 'mern',
        },
        {
          name: getStackDisplayName('pern'),
          value: 'pern',
        },
        {
          name: getStackDisplayName('nextjs'),
          value: 'nextjs',
        },
        {
          name: getStackDisplayName('flask'),
          value: 'flask',
        },
        {
          name: getStackDisplayName('express'),
          value: 'express',
        },
      ],
    },
  ]);

  // TypeScript option (only for supported stacks)
  let typescript = false;
  if (supportsTypeScript(answers.stack as StackType)) {
    const tsAnswer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Enable TypeScript?',
        default: true,
      },
    ]);
    typescript = tsAnswer.typescript;
  }

  // Additional features
  const featuresAnswers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'eslint',
      message: 'Add ESLint?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'prettier',
      message: 'Add Prettier?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'docker',
      message: 'Include Docker configuration?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'githubActions',
      message: 'Add GitHub Actions CI/CD?',
      default: false,
    },
    {
      type: 'list',
      name: 'testing',
      message: 'Testing framework?',
      choices: [
        { name: 'Jest', value: 'jest' },
        { name: 'Vitest', value: 'vitest' },
        {
          name: 'Pytest (for Python)',
          value: 'pytest',
          disabled: !['flask', 'django'].includes(answers.stack),
        },
        { name: 'None', value: 'none' },
      ],
      default: answers.stack === 'flask' || answers.stack === 'django' ? 'pytest' : 'jest',
    },
  ]);

  const config: ProjectConfig = {
    name: answers.name,
    description: answers.description,
    author: answers.author,
    stack: answers.stack as StackType,
    features: {
      typescript,
      eslint: featuresAnswers.eslint,
      prettier: featuresAnswers.prettier,
      docker: featuresAnswers.docker,
      githubActions: featuresAnswers.githubActions,
      testing: featuresAnswers.testing as TestingFramework,
    },
    path: process.cwd(),
  };

  // Display summary
  console.log(chalk.cyan('\n✓ Configuration Summary:'));
  console.log(getProjectSummary(config));

  // Confirm
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with creation?',
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.yellow('\nProject creation cancelled.'));
    process.exit(0);
  }

  return config;
}

/**
 * Prompt for confirmation
 */
export async function promptConfirmation(
  message: string,
  defaultValue = true
): Promise<boolean> {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message,
      default: defaultValue,
    },
  ]);
  return confirm;
}