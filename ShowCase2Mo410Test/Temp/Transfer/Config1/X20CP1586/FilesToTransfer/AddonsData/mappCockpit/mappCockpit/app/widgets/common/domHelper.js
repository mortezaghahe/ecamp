var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DomHelper = void 0;
    /**
     * provides some utility methods for dom and element features
     *
     * @class DomHelper
     */
    let DomHelper = class DomHelper {
        /**
         * the method checks if an element is within the visible viewport.
         *
         * @static
         * @param {*} element
         * @returns
         * @memberof DomHelper
         */
        static isElementInViewport(element) {
            var rect = element.getBoundingClientRect();
            //TODO: optimize detection of currently visible elements. To compare if an element is visible, the relative location and div z-order has
            // to be considered!
            return (rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */);
        }
        /**
         * Adds the disabled classes(e.g. mCoDisabled) to the element(or removes them)
         *
         * @static
         * @param {*} element
         * @param {*} disable
         * @returns
         * @memberof DomHelper
         */
        static disableElement(element, disable) {
            if (!element) {
                console.error("element not defined for disableElement");
                return;
            }
            if (!element.classList) {
                return;
            }
            // this tag defines the classname which will be added if an element should be shown disabled
            // this tag also will be used in the ranorex test environment
            let disabledClassName = "mCoDisabled";
            if (disable == true) {
                element.classList.add(disabledClassName);
            }
            else {
                element.classList.remove(disabledClassName);
            }
        }
    };
    DomHelper = __decorate([
        mco.role()
    ], DomHelper);
    exports.DomHelper = DomHelper;
});
