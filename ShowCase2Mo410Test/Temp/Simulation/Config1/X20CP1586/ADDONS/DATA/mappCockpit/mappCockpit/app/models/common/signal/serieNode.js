var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events", "../../../common/persistence/persistDataProvider"], function (require, exports, events_1, persistDataProvider_1) {
    "use strict";
    var SerieNode_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SerieNode = exports.NodeType = void 0;
    let EventDataChanged = class EventDataChanged extends events_1.TypedEvent {
    };
    EventDataChanged = __decorate([
        mco.role()
    ], EventDataChanged);
    ;
    let EventSerieDataChanged = class EventSerieDataChanged extends events_1.TypedEvent {
    };
    EventSerieDataChanged = __decorate([
        mco.role()
    ], EventSerieDataChanged);
    ;
    var NodeType;
    (function (NodeType) {
        NodeType[NodeType["container"] = 0] = "container";
        NodeType[NodeType["series"] = 1] = "series";
        NodeType[NodeType["calculationInputParam"] = 2] = "calculationInputParam";
        NodeType[NodeType["calculationOutputParam"] = 3] = "calculationOutputParam";
        NodeType[NodeType["root"] = 4] = "root";
    })(NodeType = exports.NodeType || (exports.NodeType = {}));
    let SerieNode = SerieNode_1 = class SerieNode {
        get validNode() {
            return true;
        }
        /**
         * Returns the type of the serieNode
         *
         * @protected
         * @type {string}
         * @memberof SerieNode
         */
        get nodeType() {
            return NodeType.series;
        }
        /**
         * Returns the description of the serie
         *
         * @type {string}
         * @memberof SerieNode
         */
        get description() {
            if (this.serie != undefined) {
                return this.serie.description;
            }
            return "";
        }
        /**
         * Sets the description of the serie
         *
         * @memberof SerieNode
         */
        set description(value) {
            if (this.serie != undefined) {
                this.serie.description = value;
            }
        }
        /**
         * Returns the color of the serie
         *
         * @type {(string | undefined)}
         * @memberof SerieNode
         */
        get color() {
            if (this._color != undefined) {
                return this._color;
            }
            else {
                if (this.serie != undefined) {
                    return this.serie.color;
                }
                else {
                    return undefined;
                }
            }
        }
        /**
         * Sets the color of the serie
         *
         * @memberof SerieNode
         */
        set color(value) {
            if (this._color != undefined) {
                this._color = value;
            }
            else {
                if (this.serie != undefined && value != undefined) {
                    this.serie.color = value;
                }
            }
        }
        /**
         * Returns the name or originalname of the serie corresponding to the edit mode
         *
         * @type {string}
         * @memberof SerieNode
         */
        get name() {
            if (this._name != undefined) {
                return this._name;
            }
            else {
                if (this.serie != undefined) {
                    let dataModel = this.getDataModel();
                    if (dataModel != undefined) {
                        if (dataModel.editModeActive == true && this.serie.originalName != "") {
                            return this.serie.originalName;
                        }
                    }
                    return this.serie.name;
                }
                return "";
            }
        }
        /**
         * Sets the name of the serie
         *
         * @memberof SerieNode
         */
        set name(value) {
            if (this._name != undefined) {
                this._name = value;
            }
            else {
                if (this.serie != undefined) {
                    this.serie.name = value;
                }
            }
        }
        /**
         * Returns the icon definition for this serieNode
         *
         * @type {string}
         * @memberof SerieNode
         */
        get iconDefinition() {
            let iconDefinition = "";
            if (this.nodeType == NodeType.container) {
                iconDefinition = this.getIconDefinitionForContainer();
            }
            else {
                iconDefinition = this.getIconDefinitionForNode();
            }
            return iconDefinition;
        }
        /**
         * Returns the iconDefinition in case of a container node
         *
         * @private
         * @returns
         * @memberof SerieNode
         */
        getIconDefinitionForContainer() {
            let classNames = "e-treegridcollapse treegridcollapse";
            // Add collapse/expand icon 
            if (this.expandState == true) {
                classNames += "e-treegridexpand treegridexpand";
            }
            return `<div class='` + classNames + `'></div>`;
        }
        /**
         * Returns the icon definition in case of a node(e.g. input param of calculation, output param of calculation, serie, ...)
         *
         * @private
         * @returns
         * @memberof SerieNode
         */
        getIconDefinitionForNode() {
            let iconDefinition = `<div class='e-doc' style='position: relative;height:16px;width:30px;margin:auto;float:left;margin-left:6px;margin-top:2px'>`;
            // Set main icon
            if (this.nodeType == NodeType.series) {
                if (this.serie != undefined) {
                    iconDefinition += this.serie.getIcon();
                }
                else {
                    console.warn("No serie info available for getting icon!");
                }
            }
            else if (this.nodeType == NodeType.calculationOutputParam) {
                iconDefinition += '<img class="treeGridRowIcon" src="../app/widgets/signalManagerWidget/style/images/tree/calculationOutput.svg" />';
                if (this.serie != undefined && !this.serie.rawPointsValid) {
                    // Set exclamation overlay for invalid series
                    let tooltipText = "The data is invalid!"; // Default tooltiptext in case of invalid data
                    let errorText = this.serie.getErrorText();
                    if (errorText != "") {
                        tooltipText = errorText; // Use error info text for tooltip text
                    }
                    iconDefinition += `<img title="` + tooltipText + `" class="treeGridRowIcon" src="` + this.serie.getSpecificIcon("exclamationOverlay") + `" />`;
                }
            }
            else if (this.nodeType == NodeType.calculationInputParam) {
                iconDefinition += '<img class="treeGridRowIcon" src="../app/widgets/signalManagerWidget/style/images/tree/calculationInput.svg" />';
            }
            iconDefinition += `</div>`;
            return iconDefinition;
        }
        /**
         * Set icon definiton => not implemented; Setter only needed for use as field for the syncfusion tree grid
         *
         * @memberof SerieNode
         */
        set iconDefinition(value) {
            // this._iconDefinition = value;
        }
        /**
         * Returns the parent of this node
         *
         * @type {(ISerieContainer | undefined)}
         * @memberof SerieNode
         */
        get parent() {
            return this._parent;
        }
        /**
         * Sets the parent of this node
         *
         * @memberof SerieNode
         */
        set parent(value) {
            if (this.serie != undefined) {
                if (value != undefined) {
                    this.serie.parent = value.getSerieGroup();
                }
                else {
                    this.serie.parent = undefined;
                }
            }
            this._parent = value;
        }
        /**
         * Returns the serie of this node
         *
         * @type {(BaseSeries | undefined)}
         * @memberof SerieNode
         */
        get serie() {
            return this._serie;
        }
        /**
         * Sets the serie of this node
         *
         * @memberof SerieNode
         */
        set serie(value) {
            if (value != this._serie) {
                if (this._serie != undefined) { // Detach old serie events
                    if (value != undefined) {
                        // update new serie to parent group info
                        value.startTriggerTime = this._serie.startTriggerTime;
                        value.parent = this._serie.parent;
                    }
                    this._serie.eventDataChanged.detach(this._onSerieDataChangedHandler);
                    if (this.nodeType == NodeType.calculationOutputParam || this.nodeType == NodeType.series) {
                        let datamodel = this.getDataModel();
                        if (datamodel != undefined) {
                            if (datamodel.seriesProvider != undefined) {
                                datamodel.seriesProvider.remove(this._serie.id);
                            }
                        }
                    }
                }
                this._serie = value;
                if (this._serie != undefined) { // Attach new serie events
                    this._serie.eventDataChanged.attach(this._onSerieDataChangedHandler);
                }
            }
        }
        /**
         * Returns the value of this node
         *
         * @type {(string|undefined)}
         * @memberof SerieNode
         */
        get value() {
            if (this._serie != undefined) {
                if (this._serie.name != this._serie.originalName) { // Only show name(alias) in value column if different to the original name in the name column
                    return this._serie.name;
                }
                return "";
            }
            return undefined;
        }
        /**
         * Sets the value of this node
         *
         * @memberof SerieNode
         */
        set value(value) {
            if (this._serie != undefined && value != undefined) {
                if (value == "") { // if empty name => use original name from signal
                    this._serie.resetName();
                }
                else {
                    this._serie.name = value;
                }
            }
        }
        /**
         * Creates an instance of SerieNode
         * @param {(string|undefined)} name
         * @param {(BaseSeries|undefined)} [serie=undefined]
         * @memberof SerieNode
         */
        constructor(name, serie = undefined) {
            this.eventDataChanged = new EventDataChanged();
            this.eventSerieDataChanged = new EventSerieDataChanged();
            this._onSerieDataChangedHandler = (sender, args) => this.onSerieDataChanged(sender, args);
            this._color = undefined;
            this._name = name;
            this.canDelete = true;
            this.serie = serie;
        }
        /**
         * Dispose the SerieNode
         *
         * @memberof SerieNode
         */
        dispose() {
            this.disposeSerie();
        }
        /**
         * Dispose the serie of this object
         *
         * @private
         * @memberof SerieNode
         */
        disposeSerie() {
            if (this.serie != undefined) {
                if (this.nodeType == NodeType.calculationOutputParam || this.nodeType == NodeType.series) {
                    // Only dispose serie if this node is the original series and not only a link to a series
                    let datamodel = this.getDataModel();
                    if (datamodel != undefined) {
                        if (datamodel.seriesProvider != undefined) {
                            datamodel.seriesProvider.remove(this.serie.id);
                        }
                    }
                }
            }
        }
        /**
         * Clones the calculated serie
         *
         * @returns
         * @memberof CalculatedSignal
         */
        clone() {
            let serieClone;
            if (this.serie != undefined) {
                serieClone = this.serie.clone();
            }
            // TODO: check clone (name undefined or from data)
            let clonedSerieNode = new SerieNode_1(undefined, serieClone);
            return clonedSerieNode;
        }
        /**
         * Returns the datamodel of this node
         *
         * @returns {(ISignalManagerDataModel|undefined)}
         * @memberof SerieNode
         */
        getDataModel() {
            let parent = this.parent;
            let lastKnownParent = parent;
            do {
                if (parent != undefined) {
                    lastKnownParent = parent;
                    parent = parent.parent;
                }
            } while (parent != undefined);
            if (lastKnownParent != undefined) {
                if (lastKnownParent.nodeType == NodeType.root) {
                    return lastKnownParent.dataModel;
                }
            }
            return undefined;
        }
        /**
         * Returns the serie group to which this node belongs
         *
         * @returns {(ISerieGroup|undefined)}
         * @memberof SerieNode
         */
        getSerieGroup() {
            if (this.isSerieGroup == true) {
                return this;
            }
            if (this.parent != undefined) {
                if (this.parent.isSerieGroup == true) {
                    return this.parent;
                }
                else {
                    return this.parent.getSerieGroup();
                }
            }
            return undefined;
        }
        /**
         * Raises the data changed event
         *
         * @protected
         * @param {*} sender
         * @param {EventSignalManagerDataChangedArgs} args
         * @memberof SerieNode
         */
        onDataChanged(sender, args) {
            this.eventDataChanged.raise(sender, args);
            if (this.serie != undefined) {
                persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(this.serie.persistID, this.serie.getSettings());
            }
        }
        /**
         * Raises the serie data cahnged event
         *
         * @protected
         * @param {*} sender
         * @param {EventSerieDataChangedArgs} args
         * @memberof SerieNode
         */
        onSerieDataChanged(sender, args) {
            this.eventSerieDataChanged.raise(sender, args);
        }
    };
    SerieNode = SerieNode_1 = __decorate([
        mco.role()
    ], SerieNode);
    exports.SerieNode = SerieNode;
});
