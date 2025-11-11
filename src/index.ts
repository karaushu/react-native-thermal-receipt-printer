import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

import * as EPToolkit from './utils/EPToolkit';
import BufferHelper from './utils/buffer-helper';
import { Buffer } from 'buffer';
import {
	callNativeMethod,
	callNativeVoid,
	callNativeWithError,
	callNativeWithOptions,
	isTurbo,
} from './utils/turbo-helpers';
import RNUSBPrinterTurbo from './NativeRNUSBPrinter';
import RNBLEPrinterTurbo from './NativeRNBLEPrinter';
import RNNetPrinterTurbo from './NativeRNNetPrinter';

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
	init: (): Promise<void> => callNativeMethod(RNUSBPrinter.init),

	getDeviceList: (): Promise<IUSBPrinter[]> =>
		callNativeMethod<IUSBPrinter[]>(RNUSBPrinter.getDeviceList),

	connectPrinter: (vendorId: string, productId: string): Promise<IUSBPrinter> =>
		callNativeMethod<IUSBPrinter>(RNUSBPrinter.connectPrinter, vendorId, productId),

	closeConn: (): Promise<void> => callNativeVoid(RNUSBPrinter.closeConn),

	printText: (text: string, opts: PrinterOptions = {}): void => {
		callNativeWithError(
			RNUSBPrinter.printRawData,
			(error: Error) => console.warn(error),
			textTo64Buffer(text, opts)
		);
	},

	printBill: (text: string, opts: PrinterOptions = {}): void => {
		callNativeWithError(
			RNUSBPrinter.printRawData,
			(error: Error) => console.warn(error),
			billTo64Buffer(text, opts)
		);
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {}) => {
		callNativeWithError(RNUSBPrinter.printRawData, onError, bytesToString(data, 'base64'));
	},

	printImage: async (imagePath: string) => {
		const tmp = await imageToBuffer(imagePath);
		callNativeWithError(RNUSBPrinter.printRawData, (error: Error) => console.warn(error), tmp);
	},
};

export const BLEPrinter = {
	init: (): Promise<void> => callNativeMethod(RNBLEPrinter.init),

	getDeviceList: (): Promise<IBLEPrinter[]> =>
		callNativeMethod<IBLEPrinter[]>(RNBLEPrinter.getDeviceList),

	connectPrinter: (inner_mac_address: string): Promise<IBLEPrinter> =>
		callNativeMethod<IBLEPrinter>(RNBLEPrinter.connectPrinter, inner_mac_address),

	closeConn: (): Promise<void> => callNativeVoid(RNBLEPrinter.closeConn),

	printText: (text: string, opts: PrinterOptions = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			callNativeWithOptions(
				RNBLEPrinter.printRawData,
				(error: Error) => console.warn(error),
				processedText.text,
				processedText.opts
			);
		} else {
			callNativeWithError(
				RNBLEPrinter.printRawData,
				(error: Error) => console.warn(error),
				textTo64Buffer(text, opts)
			);
		}
	},

	printBill: (text: string, opts: PrinterOptions = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			callNativeWithOptions(
				RNBLEPrinter.printRawData,
				(error: Error) => console.warn(error),
				processedText.text,
				processedText.opts
			);
		} else {
			callNativeWithError(
				RNBLEPrinter.printRawData,
				(error: Error) => console.warn(error),
				billTo64Buffer(text, opts)
			);
		}
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {}) => {
		if (Platform.OS === 'ios') {
			const processedText = bytesToString(data, 'hex');
			callNativeWithOptions(RNBLEPrinter.printHex, onError, processedText, {
				beep: true,
				cut: true,
			});
		} else {
			callNativeWithError(RNBLEPrinter.printRawData, onError, bytesToString(data, 'base64'));
		}
	},

	printImage: async (imagePath: string) => {
		const tmp = await imageToBuffer(imagePath);
		callNativeWithError(RNBLEPrinter.printRawData, (error: Error) => console.warn(error), tmp);
	},
};

export const NetPrinter = {
	init: (): Promise<void> => callNativeMethod(RNNetPrinter.init),

	getDeviceList: (): Promise<INetPrinter[]> =>
		callNativeMethod<INetPrinter[]>(RNNetPrinter.getDeviceList),

	connectPrinter: (host: string, port: number): Promise<INetPrinter> =>
		callNativeMethod<INetPrinter>(RNNetPrinter.connectPrinter, host, port),

	closeConn: (): Promise<void> => callNativeVoid(RNNetPrinter.closeConn),

	printText: (text: string, opts = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			callNativeWithOptions(
				RNNetPrinter.printRawData,
				(error: Error) => console.warn(error),
				processedText.text,
				processedText.opts
			);
		} else {
			callNativeWithError(
				RNNetPrinter.printRawData,
				(error: Error) => console.warn(error),
				textTo64Buffer(text, opts)
			);
		}
	},

	printBill: (text: string, opts = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			callNativeWithOptions(
				RNNetPrinter.printRawData,
				(error: Error) => console.warn(error),
				processedText.text,
				processedText.opts
			);
		} else {
			callNativeWithError(
				RNNetPrinter.printRawData,
				(error: Error) => console.warn(error),
				billTo64Buffer(text, opts)
			);
		}
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {}) => {
		if (Platform.OS === 'ios') {
			const processedText = bytesToString(data, 'hex');
			if (RNNetPrinter.printHex) {
				callNativeWithOptions(RNNetPrinter.printHex, onError, processedText, {
					beep: true,
					cut: true,
				});
			} else {
				// Fallback to printRawData when printHex is not available on Turbo module
				callNativeWithOptions(RNNetPrinter.printRawData, onError, bytesToString(data, 'base64'), {
					beep: true,
					cut: true,
				});
			}
		} else {
			callNativeWithError(RNNetPrinter.printRawData, onError, bytesToString(data, 'base64'));
		}
	},

	printImage: async (imagePath: string) => {
		const tmp = await imageToBuffer(imagePath);
		callNativeWithError(RNNetPrinter.printRawData, (error: Error) => console.warn(error), tmp);
	},
};

export const NetPrinterEventEmitter = new NativeEventEmitter(RNNetPrinter);

export enum RN_THERMAL_RECEIPT_PRINTER_EVENTS {
	EVENT_NET_PRINTER_SCANNED_SUCCESS = 'scannerResolved',
	EVENT_NET_PRINTER_SCANNING = 'scannerRunning',
	EVENT_NET_PRINTER_SCANNED_ERROR = 'registerError',
}
