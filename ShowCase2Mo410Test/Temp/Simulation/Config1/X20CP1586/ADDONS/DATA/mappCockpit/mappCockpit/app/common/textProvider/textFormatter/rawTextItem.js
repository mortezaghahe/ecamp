var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./editStringHelper", "./formatItemIdentifier"], function (require, exports, editStringHelper_1, formatItemIdentifier_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RawTextItem = void 0;
    /**
     * This class holds the information of the unformatted data.
     * Everytime a data is set, the indexes for the format item are updated
     *
     * @export
     * @class RawTextItem
     */
    let RawTextItem = class RawTextItem {
        /**
         * Creates an instance of RawTextItem.
         * Only sets the defauld values
         *
         * @memberof RawTextItem
         */
        constructor() {
            this._data = "";
            this._indexOfStartOfNextFormatItem = -1;
            this._indexOfEndFormatItem = -1;
        }
        /**
         * Set the unformtted data.
         * Everytime the data is set, the indexOfStartOfNextFormatItem
         * and indexOfEndFormatItem get updated according the new data
         *
         * @param {string} rawData
         * @memberof RawTextItem
         */
        set data(rawData) {
            this._data = rawData;
            this.setIndexOfStartOfNextFormatItem();
            this.setIndexOfEndOfNextFormatItem();
        }
        /**
         * Get the unformatted data
         *
         * @type {string}
         * @memberof RawTextItem
         */
        get data() {
            return this._data;
        }
        /**
         * Add input string to formatted string until indexOfStartOfNextFormatItem ("{") as there is nothing to process so far
         *
         * @return {*}  {string}
         * @memberof RawTextItem
         */
        getTextBeforeFormatItem() {
            return this.data.substring(0, this._indexOfStartOfNextFormatItem);
        }
        /**
         * Remove the added string from the raw Text until the indexOfStartOfNextFormatItem ("{")
         *
         * @memberof RawTextItem
         */
        removeTextBeforeFormatItem() {
            this.data = this.data.substring(this._indexOfStartOfNextFormatItem, this.data.length);
        }
        /**
         * Remove the formattet part of the data
         *
         * @memberof RawTextItem
         */
        removeFormattedText() {
            this.data = this.data.substring(this._indexOfEndFormatItem + 1, this.data.length);
        }
        /**
         * Returns the content string of the allready found format item
         * Bsp: "{1|-10.3f} is the ..." -> "1|-10.3f"
         *
         * @return {*}  {string}
         * @memberof RawTextItem
         */
        getFormatItemWithoutCurls() {
            return this.data.substring(1, this._indexOfEndFormatItem);
        }
        /**
         * Checks if the second position of the _data is a "="
         * If it is the first to positions of data are removed
         *
         * @return {*}  {boolean}
         * @memberof RawTextItem
         */
        containsRecursiveFormatItem() {
            // check if there is a "="
            if (this.data[1] !== formatItemIdentifier_1.FormatItemIdentifier.recursion) {
                return false;
            }
            this.data = this.data.substring(2, this.data.length);
            return true;
        }
        /**
         * Returns true when the data contains a format item
         *
         * @return {*}  {boolean}
         * @memberof RawTextItem
         */
        containsFurtherFormatItem() {
            return this.containsStartOfNextFormatItem() && this.containsEndOfNextFormatItem();
        }
        /**
         * Check if there is a start of a next format item
         *
         * @private
         * @return {*}  {boolean}
         * @memberof RawTextItem
         */
        containsStartOfNextFormatItem() {
            return editStringHelper_1.EditStringHelper.indexIsValid(this._indexOfStartOfNextFormatItem);
        }
        /**
         * Check if there is a end of a next format item
         *
         * @private
         * @return {*}  {boolean}
         * @memberof RawTextItem
         */
        containsEndOfNextFormatItem() {
            return editStringHelper_1.EditStringHelper.indexIsValid(this._indexOfEndFormatItem);
        }
        /**
         * Set the index of the first open curl "{" in a string.
         * If no open curl is found then -1 is set.
         * Two open curls in a row "{{" are ignored.
         *
         * @private
         * @memberof RawTextItem
         */
        setIndexOfStartOfNextFormatItem() {
            // (?<!{)   -> the sequence I am looking for must not have a "{" in front of it
            // {        -> that is what I am looking for
            // ({{)*    -> it might be followed by an even number of "{" characters, to be an odd number overall
            // (?!{)    -> it must not be followed by another "{", otherwise we haven't gotten the complete number of chained "{" characters
            let regex = RegExp('(?<!' + formatItemIdentifier_1.FormatItemIdentifier.next + ')' + formatItemIdentifier_1.FormatItemIdentifier.next + '(' + formatItemIdentifier_1.FormatItemIdentifier.next + formatItemIdentifier_1.FormatItemIdentifier.next + ')*(?!' + formatItemIdentifier_1.FormatItemIdentifier.next + ')', 'g');
            if (regex.exec(this.data) === null) {
                this._indexOfStartOfNextFormatItem - 1;
            }
            this._indexOfStartOfNextFormatItem = regex.lastIndex - 1;
        }
        /**
         * set the index of the end starting the count from the beginning of the format item.
         * If no closing for the format item is found then -1 is set.
         *
         * @private
         * @memberof RawTextItem
         */
        setIndexOfEndOfNextFormatItem() {
            if (editStringHelper_1.EditStringHelper.indexIsValid(this._indexOfStartOfNextFormatItem)) {
                let nextItemString = this.data.substring(this._indexOfStartOfNextFormatItem, this.data.length);
                this._indexOfEndFormatItem = nextItemString.indexOf(formatItemIdentifier_1.FormatItemIdentifier.end);
            }
            else {
                this._indexOfEndFormatItem = -1;
            }
        }
    };
    RawTextItem = __decorate([
        mco.role()
    ], RawTextItem);
    exports.RawTextItem = RawTextItem;
});
