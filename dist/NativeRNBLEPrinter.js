import { TurboModuleRegistry } from 'react-native';
var isTurboModuleEnabled = global.__turboModuleProxy != null;
export default isTurboModuleEnabled
    ? TurboModuleRegistry.getEnforcing('RNBLEPrinter')
    : null;
