import RNUSBPrinterTurbo from '../NativeRNUSBPrinter';

export const isTurbo = RNUSBPrinterTurbo != null;

// Helper functions to abstract Turbo vs non-Turbo module differences
export const callNativeMethod = <T>(
	method: (...args: any[]) => Promise<T> | void,
	...args: any[]
): Promise<T> => {
	if (isTurbo) {
		return method(...args) as Promise<T>;
	}
	return new Promise((resolve, reject) => {
		method(...args, resolve, reject);
	});
};

export const callNativeVoid = (
	method: (...args: any[]) => Promise<void> | void,
	...args: any[]
): Promise<void> => {
	if (isTurbo) {
		return method(...args) as Promise<void>;
	}
	return new Promise((resolve) => {
		method(...args);
		resolve();
	});
};

export const callNativeWithError = (
	method: (...args: any[]) => Promise<void> | void,
	onError: (error: Error) => void,
	...args: any[]
): void => {
	if (isTurbo) {
		(method(...args) as Promise<void>).catch(onError);
	} else {
		method(...args, onError);
	}
};

export const callNativeWithOptions = (
	method: (...args: any[]) => Promise<void> | void,
	onError: (error: Error) => void,
	data: string,
	options: any,
	...extraArgs: any[]
): void => {
	if (isTurbo) {
		(method(data, options, ...extraArgs) as Promise<void>).catch(onError);
	} else {
		method(data, options, ...extraArgs, onError);
	}
};
