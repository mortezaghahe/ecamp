var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/treeGridToolbarBase", "../../../common/directoryProvider"], function (require, exports, treeGridToolbarBase_1, directoryProvider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceConfigTimingTreeGridToolbar = void 0;
    let TraceConfigTimingTreeGridToolbar = class TraceConfigTimingTreeGridToolbar extends treeGridToolbarBase_1.TreeGridToolbarBase {
        /**
         * Creates an instance of TraceConfigTimingTreeGridToolbar.
         * @param {HTMLDivElement} widgetMainDiv
         * @memberof TraceConfigTimingTreeGridToolbar
         */
        constructor(widgetMainDiv) {
            super(widgetMainDiv);
            this.toolbarIdEmpty = "Empty";
            this.toolbarToolTipEmpty = " ";
            let imageDirectory = "../../../" + directoryProvider_1.DirectoryProvider.getWidgetsDirectory() + "traceConfigTimingWidget/style/images/toolbar/";
            // dummy toolbar button needed to show a toolbar
            this.addToolbarButton(this.toolbarIdEmpty, this.toolbarToolTipEmpty, imageDirectory + "empty.svg");
        }
        /**
         * Sets the default toolbar states at startup
         *
         * @memberof TraceConfigTimingTreeGridToolbar
         */
        initToolbarStates() {
            super.initToolbarStates();
            // disable dummy button after creation
            this.disableDummyButton();
        }
        disableDummyButton() {
            this.disableButton(this.toolbarIdEmpty, true);
        }
    };
    TraceConfigTimingTreeGridToolbar = __decorate([
        mco.role()
    ], TraceConfigTimingTreeGridToolbar);
    exports.TraceConfigTimingTreeGridToolbar = TraceConfigTimingTreeGridToolbar;
});
