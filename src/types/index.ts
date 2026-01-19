export type TemplateType = 'mern' | 'pern' | 'nextjs';

export interface ProjectConfig {
  name: string;
  template: TemplateType;
  path: string;
  installDeps: boolean;
  initGit: boolean;
}

export interface Template {
  name: string;
  description: string;
  structure: DirectoryStructure;
  files: TemplateFile[];
}

export interface DirectoryStructure {
  [key: string]: DirectoryStructure | null;
}

export interface TemplateFile {
  path: string;
  content: string;
}

export interface CreateOptions {
  template?: string;
  install?: boolean;
  git?: boolean;
}