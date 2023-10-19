var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./sortedViewGroup", "../models/viewGroup", "../../../widgets/common/groupTagProvider"], function (require, exports, sortedViewGroup_1, viewGroup_1, groupTagProvider_1) {
    "use strict";
    var ViewGroupController_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ViewGroupController = void 0;
    /**
     * Controller that maps ViewGroups to its sub controllers, which can be accessed by groupTag
     *
     * @export
     * @class ViewGroupController
     * @implements {IViewGroupController}
     */
    let ViewGroupController = ViewGroupController_1 = class ViewGroupController {
        // singleton
        constructor() {
            this._viewGroups = new Array();
            this._viewGroupSubControllers = this.initializeSubControllers();
        }
        static getInstance() {
            if (this._instance === undefined) {
                this._instance = new ViewGroupController_1();
            }
            return this._instance;
        }
        /**
         * Currently all ViewGroups are initialized at start hardcoded due to timing problems
         * TODO:Eliminate with Binding
         *
         * @param {IOpenContentViewDataModel} openContentViewDataModel
         * @param {string[]} [groupTags=[GroupTag.global, GroupTag.overview, GroupTag.startPage, GroupTag.component, GroupTag.trace, GroupTag.tools, GroupTag.login]]
         * @memberof ViewGroupController
         */
        initializeViewGroups(openContentViewDataModel, groupTags = [groupTagProvider_1.GroupTag.global, groupTagProvider_1.GroupTag.overview, groupTagProvider_1.GroupTag.startPage, groupTagProvider_1.GroupTag.component, groupTagProvider_1.GroupTag.trace, groupTagProvider_1.GroupTag.tools, groupTagProvider_1.GroupTag.login]) {
            groupTags.forEach(groupTag => this.createViewGroup(groupTag, openContentViewDataModel));
        }
        initializeSubControllers() {
            let subControllers = new Array();
            subControllers.push(new sortedViewGroup_1.SortedViewGroup(groupTagProvider_1.GroupTag.component));
            subControllers.push(new sortedViewGroup_1.SortedViewGroup(groupTagProvider_1.GroupTag.trace));
            subControllers.push(new sortedViewGroup_1.SortedViewGroup(groupTagProvider_1.GroupTag.tools));
            return subControllers;
        }
        dispose() {
            this._viewGroups.forEach(viewGroup => viewGroup.dispose());
            this._viewGroupSubControllers.forEach(subController => subController.dispose());
        }
        /**
         * TODO: Replace by binding
         * Currently not more controller than one per ViewGroup exist, thats why the first controller found directly is returned
         *
         * @param {string} groupTag
         * @return {*}  {(IViewGroupSubController | undefined)}
         * @memberof ViewGroupController
         */
        getAttacherViewGroupSubControllerByGroupTag(groupTag) {
            return this._viewGroupSubControllers.find(controller => controller.groupTag === groupTag);
        }
        /**
         * TODO: Replace by binding
         *
         * @param {string} groupTag
         * @return {*}  {(IViewGroup | undefined)}
         * @memberof ViewGroupController
         */
        getAttacherViewGroupByGroupTag(groupTag) {
            return this._viewGroups.find(viewGroup => viewGroup.groupTag === groupTag);
        }
        /**
         * If a new view is added this function needs to be called
         * If it contains a groupTag for which no ViewGroup exist, it gets created.
         *
         * @param {OpenContentView} contentView
         * @param {IOpenContentViewDataModel} openContentViewDataModel
         * @memberof ViewGroupController
         */
        createMissingViewGroups(contentView, openContentViewDataModel) {
            // check if a new content view is added
            contentView.groupTags.forEach(groupTag => {
                // Check if there is already a viewGroup with the same groupTag
                if (this._viewGroups.some(viewGroup => viewGroup.groupTag === groupTag) === false) {
                    // If not then create the view inject to corresponding controller if there is one
                    this.createViewGroup(groupTag, openContentViewDataModel);
                }
            });
        }
        /**
         * Creates a ViewGroup for the passed groupTag and inject the ViewGroup to its subControllers
         *
         * @private
         * @param {*} groupTag
         * @param {IOpenContentViewDataModel} openContentViewDataModel
         * @memberof ViewGroupController
         */
        createViewGroup(groupTag, openContentViewDataModel) {
            let viewGroup = new viewGroup_1.ViewGroup(groupTag, openContentViewDataModel);
            // TODO: Replace by binding?
            this._viewGroupSubControllers.forEach(controller => {
                if (groupTag === controller.groupTag) {
                    controller.injectViewGroup(viewGroup);
                }
            });
            this._viewGroups.push(viewGroup);
        }
    };
    ViewGroupController = ViewGroupController_1 = __decorate([
        mco.role()
    ], ViewGroupController);
    exports.ViewGroupController = ViewGroupController;
});
