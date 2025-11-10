import { TurboModule, TurboModuleRegistry } from 'react-native';

export type PrinterOptions = {
  beep?: boolean;
  cut?: boolean;
  tailingLine?: boolean;
  encoding?: string;
};

export type BLEPrinterDevice = {
  device_name: string;
  inner_mac_address: string;
};

export interface Spec extends TurboModule {
  init(): Promise<void>;
  closeConn(): Promise<void>;
  getDeviceList(): Promise<BLEPrinterDevice[]>;
  connectPrinter(inner_mac_address: string): Promise<BLEPrinterDevice>;
  // Data can be base64 (Android) or plain/hex string (iOS) depending on platform implementation
  printRawData(data: string, options?: PrinterOptions): Promise<void>;
  printImageData(imageUrl: string): Promise<void>;
  printQrCode(qrCode: string): Promise<void>;
  // iOS-specific today but harmless to expose cross-platform
  printHex(hex: string, options?: PrinterOptions): Promise<void>;
  // EventEmitter support (Android fallback)
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

const isTurboModuleEnabled = (global as any).__turboModuleProxy != null;

export default isTurboModuleEnabled
  ? TurboModuleRegistry.getEnforcing<Spec>('RNBLEPrinter')
  : (null as unknown as Spec);
