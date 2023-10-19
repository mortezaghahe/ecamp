var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var DragDropRepresentation_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DragDropRepresentation = void 0;
    let DragDropRepresentation = DragDropRepresentation_1 = class DragDropRepresentation {
        constructor() {
            /**
             * Array with the icons (icon data as string instead of icon path because with path the drop icon is flickering) for the drag and drop element
             *
             * @type {Array<string>}
             * @memberof DragDropRepresentation
             */
            this.iconList = new Array();
            /**
             * Array with the text informations for the drag and drop element
             *
             * @type {Array<string>}
             * @memberof DragDropRepresentation
             */
            this.textList = new Array();
        }
        /**
         * Returns an element with the drag and drop representation
         *
         * @returns {string}
         * @memberof DragDropRepresentation
         */
        getDragDropElement() {
            // Add element container
            let iconRepresentation = `<div class='dragDropContainer'>`;
            // Add icon container
            iconRepresentation += `<div class='dragDropIconContainer'>`;
            // Add icons
            this.iconList.forEach(icon => {
                iconRepresentation += `<div class='dragDropIcon'>`;
                iconRepresentation += icon;
                iconRepresentation += `</div>`;
            });
            // Close icon container
            iconRepresentation += `</div>`;
            // Add text container
            iconRepresentation += `<div class='dragDropTextContainer'>`;
            // Add texts
            let top = 0;
            this.textList.forEach(text => {
                iconRepresentation += `<div class='dragDropText' style='top: ` + top + `px;'>` + text + `</div>`;
                top += 20;
            });
            // Close text container
            iconRepresentation += `</div>`;
            // Close element container
            iconRepresentation += `</div>`;
            return iconRepresentation;
        }
        /**
         * Clones the dragDrop representation
         *
         * @returns {DragDropRepresentation}
         * @memberof DragDropRepresentation
         */
        clone() {
            let clone = new DragDropRepresentation_1();
            this.iconList.forEach(icon => {
                clone.iconList.push(icon);
            });
            this.textList.forEach(text => {
                clone.textList.push(text);
            });
            return clone;
        }
    };
    DragDropRepresentation = DragDropRepresentation_1 = __decorate([
        mco.role()
    ], DragDropRepresentation);
    exports.DragDropRepresentation = DragDropRepresentation;
});
