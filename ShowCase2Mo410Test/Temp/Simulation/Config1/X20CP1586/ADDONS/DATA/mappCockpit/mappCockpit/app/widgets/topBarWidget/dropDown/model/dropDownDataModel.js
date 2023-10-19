var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../../controller/openViewManagement/controller/viewGroupController", "../../../../framework/events", "./dropDownItem"], function (require, exports, viewGroupController_1, events_1, dropDownItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DropDownDataModel = exports.EventOnDropDownDataChanged = exports.EventShowDropDown = exports.EventHideDropDown = void 0;
    let EventHideDropDown = class EventHideDropDown extends events_1.TypedEvent {
    };
    EventHideDropDown = __decorate([
        mco.role()
    ], EventHideDropDown);
    exports.EventHideDropDown = EventHideDropDown;
    ;
    let EventShowDropDown = class EventShowDropDown extends events_1.TypedEvent {
    };
    EventShowDropDown = __decorate([
        mco.role()
    ], EventShowDropDown);
    exports.EventShowDropDown = EventShowDropDown;
    ;
    let EventOnDropDownDataChanged = class EventOnDropDownDataChanged extends events_1.TypedEvent {
    };
    EventOnDropDownDataChanged = __decorate([
        mco.role()
    ], EventOnDropDownDataChanged);
    exports.EventOnDropDownDataChanged = EventOnDropDownDataChanged;
    ;
    let DropDownDataModel = class DropDownDataModel {
        /**
         * Initialize the dataModel for DropDown
         * Needs to be called before the creation of ejDropDownList
         *
         * @param {string} groupTag
         * @memberof DropDownDataModel
         */
        constructor(groupTag, dropDownItemDeleteButtonId) {
            this._isVisible = false;
            this.hideDropDown = new EventHideDropDown();
            this.showDropDown = new EventShowDropDown();
            this.onDropDownDataChanged = new EventOnDropDownDataChanged();
            this._contentChanged = (sender, eventArgs) => { this.updateDropDownData(eventArgs); };
            this._groupTag = groupTag;
            this._dropDownItemDeleteButtonId = dropDownItemDeleteButtonId;
            this._data = [];
            this._sortedViewGroups = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupSubControllerByGroupTag(groupTag);
            this.attach();
            this.setHideDropDown();
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
        }
        dispose() {
            this.detach();
            this._data.length = 0;
        }
        attach() {
            if (this._sortedViewGroups !== undefined) {
                this._sortedViewGroups.eventModelChanged.attach(this._contentChanged);
            }
        }
        detach() {
            if (this._sortedViewGroups !== undefined) {
                this._sortedViewGroups.eventModelChanged.detach(this._contentChanged);
            }
        }
        /**
         * Receives events from sortedViewGroup
         * -> Throw away old data
         * -> Set changed data received from event
         * -> Set visibility
         *
         * @private
         * @param {*} eventArgs
         * @memberof DropDownDataModel
         */
        updateDropDownData(eventArgs) {
            let items = eventArgs.data;
            // Empty the array
            this._data.length = 0;
            items.forEach(item => {
                this._data.push(new dropDownItem_1.DropDownItem(item.viewID, item.viewName, item.viewType, item.isActive, this._dropDownItemDeleteButtonId));
            });
            if (this._data.length === 0 && this._isVisible === true) {
                this.setHideDropDown();
            }
            else if (this._data.length !== 0 && this._isVisible === false) {
                this.setShowDropDown();
            }
            this.onDropDownDataChanged.raise(this, this._data);
        }
        setHideDropDown() {
            this._isVisible = false;
            this.hideDropDown.raise(this, undefined);
        }
        setShowDropDown() {
            this._isVisible = true;
            this.showDropDown.raise(this, undefined);
        }
    };
    DropDownDataModel = __decorate([
        mco.role()
    ], DropDownDataModel);
    exports.DropDownDataModel = DropDownDataModel;
});
