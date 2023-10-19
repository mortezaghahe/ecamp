var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./busyInformation", "./componentDefaultDefinitionCommonLayoutProvider", "../../common/componentBase/componentWithoutSettingsBase"], function (require, exports, busyInformation_1, componentDefaultDefinitionCommonLayoutProvider_1, componentWithoutSettingsBase_1) {
    "use strict";
    var CommonLayoutProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommonLayoutProvider = void 0;
    let CommonLayoutProvider = CommonLayoutProvider_1 = class CommonLayoutProvider extends componentWithoutSettingsBase_1.ComponentWithoutSettingsBase {
        /**
         * Initialize this component
         *
         * @memberof CommonLayoutProvider
         */
        initializeComponent() {
            super.initializeComponent();
            this.component.setDefaultDefinition(new componentDefaultDefinitionCommonLayoutProvider_1.ComponentDefaultDefinitionCommonLayoutProvider());
        }
        /**
         * Initialize thhis instance
         *
         * @memberof CommonLayoutProvider
         */
        initialize() {
            this.component.loadComponentSettings();
        }
        /**
         * gets a singleton instance of CommonLayoutProvider
         *
         * @static
         * @returns
         * @memberof CommonLayoutProvider
         */
        static getInstance() {
            if (!CommonLayoutProvider_1.instance) {
                CommonLayoutProvider_1.instance = new CommonLayoutProvider_1();
                // ... any one time initialization goes here ...
            }
            return CommonLayoutProvider_1.instance;
        }
        /**
         * Disposes the CommonLayoutProvider
         *
         * @memberof CommonLayoutProvider
         */
        dispose() {
            super.dispose();
        }
        /**
         * Returns the busy screen representation for the given busy information
         *
         * @param {string} containerId
         * @param {BusyInformation} busyInformation
         * @returns {string}
         * @memberof CommonLayoutProvider
         */
        getBusyScreenLayout(containerId, busyInformation, mainDiv) {
            let innerHtmlTextWithMessage = "";
            if (busyInformation.message != "") {
                innerHtmlTextWithMessage = `<div id="` + containerId + `_message" style='margin:auto; color: white; font-family: var(--main-font); font-size: 22px'>` + busyInformation.message + `</div>`;
                if (busyInformation.rowOrientation == true) {
                    innerHtmlTextWithMessage += "</br>";
                }
                else {
                    innerHtmlTextWithMessage += "&nbsp;&nbsp;&nbsp;&nbsp;";
                }
            }
            let orientation = "flex-direction: row;";
            if (busyInformation.rowOrientation) {
                orientation = "flex-direction: column;";
            }
            var offsetLeft = "0px";
            var offsetTop = "0px";
            var height = "100%";
            var width = "100%";
            if (mainDiv != undefined) {
                height = mainDiv.clientHeight + "px";
                width = mainDiv.clientWidth + "px";
                offsetLeft = mainDiv.offsetLeft + "px";
                offsetTop = mainDiv.offsetTop + "px";
            }
            let html = `
            <div id="` + containerId + `" class="busyPage" 
                style='display:flex; position:absolute; width: ` + width + `; height: ` + height + `; top: ` + offsetTop + `; left: ` + offsetLeft + `; background-color: rgba(0,0,0,0.7); z-index: 99; '>
                <div style="margin:auto; display:flex; ` + orientation + `">`
                + innerHtmlTextWithMessage +
                `<div id="` + containerId + `_image" style='margin:auto;'>` + this.getImage(busyInformation.imageId, busyInformation.imageSize) + `</div>
                </div>
            </div>`;
            return html;
        }
        changeBusyMessage(containerId, newText) {
            let divId = containerId + "_message";
            let div = $("#" + divId);
            div[0].innerText = newText;
        }
        /**
         * Returns the image for the given id with the given imageSize
         *
         * @private
         * @param {ImageId} imageId
         * @param {number} imageSize
         * @returns {string}
         * @memberof CommonLayoutProvider
         */
        getImage(imageId, imageSize) {
            if (imageId == busyInformation_1.ImageId.defaultImage) {
                return this.getDefaultImage(imageSize);
            }
            else if (imageId == busyInformation_1.ImageId.disconnectedImage) {
                return this.getDisconnectedImage();
            }
            return "";
        }
        /**
         * Returns the disconnected image
         *
         * @private
         * @returns {string}
         * @memberof CommonLayoutProvider
         */
        getDisconnectedImage() {
            let imageProvider = this.component.getSubComponent(componentDefaultDefinitionCommonLayoutProvider_1.ComponentDefaultDefinitionCommonLayoutProvider.ImageProviderId);
            if (imageProvider == undefined) {
                return "";
            }
            return imageProvider.getImage("../app/widgets/common/style/images/disconnected.svg");
        }
        /**
         * Returns the default busy image with the given size
         *
         * @private
         * @param {number} size
         * @returns
         * @memberof CommonLayoutProvider
         */
        getDefaultImage(size) {
            let imageProvider = this.component.getSubComponent(componentDefaultDefinitionCommonLayoutProvider_1.ComponentDefaultDefinitionCommonLayoutProvider.ImageProviderId);
            if (imageProvider == undefined) {
                return "";
            }
            let busyImage = imageProvider.getImage("../app/widgets/common/style/images/busy.svg");
            busyImage = busyImage.replace('width="120"', 'width="' + size.toString() + '"');
            busyImage = busyImage.replace('height="120"', 'height="' + size.toString() + '"');
            return busyImage;
        }
    };
    CommonLayoutProvider = CommonLayoutProvider_1 = __decorate([
        mco.role()
    ], CommonLayoutProvider);
    exports.CommonLayoutProvider = CommonLayoutProvider;
});
