export type StackType =
  | 'mern'
  | 'pern'
  | 'nextjs'
  | 'flask'
  | 'express'
  | 'django';

export type TestingFramework = 'jest' | 'vitest' | 'pytest' | 'none';

export interface ProjectConfig {
  name: string;
  description: string;
  author: string;
  stack: StackType;
  features: Features;
  path: string;
}

export interface Features {
  typescript: boolean;
  eslint: boolean;
  prettier: boolean;
  docker: boolean;
  githubActions: boolean;
  testing: TestingFramework;
}

export interface DirectoryStructure {
  [key: string]: DirectoryStructure | null;
}

export interface TemplateFile {
  path: string;
  content: string | ((config: ProjectConfig) => string);
  condition?: (config: ProjectConfig) => boolean;
}

export interface Dependencies {
  [key: string]: string;
}

export interface Scripts {
  [key: string]: string;
}

export enum ErrorCode {
  INVALID_PROJECT_NAME = 'INVALID_PROJECT_NAME',
  DIRECTORY_EXISTS = 'DIRECTORY_EXISTS',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DEPENDENCY_INSTALL_FAILED = 'DEPENDENCY_INSTALL_FAILED',
  TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
}

export class BoilerplateError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public recoverable: boolean = false
  ) {
    super(message);
    this.name = 'BoilerplateError';
  }
}