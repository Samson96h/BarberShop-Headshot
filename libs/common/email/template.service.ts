import { readFileSync, existsSync } from 'fs';
import { Injectable } from '@nestjs/common';
import * as handlebars from 'handlebars';
import { join, resolve } from 'path';


@Injectable()
export class TemplateService {
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();

  private readonly templatesPath = resolve(process.cwd(), 'libs/common/email/templates');

  compile(template: string, context: Record<string, any> = {}): { html: string; error: string | null } {
    try {
      if (!this.templates.has(template)) {
        const templatePath = join(this.templatesPath, `${template}.hbs`);

        if (!existsSync(templatePath)) {
          return { html: '', error: `template "${template}" not found on path: ${templatePath}` };
        }

        const templateContent = readFileSync(templatePath, 'utf-8');
        this.templates.set(template, handlebars.compile(templateContent));
      }

      const compiled = this.templates.get(template);
      if (!compiled) {
        return { html: '', error: `Failed to get compiled template"${template}"` };
      }

      const html = compiled(context);
      return { html, error: null };

    } catch (error: any) {
      return {
        html: '',
        error: `Template rendering error "${template}": ${error?.message}`,
      };
    }
  }
}