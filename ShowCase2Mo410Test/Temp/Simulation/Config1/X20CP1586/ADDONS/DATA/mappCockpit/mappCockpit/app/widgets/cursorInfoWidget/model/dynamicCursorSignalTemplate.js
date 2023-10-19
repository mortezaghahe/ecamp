var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./cursorInfo"], function (require, exports, cursorInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DynamicCursorSignalTemplate = exports.CursorDisplayInfoClass = void 0;
    let CursorDisplayInfoClass = class CursorDisplayInfoClass {
        constructor(id, displayName, description, cursorDependency) {
            this.id = '';
            this.displayName = '';
            this.description = '';
            this.id = id;
            this.displayName = displayName;
            this.description = description;
            this.cursorDependency = cursorDependency;
        }
    };
    CursorDisplayInfoClass = __decorate([
        mco.role()
    ], CursorDisplayInfoClass);
    exports.CursorDisplayInfoClass = CursorDisplayInfoClass;
    let DynamicCursorSignalTemplate = class DynamicCursorSignalTemplate {
        /**
         * Creates an instance of DynamicCursorSignalTemplate
         * @memberof DynamicCursorSignalTemplate
         */
        constructor(cursorSignals) {
            this._visible = "true";
            this._cursorInfos = new Array();
            this.setCursorInfosByCursorSignals(cursorSignals);
        }
        get name() {
            return "Cursor Informations";
        }
        /**
         * Returns all cursor infos
         *
         * @readonly
         * @type {Array<CursorInfo>}
         * @memberof DynamicCursorSignalTemplate
         */
        get cursorInfos() {
            return this._cursorInfos;
        }
        /**
         * Returns only filtered cursor infos if some filtering would be available
         *
         * @readonly
         * @type {Array<CursorInfo>}
         * @memberof DynamicCursorSignalTemplate
         */
        get filteredCursorInfos() {
            return this._cursorInfos;
        }
        get value() {
            return "";
        }
        get visible() {
            return this._visible;
        }
        set visible(visible) {
            this._visible = visible;
        }
        /**
         * Returns the icon representation for this node for the tree grid
         *
         * @readonly
         * @type {string}
         * @memberof DynamicCursorSignalTemplate
         */
        get iconDefinition() {
            return `<div class='e-doc' style='position: relative;height:16px;width:30px;margin:auto;float:left;margin-left:6px;margin-top:2px'/>`;
        }
        /**
         * Retrieves a list of all available cursorSignal and sorts out which
         * cursorInformation is available in all cursorSignals and sets the
         * information in the CursorInformationWidget.
         *
         * @private
         * @memberof DynamicCursorSignalTemplate
         */
        setCursorInfosByCursorSignals(cursorSignals) {
            let availableCursorInfo = new Map(), availableCursorInfoCounter = new Map();
            if (cursorSignals != undefined) {
                cursorSignals = this.reduceNumberOfAvailableSignalTypes(cursorSignals);
                cursorSignals.forEach((cursorSignal, index) => {
                    let cursorInfos = cursorSignal.getAllCursorInfo();
                    //Iterate over all cursorInfos
                    this.getAvailableCrossSignalCursorInfo(cursorInfos, availableCursorInfo, availableCursorInfoCounter);
                });
            }
            //Iterate over available cursorInfos' counters to find the ones
            //present in all available signals.
            for (let id in availableCursorInfoCounter) {
                if (availableCursorInfoCounter[id] === cursorSignals.length) {
                    this.addCursorInfo(id, availableCursorInfo[id].displayName, availableCursorInfo[id].description, availableCursorInfo[id].cursorDependency);
                }
            }
        }
        /**
         * This method will get the available cursorInfos across all different
         * types of signals and count the number of occurances for each type
         * and store these into the referenced Maps passed in the function.
         *
         * @private
         * @param {Array<CursorDisplayInfoClass>} cursorInfos
         * @param {(Map<string, CursorSignal>)} availableCursorInfo
         * @param {Map<string, number>} availableCursorInfoCounter
         * @memberof DynamicCursorSignalTemplate
         */
        getAvailableCrossSignalCursorInfo(cursorInfos, availableCursorInfo, availableCursorInfoCounter) {
            cursorInfos.forEach((cursorInfo, index) => {
                //If a cursorInfo already has been saved increase the counter
                if (availableCursorInfo.hasOwnProperty(cursorInfo.id)) {
                    availableCursorInfoCounter[cursorInfo.id]++;
                    // If the cursorInfo hasnt been stored before, store it 
                    // and set counter to 1
                }
                else {
                    availableCursorInfo[cursorInfo.id] = cursorInfo;
                    availableCursorInfoCounter[cursorInfo.id] = 1;
                }
            });
        }
        /**
         * This method will reduce the number of different available kinds of signals
         * in case we receive 100 YT signals we only want to iterate over these once
         * later and not 100 times.
         *
         * @private
         * @param {(Array<CursorSignal>)} cursorSignals
         * @returns {(Array<CursorSignal>)}
         * @memberof DynamicCursorSignalTemplate
         */
        reduceNumberOfAvailableSignalTypes(cursorSignals) {
            let availableCursorSignal = new Map(), returnableCursorSignals = [];
            cursorSignals.forEach((cursorSignal, index) => {
                if (!availableCursorSignal.has(cursorSignal.serie.type)) {
                    availableCursorSignal.set(cursorSignal.serie.type, cursorSignal);
                    returnableCursorSignals.push(cursorSignal);
                }
            });
            return returnableCursorSignals;
        }
        /**
         * Adds a new cursor info to the cursor info list with the default displayname and description if not given(undefined)
         *
         * @protected
         * @param {string} id
         * @param {string} displayName
         * @param {string} description
         * @param {CursorDependency} cursorDependency
         * @memberof DynamicCursorSignalTemplate
         */
        addCursorInfo(id, displayName, description, cursorDependency) {
            let visible = 'true';
            this._cursorInfos.push(new cursorInfo_1.CursorInfo(id, displayName, description, this, visible, cursorDependency));
        }
    };
    DynamicCursorSignalTemplate = __decorate([
        mco.role()
    ], DynamicCursorSignalTemplate);
    exports.DynamicCursorSignalTemplate = DynamicCursorSignalTemplate;
});
