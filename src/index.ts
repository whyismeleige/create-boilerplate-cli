#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import { createProject } from './commands/create.js';
import { listTemplates } from './commands/list.js';

const program = new Command();

// Display banner
console.log(
  chalk.cyan(
    figlet.textSync('Project Launcher', {
      font: 'Standard',
      horizontalLayout: 'default',
    })
  )
);

program
  .name('project-launcher')
  .description('CLI tool to quickly scaffold MERN, PERN, and Next.js projects')
  .version('1.0.0');

// Create command
program
  .command('create [project-name]')
  .description('Create a new project with selected template')
  .option('-t, --template <template>', 'Template: mern, pern, nextjs')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip Git initialization')
  .action(async (projectName, options) => {
    await createProject(projectName, options);
  });

// List command
program
  .command('list')
  .description('List all available templates')
  .action(listTemplates);

// Default action
program.action(() => {
  program.help();
});

program.parse(process.argv);

// If no arguments, show help
if (!process.argv.slice(2).length) {
  program.help();
}