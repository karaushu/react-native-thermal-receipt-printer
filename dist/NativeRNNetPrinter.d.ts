import { TurboModule } from 'react-native';
export type PrinterOptions = {
    beep?: boolean;
    cut?: boolean;
    tailingLine?: boolean;
    encoding?: string;
};
export type NetPrinterDevice = {
    device_name: string;
    host: string;
    port: number;
};
export interface Spec extends TurboModule {
    init(): Promise<void>;
    closeConn(): Promise<void>;
    getDeviceList(): Promise<NetPrinterDevice[]>;
    connectPrinter(host: string, port: number): Promise<NetPrinterDevice>;
    printRawData(data: string, options?: PrinterOptions): Promise<void>;
    printImageData(imageUrl: string): Promise<void>;
    printQrCode(qrCode: string): Promise<void>;
    printHex?(hex: string, options?: PrinterOptions): Promise<void>;
    addListener(eventName: string): void;
    removeListeners(count: number): void;
}
declare const _default: Spec;
export default _default;
