#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { createProject } from './commands/create';
import { listTemplates } from './commands/list';

const program = new Command();

// Display banner
console.log(
  chalk.cyan(
    figlet.textSync('Create Boilerplate', {
      font: 'Standard',
      horizontalLayout: 'default',
    })
  )
);

program
  .name('create-boilerplate')
  .description('CLI tool to generate project boilerplate code')
  .version('1.0.0');

// Create command (default interactive mode)
program
  .command('create [project-name]')
  .description('Create a new project with boilerplate code')
  .option('-s, --stack <stack>', 'Tech stack (mern, pern, nextjs, flask)')
  .option('-t, --typescript', 'Enable TypeScript')
  .option('-d, --docker', 'Include Docker configuration')
  .option('--no-git', 'Skip Git initialization')
  .option('-p, --path <path>', 'Project path', process.cwd())
  .action(createProject);

// List command
program
  .command('list')
  .description('List all available templates')
  .action(listTemplates);

// Set default command
program.action(() => {
  createProject();
});

program.parse(process.argv);

// If no arguments, run interactive mode
if (!process.argv.slice(2).length) {
  createProject();
}