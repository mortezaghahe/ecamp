var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GroupTagProvider = exports.GroupTag = void 0;
    var GroupTag;
    (function (GroupTag) {
        GroupTag["startPage"] = "startpage";
        GroupTag["component"] = "component";
        GroupTag["trace"] = "trace";
        GroupTag["tools"] = "tools";
        GroupTag["login"] = "login";
        GroupTag["global"] = "global";
        GroupTag["overview"] = "overview";
        GroupTag["defaultView"] = "defaultView";
    })(GroupTag = exports.GroupTag || (exports.GroupTag = {}));
    let GroupTagProvider = class GroupTagProvider {
        constructor() { }
        static createGroupTags(describedArea, isOverview = false, isDefaultView = false, isGlobal = true, additionalTags = []) {
            let groupTags = [describedArea];
            if (isOverview === true) {
                groupTags.push(GroupTag.overview);
            }
            if (isDefaultView === true) {
                groupTags.push(GroupTag.defaultView);
            }
            if (isGlobal === true) {
                groupTags.push(GroupTag.global);
            }
            return groupTags.concat(additionalTags);
        }
        static getMainGroupTag(groupTags) {
            return groupTags[0];
        }
        static getImageClassForGroupTag(groupTag, isActive = false) {
            let cssImageClassName = "Icon-" + groupTag;
            if (isActive === true) {
                cssImageClassName += "-Active";
            }
            return cssImageClassName;
        }
    };
    GroupTagProvider = __decorate([
        mco.role()
    ], GroupTagProvider);
    exports.GroupTagProvider = GroupTagProvider;
});
