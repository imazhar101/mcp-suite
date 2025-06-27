export interface PuppeteerOptions {
  headless?: boolean;
  args?: string[];
  executablePath?: string;
  timeout?: number;
}

export interface NavigateParams {
  url: string;
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
  timeout?: number;
}

export interface ScreenshotParams {
  selector?: string;
  fullPage?: boolean;
  quality?: number;
  type?: "png" | "jpeg" | "webp";
  clip?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ClickParams {
  selector: string;
  button?: "left" | "right" | "middle";
  clickCount?: number;
  delay?: number;
}

export interface FillParams {
  selector: string;
  value: string;
  delay?: number;
}

export interface SelectParams {
  selector: string;
  values: string[];
}

export interface HoverParams {
  selector: string;
}

export interface EvaluateParams {
  script: string;
  args?: any[];
}

export interface WaitForSelectorParams {
  selector: string;
  timeout?: number;
  visible?: boolean;
  hidden?: boolean;
}

export interface PuppeteerResult {
  success: boolean;
  data?: any;
  error?: string;
}
