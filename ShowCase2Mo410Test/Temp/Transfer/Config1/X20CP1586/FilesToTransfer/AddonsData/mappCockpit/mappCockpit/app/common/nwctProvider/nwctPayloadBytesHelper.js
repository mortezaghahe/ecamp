var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../libs/dataparsing/primitiveTypes/I1Type", "../../libs/dataparsing/primitiveTypes/I2Type", "../../libs/dataparsing/primitiveTypes/I4Type", "../../libs/dataparsing/primitiveTypes/UI1Type", "../../libs/dataparsing/primitiveTypes/UI2Type", "../../libs/dataparsing/primitiveTypes/UI4Type", "../../libs/dataparsing/primitiveTypes/R4Type", "../../libs/dataparsing/primitiveTypes/R8Type", "../../libs/dataparsing/primitiveTypes/BP16Type", "../../libs/dataparsing/primitiveTypes/BP32Type", "../../libs/dataparsing/primitiveTypes/BYTES6Type", "../../libs/dataparsing/primitiveTypes/T5Time", "../../libs/dataparsing/primitiveTypes/STR6Type", "../../libs/dataparsing/kaitai-struct/KaitaiStream"], function (require, exports, I1Type, I2Type, I4Type, UI1Type, UI2Type, UI4Type, R4Type, R8Type, BP16Type, BP32Type, BYTES6Type, T5Time, STR6Type, KaitaiStream) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctPayloadBytesHelper = void 0;
    let NwctPayloadBytesHelper = class NwctPayloadBytesHelper {
        /**
         * Takes the Payload Bytes as Uint8Array and the type information and parse it with the help of the Kaitai parser
         *
         * @static
         * @param {Uint8Array} bytes
         * @param {string} type
         * @return {*}  {(number|Array<number>|string|undefined)}
         * @memberof NwctPayloadBytesHelper
         *
         * Review Lukas Obersamer:
         * The cyclomatic complexity of this function is too high, but that does not reflct the complexity for humans to understand it.
         * The complexity of understing this method is in fact super simple. Therefore the method may remain in this form.
         * Future implementations should avoid using the switch case and use a map, a strategy pattern or a similar approach instead.
         */
        static getKaitaiParsedTypes(bytes, type) {
            // create a KaitaiStream and pass the binary data
            let kaitaiStream = new KaitaiStream(bytes);
            switch (type) {
                case "I1": return new I1Type(kaitaiStream).i1Type;
                case "I2": return new I2Type(kaitaiStream).i2Type;
                case "I4": return new I4Type(kaitaiStream).i4Type;
                case "BOOL":
                case "X1":
                case "UI1": return new UI1Type(kaitaiStream).ui1Type;
                case "X2":
                case "PARID":
                case "UI2": return new UI2Type(kaitaiStream).ui2Type;
                case "BRMOD":
                case "DATA":
                case "X4":
                case "UI4": return new UI4Type(kaitaiStream).ui4Type;
                case "STR6": return new STR6Type(kaitaiStream).str6Type;
                case "R4": return new R4Type(kaitaiStream).r4Type;
                case "R8": return new R8Type(kaitaiStream).r8Type;
                case "BP8": return [new UI1Type(kaitaiStream).ui1Type];
                case "BP16": return new BP16Type(kaitaiStream).bp16;
                case "BP32": return new BP32Type(kaitaiStream).bp32;
                case "BYTES6": return new BYTES6Type(kaitaiStream).bytes6;
                case "T5":
                    let tmp = new T5Time(kaitaiStream);
                    return [tmp.hour, tmp.min, tmp.sec, tmp.hundredSec, tmp.day, tmp.month, tmp.year];
                default:
                    if (type.startsWith("BYTES") || type.startsWith("STR")) {
                        return new UI4Type(kaitaiStream).ui4Type;
                    }
                    return undefined;
            }
        }
        /**
         * Returns a number for the given ByteArray for the given byteCount
         *
         * @static
         * @param {Uint8Array} bytes
         * @param {number} [byteCount=1]
         * @returns {number}
         * @memberof NwctPayloadBytesHelper
         */
        static getNumber(bytes, byteCount = 1) {
            if (byteCount == 4) {
                return ((bytes[0] | bytes[1] << 8) | bytes[2] << 16) | bytes[3] << 24;
            }
            if (byteCount == 2) {
                return bytes[0] | bytes[1] << 8;
            }
            return bytes[0];
        }
        /**
         * Returns a number for the given ByteArray for the given BitPattern type
         *
         * @static
         * @param {Uint8Array} payloadBytes
         * @param {string} type
         * @returns {number}
         * @memberof NwctPayloadBytesHelper
         */
        static getBPnumber(payloadBytes, type) {
            if (type == "BP8") {
                return payloadBytes[0];
            }
            else if (type == "BP16") {
                return this.getNumber(payloadBytes.slice(0, 2), 2);
            }
            else if (type == "BP32") {
                return this.getNumber(payloadBytes.slice(0, 4), 4);
            }
            return 0;
        }
    };
    NwctPayloadBytesHelper = __decorate([
        mco.role()
    ], NwctPayloadBytesHelper);
    exports.NwctPayloadBytesHelper = NwctPayloadBytesHelper;
});
