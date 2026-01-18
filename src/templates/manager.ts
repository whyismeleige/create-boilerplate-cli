import { Template } from '../types/templates.types';
import { ProjectConfig, StackType } from '../types';
import { FileSystemService } from '../utils/fileSystem';
import {
  mernTemplate,
  pernTemplate,
  nextjsTemplate,
  flaskTemplate,
  getMernTemplateFiles,
  getPernTemplateFiles,
  getNextjsTemplateFiles,
  getFlaskTemplateFiles,
} from './generators';

export class TemplateManager {
  private templates: Map<StackType, Template>;
  private fileSystemService: FileSystemService;

  constructor() {
    this.fileSystemService = new FileSystemService();
    this.templates = new Map([
      ['mern', mernTemplate],
      ['pern', pernTemplate],
      ['nextjs', nextjsTemplate],
      ['flask', flaskTemplate],
    ]);
  }

  /**
   * Get template by stack type
   */
  getTemplate(stack: StackType): Template {
    const template = this.templates.get(stack);
    if (!template) {
      throw new Error(`Template for ${stack} not found`);
    }
    return template;
  }

  /**
   * List all available templates
   */
  listTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * Generate all files for a project
   */
  async generateFiles(
    projectPath: string,
    config: ProjectConfig
  ): Promise<void> {
    const files = this.getTemplateFiles(config);

    for (const file of files) {
      const content =
        typeof file.content === 'function'
          ? file.content(config)
          : file.content;

      const filePath = `${projectPath}/${file.path}`;
      await this.fileSystemService.writeFile(filePath, content);
    }
  }

  /**
   * Get template files based on stack
   */
  private getTemplateFiles(config: ProjectConfig) {
    switch (config.stack) {
      case 'mern':
        return getMernTemplateFiles(config);
      case 'pern':
        return getPernTemplateFiles(config);
      case 'nextjs':
        return getNextjsTemplateFiles(config);
      case 'flask':
        return getFlaskTemplateFiles(config);
      case 'express':
        // Express can use server part of MERN without MongoDB
        return this.getExpressTemplateFiles(config);
      default:
        throw new Error(`Unknown stack: ${config.stack}`);
    }
  }

  /**
   * Get Express-only template files
   */
  private getExpressTemplateFiles(config: ProjectConfig) {
    // Similar to server part of MERN
    const mernFiles = getMernTemplateFiles(config);
    // Filter to only server files and root files
    return mernFiles.filter(
      (f) =>
        f.path.startsWith('server/') ||
        f.path === 'README.md' ||
        f.path === '.gitignore' ||
        f.path === '.env.example'
    ).map((f) => ({
      ...f,
      path: f.path.replace('server/', ''),
    }));
  }

  /**
   * Validate template
   */
  validateTemplate(template: Template): boolean {
    return !!(
      template.name &&
      template.description &&
      template.structure
    );
  }
}