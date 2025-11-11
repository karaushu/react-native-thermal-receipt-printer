export declare const isTurbo: boolean;
export declare const callNativeMethod: <T>(method: (...args: any[]) => void | Promise<T>, ...args: any[]) => Promise<T>;
export declare const callNativeVoid: (method: (...args: any[]) => Promise<void> | void, ...args: any[]) => Promise<void>;
export declare const callNativeWithError: (method: (...args: any[]) => Promise<void> | void, onError: (error: Error) => void, ...args: any[]) => void;
export declare const callNativeWithOptions: (method: (...args: any[]) => Promise<void> | void, onError: (error: Error) => void, data: string, options: any, ...extraArgs: any[]) => void;
