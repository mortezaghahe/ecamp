var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./signalCategory", "../common/signal/serieContainer", "../common/signal/serieNode"], function (require, exports, signalCategory_1, serieContainer_1, serieNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignalRoot = void 0;
    let SignalRoot = class SignalRoot extends serieContainer_1.SerieContainer {
        /**
         * Creates an instance of the SignalRoot
         * @memberof SignalRoot
         */
        constructor(dataModel) {
            super(undefined);
            this.dataModel = dataModel;
            this.setDefaultData();
        }
        /**
         * Clears all the data and sets the default categories
         *
         * @memberof SignalRoot
         */
        clear() {
            let categories = this.childs;
            // Remove all categories with data
            categories.forEach(category => {
                category.clear();
            });
            this.setDefaultData();
        }
        get nodeType() {
            return serieNode_1.NodeType.root;
        }
        /**
         * Creates a new data array and sets the default categories
         *
         * @private
         * @memberof SignalRoot
         */
        setDefaultData() {
            // Create new data array
            this.childs = new Array();
            // Add default categories
            this.addDefaultCategories();
        }
        /**
         * Adds the main categories (Uploaded, Imported, Calculated, ...) to the SignalRoot
         *
         * @private
         * @memberof SignalRoot
         */
        addDefaultCategories() {
            this.addSerieContainer(new signalCategory_1.SignalCategory(signalCategory_1.SignalCategory.CategoryIdRecent));
            this.addSerieContainer(new signalCategory_1.SignalCategory(signalCategory_1.SignalCategory.CategoryIdUploaded));
            this.addSerieContainer(new signalCategory_1.SignalCategory(signalCategory_1.SignalCategory.CategoryIdImported));
            //this.addSerieContainer(new SignalCategory(SignalCategory.CategoryIdCalculated));
        }
    };
    SignalRoot = __decorate([
        mco.role()
    ], SignalRoot);
    exports.SignalRoot = SignalRoot;
});
