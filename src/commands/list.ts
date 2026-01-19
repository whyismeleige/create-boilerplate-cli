import chalk from 'chalk';
import { Logger } from '../utils/logger.js';

export function listTemplates(): void {
  const logger = new Logger();

  logger.title('📋 Available Templates');

  const templates = [
    {
      name: 'MERN',
      description: 'MongoDB + Express + React + Node.js',
      command: 'project-launcher create my-app --template mern',
    },
    {
      name: 'PERN',
      description: 'PostgreSQL + Express + React + Node.js',
      command: 'project-launcher create my-app --template pern',
    },
    {
      name: 'Next.js',
      description: 'Full-stack React framework with TypeScript',
      command: 'project-launcher create my-app --template nextjs',
    },
  ];

  templates.forEach((template, index) => {
    logger.log(chalk.bold.cyan(`\n${index + 1}. ${template.name}`));
    logger.log(`   ${template.description}`);
    logger.log(chalk.gray(`   $ ${template.command}`));
  });

  logger.newLine();
}