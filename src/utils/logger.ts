import chalk from 'chalk';

export class Logger {
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  error(message: string): void {
    console.log(chalk.red('✗'), message);
  }

  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  log(message: string): void {
    console.log(message);
  }

  title(message: string): void {
    console.log(chalk.bold.cyan(`\n${message}\n`));
  }

  step(step: number, total: number, message: string): void {
    console.log(chalk.cyan(`[${step}/${total}]`), message);
  }

  newLine(): void {
    console.log('');
  }
}