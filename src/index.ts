import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

import * as EPToolkit from './utils/EPToolkit';
import BufferHelper from './utils/buffer-helper';
import { Buffer } from 'buffer';

import RNUSBPrinterTurbo from './NativeRNUSBPrinter';
import RNBLEPrinterTurbo from './NativeRNBLEPrinter';
import RNNetPrinterTurbo from './NativeRNNetPrinter';

const isTurbo = RNUSBPrinterTurbo != null;

const RNUSBPrinter = isTurbo ? RNUSBPrinterTurbo : NativeModules.RNUSBPrinter;
const RNBLEPrinter = isTurbo ? RNBLEPrinterTurbo : NativeModules.RNBLEPrinter;
const RNNetPrinter = isTurbo ? RNNetPrinterTurbo : NativeModules.RNNetPrinter;

export interface PrinterOptions {
	beep?: boolean;
	cut?: boolean;
	tailingLine?: boolean;
	encoding?: string;
}

export interface IUSBPrinter {
	device_name: string;
	vendor_id: string;
	product_id: string;
}

export interface IBLEPrinter {
	device_name: string;
	inner_mac_address: string;
}

export interface INetPrinter {
	device_name: string;
	host: string;
	port: number;
}

const bytesToString = (data: Uint8Array, type: 'base64' | 'hex') => {
	const bytes = new BufferHelper();
	bytes.concat(Buffer.from(data));
	const buffer = bytes.toBuffer();
	return buffer.toString(type);
};

const textTo64Buffer = (text: string, opts: PrinterOptions) => {
	const defaultOptions = {
		beep: false,
		cut: false,
		tailingLine: false,
		encoding: 'UTF8',
	};

	const options = {
		...defaultOptions,
		...opts,
	};
	const buffer = EPToolkit.exchange_text(text, options);
	return buffer.toString('base64');
};

const billTo64Buffer = (text: string, opts: PrinterOptions) => {
	const defaultOptions = {
		beep: true,
		cut: true,
		encoding: 'UTF8',
		tailingLine: true,
	};
	const options = {
		...defaultOptions,
		...opts,
	};
	const buffer = EPToolkit.exchange_text(text, options);
	return buffer.toString('base64');
};

const textPreprocessingIOS = (text: string) => {
	let options = {
		beep: true,
		cut: true,
	};
	return {
		text: text
			.replace(/<\/?CB>/g, '')
			.replace(/<\/?CM>/g, '')
			.replace(/<\/?CD>/g, '')
			.replace(/<\/?C>/g, '')
			.replace(/<\/?D>/g, '')
			.replace(/<\/?B>/g, '')
			.replace(/<\/?M>/g, ''),
		opts: options,
	};
};

const imageToBuffer = async (imagePath: string, threshold: number = 60) => {
	const buffer = await EPToolkit.exchange_image(imagePath, threshold);
	return buffer.toString('base64');
};

export const USBPrinter = {
	init: (): Promise<void> => {
		if (isTurbo) {
			return RNUSBPrinter.init();
		}
		return new Promise((resolve, reject) =>
			RNUSBPrinter.init(
				() => resolve(),
				(error: Error) => reject(error),
			),
		);
	},

	getDeviceList: (): Promise<IUSBPrinter[]> => {
		if (isTurbo) {
			return RNUSBPrinter.getDeviceList();
		}
		return new Promise((resolve, reject) =>
			RNUSBPrinter.getDeviceList(
				(printers: IUSBPrinter[]) => resolve(printers),
				(error: Error) => reject(error),
			),
		);
	},

	connectPrinter: (vendorId: string, productId: string): Promise<IUSBPrinter> => {
		if (isTurbo) {
			return RNUSBPrinter.connectPrinter(vendorId, productId);
		}
		return new Promise((resolve, reject) =>
			RNUSBPrinter.connectPrinter(
				vendorId,
				productId,
				(printer: IUSBPrinter) => resolve(printer),
				(error: Error) => reject(error),
			),
		);
	},

	closeConn: (): Promise<void> => {
		if (isTurbo) {
			return RNUSBPrinter.closeConn();
		}
		return new Promise((resolve) => {
			RNUSBPrinter.closeConn();
			resolve();
		});
	},

	printText: (text: string, opts: PrinterOptions = {}): void | Promise<void> => {
		const data = textTo64Buffer(text, opts);
		if (isTurbo) {
			return RNUSBPrinter.printRawData(data, opts);
		}
		return RNUSBPrinter.printRawData(data, (error: Error) => console.warn(error));
	},

	printBill: (text: string, opts: PrinterOptions = {}): void | Promise<void> => {
		const data = billTo64Buffer(text, opts);
		if (isTurbo) {
			return RNUSBPrinter.printRawData(data, opts);
		}
		return RNUSBPrinter.printRawData(data, (error: Error) => console.warn(error));
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {}): void | Promise<void> => {
		const payload = bytesToString(data, 'base64');
		if (isTurbo) {
			return RNUSBPrinter.printRawData(payload);
		}
		return RNUSBPrinter.printRawData(payload, (error: Error) => {
				if (onError) {
					onError(error);
				}
			});
	},

	printImage: async (imagePath: string) => {
	  const tmp = await imageToBuffer(imagePath);
		if (isTurbo) {
			return RNUSBPrinter.printRawData(tmp);
		}
	  RNUSBPrinter.printRawData(tmp, (error: Error) => console.warn(error));
	},
};

export const BLEPrinter = {
	init: (): Promise<void> => {
		if (isTurbo) {
			return RNBLEPrinter.init();
		}
		return new Promise((resolve, reject) =>
			RNBLEPrinter.init(
				() => resolve(),
				(error: Error) => reject(error),
			),
		);
	},

	getDeviceList: (): Promise<IBLEPrinter[]> => {
		if (isTurbo) {
			return RNBLEPrinter.getDeviceList();
		}
		return new Promise((resolve, reject) =>
			RNBLEPrinter.getDeviceList(
				(printers: IBLEPrinter[]) => resolve(printers),
				(error: Error) => reject(error),
			),
		);
	},

	connectPrinter: (inner_mac_address: string): Promise<IBLEPrinter> => {
		if (isTurbo) {
			return RNBLEPrinter.connectPrinter(inner_mac_address);
		}
		return new Promise((resolve, reject) =>
			RNBLEPrinter.connectPrinter(
				inner_mac_address,
				(printer: IBLEPrinter) => resolve(printer),
				(error: Error) => reject(error),
			),
		);
	},

	closeConn: (): Promise<void> => {
		if (isTurbo) {
			return RNBLEPrinter.closeConn();
		}
		return new Promise((resolve) => {
			RNBLEPrinter.closeConn();
			resolve();
		});
	},

	printText: (text: string, opts: PrinterOptions = {}): void | Promise<void> => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			if (isTurbo) {
				return RNBLEPrinter.printRawData(processedText.text, processedText.opts);
			}
			return RNBLEPrinter.printRawData(
				processedText.text,
				processedText.opts,
				(error: Error) => console.warn(error),
			);
		} else {
			const data = textTo64Buffer(text, opts);
			if (isTurbo) {
				return RNBLEPrinter.printRawData(data, opts);
			}
			return RNBLEPrinter.printRawData(data, (error: Error) => console.warn(error));
		}
	},

	printBill: (text: string, opts: PrinterOptions = {}): void | Promise<void> => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			if (isTurbo) {
				return RNBLEPrinter.printRawData(processedText.text, processedText.opts);
			}
			return RNBLEPrinter.printRawData(
				processedText.text,
				processedText.opts,
				(error: Error) => console.warn(error),
			);
		} else {
			const data = billTo64Buffer(text, opts);
			if (isTurbo) {
				return RNBLEPrinter.printRawData(data, opts);
			}
			return RNBLEPrinter.printRawData(data, (error: Error) => console.warn(error));
		}
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {}): void | Promise<void> => {
		if (Platform.OS === 'ios') {
			const processedText = bytesToString(data, 'hex');
			if (isTurbo) {
				// If Turbo iOS supports hex path, prefer printHex; else printRawData
				return RNBLEPrinter.printHex ? RNBLEPrinter.printHex(processedText, { beep: true, cut: true }) : RNBLEPrinter.printRawData(processedText);
			}
			return RNBLEPrinter.printHex(
				processedText,
				{ beep: true, cut: true },
				(error: Error) => {
					if (onError) {
						onError(error);
					}
				},
			);
		} else {
			const payload = bytesToString(data, 'base64');
			if (isTurbo) {
				return RNBLEPrinter.printRawData(payload);
			}
			return RNBLEPrinter.printRawData(payload, (error: Error) => {
					if (onError) {
						onError(error);
					}
				},
			);
		}
	},

	printImage: async (imagePath: string) => {
		const tmp = await imageToBuffer(imagePath);
		if (isTurbo) {
			return RNBLEPrinter.printRawData(tmp);
		}
		RNBLEPrinter.printRawData(tmp, (error: Error) => console.warn(error));
	},
};

export const NetPrinter = {
	init: (): Promise<void> =>
		new Promise((resolve, reject) =>
			RNNetPrinter.init(
				() => resolve(),
				(error: Error) => reject(error),
			),
		),

	getDeviceList: (): Promise<INetPrinter[]> =>
		new Promise((resolve, reject) =>
			RNNetPrinter.getDeviceList(
				(printers: INetPrinter[]) => resolve(printers),
				(error: Error) => reject(error),
			),
		),

	connectPrinter: (host: string, port: number): Promise<INetPrinter> =>
		new Promise((resolve, reject) =>
			RNNetPrinter.connectPrinter(
				host,
				port,
				(printer: INetPrinter) => resolve(printer),
				(error: Error) => reject(error),
			),
		),

	closeConn: (): Promise<void> =>
		new Promise((resolve) => {
			RNNetPrinter.closeConn();
			resolve();
		}),

	printText: (text: string, opts = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			RNNetPrinter.printRawData(
				processedText.text,
				processedText.opts,
				(error: Error) => console.warn(error),
			);
		} else {
			RNNetPrinter.printRawData(textTo64Buffer(text, opts), (error: Error) =>
				console.warn(error),
			);
		}
	},

	printBill: (text: string, opts = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			RNNetPrinter.printRawData(
				processedText.text,
				processedText.opts,
				(error: Error) => console.warn(error),
			);
		} else {
			RNNetPrinter.printRawData(billTo64Buffer(text, opts), (error: Error) =>
				console.warn(error),
			);
		}
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {
	}) => {
		if (Platform.OS === 'ios') {
			const processedText = bytesToString(data, 'hex');
			RNNetPrinter.printHex(
				processedText,
				{ beep: true, cut: true },
				(error: Error) => {
					if (onError) {
						onError(error);
					}
				},
			);
		} else {
			RNNetPrinter.printRawData(bytesToString(data, 'base64'), (error: Error) => {
					if (onError) {
						onError(error);
					}
				},
			);
		}
	},

	printImage: async (imagePath: string) => {
		const tmp = await imageToBuffer(imagePath);
		RNNetPrinter.printRawData(tmp, (error: Error) => console.warn(error));
	},
};

export const NetPrinterEventEmitter = new NativeEventEmitter(RNNetPrinter);

export enum RN_THERMAL_RECEIPT_PRINTER_EVENTS {
	EVENT_NET_PRINTER_SCANNED_SUCCESS = 'scannerResolved',
	EVENT_NET_PRINTER_SCANNING = 'scannerRunning',
	EVENT_NET_PRINTER_SCANNED_ERROR = 'registerError',
}
