var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./cursorInfo"], function (require, exports, cursorInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CursorSignalDescriptor = void 0;
    let CursorSignalDescriptor = class CursorSignalDescriptor {
        constructor(cursorInfo) {
            this._cursorInfoIds = [];
            this._cursorInfos = [];
            this.visibleInfoIds = [];
            this.initializeCursorSignalInfos();
            if (cursorInfo !== undefined) {
                this.setCursorInfoVisibility(cursorInfo);
            }
            this.setDefaultCursorInfos();
        }
        getAllCursorInfo() {
            return this._cursorInfoIds;
        }
        get cursorInfos() {
            return this._cursorInfos;
        }
        initializeCursorSignalInfos() { }
        /**
         * Sets the default cursor infos for this cursor signal
         *
         * @private
         * @memberof CursorSignalDescriptor
         */
        setDefaultCursorInfos() {
            this._cursorInfoIds.forEach((cursorInfoId) => {
                this.addCursorInfo(cursorInfoId.id, cursorInfoId.displayName, cursorInfoId.description, cursorInfoId.cursorDependency);
            });
        }
        /**
         * Sets the persisted cursor infos for this cursor signal
         *
         * @protected
         * @param {CursorInfoVisibility[]} cursorInfo
         * @memberof CursorSignalDescriptor
         */
        setCursorInfoVisibility(cursorInfo) {
            //Redefine visible infoIds
            this.visibleInfoIds = [];
            cursorInfo.forEach(info => {
                if (info.visible === "true") {
                    this.visibleInfoIds.push(info.id);
                }
            });
        }
        /**
         * Adds a new cursor info to the cursor info list with the default displayname and description if not given(undefined)
         *
         * @protected
         * @param {string} id
         * @param {string} displayName
         * @param {string} description
         * @param {CursorDependency} cursorDependency
         * @memberof CursorSignalDescriptor
         */
        addCursorInfo(id, displayName, description, cursorDependency) {
            let visible = this.getVisibility(id);
            this._cursorInfos.push(new cursorInfo_1.CursorInfo(id, displayName, description, this, visible, cursorDependency));
        }
        /**
         * Retrieves the visibility for a given cursor info id
         *
         * @protected
         * @param {string} id
         * @returns {string}
         * @memberof CursorSignalDescriptor
         */
        getVisibility(id) {
            return this.visibleInfoIds.includes(id).toString();
        }
    };
    CursorSignalDescriptor = __decorate([
        mco.role()
    ], CursorSignalDescriptor);
    exports.CursorSignalDescriptor = CursorSignalDescriptor;
});
