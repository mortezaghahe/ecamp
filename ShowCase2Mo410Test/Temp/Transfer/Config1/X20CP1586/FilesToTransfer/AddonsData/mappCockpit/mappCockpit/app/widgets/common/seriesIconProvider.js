var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../models/common/series/seriesType", "../../common/componentBase/componentWithoutSettingsBase", "./componentDefaultDefinitionSeriesIconProvider"], function (require, exports, seriesType_1, componentWithoutSettingsBase_1, componentDefaultDefinitionSeriesIconProvider_1) {
    "use strict";
    var SeriesIconProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesIconProvider = void 0;
    let SeriesIconProvider = SeriesIconProvider_1 = class SeriesIconProvider extends componentWithoutSettingsBase_1.ComponentWithoutSettingsBase {
        /**
         * gets a singleton instance of SeriesIconProvider
         *
         * @readonly
         * @type {SeriesIconProvider}
         * @memberof SeriesIconProvider
         */
        static getInstance() {
            this._instance = this._instance ? this._instance : new SeriesIconProvider_1();
            return this._instance;
        }
        initializeComponent() {
            super.initializeComponent();
            this.component.setDefaultDefinition(new componentDefaultDefinitionSeriesIconProvider_1.ComponentDefaultDefinitionSeriesIconProvider());
        }
        initialize() {
            this.component.loadComponentSettings();
        }
        /**
         * Disposes the series icon provider
         *
         * @memberof SeriesIconProvider
         */
        dispose() {
            super.dispose();
        }
        /**
         * Returns html information(e.g img, svg, ...) with the icons for a series(main icon + overlays)
         *
         * @param {BaseSeries} serie
         * @returns {string}
         * @memberof SeriesIconProvider
         */
        getIcon(serie) {
            let iconDefinition = this.getBaseIconDefinition(serie);
            iconDefinition += this.getOverlayIconDefinition(serie);
            return iconDefinition;
        }
        /**
         * Returns html information(e.g img, svg, ...) with the base icons for a series
         *
         * @private
         * @param {BaseSeries} serie
         * @returns {string}
         * @memberof SeriesIconProvider
         */
        getBaseIconDefinition(serie) {
            let iconDefinition = "";
            // Set main icon
            if (serie.type == seriesType_1.SeriesType.timeSeries) {
                iconDefinition += this.getSeriesMainIcon(this.getSvgPath("timeSeries"), serie.color);
            }
            else if (serie.type == seriesType_1.SeriesType.xySeries) {
                iconDefinition += this.getSeriesMainIcon(this.getSvgPath("xySeries"), serie.color);
            }
            else if (serie.type == seriesType_1.SeriesType.fftSeries) {
                iconDefinition += this.getSeriesMainIcon(this.getSvgPath("fftSeries"), serie.color);
            }
            return iconDefinition;
        }
        /**
         *Returns html information(e.g img, svg, ...) with the overlay icons for a series
         *
         * @private
         * @param {BaseSeries} serie
         * @returns {string}
         * @memberof SeriesIconProvider
         */
        getOverlayIconDefinition(serie) {
            let iconDefinition = "";
            if (serie.isCalculated == true) {
                // Set calculation overlay
                //iconDefinition += '<img class="treeGridRowIcon" src="' + SeriesIconProvider.getSvgPath("calculationOverlay") + '" />';
            }
            if (serie.isAutoUpdated == true) {
                // Set auto update overlay 
                iconDefinition += '<img class="treeGridRowIcon" src="' + this.getSvgPath("autoUpdatedOverlay") + '" />';
            }
            if (serie.rawPointsValid == false) {
                //Set exclamation overlay for invalid series
                let tooltipText = "The data is invalid!"; // Default tooltiptext in case of invalid data
                let errorText = serie.getErrorText();
                if (errorText != "") {
                    tooltipText = errorText; // Use error info text for tooltip text
                }
                iconDefinition += `<img title="` + tooltipText + `" class="treeGridRowIcon" src="` + this.getSvgPath("exclamationOverlay") + `" />`;
            }
            return iconDefinition;
        }
        /**
         * Get filepath for svg
         *
         * @param {string} svgName
         * @returns {string}
         * @memberof SeriesIconProvider
         */
        getSvgPath(svgName) {
            return "../app/widgets/common/style/images/tree/" + svgName + ".svg";
        }
        /**
         * Get the main series icon (e.g. timeSeries, xySeries, fftSeries, ...)
         *
         * @private
         * @param {string} type
         * @param {string} color
         * @returns {string}
         * @memberof SeriesIconProvider
         */
        getSeriesMainIcon(path, color) {
            let imageProvider = this.component.getSubComponent(componentDefaultDefinitionSeriesIconProvider_1.ComponentDefaultDefinitionSeriesIconProvider.ImageProviderId);
            if (imageProvider != undefined) {
                let imageData = imageProvider.getImage(path);
                if (imageData != undefined) {
                    return imageData.replace("stroke:#76bea6", "stroke:" + color);
                }
            }
            return "";
        }
    };
    SeriesIconProvider = SeriesIconProvider_1 = __decorate([
        mco.role()
    ], SeriesIconProvider);
    exports.SeriesIconProvider = SeriesIconProvider;
});
