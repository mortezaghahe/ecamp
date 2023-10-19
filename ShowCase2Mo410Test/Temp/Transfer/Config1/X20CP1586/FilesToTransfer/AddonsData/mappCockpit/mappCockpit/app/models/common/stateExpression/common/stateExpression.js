var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StateExpression = void 0;
    /**
     * Class that handles the evaluation of metadata expressions
     *
     * @class StateExpression
     */
    let StateExpression = class StateExpression {
        constructor(name, expression, watchableVariableDeclaration) {
            //Holds variable declaration for expression variables
            this.mathjsVarDeclaration = {};
            this.name = name;
            this.expression = expression;
            this.watchableMapping = new Map(watchableVariableDeclaration);
            this.initializeMathjsVarDeclaration();
        }
        /**
         * Initialize mathjsvarDeclaration, used for the expression
         *
         * @private
         * @returns {MathjsVariableDeclaration}
         * @memberof StateExpression
         */
        initializeMathjsVarDeclaration() {
            this.watchableMapping.forEach((expressionVar, key) => {
                this.mathjsVarDeclaration[expressionVar] = null;
            });
        }
        /**
         * Update variable declaration with the given watchable variable
         *
         * @protected
         * @param {MappCockpitComponentParameter} watchable
         * @memberof StateExpression
         */
        updateMathjsVarDeclaration(watchable) {
            let expressionVar = this.watchableMapping.get(watchable.browseName);
            if (expressionVar !== undefined) {
                this.mathjsVarDeclaration[expressionVar] = this.getWatchableValueAsNumber(watchable.value);
            }
        }
        /**
         * Return watchable value as number so it can be evaluated by mathjs
         *
         * @private
         * @param {(number | string)} value
         * @returns {(number | null)}
         * @memberof StateExpression
         */
        getWatchableValueAsNumber(value) {
            if (typeof (value) == 'number') {
                return value;
            }
            else if (typeof (value) == 'boolean') {
                return value ? 1 : 0;
            }
            else {
                return null;
            }
        }
    };
    StateExpression = __decorate([
        mco.role()
    ], StateExpression);
    exports.StateExpression = StateExpression;
});
