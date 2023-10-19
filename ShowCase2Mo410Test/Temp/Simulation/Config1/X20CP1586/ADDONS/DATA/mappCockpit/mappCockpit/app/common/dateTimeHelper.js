var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DateTimeHelper = void 0;
    let DateTimeHelper = class DateTimeHelper {
        /**
         * Returns a formated datetime string for the given timestamp
         *
         * @static
         * @param {number} timestamp e.g. 1552925197000000
         * @returns e.g. "18.03.2019 17:06:37"
         * @memberof DateTimeHelper
         */
        static getDateTime(timestamp) {
            var date = new Date(timestamp / 1000); // divide by 1000 to get milliseconds
            var day = "0" + date.getDate();
            var month = "0" + (date.getMonth() + 1);
            var year = date.getFullYear();
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            // Will display time in "15.11.2018 10:30:23" format
            return day.substr(-2) + '.' + month.substr(-2) + '.' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        }
    };
    DateTimeHelper = __decorate([
        mco.role()
    ], DateTimeHelper);
    exports.DateTimeHelper = DateTimeHelper;
});
