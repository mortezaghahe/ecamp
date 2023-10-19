var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/state", "./cursorState", "../../../common/persistence/settings", "./settingIds", "./cursorType", "../../../framework/reflection/decorators/metaClassPropertyDecorator", "../../../framework/componentHub/common/commonTypes"], function (require, exports, state_1, cursorState_1, settings_1, settingIds_1, cursorType_1, Reflection, commonTypes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorStates = void 0;
    /**
     * holds cursor state objects
     * @singleton
     * @export
     * @class CursorStates
     */
    let CursorStates = class CursorStates extends state_1.State {
        /**
         * Creates an instance of CursorStates.
         * @memberof CursorStates
         */
        constructor() {
            super();
            this._type = "CursorStates"; // type of this class(normally the classname)
            // Set the persisting id where the CursorStates will be saved
            this.id = "CursorStates"; // unique id of the instance
            // Create default cursor States
            let cursorState1 = new cursorState_1.CursorState(cursorType_1.CursorType.timeDomain);
            let cursorState2 = new cursorState_1.CursorState(cursorType_1.CursorType.timeDomain);
            let FFTcursorState1 = new cursorState_1.CursorState(cursorType_1.CursorType.frequencyDomain);
            let FFTcursorState2 = new cursorState_1.CursorState(cursorType_1.CursorType.frequencyDomain);
            this._timeCursorStates = [cursorState1, cursorState2];
            this._fftCursorStates = [FFTcursorState1, FFTcursorState2];
            this._cursorStates = this._timeCursorStates.concat(this._fftCursorStates);
            // Select cursor 1 by default
            cursorState1.selected = true;
            this.lastCursorTypeSelected = cursorType_1.CursorType.timeDomain;
        }
        /**
         * Disposes the object
         *
         * @memberof CursorStates
         */
        dispose() {
        }
        /**
         * Returns the current settings of this cursorStates object
         *
         * @returns {ISettings}
         * @memberof CursorStates
         */
        getSettings() {
            let settings = new settings_1.Settings(this._type), timePositions = Array(), timeActiveStates = Array(), fftPositions = Array(), fftActiveStates = Array();
            this._timeCursorStates.forEach((cursor) => {
                timePositions.push(cursor.position);
                timeActiveStates.push(cursor.active);
            });
            this._fftCursorStates.forEach((cursor) => {
                fftPositions.push(cursor.position);
                fftActiveStates.push(cursor.active);
            });
            //Persist position and active state
            settings.setValue(settingIds_1.SettingIds.TimeCursorPositions, timePositions);
            settings.setValue(settingIds_1.SettingIds.FftCursorPositions, fftPositions);
            settings.setValue(settingIds_1.SettingIds.TimeCursorActiveState, timeActiveStates);
            settings.setValue(settingIds_1.SettingIds.FftCursorActiveState, fftActiveStates);
            return settings;
        }
        /**
         * Sets the given settings to this cursorStates object
         *
         * @param {ISettings} settings
         * @memberof CursorStates
         */
        setSettings(settings) {
            let settingsObj = settings_1.Settings.create(settings), timePositions = settingsObj.getValue(settingIds_1.SettingIds.TimeCursorPositions), fftPositions = settingsObj.getValue(settingIds_1.SettingIds.FftCursorPositions), timeActiveStates = settingsObj.getValue(settingIds_1.SettingIds.TimeCursorActiveState), fftActiveStates = settingsObj.getValue(settingIds_1.SettingIds.FftCursorActiveState);
            for (var i = 0; i < timePositions.length; i++) {
                this._timeCursorStates[i].position = timePositions[i];
                this._timeCursorStates[i].active = timeActiveStates[i];
            }
            for (var i = 0; i < fftPositions.length; i++) {
                this._fftCursorStates[i].position = fftPositions[i];
                this._fftCursorStates[i].active = fftActiveStates[i];
            }
            this._cursorStates = this._timeCursorStates.concat(this._fftCursorStates);
        }
        /**
         * Returns a list of all available cursor states
         *
         * @returns {Array<ICursorState>}
         * @memberof CursorStates
         */
        getStates() {
            return this._cursorStates;
        }
        /**
         * Returns a list of all available time cursor states
         *
         * @returns {Array<ICursorState>}
         * @memberof CursorStates
         */
        getTimeStates() {
            return this._timeCursorStates;
        }
        /**
         * Returns a list of all available time cursor states
         *
         * @returns {Array<ICursorState>}
         * @memberof CursorStates
         */
        getFrequencyStates() {
            return this._fftCursorStates;
        }
        /**
         * Sets the active flag for the given index
         *
         * @param {number} cursorIndex
         * @param {boolean} active
         * @memberof CursorStates
         */
        setActive(cursorIndex, active) {
            if (this.getLastCursorTypeSelected() == cursorType_1.CursorType.timeDomain) {
                this._timeCursorStates[cursorIndex].active = active;
            }
            else if (this.getLastCursorTypeSelected() == cursorType_1.CursorType.frequencyDomain) {
                this._fftCursorStates[cursorIndex].active = active;
            }
        }
        /**
         * Returns the active flag for the given index
         *
         * @param {number} cursorIndex
         * @returns {boolean}
         * @memberof CursorStates
         */
        getActive(cursorIndex) {
            if (this.getLastCursorTypeSelected() == cursorType_1.CursorType.timeDomain) {
                return this._timeCursorStates[cursorIndex].active;
            }
            else if (this.getLastCursorTypeSelected() == cursorType_1.CursorType.frequencyDomain) {
                return this._fftCursorStates[cursorIndex].active;
            }
            return false;
        }
        /**
         * Reset cursor states
         *
         * @param {CursorType} type
         * @memberof CursorStates
         */
        resetCursorStates(type) {
            if (type === cursorType_1.CursorType.timeDomain) {
                this.resetTimeCursorStates();
            }
            else if (type === cursorType_1.CursorType.frequencyDomain) {
                this.resetFqCursorStates();
            }
        }
        /**
         * Reset time cursor states
         *
         * @private
         * @memberof CursorStates
         */
        resetTimeCursorStates() {
            this._timeCursorStates.forEach((state) => {
                state.active = false;
                state.hovered = false;
                state.position = undefined;
            });
        }
        /**
         * Reset fq cursor states
         *
         * @private
         * @memberof CursorStates
         */
        resetFqCursorStates() {
            this._fftCursorStates.forEach((state) => {
                state.active = false;
                state.hovered = false;
                state.position = undefined;
            });
        }
        /**
         * Sets the type of cursor that has been selected
         *
         * @param {CursorType} type
         * @memberof CursorStates
         */
        setLastCursorTypeSelected(type) {
            this.lastCursorTypeSelected = type;
        }
        /**
         * Gets the type of cursor that has been selected
         *
         * @returns {CursorType}
         * @memberof CursorStates
         */
        getLastCursorTypeSelected() {
            return this.lastCursorTypeSelected;
        }
        /**
         * Set hovered flag for the cursor with the given index, and remove hovered flag from all other cursors
         * if hovered = false and cursorIndex = -1, hovered will be set to false at all cursors
         *
         * @param {number} cursorIndex
         * @param {boolean} hovered
         * @memberof CursorStates
         */
        setHovered(cursorIndex, cursorType, hovered) {
            if (cursorIndex >= 0 && cursorIndex < this._cursorStates.length) {
                if (cursorType == cursorType_1.CursorType.timeDomain) {
                    this._timeCursorStates[cursorIndex].hovered = hovered;
                }
                else if (cursorType == cursorType_1.CursorType.frequencyDomain) {
                    this._fftCursorStates[cursorIndex].hovered = hovered;
                }
                if (hovered == true) {
                    // set all other cursors to hovered false
                    this.setOtherCursorsToFalse(cursorIndex, cursorType, 'hovered');
                }
            }
            else if (cursorIndex == -1 && hovered == false) {
                // Set all cursor hovered flags to false
                this._cursorStates.forEach(cursorState => {
                    cursorState.hovered = false;
                });
            }
        }
        /**
         * Returns the hovered flag for the given index
         *
         * @param {number} cursorIndex
         * @returns {boolean}
         * @memberof CursorStates
         */
        getHovered(cursorIndex) {
            return this._cursorStates[cursorIndex].hovered;
        }
        /**
         * Returns the index of a current hovered cursor or -1 if no hovered cursor is available
         *
         * @returns {number}
         * @memberof CursorStates
         */
        getHoveredCursorIndex() {
            let hoveredCursorIndex = -1;
            for (let index = 0; index < this._timeCursorStates.length; index++) {
                if (this._timeCursorStates[index].hovered == true) {
                    hoveredCursorIndex = index;
                }
            }
            for (let index = 0; index < this._fftCursorStates.length; index++) {
                if (this._fftCursorStates[index].hovered == true) {
                    hoveredCursorIndex = index;
                }
            }
            return hoveredCursorIndex;
        }
        /**
         * Sets the position of the cursor with the given index
         *
         * @param {number} cursorIndex
         * @param {number} position
         * @memberof CursorStates
         */
        setPosition(cursorIndex, position) {
            if (this.getLastCursorTypeSelected() == cursorType_1.CursorType.timeDomain) {
                this._timeCursorStates[cursorIndex].position = position;
            }
            else if (this.getLastCursorTypeSelected() == cursorType_1.CursorType.frequencyDomain) {
                this._fftCursorStates[cursorIndex].position = position;
            }
        }
        /**
         * Returns the position of the cursor with the given index
         *
         * @param {number} cursorIndex
         * @returns {(number|undefined)}
         * @memberof CursorStates
         */
        getPosition(cursorIndex, cursorType) {
            if (cursorType == cursorType_1.CursorType.timeDomain) {
                return this._timeCursorStates[cursorIndex].position;
            }
            else {
                return this._fftCursorStates[cursorIndex].position;
            }
        }
        /**
         * Returns the index of the current selected cursor or -1 if no selected cursor is available
         *
         * @returns {number}
         * @memberof CursorStates
         */
        getSelectedCursorIndex() {
            let selectedCursorIndex = -1;
            for (var i = 0; i < this._timeCursorStates.length; i++) {
                if (this._timeCursorStates[i].selected == true) {
                    selectedCursorIndex = i;
                }
            }
            for (var i = 0; i < this._fftCursorStates.length; i++) {
                if (this._fftCursorStates[i].selected == true) {
                    selectedCursorIndex = i;
                }
            }
            return selectedCursorIndex;
        }
        /**
         * Sets selected flag of the cursor with the given index(if true all other cursors will be set to deselected)
         *
         * @param {number} cursorIndex
         * @param {boolean} selected
         * @memberof CursorStates
         */
        setSelected(cursorIndex, selected) {
            if (this.getLastCursorTypeSelected() == cursorType_1.CursorType.frequencyDomain) {
                this._fftCursorStates[cursorIndex].selected = selected;
            }
            else if (this.getLastCursorTypeSelected() == cursorType_1.CursorType.timeDomain) {
                this._timeCursorStates[cursorIndex].selected = selected;
            }
            if (selected == true) {
                // set all other cursors to selected false
                this.setOtherCursorsToFalse(cursorIndex, this.getLastCursorTypeSelected(), 'selected');
            }
        }
        /**
         * Set the specified property to false for all the cursorStates except one
         *
         * @private
         * @param {number} cursorIndex
         * @param {CursorType} cursorType
         * @param {string} property
         * @memberof CursorStates
         */
        setOtherCursorsToFalse(cursorIndex, cursorType, property) {
            for (var i = 0; i < this._timeCursorStates.length; i++) {
                if (cursorType == cursorType_1.CursorType.timeDomain) {
                    this._fftCursorStates[i][property] = false;
                }
                else if (i != cursorIndex) {
                    this._fftCursorStates[i][property] = false;
                }
            }
            for (var i = 0; i < this._fftCursorStates.length; i++) {
                if (cursorType == cursorType_1.CursorType.frequencyDomain) {
                    this._timeCursorStates[i][property] = false;
                }
                else if (i != cursorIndex) {
                    this._timeCursorStates[i][property] = false;
                }
            }
        }
    };
    CursorStates = __decorate([
        Reflection.metaClassProperty(Reflection.MetaClassProperty.persistable, true),
        Reflection.metaClassProperty(Reflection.MetaClassProperty.transferType, commonTypes_1.DataTransferType.byValue),
        Reflection.metaClassProperty(Reflection.MetaClassProperty.className, "CursorStates"),
        mco.role()
    ], CursorStates);
    exports.CursorStates = CursorStates;
});
