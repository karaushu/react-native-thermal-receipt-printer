var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import RNUSBPrinterTurbo from '../NativeRNUSBPrinter';
export var isTurbo = RNUSBPrinterTurbo != null;
// Helper functions to abstract Turbo vs non-Turbo module differences
export var callNativeMethod = function (method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (isTurbo) {
        return method.apply(void 0, args);
    }
    return new Promise(function (resolve, reject) {
        method.apply(void 0, __spreadArray(__spreadArray([], args, false), [resolve, reject], false));
    });
};
export var callNativeVoid = function (method) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (isTurbo) {
        return method.apply(void 0, args);
    }
    return new Promise(function (resolve) {
        method.apply(void 0, args);
        resolve();
    });
};
export var callNativeWithError = function (method, onError) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (isTurbo) {
        method.apply(void 0, args).catch(onError);
    }
    else {
        method.apply(void 0, __spreadArray(__spreadArray([], args, false), [onError], false));
    }
};
export var callNativeWithOptions = function (method, onError, data, options) {
    var extraArgs = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        extraArgs[_i - 4] = arguments[_i];
    }
    if (isTurbo) {
        method.apply(void 0, __spreadArray([data, options], extraArgs, false)).catch(onError);
    }
    else {
        method.apply(void 0, __spreadArray(__spreadArray([data, options], extraArgs, false), [onError], false));
    }
};
