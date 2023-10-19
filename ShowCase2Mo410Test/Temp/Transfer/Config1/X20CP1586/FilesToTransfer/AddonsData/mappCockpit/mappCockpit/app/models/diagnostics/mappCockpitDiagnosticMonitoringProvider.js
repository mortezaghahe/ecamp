var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../../communication/rest/opcUaWebSocket", "../../communication/rest/opcUaRestServices", "../../framework/events", "../../framework/interfaces/observer"], function (require, exports, opcUaWebSocket_1, opcUaRestServices_1, events_1, observer_1) {
    "use strict";
    var MonitoringSubscription_1, MonitoringSubscriptionItem_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventObservedItemsChangedArgs = exports.MappCockpitDiagnosticMonitoringProvider = void 0;
    let EventObservedItemsChanged = class EventObservedItemsChanged extends events_1.TypedEvent {
    };
    EventObservedItemsChanged = __decorate([
        mco.role()
    ], EventObservedItemsChanged);
    ;
    let EventObservedSubscriptionItemsChanged = class EventObservedSubscriptionItemsChanged extends events_1.TypedEvent {
    };
    EventObservedSubscriptionItemsChanged = __decorate([
        mco.role()
    ], EventObservedSubscriptionItemsChanged);
    ;
    let EventObservedItemsChangedArgs = class EventObservedItemsChangedArgs {
        constructor(observer, subscription, changedItems) {
            this._observer = observer;
            this._monitoringSubscription = subscription;
            this._changedMonitoredItems = changedItems;
        }
        get observer() {
            return this._observer;
        }
        get subscription() {
            return this._monitoringSubscription;
        }
        get changedItems() {
            return this._changedMonitoredItems;
        }
    };
    EventObservedItemsChangedArgs = __decorate([
        mco.role()
    ], EventObservedItemsChangedArgs);
    exports.EventObservedItemsChangedArgs = EventObservedItemsChangedArgs;
    ;
    /**
     * implements observation and monitoring of diagnostic elements
     *
     * @class MappCockpitDiagnosticMonitoringProvider
     */
    let MappCockpitDiagnosticMonitoringProvider = class MappCockpitDiagnosticMonitoringProvider {
        /**
         *Creates an instance of MappCockpitDiagnosticMonitoringProvider.
         * @param {MappCockpitDiagnosticProvider} diagnosticProvider
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        constructor(diagnosticProvider) {
            this._opcUaWebSocketHandler = (sender, eventArgs) => { this.handleOpcUaEvent(eventArgs); };
            this._observedItemsChangedHandler = (sender, eventArgs) => { this.eventObservedItemsChanged.raise(this, eventArgs); };
            this._diagnosticProvider = diagnosticProvider;
            this._monitoringSubscriptions = new MonitoringSubscriptionCollection();
            this.eventObservedItemsChanged = new EventObservedItemsChanged();
        }
        /**
         * creates a connection for listening to events from opc-ua
         *
         * @private
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        createOpcUaSocket() {
            return __awaiter(this, void 0, void 0, function* () {
                this._opcUaWebSocket = opcUaWebSocket_1.OpcUaWebSocket.create();
                this._opcUaWebSocket.eventOpcUaWebSocket.attach(this._opcUaWebSocketHandler);
                return yield this._opcUaWebSocket.connect();
            });
        }
        /**
         * activates observing parameter changes.
         *
         * @param {*} observer
         * @param {number} sessionId
         * @param {MappCockpitComponentItem[]} componentParameters
         * @returns {Promise<void>}
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        observeComponentModelItems(observer, sessionId, componentParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // get the subscription for the observer or create a new one
                    let subscription = this.findSubscriptionForObserver(observer, sessionId);
                    // create a new subscription if not yet available.
                    if (!subscription) {
                        subscription = yield MonitoringSubscription.create(observer, sessionId);
                        // add the new subscription to the subscription collection
                        this._monitoringSubscriptions.add(subscription);
                    }
                    if (subscription) {
                        // attach items changed event and forward it through the provider
                        subscription.eventObservedItemsChanged.attach(this._observedItemsChangedHandler);
                        // create the items to monitor
                        yield subscription.createMonitoredItems(componentParameters);
                        console.log("MappCockpitDiagnosticMonitoringProvider:created subscription: %o %o %o %o", observer, componentParameters, subscription.id, subscription);
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        }
        /**
         * Gets the subscription for the observer.
         *
         * @private
         * @param {*} observer
         * @param {number} sessionId
         * @returns
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        findSubscriptionForObserver(observer, sessionId) {
            // find a subscription for this observer.
            let existingSubscription = this._monitoringSubscriptions.items.filter((subscription) => { return subscription.observer == observer; });
            // check if a subscription for this observer already exists.
            if (existingSubscription.length >= 1) {
                // return the existing subscription ...
                return existingSubscription[0];
            }
            else {
                return null;
            }
        }
        /**
         * Unobserves the passed items.
         *
         * @param {*} observer
         * @param {number} sessionId
         * @param {MappCockpitComponentItem[]} observedItems
         * @param {boolean} suspend
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        unobserveComponentModelItems(observer, sessionId, observedItems, suspend) {
            return __awaiter(this, void 0, void 0, function* () {
                let subscription = this.findSubscriptionForObserver(observer, sessionId);
                if (subscription) {
                    if (observedItems.length === 0) {
                        // if no observables are specified, we delete the whole subscription to remove all contained monitored items
                        subscription.eventObservedItemsChanged.detach(this._observedItemsChangedHandler);
                        let deletedSubscriptionId = yield this.deleteSubscription(sessionId, subscription);
                        console.log("MappCockpitDiagnosticMonitoringProvider.unobserveComponentModelItems:deleted subscription - observer:%o :subscriptionId:%o", subscription.observer, deletedSubscriptionId);
                    }
                    else {
                        // otherwise we delete the specified items
                        try {
                            // create the items to monitor
                            yield subscription.deleteMontitoredItems(observedItems);
                            console.log("MappCockpitDiagnosticMonitoringProvider.unobserveComponentModelItems:removed items - observer:%o :items %o, subscriptionId:%o", subscription.observer, observedItems, subscription.id);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
            });
        }
        /**
         * Deletes a subscription with its monitored items.
         *
         * @private
         * @param {number} sessionId
         * @param {MonitoringSubscription} subscription
         * @returns {Promise<number>}
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        deleteSubscription(sessionId, subscription) {
            return __awaiter(this, void 0, void 0, function* () {
                let deletedSubscriptionId = -1;
                try {
                    // delete the subscription on the target
                    deletedSubscriptionId = yield MonitoringSubscription.delete(sessionId, subscription.id);
                    // remove the subscription instance from the list
                    this._monitoringSubscriptions.remove(subscription);
                }
                catch (error) {
                    console.error(error);
                }
                return deletedSubscriptionId;
            });
        }
        /**
         * handles opc-ua events
         *
         * @param {OpcUaWebSocketEventArgs} eventArgs
         * @returns {*}
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        handleOpcUaEvent(eventArgs) {
            switch (eventArgs.type) {
                case opcUaWebSocket_1.SockeEventType.MESSAGE:
                    this.processOpcUaDataChanged(eventArgs.data);
                    break;
                default:
                    break;
            }
        }
        /**
         * receives the data changed and distributes it to consumers
         *
         * @private
         * @param {IOpcUaDataChanged} opcUaDataChangedInfo
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        processOpcUaDataChanged(opcUaDataChangedInfo) {
            let modifiedSubscription = this._monitoringSubscriptions.findById(opcUaDataChangedInfo.subscriptionId);
            if (modifiedSubscription) {
                modifiedSubscription.processItemChanges(opcUaDataChangedInfo);
            }
        }
        /**
         * closes the monitoring provider and all its connections
         *
         * @returns {*}
         * @memberof MappCockpitDiagnosticMonitoringProvider
         */
        close() {
            if (this._opcUaWebSocket) {
                this._opcUaWebSocket.eventOpcUaWebSocket.detach(this._opcUaWebSocketHandler);
                this._opcUaWebSocket.close();
            }
        }
    };
    MappCockpitDiagnosticMonitoringProvider = __decorate([
        mco.role()
    ], MappCockpitDiagnosticMonitoringProvider);
    exports.MappCockpitDiagnosticMonitoringProvider = MappCockpitDiagnosticMonitoringProvider;
    /**
     * the class holds and manages subscriptions.
     *
     * @class MonitoringSubscriptionSet
     */
    let MonitoringSubscriptionCollection = class MonitoringSubscriptionCollection {
        /**
         *Creates an instance of MonitoringSubscriptionCollection.
         * @memberof MonitoringSubscriptionCollection
         */
        constructor() {
            // the subscription instances are stored with id as key on a simple object
            this._subscriptions = new Map();
        }
        /**
         * adds a new subcription
         *
         * @param {MonitoringSubscription} subscription
         * @memberof MonitoringSubscriptionCollection
         */
        add(subscription) {
            // store the subscription by id
            this._subscriptions.set(subscription.id, subscription);
        }
        /**
         * removes the given subscription
         *
         * @param {MonitoringSubscription} subscription
         * @memberof MonitoringSubscriptionCollection
         */
        remove(subscription) {
            this._subscriptions.delete(subscription.id);
        }
        /**
         * returns the subscription with the requested id
         *
         * @param {number} subscriptionId
         * @memberof MonitoringSubscriptionCollection
         */
        findById(subscriptionId) {
            // retrieve the available subscription
            return this._subscriptions.get(subscriptionId);
        }
        /**
         * gets the available subscriptions
         *
         * @readonly
         * @type {Array<MonitoringSubscription>}
         * @memberof MonitoringSubscriptionCollection
         */
        get items() {
            return Array.from(this._subscriptions.values());
        }
    };
    MonitoringSubscriptionCollection = __decorate([
        mco.role()
    ], MonitoringSubscriptionCollection);
    /**
     * implements managing a set of monitoring items in a subscription
     *
     * @class MonitoringSubscription
     */
    let MonitoringSubscription = MonitoringSubscription_1 = class MonitoringSubscription {
        /**
         * Creates an instance of MonitoringSubscription.
         * @param {*} observer
         * @param {*} sessionId
         * @param {number} subscriptionId
         * @memberof MonitoringSubscription
         */
        constructor(observer, sessionId, subscriptionId) {
            // holds the subscription id
            this._subscriptionId = -1;
            // holds a collection of items to be monitored
            this._monitoringItems = new Map();
            // holds the next possible client id
            this._nextClientId = 0;
            this._subscriptionObserver = observer;
            this._sessionId = sessionId;
            this._subscriptionId = subscriptionId;
            this._monitoringItems = new Map();
            this.eventObservedItemsChanged = new EventObservedSubscriptionItemsChanged();
        }
        /**
         * returns the subscription id
         *
         * @readonly
         * @memberof MonitoringSubscription
         */
        get id() {
            return this._subscriptionId;
        }
        /**
         * returns the observer interrested in change notifications
         *
         * @readonly
         * @type {*}
         * @memberof MonitoringSubscription
         */
        get observer() {
            return this._subscriptionObserver;
        }
        /**
         * returns the monitored item with the specefied id
         *
         * @param {*} clientId
         * @returns {MappCockpitComponentParameter}
         * @memberof MonitoringSubscription
         */
        getMonitoredItemById(clientId) {
            return this._monitoringItems.get(clientId);
        }
        /**
         * creates a new monitoring subscription.
         *
         * @static
         * @param {*} observer
         * @param {number} sessionId
         * @returns {Promise<MonitoringSubscription>}
         * @memberof MonitoringSubscription
         */
        static create(observer, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                let subscriptionId = yield opcUaRestServices_1.OpcUaRestServices.createSubscription(sessionId);
                return new MonitoringSubscription_1(observer, sessionId, subscriptionId);
            });
        }
        /**
         * Deletes the specified subscription
         *
         * @static
         * @param {number} sessionId
         * @param {number} subscriptionId
         * @returns {Promise<number>}
         * @memberof MonitoringSubscription
         */
        static delete(sessionId, subscriptionId) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield opcUaRestServices_1.OpcUaRestServices.deleteSubscription(sessionId, subscriptionId);
            });
        }
        /**
         * creates a set of items to be monitored
         *
         * @param {MappCockpitComponentParameter[]} componentParameters
         * @returns {Promise<any>}
         * @memberof MonitoringSubscription
         */
        createMonitoredItems(componentParameters) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // create the items to be observed
                    let newMonitoredItems = Array.from(this.createMonitoredSubscriptionItems(componentParameters).values());
                    //// activate batching
                    // create a specific service instance for batching
                    // OpcUaRestServices.activateBatching();
                    const createMonitoredItemsBatchServices = opcUaRestServices_1.OpcUaRestServices.create();
                    createMonitoredItemsBatchServices.activateBatching();
                    // invoke the creation of the new monitored items
                    yield this.invokeCreateMonitoredSubscriptionItems(createMonitoredItemsBatchServices, newMonitoredItems);
                    // execute batch request
                    let createMonitoredItemsResult = yield createMonitoredItemsBatchServices.executeBatchRequest();
                    // process the batch request result by connecting the monitored item ids ..
                    createMonitoredItemsResult.forEach((responseValue, requestId) => {
                        const requestedItem = newMonitoredItems[requestId];
                        // update the monitoring items id.
                        if (requestedItem != undefined) {
                            requestedItem.id = responseValue.monitoredItemId;
                        }
                        else {
                            console.error("requestedItem == undefined");
                            console.error(this);
                            console.error(newMonitoredItems);
                        }
                    }, this);
                }
                catch (error) {
                    console.error(error);
                }
                console.log("MonitoringSubscription:createMonitoredItems: %o", componentParameters);
            });
        }
        /**
         * Adds new monitored items.
         *
         * @private
         * @param {MappCockpitComponentItem[]} componentItems
         * @memberof MonitoringSubscription
         */
        createMonitoredSubscriptionItems(componentItems) {
            const newMonitoredItems = new Map();
            componentItems.forEach((componentItem) => {
                // create the monotored item for the values
                this.addNewMonitoringItem(componentItem, newMonitoredItems, opcUaRestServices_1.OpcUaAttribute.VALUE);
                // create the monotored item for the user access level
                this.addNewMonitoringItem(componentItem, newMonitoredItems, opcUaRestServices_1.OpcUaAttribute.USER_ACCESS_LEVEL);
            });
            return newMonitoredItems;
        }
        /**
         * Adds a new monitoring item to the subscription.
         *
         * @private
         * @param {MappCockpitComponentItem} componentItem
         * @param {Map<number, MonitoringSubscriptionItem>} newMonitoredItems
         * @memberof MonitoringSubscription
         */
        addNewMonitoringItem(componentItem, newMonitoredItems, opcUaAttribute) {
            // get the next client handle
            let clientHandle = this.getNextClientHandle();
            // create a new monitoring item instance
            let newMonitorItem = MonitoringSubscriptionItem.create(componentItem, opcUaAttribute, clientHandle);
            // add it to the subscription items collection
            this._monitoringItems.set(clientHandle, newMonitorItem);
            // add it to the subscription items
            newMonitoredItems.set(clientHandle, newMonitorItem);
        }
        /**
         * Creates the monitored subscription items
         *
         * @private
         * @param {MappCockpitComponentItem[]} componentItems
         * @returns
         * @memberof MonitoringSubscription
         */
        invokeCreateMonitoredSubscriptionItems(createMonitoredItemsBatchServices, monitoringItems) {
            return __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < monitoringItems.length; i++) {
                    const monitoringItem = monitoringItems[i];
                    yield createMonitoredItemsBatchServices.createMonitoredItem(this._sessionId, this._subscriptionId, monitoringItem.monitoringObject.id, monitoringItem.clientId, opcUaRestServices_1.OpcUaRestServices.monitoringSamplingInterval, monitoringItem.monitoringProperty);
                }
            });
        }
        /**
         *
         *
         * @private
         * @returns {number}
         * @memberof MonitoringSubscription
         */
        getNextClientHandle() {
            // get the next client id and set it to the next value. This ensures a unique id over the subscription lifetime when removing and readding monitored items.
            return this._nextClientId++;
        }
        /**
         * Removes the specified observales from the subscription
         *
         * @memberof MonitoringSubscription
         */
        deleteMontitoredItems(observedItems) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // if there is something to remove ....
                    if (this._monitoringItems.size > 0) {
                        // activate batching
                        const deleteMonitoredItemsBatchServices = opcUaRestServices_1.OpcUaRestServices.create();
                        deleteMonitoredItemsBatchServices.activateBatching();
                        // create the requests for removing the monitored items.
                        let obsoleteMonitoringItemsToDelete = yield this.getObsoleteMonitoredItems(observedItems, deleteMonitoredItemsBatchServices);
                        try {
                            // execute batch request for unsubscribing the obsolete monitored items
                            const deletedResult = yield deleteMonitoredItemsBatchServices.executeBatchRequest();
                            //TODO: match the deleted keys of the result to the requested items and delete. Currently the order and number of requests strictly needs to match the responses,
                            // which is typically the case.
                            // remove monitored items after unsubscribing them
                            this.deleteManagedMonitoredItems(obsoleteMonitoringItemsToDelete);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            });
        }
        /**
         * Deletes the obsolete items from the managed collection
         *
         * @private
         * @param {MonitoringSubscriptionItem[]} obsoleteMonitoringItemsToDelete
         * @memberof MonitoringSubscription
         */
        deleteManagedMonitoredItems(obsoleteMonitoringItemsToDelete) {
            // find the obsolete and deleted items in the collection and delete it.
            const monitoringEntries = Array.from(this._monitoringItems.entries());
            obsoleteMonitoringItemsToDelete.forEach((obsoleteItem) => {
                const obsoleteMonitoringItem = monitoringEntries.forEach((item) => {
                    if (item[1] === obsoleteItem) {
                        this._monitoringItems.delete(item[0]);
                    }
                });
            });
        }
        /**
         * Collects the obsolete minitored items to be deleted
         *
         * @private
         * @param {MappCockpitComponentItem[]} observedItems
         * @param {OpcUaRestServiceProvider} deleteMonitoredItemsBatchServices
         * @returns
         * @memberof MonitoringSubscription
         */
        getObsoleteMonitoredItems(observedItems, deleteMonitoredItemsBatchServices) {
            return __awaiter(this, void 0, void 0, function* () {
                let obsoleteMonitoringItemsToDelete = [];
                for (let i = 0; i < observedItems.length; i++) {
                    // find corresponding monidored items
                    const obsoleteMonitoringItems = this.findObservedSubscriptionItems(observedItems[i]);
                    // if there are items to remove ....
                    if (obsoleteMonitoringItems.length > 0) {
                        // remove all monitoring items of the observed item
                        for (let i = 0; i < obsoleteMonitoringItems.length; i++) {
                            const itemDeleted = yield this.removeMonitoredSubscriptionItem(deleteMonitoredItemsBatchServices, obsoleteMonitoringItems[i]);
                            if (itemDeleted) {
                                obsoleteMonitoringItemsToDelete.push(itemDeleted);
                            }
                        }
                    }
                }
                return obsoleteMonitoringItemsToDelete;
            });
        }
        /**
         * Finds all monitoring items with matching monitoringObjet.id
         *
         * @private
         * @param {any[]} observedItems
         * @param {number} i
         * @returns
         * @memberof MonitoringSubscription
         */
        findObservedSubscriptionItems(observedItem) {
            // get the key of a matching item ( the monitoring object ids need to be the same)
            const monitoringItems = Array.from(this._monitoringItems.values()).filter((item) => { return item.monitoringObject.id === observedItem.id; });
            return monitoringItems;
        }
        /**
         * Removes the monitored item from the subscription
         *
         * @private
         * @param {any[]} observedItems
         * @param {number} itemKey
         * @param {MonitoringSubscriptionItem} subscriptionItem
         * @memberof MonitoringSubscription
         */
        removeMonitoredSubscriptionItem(deleteMonitoredItemsBatchServices, subscriptionItem) {
            return __awaiter(this, void 0, void 0, function* () {
                const monitoringEntries = Array.from(this._monitoringItems.entries());
                // filter the items matching the item id and attribute/property name
                const obsoleteMonitoringItem = monitoringEntries.find((item) => {
                    return (item[1].monitoringObject.id === subscriptionItem.monitoringObject.id)
                        && (item[1].monitoringProperty === subscriptionItem.monitoringProperty);
                });
                if (obsoleteMonitoringItem) {
                    // get the item entry
                    const obsoleteItem = obsoleteMonitoringItem[1];
                    // remove obsolete item from the subscription.
                    yield deleteMonitoredItemsBatchServices.deleteMonitoredItem(this._sessionId, this._subscriptionId, obsoleteItem.id);
                    return subscriptionItem;
                }
                return null;
            });
        }
        /**
         * handles the processing of item changes
         *
         * @param {IOpcUaDataChanged} opcUaDataChangedInfo
         * @returns {*}
         * @memberof MonitoringSubscription
         */
        processItemChanges(opcUaDataChangedInfo) {
            let changedObservables = new Array();
            opcUaDataChangedInfo.DataNotifications.forEach(dataNotification => {
                // get the item to change
                let monitorItem = this.getMonitoredItemById(dataNotification.clientHandle);
                if (monitorItem) {
                    // update the items value
                    monitorItem.changeValue(dataNotification.value);
                    // add it to the modified observables list
                    changedObservables.push(new observer_1.Observable(monitorItem.monitoringObject, monitorItem.monitoringProperty));
                }
                else {
                    throw new Error('MappCockpitDiagnosticMonitoringProvider.processOpcUaDataChanged: Could not find monitored item ' + JSON.stringify(dataNotification));
                }
            });
            this.onMonitorItemsChanged(this, changedObservables);
        }
        /**
         * notifies from updateing observed items
         *
         * @param {MonitoringSubscription} changedSubscription
         * @param {Observable[]} changedObservables
         * @returns {*}
         * @memberof MonitoringSubscription
         */
        onMonitorItemsChanged(changedSubscription, changedObservables) {
            let changedEventArgs = new EventObservedItemsChangedArgs(changedSubscription.observer, changedSubscription, changedObservables);
            this.eventObservedItemsChanged.raise(this, changedEventArgs);
            this.notifyObserverFromChanges(changedSubscription.observer, changedObservables);
        }
        /**
         * notifies the observer from changes if the observer implements the notification interface
         *
         * @private
         * @param {IObserver} observer
         * @param {Observables[]} changedObservables
         * @memberof MonitoringSubscription
         */
        notifyObserverFromChanges(observer, changedObservables) {
            if (observer.onObservablesChanged) {
                observer.onObservablesChanged(changedObservables);
            }
        }
    };
    MonitoringSubscription = MonitoringSubscription_1 = __decorate([
        mco.role()
    ], MonitoringSubscription);
    /**
     * The class holds information about the subsripted item
     *
     * @class MonitoringSubscriptionItem
     */
    let MonitoringSubscriptionItem = MonitoringSubscriptionItem_1 = class MonitoringSubscriptionItem {
        /**
         * Creates an instance of MonitoringSubscriptionItem.
         * @param {*} monitoringObject
         * @param {string} monitoringProperty
         * @memberof MonitoringSubscriptionItem
         */
        constructor(monitoringObject, monitoringProperty, clientId) {
            // holds the item instance
            this._monitorItemInstance = undefined;
            // holds the property name of the item to watch
            this._monitoringProperty = "";
            // holds the monitor item id
            this._id = "";
            // holds client id 
            this._clientId = -1;
            this._monitorItemInstance = monitoringObject;
            this._monitoringProperty = monitoringProperty;
            this._clientId = clientId;
        }
        /**
         * Gets the monitoring object
         *
         * @readonly
         * @type {*}
         * @memberof MonitoringSubscriptionItem
         */
        get monitoringObject() {
            return this._monitorItemInstance;
        }
        /**
         * Gets the monitoring property
         *
         * @readonly
         * @type {string}
         * @memberof MonitoringSubscriptionItem
         */
        get monitoringProperty() {
            return this._monitoringProperty;
        }
        /**
         * Gets the client id
         *
         * @readonly
         * @type {number}
         * @memberof MonitoringSubscriptionItem
         */
        get clientId() {
            return this._clientId;
        }
        get id() {
            return this._id;
        }
        set id(id) {
            this._id = id;
        }
        /**
         * creates and initializes a new monitoring item
         *
         * @static
         * @param {MappCockpitComponentItem} monitoringObject
         * @param {string} monitoringProperty
         * @param {number} clientId
         * @returns {MonitoringSubscriptionItem}
         * @memberof MonitoringSubscriptionItem
         */
        static create(monitoringObject, monitoringProperty, clientId) {
            return new MonitoringSubscriptionItem_1(monitoringObject, monitoringProperty, clientId);
        }
        /**
         * Updates the specified item property with the new value
         *
         * @param {*} newMonitoredItemValue
         * @returns {*}
         * @memberof MonitoringSubscriptionItem
         */
        changeValue(newMonitoredItemValue) {
            switch (this.monitoringProperty) {
                case "Value":
                    // set object value
                    this.monitoringObject.value = newMonitoredItemValue;
                    break;
                case "UserAccessLevel":
                    // set writeable attribute according to the access level
                    let newWriteableState = (newMonitoredItemValue & opcUaRestServices_1.OpcUaAccessLevel.CurrentWrite) == opcUaRestServices_1.OpcUaAccessLevel.CurrentWrite;
                    this.monitoringObject.isWriteable.value = newWriteableState;
                    console.log("MonitoringSubscriptionItem - updated writeable %o %o", this.monitoringObject.browseName + ".isWriteable = ", this.monitoringObject.isWriteable);
                    break;
                default:
                    break;
            }
        }
    };
    MonitoringSubscriptionItem = MonitoringSubscriptionItem_1 = __decorate([
        mco.role()
    ], MonitoringSubscriptionItem);
});
