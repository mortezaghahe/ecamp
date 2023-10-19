var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./componentDefaultDefinition", "../common/treeGridWidgetBase"], function (require, exports, componentDefaultDefinition_1, treeGridWidgetBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DummyWidget = void 0;
    /*
    import { FileReader } from "../../common/utilities/binFileReader";
    import * as KaitaiStream from "../../libs/dataparsing/kaitai-struct/kaitaiStream";
    import * as NwctBinParser from "../../libs/dataparsing/NwctBinParser";*/
    /**
     * implements the dummy widget
     *
     * @class DummyWidget
     * @extends {WidgetBase}
     */
    let DummyWidget = class DummyWidget extends treeGridWidgetBase_1.TreeGridWidgetBase {
        constructor() {
            super(...arguments);
            // Event handlers
            this._contentActivatedHandler = (sender, args) => this.onLayoutContentActivated(sender, args);
            /**
             * resizes the trace configuration widget
             *
             * @param {number} width
             * @param {number} height
             * @memberof TraceConfigurationWidget
             */
            /*resize(width: number, height: number){
                this._actualWidth = width;
                this._actualHeight = height;
                
                if(this._layoutWidget != undefined){
                    this._layoutWidget!.resize(width, height);
                }
            }*/
            /**
             * Creates the widget content and eventually subwidgets
             *
             * @param {string} layoutContainerId
             * @memberof DummyWidget
             */
            /*createLayout() {
                this.createDummyData();
            }
        
            resize(width: number, height: number){
        
                this._mainDiv[0].style.width = width.toString() + "px";
                this._mainDiv[0].style.height = height.toString() + "px";
            }
        
            private createDummyData() {
        
                this._mainDiv.append("Dummy widget");
                this._mainDiv[0].style.background = ColorHelper.getColor();
                this._mainDiv[0].style.overflow = "hidden";
            }*/
        }
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        /**
         * Sets the widget content and eventually subwidgets
         *
         * @memberof DummyWidget
         */
        initialized() {
            super.initialized();
            this.getNwctData();
            /*
            this._layoutWidget = this.component.getSubComponent(ComponentDefaultDefinition.mainWidgetId);
    
            this._layoutWidget!.initialize("");
            this._layoutWidget!.eventWidgetActivated.attach(this._contentActivatedHandler);
            this._layoutWidget.addToParentContainer(this.mainDiv);*/
        }
        getNwctData() {
            return new Array();
        }
        /**
         * Disposes the dummy widget
         *
         * @returns {*}
         * @memberof DummyWidget
         */
        dispose() {
            /* this._layoutWidget!.eventWidgetActivated.detach(this._contentActivatedHandler);
             this._layoutWidget!.dispose();*/
            super.dispose();
        }
        getDataSource() {
            let dataSource = new Array();
            let data = this.getNwctData();
            data.dataRecords.forEach(dataRecord => {
                let ncObjectType = "";
                let channelIndex = "";
                if (dataRecord.ncObjectType == 1) {
                    ncObjectType = "ncAXIS";
                    channelIndex = (dataRecord.channelIndex + 1);
                }
                else if (dataRecord.ncObjectType == 3) {
                    ncObjectType = "ncMODULE";
                    channelIndex = (dataRecord.channelIndex + 1);
                }
                let nodeNumber = "";
                let networkType = "";
                data.configRecord.forEach(configRecord => {
                    if (configRecord.configurationRecordId == dataRecord.configRecordId) {
                        nodeNumber = configRecord.nodeNumberOfDrive;
                        if (configRecord.networkType == 254) {
                            networkType = "NCMAN";
                            nodeNumber = "";
                        }
                        else if (configRecord.networkType == 1) {
                            networkType = "PLK[0]";
                        }
                        else {
                            networkType = configRecord.networkType;
                        }
                    }
                });
                let parDatValue = "";
                if (dataRecord.acoposParameterData != undefined && dataRecord.acoposParameterData.parDat.value != undefined) {
                    parDatValue = " = " + dataRecord.acoposParameterData.parDat.value;
                }
                let type = "req";
                let record = this.getRecord(dataRecord.index, networkType, nodeNumber, ncObjectType + " " + channelIndex, dataRecord.acoposParameterData.parId + parDatValue, dataRecord.timeInSeconds, type);
                dataSource.push(record);
            });
            return dataSource;
        }
        getRecord(index, interfaceName, node, ncObject, description, time, type) {
            if (type == "res") {
                return { resIndex: index, interface: interfaceName, node: node, ncObject: ncObject, res: description, resTime: time };
            }
            else {
                return { reqIndex: index, interface: interfaceName, node: node, ncObject: ncObject, req: description, reqTime: time };
            }
        }
        createTreeGrid() {
            var dataSource = this.getDataSource();
            $(this.mainDiv).ejTreeGrid(Object.assign(Object.assign({}, this.getTreeGridColumnDefinition()), { dataSource: dataSource, editSettings: { allowDeleting: false } }));
        }
        getTreeGridColumnDefinition() {
            return {
                columns: [
                    { field: "reqIndex", headerText: "Index", width: "40" },
                    { field: "interface", headerText: "Interface", width: "40" },
                    { field: "node", headerText: "Node", width: "40" },
                    { field: "ncObject", headerText: "NC Object", width: "100" },
                    { field: "req", headerText: "Request", width: "200" },
                    { field: "reqTime", headerText: "Time [s]", width: "100" },
                    { field: "resTime", headerText: "Time [s]", width: "100" },
                    { field: "res", headerText: "Response", width: "200" },
                    { field: "resIndex", headerText: "Index", width: "100" },
                ],
            };
        }
        /**
         * Raised after a layout content was activated
         *
         * @private
         * @param {*} sender
         * @param {*} args
         * @memberof DummyWidget
         */
        onLayoutContentActivated(sender, args) {
            args.widget.activate();
            this.resize(this._actualWidth, this._actualHeight);
        }
    };
    DummyWidget = __decorate([
        mco.role()
    ], DummyWidget);
    exports.DummyWidget = DummyWidget;
});
