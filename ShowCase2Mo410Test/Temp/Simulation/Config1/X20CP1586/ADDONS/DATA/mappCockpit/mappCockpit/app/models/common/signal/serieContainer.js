var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../signalManagerDataModel/eventSignalManagerDataChangedArgs", "./serieNode"], function (require, exports, eventSignalManagerDataChangedArgs_1, serieNode_1) {
    "use strict";
    var SerieContainer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SerieContainer = void 0;
    let SerieContainer = SerieContainer_1 = class SerieContainer extends serieNode_1.SerieNode {
        get visibleChilds() {
            return this.childs;
        }
        get parent() {
            return this._parent;
        }
        set parent(value) {
            this._parent = value;
            // Also set parent to child containers
            this.childs.forEach((child) => {
                child.parent = this;
            });
        }
        get color() {
            return undefined;
        }
        get name() {
            if (this._name != undefined) {
                return this._name;
            }
            else {
                return "";
            }
        }
        set name(value) {
            this._name = value;
        }
        get nodeType() {
            return serieNode_1.NodeType.container;
        }
        /**
         * Creates an instance of SerieContainer
         * @param {string} name
         * @param {string} [id=""]
         * @param {boolean} [expandState=true]
         * @memberof SerieContainer
         */
        constructor(name, id = "", expandState = true) {
            super(name, undefined);
            this._serieDataChangedHandler = (sender, args) => this.onDataChanged(sender, args);
            this._serieContainerDataChangedHandler = (sender, args) => this.onDataChanged(sender, args);
            this._name = name;
            this.id = id;
            this.expandState = expandState;
            this.childs = new Array();
            // Removing of the container is possible by default
            this.canDelete = true;
        }
        /**
         * Dispose the SerieContainer
         *
         * @memberof SerieContainer
         */
        dispose() {
            super.dispose();
        }
        /**
         * Removes all serieNodes and serieContainers from this container
         *
         * @memberof SerieContainer
         */
        clear() {
            for (let i = 0; i < this.childs.length; i++) {
                let child = this.childs[i];
                if (child instanceof SerieContainer_1) {
                    // Remove all childs of this container
                    child.clear();
                    if (child.canDelete == true) {
                        // remove container if deletable
                        this.removeSerieContainer(child);
                        i--;
                    }
                }
                else {
                    this.removeSerieNode(child);
                    i--;
                }
            }
        }
        /**
         * Returns all childs of this container
         *
         * @returns {Array<ISerieNode>}
         * @memberof SerieContainer
         */
        getChilds() {
            return this.childs;
        }
        /**
         * Clones this SerieContainer
         *
         * @returns {ISerieNode}
         * @memberof SerieContainer
         */
        clone() {
            return new SerieContainer_1(this.name, this.id, this.expandState);
        }
        /**
         * Adds a serie node to this serie container
         *
         * @param {ISerieNode} serieNode
         * @param {number} [index=-1]
         * @memberof SerieContainer
         */
        addSerieNode(serieNode, index = -1) {
            if (index == -1 || index >= this.childs.length) {
                this.childs.push(serieNode);
            }
            else {
                this.childs.splice(index, 0, serieNode);
            }
            serieNode.parent = this;
            serieNode.eventDataChanged.attach(this._serieDataChangedHandler);
            this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.add, serieNode));
        }
        /**
         * Removes a serie node from this serie container
         *
         * @param {ISerieNode} serieNode
         * @memberof SerieContainer
         */
        removeSerieNode(serieNode) {
            const index = this.childs.indexOf(serieNode, 0);
            if (index > -1) {
                serieNode.eventDataChanged.detach(this._serieDataChangedHandler);
                // Remove references to this serie node if available
                this.removeReferences(serieNode);
                this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.remove, serieNode));
                serieNode.dispose();
                serieNode.parent = undefined;
                this.childs.splice(index, 1);
            }
            else {
                // serie not found => look in sub containers
                for (let i = 0; i < this.childs.length; i++) {
                    if (this.childs[i] instanceof SerieContainer_1) {
                        this.childs[i].removeSerieNode(serieNode);
                    }
                }
            }
        }
        removeReferences(serieNode) {
            // serie node is no input data so remove all references to the serie in this serie node
            let serieGroup = serieNode.getSerieGroup();
            if (serieGroup != undefined) {
                serieGroup.removeReferencesToSerieNode(serieNode);
            }
        }
        /**
         * Returns the serieNode with the given seriename
         *
         * @param {string} serieName
         * @returns {(ISerieNode|undefined)}
         * @memberof SerieContainer
         */
        getSerieNode(serieName) {
            let serieNodes = this.getSerieNodes();
            for (let i = 0; i < serieNodes.length; i++) {
                let nodeName = serieNodes[i].name;
                let serie = serieNodes[i].serie;
                if (serie != undefined) {
                    nodeName = serie.name;
                }
                if (nodeName == serieName) {
                    return serieNodes[i];
                }
            }
            return undefined;
        }
        /**
         * Returns all series nodes within the container or sub container
         *
         * @param {string} [serieName=""]
         * @returns {Array<ISerieNode>}
         * @memberof SerieContainer
         */
        getSerieNodes(serieName = "") {
            let serieNodes = new Array();
            for (let i = 0; i < this.childs.length; i++) {
                let child = this.childs[i];
                if (child.serie != undefined) {
                    if (serieName == "" || child.serie.name == serieName) {
                        serieNodes.push(child);
                    }
                }
                else if (child instanceof SerieContainer_1) {
                    serieNodes = serieNodes.concat(child.getSerieNodes(serieName));
                }
            }
            return serieNodes;
        }
        /**
         * Returns all series within the container or sub container
         *
         * @returns {Array<BaseSeries>}
         * @memberof SerieContainer
         */
        getSeries() {
            let serieNodes = this.getSerieNodes();
            let series = new Array();
            for (let i = 0; i < serieNodes.length; i++) {
                let serie = serieNodes[i].serie;
                if (serie != undefined) {
                    series.push(serie);
                }
            }
            return series;
        }
        /**
         * Adds a serie container to this serie container
         *
         * @param {ISerieContainer} serieContainer
         * @param {number} [index=-1]  -1 to add at the end, else the index where to add
         * @memberof SerieContainer
         */
        addSerieContainer(serieContainer, index = -1) {
            if (index == -1 || index >= this.childs.length) {
                this.childs.push(serieContainer);
            }
            else {
                this.childs.splice(index, 0, serieContainer);
            }
            serieContainer.parent = this;
            serieContainer.eventDataChanged.attach(this._serieContainerDataChangedHandler);
            this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.add, serieContainer));
        }
        /**
          * Removes a serie container from this container
          *
          * @param {ISerieContainer} serieContainer
          * @memberof SerieContainer
          */
        removeSerieContainer(serieContainer) {
            const index = this.childs.indexOf(serieContainer, 0);
            if (index > -1) {
                serieContainer.eventDataChanged.detach(this._serieContainerDataChangedHandler);
                this.childs.splice(index, 1);
                this.onDataChanged(this, new eventSignalManagerDataChangedArgs_1.EventSignalManagerDataChangedArgs(eventSignalManagerDataChangedArgs_1.SignalManagerAction.remove, serieContainer));
            }
            else {
                // container not found => look in sub containers
                for (let i = 0; i < this.childs.length; i++) {
                    if (this.childs[i] instanceof SerieContainer_1) {
                        this.childs[i].removeSerieContainer(serieContainer);
                    }
                }
            }
        }
        /**
         * Returns the serie container with the given id if found, else undefined
         *
         * @param {string} serieContainerId
         * @returns {(ISerieContainer|undefined)}
         * @memberof SerieContainer
         */
        getSerieContainerById(serieContainerId) {
            for (let i = 0; i < this.childs.length; i++) {
                let node = this.childs[i];
                if (node instanceof SerieContainer_1) {
                    if (node.id == serieContainerId) {
                        return node;
                    }
                    let serieContainer = node.getSerieContainerById(serieContainerId);
                    if (serieContainer != undefined) {
                        return serieContainer;
                    }
                }
            }
            return undefined;
        }
    };
    SerieContainer = SerieContainer_1 = __decorate([
        mco.role()
    ], SerieContainer);
    exports.SerieContainer = SerieContainer;
});
