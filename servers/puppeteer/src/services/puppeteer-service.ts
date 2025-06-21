import puppeteer from 'puppeteer';
import type { Browser, Page } from 'puppeteer';
import {
  PuppeteerOptions,
  NavigateParams,
  ScreenshotParams,
  ClickParams,
  FillParams,
  SelectParams,
  HoverParams,
  EvaluateParams,
  WaitForSelectorParams,
  PuppeteerResult
} from '../types/index.js';

export class PuppeteerService {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private consoleLogs: Array<{ type: string; text: string; timestamp: Date }> = [];

  async launch(options: PuppeteerOptions = {}): Promise<PuppeteerResult> {
    try {
      if (this.browser) {
        await this.close();
      }

      const defaultArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ];

      // Security: validate and filter potentially dangerous args
      const dangerousArgs = [
        '--disable-web-security',
        '--allow-running-insecure-content',
        '--disable-features=VizDisplayCompositor'
      ];

      const safeArgs = options.args?.filter(arg => 
        !dangerousArgs.some(dangerous => arg.includes(dangerous))
      ) || [];

      this.browser = await puppeteer.launch({
        headless: options.headless ?? true,
        args: [...defaultArgs, ...safeArgs],
        executablePath: options.executablePath,
        timeout: options.timeout || 30000
      });

      this.page = await this.browser.newPage();
      
      // Set up console logging
      this.page.on('console', (msg: any) => {
        this.consoleLogs.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: new Date()
        });
      });

      await this.page.setViewport({ width: 1920, height: 1080 });

      return { success: true, data: 'Browser launched successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error launching browser' 
      };
    }
  }

  async navigate(params: NavigateParams): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        const launchResult = await this.launch();
        if (!launchResult.success) {
          return launchResult;
        }
      }

      await this.page!.goto(params.url, {
        waitUntil: params.waitUntil || 'networkidle2',
        timeout: params.timeout || 30000
      });

      return { success: true, data: `Navigated to ${params.url}` };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Navigation failed' 
      };
    }
  }

  async screenshot(params: ScreenshotParams = {}): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        return { success: false, error: 'No page available. Navigate to a URL first.' };
      }

      let screenshotBuffer: Buffer;

      if (params.selector) {
        const element = await this.page.$(params.selector);
        if (!element) {
          return { success: false, error: `Element with selector "${params.selector}" not found` };
        }
        screenshotBuffer = await element.screenshot({
          type: params.type || 'png',
          quality: params.quality
        });
      } else {
        screenshotBuffer = await this.page.screenshot({
          fullPage: params.fullPage || false,
          type: params.type || 'png',
          quality: params.quality,
          clip: params.clip
        });
      }

      const base64 = screenshotBuffer.toString('base64');
      return { 
        success: true, 
        data: { 
          screenshot: base64,
          type: params.type || 'png'
        } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Screenshot failed' 
      };
    }
  }

  async click(params: ClickParams): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        return { success: false, error: 'No page available. Navigate to a URL first.' };
      }

      await this.page.click(params.selector, {
        button: params.button || 'left',
        clickCount: params.clickCount || 1,
        delay: params.delay || 0
      });

      return { success: true, data: `Clicked element: ${params.selector}` };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Click failed' 
      };
    }
  }

  async fill(params: FillParams): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        return { success: false, error: 'No page available. Navigate to a URL first.' };
      }

      await this.page.focus(params.selector);
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('KeyA');
      await this.page.keyboard.up('Control');
      await this.page.type(params.selector, params.value, { delay: params.delay || 0 });

      return { success: true, data: `Filled element: ${params.selector}` };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Fill failed' 
      };
    }
  }

  async select(params: SelectParams): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        return { success: false, error: 'No page available. Navigate to a URL first.' };
      }

      const selectedValues = await this.page.select(params.selector, ...params.values);

      return { 
        success: true, 
        data: { 
          selector: params.selector,
          selectedValues: selectedValues
        } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Select failed' 
      };
    }
  }

  async hover(params: HoverParams): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        return { success: false, error: 'No page available. Navigate to a URL first.' };
      }

      await this.page.hover(params.selector);

      return { success: true, data: `Hovered over element: ${params.selector}` };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Hover failed' 
      };
    }
  }

  async evaluate(params: EvaluateParams): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        return { success: false, error: 'No page available. Navigate to a URL first.' };
      }

      const result = await this.page.evaluate(
        params.script,
        params.args
      );

      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Script evaluation failed' 
      };
    }
  }

  async waitForSelector(params: WaitForSelectorParams): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        return { success: false, error: 'No page available. Navigate to a URL first.' };
      }

      await this.page.waitForSelector(params.selector, {
        timeout: params.timeout || 30000,
        visible: params.visible,
        hidden: params.hidden
      });

      return { success: true, data: `Element found: ${params.selector}` };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Wait for selector failed' 
      };
    }
  }

  async getConsoleLogs(): Promise<PuppeteerResult> {
    return { 
      success: true, 
      data: this.consoleLogs.slice(-100) // Return last 100 logs
    };
  }

  async getPageInfo(): Promise<PuppeteerResult> {
    try {
      if (!this.page) {
        return { success: false, error: 'No page available. Navigate to a URL first.' };
      }

      const url = this.page.url();
      const title = await this.page.title();
      const viewport = this.page.viewport();

      return { 
        success: true, 
        data: { url, title, viewport } 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get page info' 
      };
    }
  }

  async close(): Promise<PuppeteerResult> {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
        this.consoleLogs = [];
      }
      return { success: true, data: 'Browser closed successfully' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to close browser' 
      };
    }
  }
}