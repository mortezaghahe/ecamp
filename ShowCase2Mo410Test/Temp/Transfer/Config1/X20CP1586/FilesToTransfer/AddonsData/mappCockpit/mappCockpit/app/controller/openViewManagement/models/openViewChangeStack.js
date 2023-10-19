var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./openViewChangeStatus"], function (require, exports, openViewChangeStatus_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenViewChangeStack = void 0;
    /**
     * Stores all changes from the OpenContentViewDataModel
     *
     * @export
     * @class OpenViewChangeStack
     * @implements {IOpenViewChangeStack}
     */
    let OpenViewChangeStack = class OpenViewChangeStack {
        constructor(openContentViewDataModel) {
            // Stack that holds all changes of the OpenContentViewDataModel
            this._stack = new Array();
            this._stackSize = 1000;
            this._viewActivated = (sender, eventArgs) => { this.addToStack(eventArgs, openViewChangeStatus_1.ChangeStatus.activated); };
            this._viewDeactivated = (sender, eventArgs) => { this.addToStack(eventArgs, openViewChangeStatus_1.ChangeStatus.deactivated); };
            this._viewAdded = (sender, eventArgs) => { this.addToStack(eventArgs, openViewChangeStatus_1.ChangeStatus.added); };
            this._viewDeleted = (sender, eventArgs) => { this.addToStack(eventArgs, openViewChangeStatus_1.ChangeStatus.deleted); };
            this._openContentViewDataModel = openContentViewDataModel;
            this.initialize();
        }
        /**
         * initialize the data Model
         *
         * @memberof OpenViewDataModel
         */
        initialize() {
            this.attach();
        }
        dispose() {
            this.detach();
            // Empty stack TODO: Persist the stack?     
            this._stack.length = 0;
        }
        attach() {
            this._openContentViewDataModel.viewActivated.attach(this._viewActivated);
            this._openContentViewDataModel.viewDeactivated.attach(this._viewDeactivated);
            this._openContentViewDataModel.viewAdded.attach(this._viewAdded);
            this._openContentViewDataModel.viewDeleted.attach(this._viewDeleted);
        }
        detach() {
            this._openContentViewDataModel.viewActivated.detach(this._viewActivated);
            this._openContentViewDataModel.viewDeactivated.detach(this._viewDeactivated);
            this._openContentViewDataModel.viewAdded.detach(this._viewAdded);
            this._openContentViewDataModel.viewDeleted.detach(this._viewDeleted);
        }
        /**
         * Every change in the OpenContentViewDataModel is added to the stack.
         * If the stack size is 1000 the oldest element is popped
         *
         * @private
         * @param {*} eventArgs
         * @memberof OpenViewChangeStack
         */
        addToStack(view, status) {
            // Add changes
            let change = new openViewChangeStatus_1.OpenViewChangeStatus(status, view);
            this._stack.splice(0, 0, change);
            // limit the stack size, that it does not grow endless
            if (this._stack.length > this._stackSize) {
                this._stack.slice(0, this._stackSize);
            }
        }
        /**
         * Returns the viewID of the last active view from the passed groupTag.
         * If no view is found, undefined gets returned.
         *
         * @param {*} groupTag
         * @return {*}  {string}
         * @memberof OpenViewChangeStack
         */
        getLastActiveViewByGroupTag(groupTag) {
            // get only the changes for the passed groupTag
            let filteredStack = this._stack.filter(change => change.view.groupTags.includes(groupTag));
            let deactivateIndex = 0;
            let viewID;
            do {
                // slice the stack, so that a specific deactivateIndex can only be found once and to avoid an endless loop.
                filteredStack = filteredStack.slice(deactivateIndex, filteredStack.length);
                deactivateIndex = filteredStack.findIndex(change => change.changeStatus == openViewChangeStatus_1.ChangeStatus.deactivated);
                // no last deactivated view found
                if (deactivateIndex === -1) {
                    return undefined;
                }
                // make sure that the last deactivated view is not deleted
                viewID = filteredStack[deactivateIndex].view.viewID;
            } while (this._openContentViewDataModel.getContentViewByID(viewID) === undefined);
            return viewID;
        }
    };
    OpenViewChangeStack = __decorate([
        mco.role()
    ], OpenViewChangeStack);
    exports.OpenViewChangeStack = OpenViewChangeStack;
});
