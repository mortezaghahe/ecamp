var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/fileProvider"], function (require, exports, fileProvider_1) {
    "use strict";
    var ThemeProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ThemeProvider = void 0;
    let ThemeProvider = ThemeProvider_1 = class ThemeProvider {
        constructor() {
            this._currentThemeId = "";
            this._currentThemeId = ThemeProvider_1.getCurrentThemeId();
        }
        /**
         * gets a singleton instance of ThemeProvider
         *
         * @readonly
         * @type {ThemeProvider}
         * @memberof ThemeProvider
         */
        static getInstance() {
            this._instance = this._instance ? this._instance : new ThemeProvider_1();
            return this._instance;
        }
        /**
         * Returns the theme id if defined in the address bar (e.g.: ?theme="myTheme") else ""
         *
         * @private
         * @returns {string}
         * @memberof WidgetBase
         */
        static getCurrentThemeId() {
            var initCommands = window.location.search.substring(1);
            let themeIdIndex = initCommands.indexOf("theme=%22");
            if (themeIdIndex > -1) {
                let themeIdStartIndex = themeIdIndex + 9;
                let themeIdEndIndex = initCommands.indexOf("%22", themeIdStartIndex);
                let themeId = initCommands.substr(themeIdStartIndex, themeIdEndIndex - themeIdStartIndex);
                return themeId;
            }
            return "";
        }
        /**
         * Returns the filepath for the given theme if file is available in this theme, else the input file path will be returned
         *
         * @static
         * @param {string} filePath
         * @param {string} themeId
         * @returns {string}
         * @memberof ThemeProvider
         */
        getThemedFilePath(filePath) {
            if (this._currentThemeId != "") {
                let themeFolder = "themes/" + this._currentThemeId + "/";
                let themeFilePath = filePath.replace("widgets/", themeFolder);
                if (fileProvider_1.FileProvider.doesFileExistOnServer(themeFilePath)) {
                    filePath = themeFilePath;
                }
            }
            return filePath;
        }
    };
    ThemeProvider = ThemeProvider_1 = __decorate([
        mco.role()
    ], ThemeProvider);
    exports.ThemeProvider = ThemeProvider;
});
