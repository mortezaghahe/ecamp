var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../widgets/common/groupTagProvider", "../interfaces/openViewChangeEventsInterface"], function (require, exports, groupTagProvider_1, openViewChangeEventsInterface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OpenContentViewDataModel = void 0;
    /**
     * DataModel that includes all OpenContentViews
     *
     * @export
     * @class OpenContentViewDataModel
     * @extends {DataModelBase}
     * @implements {IOpenContentViewDataModel}
     */
    let OpenContentViewDataModel = class OpenContentViewDataModel {
        constructor() {
            /**
             * Stores a flat list of all open content views
             *
             * @protected
             * @type {Array<OpenContentView>}
             * @memberof OpenContentViewDataModel
             */
            this._data = new Array();
            // event that is raised, when a view of its ViewGroup is activated
            this.viewActivated = new openViewChangeEventsInterface_1.EventViewActivated();
            // event that is raised, when a view of its ViewGroup is deactivated
            this.viewDeactivated = new openViewChangeEventsInterface_1.EventViewDeactivated();
            // event that is raised, when a view of its ViewGroup is added
            this.viewAdded = new openViewChangeEventsInterface_1.EventViewAdded();
            // event that is raised, when a view of its ViewGroup is deleted
            this.viewDeleted = new openViewChangeEventsInterface_1.EventViewDeleted();
        }
        get data() {
            return this._data;
        }
        /**
         * Removes the open content view from list and trigger model change event.
         *
         * @param {string} viewID
         * @return {*}  {Array<ViewModelChangeHint>}
         * @memberof OpenContentViewDataModel
         */
        deleteContentViewByID(viewID) {
            let index = this._data.findIndex(contentView => (contentView.viewID === viewID));
            if (index !== -1) {
                let contentView = this._data[index];
                this.deactivateContentViewByID(contentView.viewID);
                this._data.splice(index, 1);
                this.viewDeleted.raise(this, contentView);
            }
        }
        /**
         * (Not needed right now cause all are set deactivated when a new view is set active)
         *
         * @param {string} viewID
         * @return {*}  {Array<ViewModelChangeHint>}
         * @memberof OpenContentViewDataModel
         */
        deactivateContentViewByID(viewID) {
            this._data.forEach(view => {
                if (view.viewID == viewID && view.isActive === true) {
                    view.isActive = false;
                    this.viewDeactivated.raise(this, view);
                }
            });
        }
        /**
         * At first sets all active views deactivated, then sets the desired view active. Returns a hint for all changed views.
         *
         * @private
         * @param {string} viewID
         * @return {*}  {Array<ViewModelChangeHint>}
         * @memberof OpenContentViewDataModel
         */
        activateContentViewByID(viewID) {
            // Currently all views are set deactivated before a new view is set active
            this.deactivateAllOpenContentViews();
            this._data.forEach(view => {
                if (view.viewID == viewID && view.isActive === false) {
                    view.isActive = true;
                    this.viewActivated.raise(this, view);
                }
            });
        }
        /**
         * Adds a content view if it doesn't exist already. Returns a hint if a view is added.
         *
         * @private
         * @param {OpenContentView} contentView
         * @return {*}  {Array<ViewModelChangeHint>}
         * @memberof OpenContentViewDataModel
         */
        addContentView(contentView) {
            if (this._data.some(view => view.viewID === contentView.viewID) === false) {
                this._data.push(contentView);
                this.viewAdded.raise(this, contentView);
            }
        }
        /**
         * Deactivates all open content views. Returns a hint for all views that are deactivated
         *
         * @private
         * @return {*}  {Array<ViewModelChangeHint>}
         * @memberof OpenContentViewDataModel
         */
        deactivateAllOpenContentViews() {
            this._data.forEach(contentView => {
                if (contentView.isActive === true) {
                    contentView.isActive = false;
                    this.viewDeactivated.raise(this, contentView);
                }
            });
        }
        /**
         * Either the view is found and returned, or undefined is returned
         *
         * @param {string} viewID
         * @return {*}  {(OpenContentView | undefined)}
         * @memberof OpenContentViewDataModel
         */
        getContentViewByID(viewID) {
            return this._data.find(view => view.viewID === viewID);
        }
        /**
         * Returns an array of all active views.
         * If no view is active an empty array is returned.
         *
         * @return {*}  {Array<OpenContentView>}
         * @memberof OpenContentViewDataModel
         */
        getActiveViews() {
            return this._data.filter(view => (view.isActive === true));
        }
        /**
         * Returns true when the passed view is active, false otherwise
         *
         * @param {string} viewID
         * @return {*}  {boolean}
         * @memberof OpenContentViewDataModel
         */
        isViewActive(viewID) {
            return this.getActiveViews().some(view => view.viewID === viewID);
        }
        /**
         * Returns true when at least one view from the passed groupTag is active, false otherwise
         *
         * @param {string} groupTag
         * @return {*}  {boolean}
         * @memberof OpenContentViewDataModel
         */
        isViewFromGroupTagActive(groupTag) {
            return this.getActiveViews().filter(view => view.groupTags.includes(groupTag)).length !== 0;
        }
        /**
         * Returns the first found view for the passed groupTag, where defaultView is added.
         *
         * @param {string} groupTag
         * @return {*}  {(OpenContentView | undefined)}
         * @memberof OpenContentViewDataModel
         */
        getDefaultViewForGroupTag(groupTag) {
            return this._data.find(view => [groupTag, groupTagProvider_1.GroupTag.defaultView].every(gT => view.groupTags.includes(gT)));
        }
    };
    OpenContentViewDataModel = __decorate([
        mco.role()
    ], OpenContentViewDataModel);
    exports.OpenContentViewDataModel = OpenContentViewDataModel;
});
