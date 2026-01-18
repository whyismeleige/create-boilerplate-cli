import { validateProjectName } from '../utils/validation';

/**
 * Validate project name for inquirer
 */
export function validateProjectNamePrompt(
  input: string
): boolean | string {
  return validateProjectName(input);
}

/**
 * Validate non-empty input
 */
export function validateNonEmpty(input: string): boolean | string {
  if (!input || input.trim().length === 0) {
    return 'This field cannot be empty';
  }
  return true;
}

/**
 * Validate port number
 */
export function validatePort(input: string): boolean | string {
  const port = parseInt(input, 10);
  if (isNaN(port)) {
    return 'Port must be a number';
  }
  if (port < 1 || port > 65535) {
    return 'Port must be between 1 and 65535';
  }
  return true;
}