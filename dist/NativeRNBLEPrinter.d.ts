import { TurboModule } from 'react-native';
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
    printRawData(data: string, options?: PrinterOptions): Promise<void>;
    printImageData(imageUrl: string): Promise<void>;
    printQrCode(qrCode: string): Promise<void>;
    printHex(hex: string, options?: PrinterOptions): Promise<void>;
    addListener(eventName: string): void;
    removeListeners(count: number): void;
}
declare const _default: Spec;
export default _default;
