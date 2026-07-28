/// <reference types="vite-plugin-pwa/client" />

interface BarcodeDetectorOptions {
  formats: string[];
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions);
  detect(image: ImageBitmapSource): Promise<{ rawValue?: string }[]>;
}
