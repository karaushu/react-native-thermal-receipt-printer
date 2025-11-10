import { TurboModule, TurboModuleRegistry } from 'react-native';

export type PrinterOptions = {
  beep?: boolean;
  cut?: boolean;
  tailingLine?: boolean;
  encoding?: string;
};

export type USBPrinterDevice = {
  device_name: string;
  vendor_id: string;
  product_id: string;
};

export interface Spec extends TurboModule {
  init(): Promise<void>;
  closeConn(): Promise<void>;
  getDeviceList(): Promise<USBPrinterDevice[]>;
  connectPrinter(vendorId: string, productId: string): Promise<USBPrinterDevice>;
  printRawData(base64Data: string, options?: PrinterOptions): Promise<void>;
  printImageData(imageUrl: string): Promise<void>;
  printQrCode(qrCode: string): Promise<void>;
}

const isTurboModuleEnabled = (global as any).__turboModuleProxy != null;

export default isTurboModuleEnabled
  ? TurboModuleRegistry.getEnforcing<Spec>('RNUSBPrinter')
  : (null as unknown as Spec);
