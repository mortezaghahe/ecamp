var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events", "../interfaces/openViewChangeEventsInterface"], function (require, exports, events_1, openViewChangeEventsInterface_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewGroup = exports.EventViewGroupDeactivated = exports.EventViewGroupActivated = void 0;
    let EventViewGroupActivated = class EventViewGroupActivated extends events_1.TypedEvent {
    };
    EventViewGroupActivated = __decorate([
        mco.role()
    ], EventViewGroupActivated);
    exports.EventViewGroupActivated = EventViewGroupActivated;
    ;
    let EventViewGroupDeactivated = class EventViewGroupDeactivated extends events_1.TypedEvent {
    };
    EventViewGroupDeactivated = __decorate([
        mco.role()
    ], EventViewGroupDeactivated);
    exports.EventViewGroupDeactivated = EventViewGroupDeactivated;
    ;
    /**
     * Filter the events for the changes in OpenContentViewDataModel.
     * Additionally sends events, when a ViewGroup is active or deactivated.
     *
     * @export
     * @class ViewGroup
     * @extends {DataModelBase}
     * @implements {IViewGroup}
     */
    let ViewGroup = class ViewGroup {
        constructor(groupTag, openContentViewDataModel) {
            // event that is raised, when the ViewGroup is activated
            this.viewGroupActivated = new EventViewGroupActivated();
            // event that is raised, when the ViewGroup is deactivated
            this.viewGroupDeactivated = new EventViewGroupDeactivated();
            // event that is raised, when a view of its ViewGroup is activated
            this.viewActivated = new openViewChangeEventsInterface_1.EventViewActivated();
            // event that is raised, when a view of its ViewGroup is deactivated
            this.viewDeactivated = new openViewChangeEventsInterface_1.EventViewDeactivated();
            // event that is raised, when a view of its ViewGroup is added
            this.viewAdded = new openViewChangeEventsInterface_1.EventViewAdded();
            // event that is raised, when a view of its ViewGroup is deleted
            this.viewDeleted = new openViewChangeEventsInterface_1.EventViewDeleted();
            this._viewActivated = (sender, eventArgs) => { this.raiseViewActivated(eventArgs); };
            this._viewDeactivated = (sender, eventArgs) => { this.raiseViewDeactivated(eventArgs); };
            this._viewAdded = (sender, eventArgs) => { this.raiseViewAdded(eventArgs); };
            this._viewDeleted = (sender, eventArgs) => { this.raiseViewDeleted(eventArgs); };
            this.groupTag = groupTag;
            this._openContentViewDataModel = openContentViewDataModel;
            this._isAtLeastOneActive = this.isViewGroupActive();
            this.attach();
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
         * Raise a viewActivated event for this viewGroup
         *
         * @private
         * @param {OpenContentView} view
         * @memberof ViewGroup
         */
        raiseViewActivated(view) {
            if (this.isViewFromViewGroup(view) === true) {
                this.triggerActivationStateChanged();
                this.viewActivated.raise(this, view);
            }
        }
        /**
         * Raise a viewDeactivated event for this viewGroup
         *
         * @private
         * @param {OpenContentView} view
         * @memberof ViewGroup
         */
        raiseViewDeactivated(view) {
            if (this.isViewFromViewGroup(view) === true) {
                this.triggerActivationStateChanged();
                this.viewDeactivated.raise(this, view);
            }
        }
        /**
         * Raise a viewAdded event for this viewGroup
         *
         * @private
         * @param {OpenContentView} view
         * @memberof ViewGroup
         */
        raiseViewAdded(view) {
            if (this.isViewFromViewGroup(view) === true) {
                this.viewAdded.raise(this, view);
            }
        }
        /**
         * Raise a viewDeleted event for this viewGroup
         *
         * @private
         * @param {OpenContentView} view
         * @memberof ViewGroup
         */
        raiseViewDeleted(view) {
            if (this.isViewFromViewGroup(view) === true) {
                this.viewDeleted.raise(this, view);
            }
        }
        /**
         * When a openContentView that is included in the data has changed, a corresponding event need to be raised.
         *
         * @private
         * @param {*} eventArgs
         * @memberof ViewGroup
         */
        isViewFromViewGroup(view) {
            return view.groupTags.includes(this.groupTag);
        }
        /**
         * Trigger an event if the ViewGroup changed to activated or deactivated
         *
         * @private
         * @return {*}
         * @memberof ViewGroup
         */
        triggerActivationStateChanged() {
            // get the current activation state for this ViewGroup
            let isCurrentlyActive = this.isViewGroupActive();
            // Check if it differs from the last state  
            if (this._isAtLeastOneActive !== isCurrentlyActive) {
                // In case it differs, set the current state and send an appropriate event
                this._isAtLeastOneActive = isCurrentlyActive;
                if (this._isAtLeastOneActive === true) {
                    this.viewGroupActivated.raise(this, this.groupTag);
                }
                else {
                    this.viewGroupDeactivated.raise(this, this.groupTag);
                }
            }
        }
        /**
         * Returns true if at least one view of this ViewGroup is active, false otherwise
         *
         * @private
         * @return {*}  {boolean}
         * @memberof ViewGroup
         */
        isViewGroupActive() {
            return this.getData().some(view => view.isActive === true);
        }
        /**
         * Returns all currently active views of the ViewGroup
         *
         * @return {*}  {OpenContentView[]}
         * @memberof ViewGroup
         */
        getActiveViewsOfViewGroup() {
            return this._openContentViewDataModel.getActiveViews().filter(view => view.groupTags.includes(this.groupTag));
        }
        /**
         * Returns all currently active views
         *
         * @return {*}  {OpenContentView[]}
         * @memberof ViewGroup
         */
        getAllActiveViews() {
            return this._openContentViewDataModel.getActiveViews();
        }
        /**
         * Returns all OpenContentViews of this ViewGroup
         *
         * @return {*}  {OpenContentView[]}
         * @memberof ViewGroup
         */
        getData() {
            return this._openContentViewDataModel.data.filter(view => view.groupTags.includes(this.groupTag));
        }
        /**
         * Returns true when at least one view of the viewGroup is active, false otherwise
         *
         * @return {*}  {boolean}
         * @memberof ViewGroup
         */
        isActive() {
            return this._isAtLeastOneActive;
        }
    };
    ViewGroup = __decorate([
        mco.role()
    ], ViewGroup);
    exports.ViewGroup = ViewGroup;
});
