var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./subFormatterSelector", "./editStringHelper", "./formatItemIdentifier", "./rawTextItem", "./formatItem", "./formatterInputArguments/formatterInputArgumentString", "../errorHandling/textSystemErrorTypes", "../errorHandling/textSystemErrorHandler", "../errorHandling/textSystemErrorItem", "./formatterTextItem"], function (require, exports, subFormatterSelector_1, editStringHelper_1, formatItemIdentifier_1, rawTextItem_1, formatItem_1, formatterInputArgumentString_1, textSystemErrorTypes_1, textSystemErrorHandler_1, textSystemErrorItem_1, formatterTextItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextFormatter = void 0;
    /**
     * Format strings are text templates consisting of UTF-8 text areas and optional format items. When the text is displayed,
     * the respective format items are replaced by text fragments that are generated based on the specified contained in the
     * format item, for example to display measured values from variables, to apply measured values in user-defined event messages
     * or put together strings for displaying in HMI applications. Basic syntax of a format item:
     *
     * {<DataSource>|[<FormatSpecification>]}
     *
     * In other words, format items are delimited by { and } and always contain a data source,
     * which can then be followed by a | (pipe) character and format specification (optional).
     *
     * @static
     * @class TextFormatter
     */
    let TextFormatter = class TextFormatter {
        /**
        * Private constructor for initializing a static
        * Creates an instance of TextFormatter.
        * @memberof TextFormatter
        */
        constructor() { }
        /**
        * Call method for using TextFormatter that is connected to the textsystem
        *
        * @param {string} text
        * @param {ITextProvider} textSystemInterface
        * @param {FormatterInputArgumentList | undefined} argumentList
        * @param {*} [languageCode=this._selectedLanguage]
        * @returns {TextItem}
        * @memberof TextFormatter
        */
        static formatText(rawText, textSystemInterface, argumentList, languageCode) {
            // Prepare data before starting
            let inputData = new formatterTextItem_1.FormatterTextItem(rawText);
            let formattedText = this.replaceFormatItems(inputData, textSystemInterface, argumentList, languageCode);
            formattedText.value = this.removeDoubleOpeningCurls(formattedText.value);
            return formattedText;
        }
        /**
         * Formatter light for handling formatting without being connected to the textsystem.
         * Resolves format items reffering to the argument list returning the result as string.
         * CANNOT handle dynamically build texts
         * CANNOT handle external data sources
         * DOES NOT include error informations
         *
         * @static
         * @param {string} rawArg
         * @param {FormatterInputArgumentList} argumentList
         * @return {*}  {string}
         * @memberof TextFormatter
         */
        static formatArgument(rawArg, argumentList) {
            let formattedArgument = "";
            let rawArgument = new rawTextItem_1.RawTextItem();
            rawArgument.data = rawArg;
            while (rawArgument.containsFurtherFormatItem()) {
                formattedArgument += rawArgument.getTextBeforeFormatItem();
                rawArgument.removeTextBeforeFormatItem();
                // get the the result of the formatting and add it to the allredy formatted data
                formattedArgument += this.processSingleArgument(rawArgument.getFormatItemWithoutCurls(), argumentList);
                rawArgument.removeFormattedText();
            }
            formattedArgument += rawArgument.data;
            formattedArgument = this.removeDoubleOpeningCurls(formattedArgument);
            return formattedArgument;
        }
        /**
         * Change "{{" to "{"
         *
         * @private
         * @static
         * @param {string} text
         * @return {string}
         * @memberof TextFormatter
         */
        static removeDoubleOpeningCurls(text) {
            let regex = RegExp(formatItemIdentifier_1.FormatItemIdentifier.next + formatItemIdentifier_1.FormatItemIdentifier.next, 'g');
            return text.replace(regex, formatItemIdentifier_1.FormatItemIdentifier.next);
        }
        /**
         * Resolve the format items of the formatter light
         *
         * @private
         * @static
         * @param {string} rawData
         * @param {FormatterInputArgumentList} argumentList
         * @return {*}  {string}
         * @memberof TextFormatter
         */
        static processSingleArgument(rawData, argumentList) {
            let formattedItem = "";
            try {
                // get the format item information {<DataSource>|[<FormatSpecification>]} from raw string
                let formatItem = new formatItem_1.FormatItem(rawData, argumentList);
                // get input Argument from Argument List
                let inputArgument = this.receiveInputArgumentFromArgumentDataSource(formatItem, argumentList);
                // apply format Specification
                formattedItem = subFormatterSelector_1.SubFormatterSelector.formatArgumentItem(inputArgument, formatItem.formatSpecification);
            }
            catch (textSystemError) {
                formattedItem = textSystemError.message;
            }
            return formattedItem;
        }
        /**
         * Search for format items and change the items with the value from data source
         *
         * @private
         * @static
         * @param {FormatterTextItem} data
         * @param {ITextProvider} [textSystemInterface]
         * @param {FormatterInputArgumentList} [argumentList]
         * @param {string} [languageCode]
         * @return {*}  {FormatterTextItem}
         * @memberof TextFormatter
         */
        static replaceFormatItems(data, textSystemInterface, argumentList, languageCode) {
            let rawTextItem = new rawTextItem_1.RawTextItem();
            rawTextItem.data = data.value;
            data.value = "";
            // ends if no further format item is found
            while (rawTextItem.containsFurtherFormatItem()) {
                data.value += rawTextItem.getTextBeforeFormatItem();
                rawTextItem.removeTextBeforeFormatItem();
                // if there is a "=", its is an dynamically built format item and "{=" gets removed
                if (rawTextItem.containsRecursiveFormatItem()) {
                    // Recursion: process the inner format items. The before removed "{" need to be added in front again that it gets processed again.
                    let recursiveItem = this.replaceFormatItems(new formatterTextItem_1.FormatterTextItem(rawTextItem.data, data.errors, data.recurisionCnt), textSystemInterface, argumentList, languageCode);
                    // Append the bevor removed "{" on front that the formatted part gets interpreted as format item again
                    rawTextItem.data = formatItemIdentifier_1.FormatItemIdentifier.next + recursiveItem.value;
                    data.errors = recursiveItem.errors;
                    data.recurisionCnt = recursiveItem.recurisionCnt;
                }
                // get the the result of the formatting and add it to the allredy formatted data
                let processedItem = this.processFormatItem(new formatterTextItem_1.FormatterTextItem(rawTextItem.getFormatItemWithoutCurls(), data.errors, data.recurisionCnt), textSystemInterface, argumentList, languageCode);
                data.value += processedItem.value;
                data.errors = processedItem.errors;
                data.recurisionCnt = processedItem.recurisionCnt;
                rawTextItem.removeFormattedText();
            }
            data.value += rawTextItem.data;
            return data;
        }
        /**
         * Get the formatted string of the format item
         *
         * @private
         * @static
         * @param {FormatterTextItem} item
         * @param {ITextProvider} [textSystemInterface]
         * @param {FormatterInputArgumentList} [argumentList]
         * @param {string} [languageCode]
         * @return {*}  {FormatterTextItem}
         * @memberof TextFormatter
         */
        static processFormatItem(item, textSystemInterface, argumentList, languageCode) {
            try {
                // get the format item information {<DataSource>|[<FormatSpecification>]} from raw string
                let formatItem = new formatItem_1.FormatItem(item.value, argumentList);
                // receive the input argument for the respective datasource
                let inputArgument = this.receiveInputArgumentFromDataSource(formatItem, textSystemInterface, argumentList, languageCode);
                // apply format Specification
                item.value = subFormatterSelector_1.SubFormatterSelector.formatArgumentItem(inputArgument, formatItem.formatSpecification);
                // In recursive format items the result is checked for inner format items
                item = this.processRecursiveFormatItem(item, formatItem, textSystemInterface, argumentList, languageCode);
            }
            catch (textSystemError) {
                // reset the recursion counter
                item.resetRecurisionCnt();
                // Errors ar only pushed at this place
                item.errors.push(textSystemError.item);
                // The before created errormessage gets shown in the formatted string instead of the format item
                item.value = textSystemError.message;
            }
            return item;
        }
        /**
         * Selects the right datasource and receives the raw input argument
         *
         * @private
         * @static
         * @param {FormatItem} formatItem
         * @param {ITextProvider} [textSystemInterface]
         * @param {FormatterInputArgumentList} [argumentList]
         * @param {string} [languageCode]
         * @return {*}  {IFormatterInputArgument}
         * @memberof TextFormatter
         */
        static receiveInputArgumentFromDataSource(formatItem, textSystemInterface, argumentList, languageCode) {
            let inputArgument;
            if (formatItem.dataSourceType === formatItem_1.DataSourceTypes.external) {
                // Remove the external data source identifier ("$") from rawItem and pass it for getting the text from the textsystem
                inputArgument = this.receiveInputArgumentFromExternalDataSource(formatItem, textSystemInterface, languageCode);
            }
            // Else its an argument data source
            else {
                inputArgument = this.receiveInputArgumentFromArgumentDataSource(formatItem, argumentList);
            }
            return inputArgument;
        }
        /**
         * Process the externl data source.
         * Searches recoursive for further format items in the processed string.
         * Can throw Error strings
         *
         * @private
         * @static
         * @param {FormatItem} formatItem
         * @param {ITextProvider} [textSystemInterface]
         * @param {string} [languageCode]
         * @return {*}  {IFormatterInputArgument}
         * @memberof TextFormatter
         */
        static receiveInputArgumentFromExternalDataSource(formatItem, textSystemInterface, languageCode) {
            // check if there is a textsystem instance
            if (textSystemInterface === undefined) {
                let errorMessage = textSystemErrorHandler_1.TextSystemErrorHandler.getErrorMessageBySource(textSystemErrorTypes_1.TextSystemErrorTypes.CouldNotOpenTextDatabase, formatItem.dataSource);
                textSystemErrorHandler_1.TextSystemErrorHandler.throwFormatterErrors(errorMessage, new textSystemErrorItem_1.TextSystemErrorItem(textSystemErrorTypes_1.TextSystemErrorTypes.CouldNotOpenTextDatabase));
            }
            // Get TextItem from textsystem
            let textItem = textSystemInterface.getRawTextByFullyQualifiedTextId(formatItem.dataSource, languageCode);
            let formattedItem = textItem.value;
            // Wenn Fehler aufgetreten sind werden diese in den errorContainer gepusht und eine exeption wird geworfen
            if (!textItem.isValid()) {
                textSystemErrorHandler_1.TextSystemErrorHandler.throwFormatterErrors(formattedItem, textItem.errors[0]);
            }
            // convert the received string in database to FormatterInputArgumentString
            let inputArgument = new formatterInputArgumentString_1.FormatterInputArgumentString(formattedItem);
            return inputArgument;
        }
        /**
         * Process the argument data source
         * Can throw Error strings
         *
         * @private
         * @static
         * @param {FormatItem} formatItem
         * @param {FormatterInputArgumentList} [argumentList]
         * @return {*}  {IFormatterInputArgument}
         * @memberof TextFormatter
         */
        static receiveInputArgumentFromArgumentDataSource(formatItem, argumentList) {
            let checkedInputArgument = editStringHelper_1.EditStringHelper.getInputArgumentFromText(formatItem.dataSource, argumentList);
            if (checkedInputArgument.error !== textSystemErrorTypes_1.TextSystemErrorTypes.NoError) {
                textSystemErrorHandler_1.TextSystemErrorHandler.throwFormatterErrors(textSystemErrorHandler_1.TextSystemErrorHandler.defaultErrorMessage, new textSystemErrorItem_1.TextSystemErrorItem(checkedInputArgument.error));
            }
            return checkedInputArgument.inputArgument;
        }
        /**
         * Checks if the processed format item need to be processed again for inner format items
         * The recursion is limited by 10
         *
         * @private
         * @static
         * @param {FormatterTextItem} item
         * @param {FormatItem} formatItem
         * @param {ITextProvider} [textSystemInterface]
         * @param {FormatterInputArgumentList} [argumentList]
         * @param {string} [languageCode]
         * @return {*}  {FormatterTextItem}
         * @memberof TextFormatter
         */
        static processRecursiveFormatItem(item, formatItem, textSystemInterface, argumentList, languageCode) {
            if (formatItem.isRecursive()) {
                item.incrementRecurisionCnt();
                // disables endless recursion of external data source items
                if (item.recursionLimitExeeded) {
                    textSystemErrorHandler_1.TextSystemErrorHandler.throwFormatterErrors(textSystemErrorHandler_1.TextSystemErrorHandler.defaultErrorMessage, new textSystemErrorItem_1.TextSystemErrorItem(textSystemErrorTypes_1.TextSystemErrorTypes.EndlessRecursion));
                }
                // Recursion: Search for a format item in the formatted item
                item = this.replaceFormatItems(item, textSystemInterface, argumentList, languageCode);
            }
            else {
                // reset the recursion counter
                item.resetRecurisionCnt();
            }
            return item;
        }
    };
    TextFormatter = __decorate([
        mco.role()
    ], TextFormatter);
    exports.TextFormatter = TextFormatter;
});
