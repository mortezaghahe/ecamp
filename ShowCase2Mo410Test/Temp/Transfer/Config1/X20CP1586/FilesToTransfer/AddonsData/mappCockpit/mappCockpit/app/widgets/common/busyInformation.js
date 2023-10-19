var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ImageId = exports.BusyInformation = void 0;
    var ImageId;
    (function (ImageId) {
        ImageId[ImageId["defaultImage"] = 0] = "defaultImage";
        ImageId[ImageId["disconnectedImage"] = 1] = "disconnectedImage";
    })(ImageId || (ImageId = {}));
    exports.ImageId = ImageId;
    let BusyInformation = class BusyInformation {
        /**
         * Creates an instance of BusyInformation.
         * @param {string} [message=""] a message
         * @param {ImageId} [imageId=ImageId.defaultImage] imageId of the image(e.g. defautl image or disconnected image)
         * @param {number} [imageSize=120] image size of the default image
         * @param {boolean} [rowOrientation=true] if true the image is under the message text else the image is at he right of the message text
         * @memberof BusyInformation
         */
        constructor(message = "", imageId = ImageId.defaultImage, imageSize = 120, rowOrientation = true) {
            this.rowOrientation = true;
            this.message = message;
            this.imageId = imageId;
            this.imageSize = imageSize;
            this.rowOrientation = rowOrientation;
        }
    };
    BusyInformation = __decorate([
        mco.role()
    ], BusyInformation);
    exports.BusyInformation = BusyInformation;
});
