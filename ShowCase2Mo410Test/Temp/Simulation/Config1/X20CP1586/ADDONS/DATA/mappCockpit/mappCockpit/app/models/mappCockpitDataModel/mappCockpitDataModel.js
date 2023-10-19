var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../models/dataModelBase", "../../models/online/componentsDataModel"], function (require, exports, dataModelBase_1, componentsDataModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitDataModel = void 0;
    /**
     * implements the data model for the mappCockpit
     *
     * @class MappCockpitDataModel
     * @extends {DataModelBase}
     * @implements {IMappCockpitDataModel}
     */
    let MappCockpitDataModel = class MappCockpitDataModel extends dataModelBase_1.DataModelBase {
        get mappCockpitComponentDataModel() { return this.dataSource; }
        ;
        /**
         * initializes the data model
         *
         * @memberof MappCockpitDataModel
         */
        initialize() {
            // the main data models data source is the mapp cockpit component data model
            let mappCockpitComponentDataModel = new componentsDataModel_1.MappCockpitComponentDataModel();
            this.dataSource = mappCockpitComponentDataModel;
            mappCockpitComponentDataModel.initialize();
            super.initialize();
        }
        /**
         * initializes the data model component
         *
         * @memberof MappCockpitDataModel
         */
        initializeComponent() {
            this.component.disablePersisting();
        }
        /**
         * Dispose the MappCockpitDataModel
         *
         * @memberof MappCockpitDataModel
         */
        dispose() {
            this.mappCockpitComponentDataModel.dispose();
            super.dispose();
        }
        /**
         * updates the data model
         *
         * @memberof MappCockpitDataModel
         */
        connect() {
            super.connect();
            this.mappCockpitComponentDataModel.connect();
        }
    };
    MappCockpitDataModel = __decorate([
        mco.role()
    ], MappCockpitDataModel);
    exports.MappCockpitDataModel = MappCockpitDataModel;
});
