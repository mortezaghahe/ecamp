var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../models/chartManagerDataModel/chartManagerChart", "../../../models/chartManagerDataModel/chartManagerChart", "../../../models/chartManagerDataModel/scale", "../../common/dropDownMenuBase"], function (require, exports, chartManagerChart_1, chartManagerChart_2, scale_1, dropDownMenuBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChartManagerTreeGridDropDownMenu = void 0;
    let ChartManagerTreeGridDropDownMenu = class ChartManagerTreeGridDropDownMenu extends dropDownMenuBase_1.dropDownMenuBase {
        constructor(dataModel, widgetDiv) {
            super(widgetDiv, "Add");
            this._width = '130px';
            this._leftPosition = '1px';
            this.dataModel = dataModel;
            this.buttonsId = ["YTChart_Choose_Btn_DropDownMenu", "XYChart_Choose_Btn_DropDownMenu", "FFTChart_Choose_Btn_DropDownMenu",
                "YTAxis_Choose_Btn_DropDownMenu"];
            this.ytChartDropDownMenu = this.buttonsId[0];
            this.xyChartDropDownMenu = this.buttonsId[1];
            this.fftChartDropDownMenu = this.buttonsId[2];
            this.axisChartDropDownMenu = this.buttonsId[3];
        }
        /**
         * Updates the chartmanager datamodel
         *
         * @param {IChartManagerDataModel} dataModel
         * @memberof ChartManagerTreeGridDropDownMenu
         */
        updateDataModel(dataModel) {
            this.dataModel = dataModel;
        }
        /**
         * Show dropdown menu
         *
         * @param {(IChartManagerChart | undefined)} selectedChart
         * @memberof ChartManagerTreeGridDropDownMenu
         */
        showDropDownMenu(selectedChart) {
            let axisAvailable;
            let canAddChart = this.dataModel.canAddChart();
            if (selectedChart !== undefined && selectedChart.canAddYAxis()) {
                axisAvailable = true;
            }
            else {
                axisAvailable = false;
            }
            this.createDropDownMenu(this._width, this._leftPosition, this.buttonsId);
            this.createButton(this.ytChartDropDownMenu, "Add YT Chart", canAddChart, undefined);
            this.createButton(this.xyChartDropDownMenu, "Add XY Chart", canAddChart, undefined);
            this.createButton(this.fftChartDropDownMenu, "Add FFT Chart", canAddChart, undefined);
            this.createButton(this.axisChartDropDownMenu, "Add scale to chart", axisAvailable, selectedChart);
            this.isOpened = true;
        }
        /**
         * Create syncf button
         *
         * @private
         * @param {string} id
         * @param {string} text
         * @param {boolean} enabled
         * @param {(IChartManagerChart | undefined)} chart
         * @memberof ChartManagerTreeGridDropDownMenu
         */
        createButton(id, text, enabled, chart) {
            $('#' + id).ejButton({
                text: text,
                contentType: ej.ContentType.TextOnly,
                cssClass: "dropDownMenu",
                prefixIcon: "e-icon",
                enabled: enabled,
                click: (args) => {
                    switch (id) {
                        case this.ytChartDropDownMenu:
                            this.addChart(chartManagerChart_2.ChartType.YTChart);
                            break;
                        case this.xyChartDropDownMenu:
                            this.addChart(chartManagerChart_2.ChartType.XYChart);
                            break;
                        case this.fftChartDropDownMenu:
                            this.addChart(chartManagerChart_2.ChartType.FFTChart);
                            break;
                        case this.axisChartDropDownMenu:
                            this.addANewYAxisToChart(chart);
                            break;
                    }
                    this.hideDropDownMenu();
                }
            });
        }
        /**
         * Add an empty chart
         *
         * @private
         * @param {ChartType} type
         * @memberof ChartManagerTreeGridDropDownMenu
         */
        addChart(type) {
            var newChart = new chartManagerChart_1.ChartManagerChart(this.dataModel.getUniqueChartName(), type);
            newChart.addDefaultYScale(this.dataModel);
            this.dataModel.addChart(newChart, 0);
        }
        /**
         * Add a new y axis to a chart
         *
         * @private
         * @param {IChartManagerChart} selectedChart
         * @memberof ChartManagerTreeGridDropDownMenu
         */
        addANewYAxisToChart(selectedChart) {
            let yAxis = new scale_1.Scale(selectedChart.getNextYAxisId(), selectedChart);
            selectedChart.addYScale(yAxis);
            this.dataModel.addYScale(selectedChart, yAxis);
        }
    };
    ChartManagerTreeGridDropDownMenu = __decorate([
        mco.role()
    ], ChartManagerTreeGridDropDownMenu);
    exports.ChartManagerTreeGridDropDownMenu = ChartManagerTreeGridDropDownMenu;
});
