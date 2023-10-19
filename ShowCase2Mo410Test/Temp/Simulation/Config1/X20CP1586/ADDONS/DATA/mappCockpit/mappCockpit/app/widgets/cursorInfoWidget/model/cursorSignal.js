var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./cursorSignalDescriptor", "./cursorInfoVisibility", "../../../common/persistence/settings", "./settingIds"], function (require, exports, cursorSignalDescriptor_1, cursorInfoVisibility_1, settings_1, settingIds_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorSignal = void 0;
    /**
     * implements the base class for the various types of cursor signals
     *
     * @export
     * @class CursorSignal
     */
    let CursorSignal = class CursorSignal {
        constructor(serie, expandState) {
            // holds an object with informations describing the cursor signal
            this._cursorSignalDescriptor = new cursorSignalDescriptor_1.CursorSignalDescriptor(undefined);
            this._serie = serie;
            this._expandState = expandState;
        }
        /**
         * provides the serie
         *
         * @readonly
         * @type {BaseSeries}
         * @memberof CursorSignal
         */
        get serie() {
            return this._serie;
        }
        /**
         * provides expandState of signal in treeGrid
         *
         * @type {boolean}
         * @memberof CursorSignal
         */
        get expandState() {
            return this._expandState;
        }
        /**
         * sets expandState of signal in treeGrid
         *
         * @memberof CursorSignal
         */
        set expandState(expandState) {
            this._expandState = expandState;
        }
        /**
         * provides the serie name
         *
         * @readonly
         * @type {string}
         * @memberof CursorSignal
         */
        get name() {
            return this._serie.name;
        }
        /**
         * provides additional descriptive info
         *
         * @readonly
         * @type {string}
         * @memberof CursorSignal
         */
        get value() {
            return this._serie.additionalInfo;
        }
        /**
         * cursor signals are visible by default
         *
         * @readonly
         * @type {string}
         * @memberof CursorSignal
         */
        get visible() {
            return "true";
        }
        /**
         * This method is used by the DynamicCursorSignalTemplate to get hold
         * of all available cursor information available to the YTChart
         *
         * @returns {Array<CursorDisplayInfoClass>}
         * @memberof CursorSignal
         */
        getAllCursorInfo() {
            return [];
        }
        /**
         * provides the current cursor infos
         *
         * @readonly
         * @type {Array<CursorInfo>}
         * @memberof CursorSignal
         */
        get cursorInfos() {
            return this._cursorSignalDescriptor.cursorInfos;
        }
        /**
         * provides the filtered cursor infos (only cursors infos which should be shown for this signal)
         *
         * @readonly
         * @type {Array<CursorInfo>}
         * @memberof CursorSignal
         */
        get filteredCursorInfos() {
            return this._cursorSignalDescriptor.cursorInfos.filter(element => element.visible == "true");
        }
        /**
         * dummy method for updating cursor values
         *
         * @param {IPoint} cursorData1
         * @param {IPoint} cursorData2
         * @param {number} time1
         * @param {number} time2
         * @memberof CursorSignal
         */
        updateValues(cursorData1, cursorData2, time1, time2) {
        }
        /**
         * Clears all the cursor value informations
         *
         * @memberof CursorSignal
         */
        clearValues() {
            this.cursorInfos.forEach(cursorInfo => {
                cursorInfo.value = "";
            });
        }
        /**
         * Returns the icon representation for this node for the tree grid
         *
         * @readonly
         * @type {string}
         * @memberof CursorSignal
         */
        get iconDefinition() {
            let iconDefinition = "";
            let classNames = "e-treegridcollapse treegridcollapse";
            // Add collapse/expand icon 
            if (this.expandState == true) {
                classNames += "e-treegridexpand treegridexpand";
            }
            iconDefinition += `<div class='` + classNames + `'></div>`;
            // add series icon (with overlays)
            iconDefinition += `<div class='e-doc' style='position: relative;height:16px;width:30px;margin:auto;float:left;margin-left:0px;margin-top:2px'>`;
            iconDefinition += this._serie.getIcon();
            iconDefinition += `</div>`;
            return iconDefinition;
        }
        getSettings() {
            let settings = new settings_1.Settings("CursorSignal");
            settings.setValue(settingIds_1.SettingIds.SerieId, this.serie.id);
            settings.setValue(settingIds_1.SettingIds.ExpandState, this.expandState);
            settings.setValue(settingIds_1.SettingIds.CursorInfo, this.getCursorInfoVisibility());
            return settings;
        }
        /**
         * Get id and visibility of cursor info
         *
         * @private
         * @returns
         * @memberof CursorSignal
         */
        getCursorInfoVisibility() {
            let cursorInfoVisibility = Array();
            this.cursorInfos.forEach(cursorInfo => {
                let info = new cursorInfoVisibility_1.CursorInfoVisibility(cursorInfo.id, cursorInfo.visible);
                cursorInfoVisibility.push(info);
            });
            return cursorInfoVisibility;
        }
    };
    CursorSignal = __decorate([
        mco.role()
    ], CursorSignal);
    exports.CursorSignal = CursorSignal;
});
