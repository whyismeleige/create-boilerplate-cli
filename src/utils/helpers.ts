import { ProjectConfig, StackType } from '../types';

/**
 * Get stack display name
 */
export function getStackDisplayName(stack: StackType): string {
  const displayNames: Record<StackType, string> = {
    mern: 'MERN (MongoDB, Express, React, Node.js)',
    pern: 'PERN (PostgreSQL, Express, React, Node.js)',
    nextjs: 'Next.js (React Framework with SSR)',
    flask: 'Flask (Python Web Framework)',
    express: 'Express.js (Node.js Framework)',
    django: 'Django (Python Web Framework)',
  };

  return displayNames[stack] || stack.toUpperCase();
}

/**
 * Format package name
 */
export function formatPackageName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Generate random port number
 */
export function generateRandomPort(min = 3000, max = 9000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get default testing framework for stack
 */
export function getDefaultTestingFramework(stack: StackType): string {
  if (stack === 'flask' || stack === 'django') {
    return 'pytest';
  }
  return 'jest';
}

/**
 * Check if stack supports TypeScript
 */
export function supportsTypeScript(stack: StackType): boolean {
  return ['mern', 'pern', 'nextjs', 'express'].includes(stack);
}

/**
 * Get file extension based on TypeScript preference
 */
export function getFileExtension(useTypeScript: boolean): string {
  return useTypeScript ? 'ts' : 'js';
}

/**
 * Get React file extension based on TypeScript preference
 */
export function getReactFileExtension(useTypeScript: boolean): string {
  return useTypeScript ? 'tsx' : 'jsx';
}

/**
 * Convert string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toUpperCase());
}

/**
 * Convert string to camelCase
 */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Get current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Format date
 */
export function formatDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get project summary
 */
export function getProjectSummary(config: ProjectConfig): string {
  const features = [];
  if (config.features.typescript) features.push('TypeScript');
  if (config.features.eslint) features.push('ESLint');
  if (config.features.prettier) features.push('Prettier');
  if (config.features.docker) features.push('Docker');
  if (config.features.githubActions) features.push('GitHub Actions');
  if (config.features.testing !== 'none')
    features.push(config.features.testing);

  return `
  Name: ${config.name}
  Stack: ${getStackDisplayName(config.stack)}
  Features: ${features.join(', ') || 'None'}
  `;
}