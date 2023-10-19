var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenViewChangeStatus = exports.ChangeStatus = void 0;
    var ChangeStatus;
    (function (ChangeStatus) {
        ChangeStatus["deactivated"] = "deactivated";
        ChangeStatus["activated"] = "activated";
        ChangeStatus["deleted"] = "deleted";
        ChangeStatus["added"] = "added";
    })(ChangeStatus = exports.ChangeStatus || (exports.ChangeStatus = {}));
    /**
     * DataType that is send by an change event for OpenContentViews
     *
     * @export
     * @class ViewModelChangeHint
     */
    let OpenViewChangeStatus = class OpenViewChangeStatus {
        /**
         * Creates an instance of ModelChangeHint.
         * Get as first parameter the viewID, on which a change has happened.
         * As second parameter it receives what has been changed on that view.
         *
         * @param {string} viewID
         * @param {Array<ChangeStatus>} changeStatus
         * @memberof ModelChangeHint
         */
        constructor(changeStatus, view) {
            this.changeStatus = changeStatus;
            this.view = view;
        }
    };
    OpenViewChangeStatus = __decorate([
        mco.role()
    ], OpenViewChangeStatus);
    exports.OpenViewChangeStatus = OpenViewChangeStatus;
});
