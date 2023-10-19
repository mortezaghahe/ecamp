var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../models/openContentViewDataModel", "./viewGroupController", "../models/openViewChangeStack"], function (require, exports, openContentViewDataModel_1, viewGroupController_1, openViewChangeStack_1) {
    "use strict";
    var OpenViewMainController_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenViewMainController = void 0;
    /**
     * Controller that is the only interface used for triggering changes in the open view management
     *
     * @export
     * @class OpenViewMainController
     * @implements {IOpenViewMainController}
     */
    let OpenViewMainController = OpenViewMainController_1 = class OpenViewMainController {
        // singleton
        constructor() {
            this._openContentViewDataModel = new openContentViewDataModel_1.OpenContentViewDataModel();
            this._viewGroupController = viewGroupController_1.ViewGroupController.getInstance();
            this._viewGroupController.initializeViewGroups(this._openContentViewDataModel);
            this._changeStack = new openViewChangeStack_1.OpenViewChangeStack(this._openContentViewDataModel);
        }
        static getInstance() {
            if (this._instance === undefined) {
                this._instance = new OpenViewMainController_1();
            }
            return this._instance;
        }
        dispose() {
            this._viewGroupController.dispose();
            this._changeStack.dispose();
        }
        /**
         * Add view to data model
         *
         * @param {OpenContentView} view
         * @memberof OpenViewMainController
         */
        executeAddView(view) {
            // Create missing ViewGroups in case they doesn't exist already
            this._viewGroupController.createMissingViewGroups(view, this._openContentViewDataModel);
            this._openContentViewDataModel.addContentView(view);
        }
        /**
         * Add view to data model and open view afterwards
         *
         * @param {OpenContentView} view
         * @memberof OpenViewMainController
         */
        executeAddAndOpenView(view) {
            // Create missing ViewGroups in case they doesn't exist already
            this._viewGroupController.createMissingViewGroups(view, this._openContentViewDataModel);
            this._openContentViewDataModel.addContentView(view);
            this._openContentViewDataModel.activateContentViewByID(view.viewID);
        }
        /**
         * Open view for the passed groupTag.
         *
         * @private
         * @param {*} commandArgs
         * @return {*}
         * @memberof OpenViewMainController
         */
        executeOpenViewByGroupTag(groupTag) {
            // View is already open
            if (this._openContentViewDataModel.isViewFromGroupTagActive(groupTag)) {
                return;
            }
            // Get already existing view
            let view = this.getLastActiveView(groupTag);
            // If no view is found get the default view for the groupTag
            if (view === undefined) {
                view = this._openContentViewDataModel.getDefaultViewForGroupTag(groupTag);
            }
            // Open the view
            if (view !== undefined) {
                this._openContentViewDataModel.addContentView(view);
                this._openContentViewDataModel.activateContentViewByID(view.viewID);
            }
        }
        /**
         * Returns the last open view for the past groupTag if there is one
         *
         * @private
         * @param {string} groupTag
         * @return {*}  {(OpenContentView | undefined)}
         * @memberof OpenViewMainController
         */
        getLastActiveView(groupTag) {
            let view;
            let viewID = this._changeStack.getLastActiveViewByGroupTag(groupTag);
            if (viewID !== undefined) {
                view = this._openContentViewDataModel.getContentViewByID(viewID);
            }
            return view;
        }
        /**
         * Open the view the view by id. The view needs to exist in data model.
         *
         * @private
         * @param {*} commandArgs
         * @return {*}
         * @memberof OpenViewMainController
         */
        executeOpenViewByID(viewID) {
            // View is already open
            if (this._openContentViewDataModel.isViewActive(viewID)) {
                return;
            }
            // Get already existing view
            let view = this._openContentViewDataModel.getContentViewByID(viewID);
            // Open the view
            if (view !== undefined) {
                this._openContentViewDataModel.addContentView(view);
                this._openContentViewDataModel.activateContentViewByID(view.viewID);
            }
        }
        /**
         * Delete view by id
         *
         * @param {string} viewID
         * @memberof OpenViewMainController
         */
        executeDeleteViewByID(viewID) {
            this._openContentViewDataModel.deleteContentViewByID(viewID);
        }
        /**
         * Delete all views passed by id list
         *
         * @param {string[]} viewIDs
         * @memberof OpenViewMainController
         */
        executeDeleteViewByIDList(viewIDs) {
            viewIDs.forEach(id => this._openContentViewDataModel.deleteContentViewByID(id));
        }
    };
    OpenViewMainController = OpenViewMainController_1 = __decorate([
        mco.role()
    ], OpenViewMainController);
    exports.OpenViewMainController = OpenViewMainController;
});
