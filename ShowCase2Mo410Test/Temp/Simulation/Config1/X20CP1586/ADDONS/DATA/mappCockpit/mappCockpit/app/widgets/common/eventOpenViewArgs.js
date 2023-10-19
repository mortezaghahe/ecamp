define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventOpenViewArgs = void 0;
    /**
     * EventArgs data for opening a new view
     *
     * @class EventOpenViewArgs
     */
    class EventOpenViewArgs {
        /**
         * Creates an instance of EventOpenViewArgs.
         * @param {*} caller
         * @param {string} componentId
         * @param {string} componentDisplayName
         * @param {ViewType} viewType
         * @memberof EventOpenViewArgs
         */
        constructor(caller, componentId, componentDisplayName, viewType) {
            this.caller = caller;
            this.componentId = componentId;
            this.componentDisplayName = componentDisplayName;
            this.viewType = viewType;
        }
    }
    exports.EventOpenViewArgs = EventOpenViewArgs;
});
