var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/persistence/settings"], function (require, exports, settings_1) {
    "use strict";
    var LayoutPane_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LayoutPane = void 0;
    let LayoutPane = LayoutPane_1 = class LayoutPane {
        constructor(name, size, widget, fillSpace = false, resizable = false, expandable = false, collapsible = false, minimumSize = 0) {
            this.name = "";
            this.name = name;
            this.size = size;
            this.expandable = expandable;
            this.collapsible = collapsible;
            this.fillSpace = fillSpace;
            this.resizable = resizable;
            this.minimumSize = minimumSize;
            this.widget = widget;
        }
        getSettings() {
            return LayoutPane_1.getFormatedSettings(this.size, this.expandable, this.collapsible, this.fillSpace, this.resizable, this.minimumSize);
        }
        static getFormatedSettings(size, expandable, collapsible, fillSpace, resizable, minimumSize) {
            let settings = new settings_1.Settings("LayoutPane");
            settings.setValue("size", size);
            settings.setValue("expandable", expandable);
            settings.setValue("collapsible", collapsible);
            settings.setValue("fillSpace", fillSpace);
            settings.setValue("resizable", resizable);
            settings.setValue("minimumSize", minimumSize);
            return settings;
        }
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings);
            this.size = settingsObj.getValue("size");
            this.expandable = settingsObj.getValue("expandable");
            this.collapsible = settingsObj.getValue("collapsible");
            this.fillSpace = settingsObj.getValue("fillSpace");
            this.resizable = settingsObj.getValue("resizable");
            this.minimumSize = settingsObj.getValue("minimumSize");
        }
    };
    LayoutPane = LayoutPane_1 = __decorate([
        mco.role()
    ], LayoutPane);
    exports.LayoutPane = LayoutPane;
});
