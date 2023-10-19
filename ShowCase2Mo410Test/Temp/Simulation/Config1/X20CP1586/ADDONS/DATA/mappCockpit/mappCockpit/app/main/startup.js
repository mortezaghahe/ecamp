var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.load = void 0;
    /**
     * Loads application modules and starts the application
     *
     * @export
     * @param {(undefined|string)} [mode=undefined]
     * @returns {Promise<void>}
     */
    function load(mode = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            // load and activate instrumentation
            const globalDecorators = yield new Promise((resolve_1, reject_1) => { require(["../framework/aspects/decorators/globalDecorators"], resolve_1, reject_1); });
            globalDecorators.install();
            // load mapp Cockpit app
            const mappCockpit = yield new Promise((resolve_2, reject_2) => { require(["../main/mappCockpitApp"], resolve_2, reject_2); });
            // Instantiate and create mappCockpit
            let mappCockpitApp = new mappCockpit.MappCockpitApp();
            mappCockpitApp.mode = mode;
            mappCockpitApp.create();
        });
    }
    exports.load = load;
});
