var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./themeProvider"], function (require, exports, themeProvider_1) {
    "use strict";
    var ViewTypeProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewType = exports.ViewTypeProvider = void 0;
    var ViewType;
    (function (ViewType) {
        ViewType[ViewType["Default"] = 0] = "Default";
        ViewType[ViewType["Common"] = 1] = "Common";
        ViewType[ViewType["Analysis"] = 2] = "Analysis";
        ViewType[ViewType["Configuration"] = 3] = "Configuration";
        ViewType[ViewType["Overview"] = 4] = "Overview";
        ViewType[ViewType["User"] = 5] = "User";
        ViewType[ViewType["SideBarTab"] = 6] = "SideBarTab";
        ViewType[ViewType["DriveLog"] = 7] = "DriveLog";
    })(ViewType || (ViewType = {}));
    exports.ViewType = ViewType;
    /**
     *
     *
     * @class ViewTypeProvider
     */
    let ViewTypeProvider = ViewTypeProvider_1 = class ViewTypeProvider {
        constructor() {
            this._iconPathList = {};
            /**
             * Maps viewType to its icon Css Class name
             *
             * @private
             * @type {Map<ViewType, string>}
             * @memberof ViewTypeProvider
             */
            this._viewTypeIconClassMap = new Map([
                [ViewType.Default, ""],
                [ViewType.Common, "iconComponentView"],
                [ViewType.Analysis, "iconTraceView"],
                [ViewType.Configuration, "iconTraceConfigurationView"],
                [ViewType.Overview, "iconOverviewPage"],
                [ViewType.User, "iconUser"],
                [ViewType.SideBarTab, ""],
                [ViewType.DriveLog, "iconLoggerView"]
            ]);
        }
        static getInstance() {
            if (!ViewTypeProvider_1.instance) {
                ViewTypeProvider_1.instance = new ViewTypeProvider_1();
                // ... any one time initialization goes here ...
                this.instance.initIconPathList();
            }
            return ViewTypeProvider_1.instance;
        }
        /**
         * Returns the componentType for the given viewType
         *
         * @param {ViewType} viewType
         * @returns {string}
         * @memberof ViewTypeProvider
         */
        getComponentTypeForViewType(viewType) {
            if (viewType == ViewType.Analysis) {
                return "TraceViewWidget";
            }
            else if (viewType == ViewType.Configuration) {
                return "TraceConfigurationViewWidget";
            }
            else if (viewType == ViewType.Common) {
                return "ComponentViewWidget";
            }
            else if (viewType == ViewType.DriveLog) {
                return "LoggerWidget";
            }
            return "";
        }
        /**
         * Returns the default component id for the given view type
         *
         * @param {ViewType} viewType
         * @returns {string}
         * @memberof ViewTypeProvider
         */
        getDefaultComponentIdForViewType(viewType) {
            // Currently the default component id is the same as the view type
            return this.getComponentTypeForViewType(viewType);
        }
        getIconByViewType(viewType) {
            return this._iconPathList[viewType];
        }
        initIconPathList() {
            let themeProvider = themeProvider_1.ThemeProvider.getInstance();
            this._iconPathList[ViewType.Common.toString()] = themeProvider.getThemedFilePath("widgets/common/style/images/IconComponentView.svg");
            this._iconPathList[ViewType.Analysis.toString()] = themeProvider.getThemedFilePath("widgets/common/style/images/IconTraceView.svg");
            this._iconPathList[ViewType.Configuration.toString()] = themeProvider.getThemedFilePath("widgets/common/style/images/IconTraceConfigurationView.svg");
            this._iconPathList[ViewType.Overview.toString()] = themeProvider.getThemedFilePath("widgets/common/style/images/IconOverviewPage.svg");
            this._iconPathList[ViewType.User.toString()] = themeProvider.getThemedFilePath("widgets/common/style/images/IconUser.svg");
            this._iconPathList[ViewType.DriveLog.toString()] = themeProvider.getThemedFilePath("widgets/common/style/images/IconLoggerView.svg");
        }
        /**
         * Return css Class name by passed viewType.
         * When no css Class is found for the passed viewType, an empty string gets returned.
         *
         * @param {ViewType} viewType
         * @return {*}  {string}
         * @memberof ViewTypeProvider
         */
        getIconClassByViewType(viewType, isActive = false) {
            let cssClass = this._viewTypeIconClassMap.get(viewType);
            if (cssClass === undefined) {
                return "";
            }
            if (isActive === true) {
                cssClass += "-orange";
            }
            return cssClass;
        }
    };
    ViewTypeProvider = ViewTypeProvider_1 = __decorate([
        mco.role()
    ], ViewTypeProvider);
    exports.ViewTypeProvider = ViewTypeProvider;
});
