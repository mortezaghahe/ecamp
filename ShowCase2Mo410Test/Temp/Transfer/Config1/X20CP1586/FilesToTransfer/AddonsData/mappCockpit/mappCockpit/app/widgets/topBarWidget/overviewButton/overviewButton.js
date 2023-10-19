var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../controller/openViewManagement/controller/openViewMainController", "../../../controller/openViewManagement/controller/viewGroupController", "../../common/groupTagProvider", "../topBarDOMManipulator"], function (require, exports, openViewMainController_1, viewGroupController_1, groupTagProvider_1, topBarDOMManipulator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OverviewButton = void 0;
    let OverviewButton = class OverviewButton {
        constructor(groupTag, divID) {
            this._buttonImg = "OverviewButtonImg";
            this._buttonTheme = "OverviewButtonTheme";
            this._activeClass = "TabIsActive";
            this._deactiveClass = "TabIsDeactive";
            this._viewAdded = (sender, eventArgs) => { this.setOverviewButtonID(eventArgs); };
            this._viewActivated = (sender, eventArgs) => { this.setButtonActivated(eventArgs); };
            this._viewDeactivated = (sender, eventArgs) => { this.setButtonDeactivated(eventArgs); };
            this.groupTag = groupTag;
            this._divID = divID;
            this._viewGroup = viewGroupController_1.ViewGroupController.getInstance().getAttacherViewGroupByGroupTag(groupTag);
            this.attach();
            this.createButton();
        }
        dispose() {
            this.detach();
        }
        attach() {
            if (this._viewGroup !== undefined) {
                this._viewGroup.viewAdded.attach(this._viewAdded);
                this._viewGroup.viewActivated.attach(this._viewActivated);
                this._viewGroup.viewDeactivated.attach(this._viewDeactivated);
            }
        }
        detach() {
            if (this._viewGroup !== undefined) {
                this._viewGroup.viewAdded.detach(this._viewAdded);
                this._viewGroup.viewActivated.detach(this._viewActivated);
                this._viewGroup.viewDeactivated.detach(this._viewDeactivated);
            }
        }
        /**
         * Creates an overview button
         *
         * @private
         * @memberof OverviewButton
         */
        createButton() {
            $("#" + this._divID).ejButton({
                contentType: ej.ContentType.ImageOnly,
                prefixIcon: "e-icon " + this._buttonImg + " Icon-28",
                cssClass: this._buttonTheme + " " + this._activeClass,
                click: (args) => this.onOverviewButtonClicked(args)
            });
        }
        /**
         * When the overview button is clicked, the last stored viewID is opened
         *
         * @private
         * @param {ej.Button.ClickEventArgs} args
         * @memberof OverviewButton
         */
        onOverviewButtonClicked(args) {
            args.cancel = true;
            if (this._viewID !== undefined) {
                openViewMainController_1.OpenViewMainController.getInstance().executeOpenViewByID(this._viewID);
            }
        }
        /**
         * If the view that is added is an overview set the viewID for the button
         *
         * @private
         * @param {OpenContentView} view
         * @memberof OverviewButton
         */
        setOverviewButtonID(view) {
            if (view.groupTags.includes(groupTagProvider_1.GroupTag.overview) === true) {
                this._viewID = view.viewID;
            }
        }
        /**
         * If the overview page of its viewGroup is deActive set the button deActive
         *
         * @private
         * @param {OpenContentView} view
         * @memberof OverviewButton
         */
        setButtonDeactivated(view) {
            if (view.groupTags.includes(groupTagProvider_1.GroupTag.overview) === true) {
                topBarDOMManipulator_1.TopBarDOMManipulator.removeClassAtID(this._divID, this._activeClass);
                topBarDOMManipulator_1.TopBarDOMManipulator.addClassAtID(this._divID, this._deactiveClass);
            }
        }
        /**
         * If the overview page of its viewGroup is active set the button active
         *
         * @private
         * @param {OpenContentView} view
         * @memberof OverviewButton
         */
        setButtonActivated(view) {
            if (view.groupTags.includes(groupTagProvider_1.GroupTag.overview) === true) {
                topBarDOMManipulator_1.TopBarDOMManipulator.removeClassAtID(this._divID, this._deactiveClass);
                topBarDOMManipulator_1.TopBarDOMManipulator.addClassAtID(this._divID, this._activeClass);
            }
        }
    };
    OverviewButton = __decorate([
        mco.role()
    ], OverviewButton);
    exports.OverviewButton = OverviewButton;
});
