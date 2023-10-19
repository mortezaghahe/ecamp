var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/dataModelBase", "../../../models/dataModelInterface", "../../../widgets/common/groupTagProvider", "./openViewMainController"], function (require, exports, dataModelBase_1, dataModelInterface_1, groupTagProvider_1, openViewMainController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SortedViewGroup = void 0;
    /**
     * SortedViewGroups are needed for ensuring the correct order of open views in e.g. Tabs and dropdown.
     * ADDITIONALLY EACH SORTED VIEW GROUP IS RESPONSIBLE FOR OPENING THE NEXT VIEW IN CASE OF DELETION!
     *
     * @export
     * @class SortedViewGroup
     * @extends {DataModelBase}
     * @implements {ISortedViewGroup}
     */
    let SortedViewGroup = class SortedViewGroup extends dataModelBase_1.DataModelBase {
        constructor(groupTag) {
            super();
            // the order of the array is important (sorted ViewGroups)
            this._data = new Array();
            this._lastActiveView = "";
            this._viewActivated = (sender, eventArgs) => { this.modifyData(eventArgs); };
            this._viewDeactivated = (sender, eventArgs) => { this.deactivateData(eventArgs); };
            this._viewAdded = (sender, eventArgs) => { this.addData(eventArgs); };
            this._viewDeleted = (sender, eventArgs) => { this.deleteData(eventArgs); };
            this.groupTag = groupTag;
        }
        injectViewGroup(viewGroup) {
            this._viewGroup = viewGroup;
            this.attach();
        }
        /**
         * Move the passed view id to the desired index
         *
         * @param {string} viewID
         * @param {number} [toIndex=0]
         * @memberof SortedViewGroup
         */
        moveSingleData(viewID, toIndex = 0) {
            let fromIndex = this._data.findIndex(item => item.viewID === viewID);
            if (fromIndex !== -1 && fromIndex !== toIndex) {
                this._data.splice(toIndex, 0, this._data.splice(fromIndex, 1)[0]);
                this.triggerFlexTabChangedEvent();
            }
        }
        /**
         * Returns the first found active view
         *
         * @return {*}  {(string | undefined)}
         * @memberof SortedViewGroup
         */
        getActiveView() {
            return this._data.find(view => (view.isActive === true));
        }
        dispose() {
            this.detach();
        }
        attach() {
            this._viewGroup.viewActivated.attach(this._viewActivated);
            this._viewGroup.viewDeactivated.attach(this._viewDeactivated);
            this._viewGroup.viewAdded.attach(this._viewAdded);
            this._viewGroup.viewDeleted.attach(this._viewDeleted);
        }
        detach() {
            this._viewGroup.viewActivated.detach(this._viewActivated);
            this._viewGroup.viewDeactivated.detach(this._viewDeactivated);
            this._viewGroup.viewAdded.detach(this._viewAdded);
            this._viewGroup.viewDeleted.detach(this._viewDeleted);
        }
        /**
         * Modifies the passed view in the data by exchanging the data point.
         *
         * @private
         * @param {ViewModelChangeHint} change
         * @param {OpenContentView} contentView
         * @return {boolean} // change applied ?
         * @memberof ViewGroup
         */
        modifyData(contentView) {
            let pos = this._data.findIndex(view => view.viewID === contentView.viewID);
            if (pos !== -1 && this.isOverviewPage(contentView) === false) {
                this._data.splice(pos, 1, contentView);
                this.triggerFlexTabChangedEvent();
            }
        }
        /**
         * Modifies the passed view in the data by exchanging the data point and stores its viewID
         *
         * @private
         * @param {OpenContentView} contentView
         * @memberof SortedViewGroup
         */
        deactivateData(contentView) {
            this.modifyData(contentView);
            this._lastActiveView = contentView.viewID;
        }
        /**
         * Adds the data on the passed position.
         *
         * @private
         * @param {OpenContentView} contentView
         * @param {number} [pos=this._data.length]
         * @return {boolean} // change applied ?
         * @memberof SortedViewGroup
         */
        addData(contentView, pos = this._data.length) {
            if (this._data.includes(contentView) === false && this.isOverviewPage(contentView) === false) {
                this._data.splice(pos, 0, contentView);
                this.triggerFlexTabChangedEvent();
            }
        }
        /**
         * Deletes the passed view from data.
         *
         * @private
         * @param {OpenContentView} contentView
         * @return {boolean} // change applied ?}
         * @memberof SortedViewGroup
         */
        deleteData(contentView) {
            let index = this._data.findIndex(item => item.viewID === contentView.viewID);
            if (index !== -1 && this.isOverviewPage(contentView) === false) {
                let viewToOpen;
                // If the last active view is deleted and no other view is active a default view should be opened
                if (this._data[index].viewID === this._lastActiveView && this._viewGroup.getAllActiveViews().length === 0) {
                    viewToOpen = this.nextViewToOpen(this._data[index]);
                }
                // Delete view
                this._data.splice(index, 1);
                this.triggerFlexTabChangedEvent();
                if (viewToOpen !== undefined) {
                    openViewMainController_1.OpenViewMainController.getInstance().executeOpenViewByID(viewToOpen);
                }
            }
        }
        /**
         * Handling for get the next view to open after deletion of an active one.
         * Behavior:
         * -> Open right view
         * no right -> open left view
         * no right, no left -> open overview
         *
         * @private
         * @param {OpenContentView} view
         * @param {(string | undefined)} viewToOpen
         * @return {*}  {(string | undefined)}
         * @memberof SortedViewGroup
         */
        nextViewToOpen(view) {
            // Check if the view was active
            let index = this._data.findIndex(item => item.viewID === view.viewID);
            let maxIndex = this._data.length - 1;
            let viewToOpen;
            // Be Careful! Changing the order of the conditions changes the behavior drastically 
            // no right, no left -> get overview
            if (maxIndex < 1 || index === -1) {
                viewToOpen = this.getOverviewPage();
            }
            // -> get right view 
            else if (index < maxIndex) {
                viewToOpen = this._data[index + 1].viewID;
            }
            //  no right -> get left view
            else if (index === maxIndex) {
                viewToOpen = this._data[index - 1].viewID;
            }
            return viewToOpen;
        }
        /**
         * Get the overview page from the viewGroup attached to this class if one is available
         *
         * @private
         * @return {*}
         * @memberof SortedViewGroup
         */
        getOverviewPage() {
            let viewToOpen;
            if (this._viewGroup !== undefined) {
                let view = this._viewGroup.getData().find(view => view.groupTags.includes(groupTagProvider_1.GroupTag.overview));
                if (view !== undefined) {
                    viewToOpen = view.viewID;
                }
            }
            return viewToOpen;
        }
        /**
         * Return true if view is an overview, false otherwise
         *
         * @private
         * @param {OpenContentView} view
         * @return {*}  {boolean}
         * @memberof SortedViewGroup
         */
        isOverviewPage(view) {
            return view.groupTags.includes(groupTagProvider_1.GroupTag.overview);
        }
        /**
         * Trigger sorted view change event
         *
         * @private
         * @param {(string | undefined)} viewToOpen
         * @memberof SortedViewGroup
         */
        triggerFlexTabChangedEvent() {
            // Trigger event sends the actual sorted list for this viewGroup
            let eventArgs = new dataModelInterface_1.EventModelChangedArgs(this, dataModelInterface_1.ModelChangeType.updateSource, undefined, this._data);
            this.onModelChanged(this, eventArgs);
        }
    };
    SortedViewGroup = __decorate([
        mco.role()
    ], SortedViewGroup);
    exports.SortedViewGroup = SortedViewGroup;
});
