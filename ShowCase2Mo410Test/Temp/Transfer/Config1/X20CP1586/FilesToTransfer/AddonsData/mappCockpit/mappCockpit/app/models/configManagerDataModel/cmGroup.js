var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./cmParameter"], function (require, exports, cmParameter_1) {
    "use strict";
    var CmGroup_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CmGroup = void 0;
    let CmGroup = CmGroup_1 = class CmGroup extends cmParameter_1.CmParameter {
        /**
         * Creates an instance of CmGroup
         * @param {IMetaDataGroup} groupMetaData
         * @param {Array<MappCockpitComponentParameter>} componentParameters
         * @param {boolean} editModeActive
         * @memberof CmGroup
         */
        constructor(groupMetaData, componentParameters, editModeActive) {
            super(groupMetaData, componentParameters, editModeActive);
            var childConfigurationData = new Array();
            if (groupMetaData != null) {
                if (groupMetaData.Childs != null) {
                    groupMetaData.Childs.forEach(childElement => {
                        if (childElement.Group != null) {
                            childConfigurationData.push(new CmGroup_1(childElement.Group, componentParameters, editModeActive));
                        }
                        else {
                            childConfigurationData.push(new cmParameter_1.CmParameter(childElement.Parameter, componentParameters, editModeActive));
                        }
                    });
                }
            }
            this.childs = childConfigurationData;
        }
    };
    CmGroup = CmGroup_1 = __decorate([
        mco.role()
    ], CmGroup);
    exports.CmGroup = CmGroup;
});
