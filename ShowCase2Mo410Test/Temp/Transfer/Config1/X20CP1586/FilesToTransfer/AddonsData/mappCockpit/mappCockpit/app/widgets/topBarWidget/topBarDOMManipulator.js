var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TopBarDOMManipulator = void 0;
    let TopBarDOMManipulator = class TopBarDOMManipulator {
        constructor() { }
        /**
         * Append the passed html tag on the passed id
         *
         * @static
         * @param {string} id
         * @param {string} htmlTag
         * @memberof TopBarDOMManipulator
         */
        static appendHTMLTagAtID(id, htmlTag) {
            $("#" + id).append(htmlTag);
        }
        /**
         * Add css class in the element of the passed id
         *
         * @static
         * @param {string} id
         * @param {string} className
         * @memberof TopBarDOMManipulator
         */
        static addClassAtID(id, className) {
            $("#" + id).addClass(className);
        }
        /**
        * Remove css class in the element of the passed id
        *
        * @static
        * @param {string} id
        * @param {string} className
        * @memberof TopBarDOMManipulator
        */
        static removeClassAtID(id, className) {
            $("#" + id).removeClass(className);
        }
    };
    TopBarDOMManipulator = __decorate([
        mco.role()
    ], TopBarDOMManipulator);
    exports.TopBarDOMManipulator = TopBarDOMManipulator;
});
