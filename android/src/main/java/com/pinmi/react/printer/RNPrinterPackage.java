package com.pinmi.react.printer;

import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by xiesubin on 2017/9/21.
 */

public class RNPrinterPackage extends TurboReactPackage {
    @Override
    public @Nullable NativeModule getModule(String name, ReactApplicationContext context) {
        switch (name) {
            case "RNUSBPrinter":
                return new RNUSBPrinterModule(context);
            case "RNBLEPrinter":
                return new RNBLEPrinterModule(context);
            case "RNNetPrinter":
                return new RNNetPrinterModule(context);
            default:
                return null;
        }
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> map = new HashMap<>();
            map.put("RNUSBPrinter", new ReactModuleInfo(
                    "RNUSBPrinter",
                    RNUSBPrinterModule.class.getName(),
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    false, // hasConstants
                    false, // isCxxModule
                    false   // isTurboModule (set to true after modules are upgraded)
            ));
            map.put("RNBLEPrinter", new ReactModuleInfo(
                    "RNBLEPrinter",
                    RNBLEPrinterModule.class.getName(),
                    false,
                    false,
                    false,
                    false,
                    false
            ));
            map.put("RNNetPrinter", new ReactModuleInfo(
                    "RNNetPrinter",
                    RNNetPrinterModule.class.getName(),
                    false,
                    false,
                    false,
                    false,
                    false
            ));
            return map;
        };
    }
}
