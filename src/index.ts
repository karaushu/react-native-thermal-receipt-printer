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
	init: (): Promise<void> =>
		isTurbo
			? RNUSBPrinter.init()
			: new Promise((resolve, reject) =>
					RNUSBPrinter.init(
						() => resolve(),
						(error: Error) => reject(error)
					)
			  ),

	getDeviceList: (): Promise<IUSBPrinter[]> =>
		isTurbo
			? RNUSBPrinter.getDeviceList()
			: new Promise((resolve, reject) =>
					RNUSBPrinter.getDeviceList(
						(printers: IUSBPrinter[]) => resolve(printers),
						(error: Error) => reject(error)
					)
			  ),

	connectPrinter: (vendorId: string, productId: string): Promise<IUSBPrinter> =>
		isTurbo
			? RNUSBPrinter.connectPrinter(vendorId, productId)
			: new Promise((resolve, reject) =>
					RNUSBPrinter.connectPrinter(
						vendorId,
						productId,
						(printer: IUSBPrinter) => resolve(printer),
						(error: Error) => reject(error)
					)
			  ),

	closeConn: (): Promise<void> =>
		isTurbo
			? RNUSBPrinter.closeConn()
			: new Promise((resolve) => {
					RNUSBPrinter.closeConn();
					resolve();
			  }),

	printText: (text: string, opts: PrinterOptions = {}): void => {
		if (isTurbo) {
			RNUSBPrinter.printRawData(textTo64Buffer(text, opts)).catch((error: Error) =>
				console.warn(error)
			);
		} else {
			RNUSBPrinter.printRawData(textTo64Buffer(text, opts), (error: Error) => console.warn(error));
		}
	},

	printBill: (text: string, opts: PrinterOptions = {}): void => {
		if (isTurbo) {
			RNUSBPrinter.printRawData(billTo64Buffer(text, opts)).catch((error: Error) =>
				console.warn(error)
			);
		} else {
			RNUSBPrinter.printRawData(billTo64Buffer(text, opts), (error: Error) => console.warn(error));
		}
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {}) => {
		if (isTurbo) {
			RNUSBPrinter.printRawData(bytesToString(data, 'base64')).catch((error: Error) => {
				if (onError) {
					onError(error);
				}
			});
		} else {
			RNUSBPrinter.printRawData(bytesToString(data, 'base64'), (error: Error) => {
				if (onError) {
					onError(error);
				}
			});
		}
	},

	printImage: async (imagePath: string) => {
		const tmp = await imageToBuffer(imagePath);
		if (isTurbo) {
			RNUSBPrinter.printRawData(tmp).catch((error: Error) => console.warn(error));
		} else {
			RNUSBPrinter.printRawData(tmp, (error: Error) => console.warn(error));
		}
	},
};

export const BLEPrinter = {
	init: (): Promise<void> =>
		isTurbo
			? RNBLEPrinter.init()
			: new Promise((resolve, reject) =>
					RNBLEPrinter.init(
						() => resolve(),
						(error: Error) => reject(error)
					)
			  ),

	getDeviceList: (): Promise<IBLEPrinter[]> =>
		isTurbo
			? RNBLEPrinter.getDeviceList()
			: new Promise((resolve, reject) =>
					RNBLEPrinter.getDeviceList(
						(printers: IBLEPrinter[]) => resolve(printers),
						(error: Error) => reject(error)
					)
			  ),

	connectPrinter: (inner_mac_address: string): Promise<IBLEPrinter> =>
		isTurbo
			? RNBLEPrinter.connectPrinter(inner_mac_address)
			: new Promise((resolve, reject) =>
					RNBLEPrinter.connectPrinter(
						inner_mac_address,
						(printer: IBLEPrinter) => resolve(printer),
						(error: Error) => reject(error)
					)
			  ),

	closeConn: (): Promise<void> =>
		isTurbo
			? RNBLEPrinter.closeConn()
			: new Promise((resolve) => {
					RNBLEPrinter.closeConn();
					resolve();
			  }),

	printText: (text: string, opts: PrinterOptions = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			if (isTurbo) {
				RNBLEPrinter.printRawData(processedText.text, processedText.opts).catch((error: Error) =>
					console.warn(error)
				);
			} else {
				RNBLEPrinter.printRawData(processedText.text, processedText.opts, (error: Error) =>
					console.warn(error)
				);
			}
		} else {
			if (isTurbo) {
				RNBLEPrinter.printRawData(textTo64Buffer(text, opts)).catch((error: Error) =>
					console.warn(error)
				);
			} else {
				RNBLEPrinter.printRawData(textTo64Buffer(text, opts), (error: Error) =>
					console.warn(error)
				);
			}
		}
	},

	printBill: (text: string, opts: PrinterOptions = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			if (isTurbo) {
				RNBLEPrinter.printRawData(processedText.text, processedText.opts).catch((error: Error) =>
					console.warn(error)
				);
			} else {
				RNBLEPrinter.printRawData(processedText.text, processedText.opts, (error: Error) =>
					console.warn(error)
				);
			}
		} else {
			if (isTurbo) {
				RNBLEPrinter.printRawData(billTo64Buffer(text, opts)).catch((error: Error) =>
					console.warn(error)
				);
			} else {
				RNBLEPrinter.printRawData(billTo64Buffer(text, opts), (error: Error) =>
					console.warn(error)
				);
			}
		}
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {}) => {
		if (Platform.OS === 'ios') {
			const processedText = bytesToString(data, 'hex');
			if (isTurbo) {
				RNBLEPrinter.printHex(processedText, { beep: true, cut: true }).catch((error: Error) => {
					if (onError) {
						onError(error);
					}
				});
			} else {
				RNBLEPrinter.printHex(processedText, { beep: true, cut: true }, (error: Error) => {
					if (onError) {
						onError(error);
					}
				});
			}
		} else {
			if (isTurbo) {
				RNBLEPrinter.printRawData(bytesToString(data, 'base64')).catch((error: Error) => {
					if (onError) {
						onError(error);
					}
				});
			} else {
				RNBLEPrinter.printRawData(bytesToString(data, 'base64'), (error: Error) => {
					if (onError) {
						onError(error);
					}
				});
			}
		}
	},

	printImage: async (imagePath: string) => {
		const tmp = await imageToBuffer(imagePath);
		if (isTurbo) {
			RNBLEPrinter.printRawData(tmp).catch((error: Error) => console.warn(error));
		} else {
			RNBLEPrinter.printRawData(tmp, (error: Error) => console.warn(error));
		}
	},
};

export const NetPrinter = {
	init: (): Promise<void> =>
		isTurbo
			? RNNetPrinter.init()
			: new Promise((resolve, reject) =>
					RNNetPrinter.init(
						() => resolve(),
						(error: Error) => reject(error)
					)
			  ),

	getDeviceList: (): Promise<INetPrinter[]> =>
		isTurbo
			? RNNetPrinter.getDeviceList()
			: new Promise((resolve, reject) =>
					RNNetPrinter.getDeviceList(
						(printers: INetPrinter[]) => resolve(printers),
						(error: Error) => reject(error)
					)
			  ),

	connectPrinter: (host: string, port: number): Promise<INetPrinter> =>
		isTurbo
			? RNNetPrinter.connectPrinter(host, port)
			: new Promise((resolve, reject) =>
					RNNetPrinter.connectPrinter(
						host,
						port,
						(printer: INetPrinter) => resolve(printer),
						(error: Error) => reject(error)
					)
			  ),

	closeConn: (): Promise<void> =>
		isTurbo
			? RNNetPrinter.closeConn()
			: new Promise((resolve) => {
					RNNetPrinter.closeConn();
					resolve();
			  }),

	printText: (text: string, opts = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			if (isTurbo) {
				RNNetPrinter.printRawData(processedText.text, processedText.opts).catch((error: Error) =>
					console.warn(error)
				);
			} else {
				RNNetPrinter.printRawData(processedText.text, processedText.opts, (error: Error) =>
					console.warn(error)
				);
			}
		} else {
			if (isTurbo) {
				RNNetPrinter.printRawData(textTo64Buffer(text, opts)).catch((error: Error) =>
					console.warn(error)
				);
			} else {
				RNNetPrinter.printRawData(textTo64Buffer(text, opts), (error: Error) =>
					console.warn(error)
				);
			}
		}
	},

	printBill: (text: string, opts = {}): void => {
		if (Platform.OS === 'ios') {
			const processedText = textPreprocessingIOS(text);
			if (isTurbo) {
				RNNetPrinter.printRawData(processedText.text, processedText.opts).catch((error: Error) =>
					console.warn(error)
				);
			} else {
				RNNetPrinter.printRawData(processedText.text, processedText.opts, (error: Error) =>
					console.warn(error)
				);
			}
		} else {
			if (isTurbo) {
				RNNetPrinter.printRawData(billTo64Buffer(text, opts)).catch((error: Error) =>
					console.warn(error)
				);
			} else {
				RNNetPrinter.printRawData(billTo64Buffer(text, opts), (error: Error) =>
					console.warn(error)
				);
			}
		}
	},

	printRawData: (data: Uint8Array, onError: (error: Error) => void = () => {}) => {
		if (Platform.OS === 'ios') {
			const processedText = bytesToString(data, 'hex');
			if (isTurbo && RNNetPrinter.printHex) {
				RNNetPrinter.printHex(processedText, { beep: true, cut: true }).catch((error: Error) => {
					if (onError) {
						onError(error);
					}
				});
			} else if (isTurbo) {
				// Fallback to printRawData when printHex is not available on Turbo module
				RNNetPrinter.printRawData(processedText, { beep: true, cut: true }).catch(
					(error: Error) => {
						if (onError) {
							onError(error);
						}
					}
				);
			} else {
				RNNetPrinter.printHex(processedText, { beep: true, cut: true }, (error: Error) => {
					if (onError) {
						onError(error);
					}
				});
			}
		} else {
			if (isTurbo) {
				RNNetPrinter.printRawData(bytesToString(data, 'base64')).catch((error: Error) => {
					if (onError) {
						onError(error);
					}
				});
			} else {
				RNNetPrinter.printRawData(bytesToString(data, 'base64'), (error: Error) => {
					if (onError) {
						onError(error);
					}
				});
			}
		}
	},

	printImage: async (imagePath: string) => {
		const tmp = await imageToBuffer(imagePath);
		if (isTurbo) {
			RNNetPrinter.printRawData(tmp).catch((error: Error) => console.warn(error));
		} else {
			RNNetPrinter.printRawData(tmp, (error: Error) => console.warn(error));
		}
	},
};

export const NetPrinterEventEmitter = new NativeEventEmitter(RNNetPrinter);

export enum RN_THERMAL_RECEIPT_PRINTER_EVENTS {
	EVENT_NET_PRINTER_SCANNED_SUCCESS = 'scannerResolved',
	EVENT_NET_PRINTER_SCANNING = 'scannerRunning',
	EVENT_NET_PRINTER_SCANNED_ERROR = 'registerError',
}
