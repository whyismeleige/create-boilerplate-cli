import { z } from 'zod';

/**
 * Validate project name
 */
export function validateProjectName(name: string): boolean | string {
  if (!name || name.trim().length === 0) {
    return 'Project name cannot be empty';
  }

  if (name.length > 214) {
    return 'Project name must be less than 214 characters';
  }

  // Check for valid npm package name format
  const validNameRegex = /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
  if (!validNameRegex.test(name)) {
    return 'Project name must contain only lowercase letters, numbers, hyphens, and underscores';
  }

  // Check for reserved names
  const reservedNames = ['node_modules', 'favicon.ico'];
  if (reservedNames.includes(name.toLowerCase())) {
    return `"${name}" is a reserved name and cannot be used`;
  }

  return true;
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize input string
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[^\w\s-]/g, '');
}

/**
 * Validate path
 */
export function validatePath(inputPath: string): boolean {
  try {
    // Check for path traversal attempts
    if (inputPath.includes('..') || inputPath.includes('~')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Zod schema for project configuration
 */
export const projectConfigSchema = z.object({
  name: z.string().min(1).max(214),
  description: z.string(),
  author: z.string(),
  stack: z.enum(['mern', 'pern', 'nextjs', 'flask', 'express', 'django']),
  features: z.object({
    typescript: z.boolean(),
    eslint: z.boolean(),
    prettier: z.boolean(),
    docker: z.boolean(),
    githubActions: z.boolean(),
    testing: z.enum(['jest', 'vitest', 'pytest', 'none']),
  }),
  path: z.string(),
});