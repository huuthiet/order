import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';
import { formatCurrency } from 'src/helper';
import * as ejs from 'ejs';

@Injectable()
export class PdfService {
  private async compileTemplate(
    templateName: string,
    data: any,
  ): Promise<string> {
    const templatePath = path.resolve(
      'public/templates',
      `${templateName}.ejs`,
    );
    if (!fs.existsSync(templatePath)) {
      throw new BadRequestException(
        `Template ${templateName} not found at ${templatePath}`,
      );
    }
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = ejs.render(templateSource, { ...data, formatCurrency });
    return template;
  }

  public async generatePdf(templateName: string, data: any): Promise<Buffer> {
    // Compile HTML using the specified template and data
    const htmlContent = await this.compileTemplate(templateName, data);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();

    // Set the HTML content for the page
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate the PDF
    const pdfBuffer = await page.pdf({
      format: 'A4', // You can customize this (e.g., `A5`, custom size)
      printBackground: true,
    });

    // Close the browser
    await browser.close();

    return Buffer.from(pdfBuffer);
  }
}
