var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../libs/math/mathjs", "../../online/mappCockpitComponent", "./watchableIcon", "./common/stateExpression", "../../../framework/events"], function (require, exports, math, mappCockpitComponent_1, watchableIcon_1, stateExpression_1, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WatchableStateExpression = void 0;
    let EventIconUpdated = class EventIconUpdated extends events_1.TypedEvent {
    };
    EventIconUpdated = __decorate([
        mco.role()
    ], EventIconUpdated);
    ;
    /**
     * Class that handles evaluation of expression for watchableState parameters
     *
     * @class WatchableStateExpression
     * @extends {StateExpression}
     */
    let WatchableStateExpression = class WatchableStateExpression extends stateExpression_1.StateExpression {
        constructor(name = '', expression = '', watchableVariableDeclaration = [], icon = {}) {
            super(name, expression, watchableVariableDeclaration);
            // event that will be raised when an icon is updated
            this.eventIconUpdated = new EventIconUpdated();
            // holds the icon value given by the expression
            this._iconValue = null;
            this.watchableIcons = this.initializeWatchableIcon(icon);
        }
        /**
         * Return a map of WatchableIcon with the value assigned in the metaData
         *
         * @private
         * @param {*} icon
         * @returns {Map<number, WatchableIcon>}
         * @memberof WatchableStateExpression
         */
        initializeWatchableIcon(icon) {
            let watchableIcon = new Map();
            for (var value in icon) {
                watchableIcon.set(parseInt(value), new watchableIcon_1.WatchableIcon(icon[value].ImageName, icon[value].Tooltip));
            }
            return watchableIcon;
        }
        /**
         * Update icon value
         *
         * @private
         * @param {MappCockpitComponentParameter} watchable
         * @memberof WatchableStateExpression
         */
        updateIconValue(watchable) {
            this.updateMathjsVarDeclaration(watchable);
            this._iconValue = this.getIconValue();
            let watchableIcon = this.getWatchableIcon();
            this.onIconUpdated(this.name, watchableIcon);
        }
        observeWatchables(watchableParameters) {
            // invoke observing the watchables
            mappCockpitComponent_1.MappCockpitComponentParameter.observeParameterValueChanges(this, watchableParameters);
        }
        /**
         * Called after change of observable
         *
         * @param {Observable[]} changedObservables
         * @memberof WatchableStateExpression
         */
        onObservablesChanged(changedObservables) {
            changedObservables.forEach((observable) => {
                if (observable.property === "Value") {
                    let watchableParameter = observable.object;
                    this.updateIconValue(watchableParameter);
                }
            });
        }
        /**
         * Get value of evaluated expression
         *
         * @private
         * @returns {boolean}
         * @memberof WatchableStateExpression
         */
        getIconValue() {
            if (Object.values(this.mathjsVarDeclaration).every(elem => typeof (elem) === 'number')) {
                return math.evaluate(this.expression, this.mathjsVarDeclaration);
            }
            else {
                //If one value of mathjsVarDeclaration is not a number, return null as invalid
                return null;
            }
        }
        /**
         * Get watchableIcon according to its value
         *
         * @private
         * @returns {WatchableIcon}
         * @memberof WatchableStateExpression
         */
        getWatchableIcon() {
            let watchableIcon;
            if (this._iconValue !== null && this.watchableIcons.has(this._iconValue)) {
                watchableIcon = this.watchableIcons.get(this._iconValue);
            }
            else {
                watchableIcon = watchableIcon_1.WatchableIcon.getUnkownWatchableIcon();
            }
            return watchableIcon;
        }
        /**
         * Get icon value
         *
         * @readonly
         * @type {(number | null)}
         * @memberof WatchableStateExpression
         */
        get iconValue() {
            return this._iconValue;
        }
        /**
         * Triggers the event
         *
         * @private
         * @memberof WatchableStateExpression
         */
        onIconUpdated(name, watchableIcon) {
            this.eventIconUpdated.raise(null, { name, watchableIcon });
        }
    };
    WatchableStateExpression = __decorate([
        mco.role()
    ], WatchableStateExpression);
    exports.WatchableStateExpression = WatchableStateExpression;
});
