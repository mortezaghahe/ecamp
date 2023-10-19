var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./nwctPrsItemBase"], function (require, exports, nwctPrsItemBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctPrsPropertyNumber = void 0;
    /**
     * Type safe access to number property
     *
     * @export
     * @class NwctPrsPropertyNumber
     * @extends {NwctPrsItemBase}
     * @implements {INwctPrsPropertyNumber}
     */
    let NwctPrsPropertyNumber = class NwctPrsPropertyNumber extends nwctPrsItemBase_1.NwctPrsItemBase {
        /**
         *Creates an instance of NwctPrsPropertyNumber.
         * @param {*} input
         * @param {Array<string>} locationOfPropertyInInput
         * @memberof NwctPrsPropertyNumber
         */
        constructor(input, locationOfPropertyInInput) {
            super(input);
            this._value = 0.0;
            this._valid = false;
            this._parsed = false; // only parse once
            this._locationOfPropertyInInput = locationOfPropertyInInput;
        }
        /**
         * returns the parsed number
         *
         * @readonly
         * @type {number}
         * @memberof NwctPrsPropertyNumber
         */
        get value() {
            this.parse();
            return this._value;
        }
        /**
         *
         *
         * @readonly
         * @memberof NwctPrsPropertyNumber
         */
        get valid() {
            this.parse();
            return this._valid;
        }
        /**
         * parses on demand (only once)
         *
         * @private
         * @memberof NwctPrsPropertyNumber
         */
        parse() {
            // parsing is only done once to reduce performance demand
            // parsing is only done on demand to reduce performance demand
            if (!this._parsed) {
                this._parsed = true; // it will not be parsed next time
                let property = this.getUntypedPropertyByName(this._input, this._locationOfPropertyInInput); // do parsing and get the untyped property
                this._valid = typeof (property) === 'number'; // check datatype to ensure that it is really a number
                if (this._valid) {
                    this._value = property;
                }
            }
        }
    };
    NwctPrsPropertyNumber = __decorate([
        mco.role()
    ], NwctPrsPropertyNumber);
    exports.NwctPrsPropertyNumber = NwctPrsPropertyNumber;
});
