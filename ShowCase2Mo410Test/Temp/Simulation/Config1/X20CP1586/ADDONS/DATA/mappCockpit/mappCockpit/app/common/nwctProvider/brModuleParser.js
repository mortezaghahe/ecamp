var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../libs/dataparsing/kaitai-struct/KaitaiStream", "../../libs/dataparsing/BrModSDM"], function (require, exports, KaitaiStream, BrModSDM) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrModuleParser = void 0;
    /**
     * Parser for br module SMD file types
     *
     * @export
     * @class BrModuleParser
     */
    let BrModuleParser = class BrModuleParser {
        /**
         * Creates an instance of BrModuleParser.
         * The received bin data get parsed and saved in readonly parameters
         *
         * @param {ArrayBuffer} binData
         * @memberof BrModuleParser
         */
        constructor(binData) {
            this.isNCData = true;
            this.has6Sections = true;
            // create a KaitaiStream and pass the binary data
            let kaitaiStream = new KaitaiStream(binData);
            try {
                // parse the data
                let tmp = new BrModSDM(kaitaiStream);
                // set the parsed data
                this.mTrcBinDat01 = tmp.mTrcBinDat01;
                this.mappMotionArConfig = this.trimStrEnd(tmp.mappMotionArConfig);
                this.acoposParIDs = this.trimStrEnd(tmp.acoposParIDs);
                this.acoposErrInfTypes = this.trimStrEnd(tmp.acoposErrInfTypes);
            }
            catch (e) {
                // Is not the ID of NC-Data Module
                if (e.expected[0] === 70) {
                    this.isNCData = false;
                    console.log("Error in BrModuleParser: Loaded binary data is no NC Data! " + e.message);
                }
                // Does not have the expected 6 sections
                if (e.expected[0] === 6) {
                    this.has6Sections = false;
                    console.log("Error in BrModuleParser: Loaded binary data has not 6 sections! " + e.message);
                }
                // Set data empty
                this.mTrcBinDat01 = new ArrayBuffer(0);
                this.mappMotionArConfig = "";
                this.acoposParIDs = "";
                this.acoposErrInfTypes = "";
            }
        }
        /**
         * Removes the string behind the last "}"
         *
         * @private
         * @param {string} data
         * @return {*}  {string}
         * @memberof BrModuleParser
         */
        trimStrEnd(data) {
            let endIndex = data.lastIndexOf("}");
            return data.substr(0, endIndex + 1);
        }
    };
    BrModuleParser = __decorate([
        mco.role()
    ], BrModuleParser);
    exports.BrModuleParser = BrModuleParser;
});
