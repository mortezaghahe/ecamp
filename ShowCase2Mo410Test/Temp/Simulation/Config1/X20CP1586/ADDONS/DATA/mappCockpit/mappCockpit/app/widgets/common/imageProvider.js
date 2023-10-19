var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../common/componentBase/componentWithoutSettingsBase"], function (require, exports, componentWithoutSettingsBase_1) {
    "use strict";
    var ImageProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageProvider = void 0;
    /**
     * Image provider to preload some image(the data of the images e.g. <svg ..... />)
     *
     * @export
     * @class ImageProvider
     */
    let ImageProvider = ImageProvider_1 = class ImageProvider extends componentWithoutSettingsBase_1.ComponentWithoutSettingsBase {
        /**
         * gets a singleton instance of ImageProvider
         *
         * @readonly
         * @type {ImageProvider}
         * @memberof ImageProvider
         */
        static getInstance() {
            this._instance = this._instance ? this._instance : new ImageProvider_1();
            return this._instance;
        }
        /**
         * Returns the data of an image for the given path(e.g ../app/widgets/common/style/images/tree/timeSeries.svg) or "" if not defined
         *
         * @param {*} imagePath
         * @returns {string}
         * @memberof ImageProvider
         */
        getImage(imagePath) {
            if (this.imageDatas.has(imagePath)) {
                let imageData = this.imageDatas.get(imagePath);
                if (imageData == undefined) {
                    return "";
                }
                return imageData;
            }
            return "";
        }
        /**
         * Creates an instance of ImageProvider
         * @memberof ImageProvider
         */
        constructor() {
            super();
            this.imageDatas = new Map();
            // Preload images at the initialization 
            // Startpage image
            this.loadSvg("../app/widgets/startPageWidget/style/images/mappCockpitLogo.svg");
            // Images for common topics
            this.loadSvg("../app/widgets/common/style/images/disconnected.svg");
            this.loadSvg("../app/widgets/common/style/images/busy.svg");
            // Images for tree grids
            this.loadSvg("../app/widgets/common/style/images/tree/timeSeries.svg");
            this.loadSvg("../app/widgets/common/style/images/tree/xySeries.svg");
            this.loadSvg("../app/widgets/common/style/images/tree/fftSeries.svg");
            // Images for signal manager drag drop
            this.loadSvg("../app/widgets/common/style/images/dragDrop/dropNotPossible.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/ytSeries.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/xySeries.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/fftSeries.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/addNewScale.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/assignToScale.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/addNewXYChart.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/addNewYTChart.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/addNewFFTChart.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/assignToChart.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/severalYTSeries.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/severalXYSeries.svg");
            this.loadSvg("../app/widgets/common/style/images/dragDrop/severalFFTSeries.svg");
            //quick commands
            this.loadSvg("../app/widgets/methodListWidget/style/images/toolbar/On.svg");
            this.loadSvg("../app/widgets/methodListWidget/style/images/toolbar/Off.svg");
            this.loadSvg("../app/widgets/methodListWidget/style/images/toolbar/Stop.svg");
            this.loadSvg("../app/widgets/methodListWidget/style/images/toolbar/Reset.svg");
        }
        /**
         * Disposes the image provider
         *
         * @memberof ImageProvider
         */
        dispose() {
            super.dispose();
        }
        /**
         * Resets all the data
         *
         * @memberof ImageProvider
         */
        clear() {
            // TODO: Must be implemented if needed
        }
        /**
         * Starts loading of a svg file from server.
         *
         * @private
         * @param {string} svgId
         * @memberof ImageProvider
         */
        loadSvg(svgPath) {
            try {
                $.get(svgPath, (svgData) => { this.onSvgLoaded(svgPath, svgData); });
            }
            catch (_a) {
                // Error while loading an svg image
            }
        }
        /**
         * Called after the svg file have been loaded
         *
         * @private
         * @param {string} svgPath
         * @param {*} svgData
         * @memberof ImageProvider
         */
        onSvgLoaded(svgPath, svgData) {
            this.imageDatas.set(svgPath, svgData.documentElement.outerHTML);
        }
    };
    ImageProvider = ImageProvider_1 = __decorate([
        mco.role()
    ], ImageProvider);
    exports.ImageProvider = ImageProvider;
});
