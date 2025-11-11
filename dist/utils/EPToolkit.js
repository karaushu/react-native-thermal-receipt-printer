var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Buffer } from 'buffer';
import * as iconv from 'iconv-lite';
import * as _Jimp from 'jimp';
//@ts-ignore
var Jimp = typeof self !== 'undefined' ? self.Jimp || _Jimp : _Jimp; // The hack
import BufferHelper from './buffer-helper';
var init_printer_bytes = Buffer.from([27, 64]);
var l_start_bytes = Buffer.from([27, 97, 0]);
var l_end_bytes = Buffer.from([]);
var c_start_bytes = Buffer.from([27, 97, 1]);
var c_end_bytes = Buffer.from([]); // [ 27, 97, 0 ];
var r_start_bytes = Buffer.from([27, 97, 2]);
var r_end_bytes = Buffer.from([]);
var default_space_bytes = Buffer.from([27, 50]);
var reset_bytes = Buffer.from([27, 97, 0, 29, 33, 0, 27, 50]);
var m_start_bytes = Buffer.from([27, 33, 16, 28, 33, 8]);
var m_end_bytes = Buffer.from([27, 33, 0, 28, 33, 0]);
var b_start_bytes = Buffer.from([27, 33, 48, 28, 33, 12]);
var b_end_bytes = Buffer.from([27, 33, 0, 28, 33, 0]);
var cm_start_bytes = Buffer.from([27, 97, 1, 27, 33, 16, 28, 33, 8]);
var cm_end_bytes = Buffer.from([27, 33, 0, 28, 33, 0]);
var cb_start_bytes = Buffer.from([27, 97, 1, 27, 33, 48, 28, 33, 12]);
var cb_end_bytes = Buffer.from([27, 33, 0, 28, 33, 0]);
var cd_start_bytes = Buffer.from([27, 97, 1, 27, 33, 32, 28, 33, 4]);
var cd_end_bytes = Buffer.from([27, 33, 0, 28, 33, 0]);
var d_start_bytes = Buffer.from([27, 33, 32, 28, 33, 4]);
var d_end_bytes = Buffer.from([27, 33, 0, 28, 33, 0]);
var cut_bytes = Buffer.from([27, 105]);
var beep_bytes = Buffer.from([27, 66, 3, 2]);
var line_bytes = Buffer.from([10, 10, 10, 10, 10]);
var encoding_mappings_bytes = {
    // single byte encodings
    CP437: Buffer.from([27, 116, 0]),
    // multiple bit encodings
    GB18030: Buffer.from([28, 38, 28, 67, 0]),
    BIG5: Buffer.from([28, 38, 28, 67, 1]),
    UTF8: Buffer.from([28, 38, 28, 67, 255]),
};
var options_controller = {
    cut: cut_bytes,
    beep: beep_bytes,
    tailingLine: line_bytes,
    encoding: encoding_mappings_bytes,
};
var controller = {
    '<M>': m_start_bytes,
    '</M>': m_end_bytes,
    '<B>': b_start_bytes,
    '</B>': b_end_bytes,
    '<D>': d_start_bytes,
    '</D>': d_end_bytes,
    '<C>': c_start_bytes,
    '</C>': c_end_bytes,
    '<CM>': cm_start_bytes,
    '</CM>': cm_end_bytes,
    '<CD>': cd_start_bytes,
    '</CD>': cd_end_bytes,
    '<CB>': cb_start_bytes,
    '</CB>': cb_end_bytes,
    '<L>': l_start_bytes,
    '</L>': l_end_bytes,
    '<R>': r_start_bytes,
    '</R>': r_end_bytes,
};
var default_options = {
    beep: false,
    cut: true,
    tailingLine: true,
    encoding: 'UTF8',
};
export function exchange_text(text, options) {
    var m_options = options || default_options;
    var bytes = new BufferHelper();
    bytes.concat(init_printer_bytes);
    // set encoding
    if (m_options['encoding'] &&
        options_controller['encoding'][m_options['encoding']]) {
        bytes.concat(options_controller['encoding'][m_options['encoding']]);
    }
    bytes.concat(default_space_bytes);
    var temp = '';
    for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        switch (ch) {
            case '<':
                bytes.concat(iconv.encode(temp, m_options.encoding));
                temp = '';
                // add bytes for changing font and justifying text
                for (var tag in controller) {
                    if (text.substring(i, i + tag.length) === tag) {
                        bytes.concat(controller[tag]);
                        i += tag.length - 1;
                    }
                }
                break;
            case '\n':
                temp = "".concat(temp).concat(ch);
                bytes.concat(iconv.encode(temp, m_options.encoding));
                bytes.concat(reset_bytes);
                temp = '';
                break;
            default:
                temp = "".concat(temp).concat(ch);
                break;
        }
    }
    temp.length && bytes.concat(iconv.encode(temp, m_options.encoding));
    // check for "tailingLine" flag
    if (typeof m_options['tailingLine'] === 'boolean' && options_controller['tailingLine']) {
        bytes.concat(options_controller['tailingLine']);
    }
    // check for "cut" flag
    if (typeof m_options['cut'] === 'boolean' && options_controller['cut']) {
        bytes.concat(options_controller['cut']);
    }
    // check for "beep" flag
    if (typeof m_options['beep'] === 'boolean' && options_controller['beep']) {
        bytes.concat(options_controller['beep']);
    }
    return bytes.toBuffer();
}
export function exchange_image(imagePath, threshold) {
    return __awaiter(this, void 0, void 0, function () {
        var bytes, raw_image, img, hex, nl, nh, data, line, i, header, j, k, dit, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bytes = new BufferHelper();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Jimp.read(imagePath)];
                case 2:
                    raw_image = _a.sent();
                    img = raw_image.resize(250, 250).quality(60).greyscale();
                    hex = void 0;
                    nl = img.bitmap.width % 256;
                    nh = Math.round(img.bitmap.width / 256);
                    data = Buffer.from([0, 0, 0]);
                    line = Buffer.from([10]);
                    for (i = 0; i < Math.round(img.bitmap.height / 24) + 1; i++) {
                        header = Buffer.from([27, 42, 33, nl, nh]);
                        bytes.concat(header);
                        for (j = 0; j < img.bitmap.width; j++) {
                            data[0] = data[1] = data[2] = 0; // Clear to Zero.
                            for (k = 0; k < 24; k++) {
                                if (i * 24 + k < img.bitmap.height) {
                                    // if within the BMP size
                                    hex = img.getPixelColor(j, i * 24 + k);
                                    if (Jimp.intToRGBA(hex).r <= threshold) {
                                        data[Math.round(k / 8)] += 128 >> k % 8;
                                    }
                                }
                            }
                            dit = Buffer.from([data[0], data[1], data[2]]);
                            bytes.concat(dit);
                        }
                        bytes.concat(line);
                    } // data
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, bytes.toBuffer()];
            }
        });
    });
}
