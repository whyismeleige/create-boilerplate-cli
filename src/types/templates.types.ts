import {
  DirectoryStructure,
  TemplateFile,
  Dependencies,
  Scripts,
} from './index';

export interface Template {
  name: string;
  description: string;
  version: string;
  structure: DirectoryStructure;
  dependencies: Dependencies;
  devDependencies: Dependencies;
  scripts: Scripts;
  files: TemplateFile[];
}

export interface PackageJsonContent {
  name: string;
  version: string;
  description: string;
  main?: string;
  scripts: Scripts;
  dependencies: Dependencies;
  devDependencies: Dependencies;
  author?: string;
  license?: string;
  type?: string;
}

export interface TsConfigContent {
  compilerOptions: {
    target: string;
    module: string;
    lib?: string[];
    jsx?: string;
    outDir?: string;
    rootDir?: string;
    strict: boolean;
    esModuleInterop: boolean;
    skipLibCheck: boolean;
    forceConsistentCasingInFileNames: boolean;
    resolveJsonModule?: boolean;
    moduleResolution?: string;
    allowSyntheticDefaultImports?: boolean;
    [key: string]: unknown;
  };
  include: string[];
  exclude: string[];
}