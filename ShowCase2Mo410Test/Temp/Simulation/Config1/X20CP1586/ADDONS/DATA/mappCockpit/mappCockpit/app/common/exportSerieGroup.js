var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ExportSerieGroup = void 0;
    let ExportSerieGroup = class ExportSerieGroup {
        /**
         * Creates an instance of ExportSerieGroup.
         * @param {string} name
         * @param {number} startTriggerTime
         * @memberof SerieGroup
         */
        constructor(name, startTriggerTime, serie) {
            this.series = new Array();
            this.name = name;
            this.startTriggerTime = startTriggerTime;
            this.series.push(serie);
        }
        addSerie(serie) {
            this.series.push(serie);
        }
    };
    ExportSerieGroup = __decorate([
        mco.role()
    ], ExportSerieGroup);
    exports.ExportSerieGroup = ExportSerieGroup;
});
