var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/utilities/dataBox", "../common/utilities/objectx", "./reflection/metaClassReflectionInfo", "../framework/reflection/decorators/metaClassPropertyDecorator", "./componentHub/common/commonTypes"], function (require, exports, dataBox_1, objectx_1, metaClassReflectionInfo_1, Reflection, commonTypes_1) {
    "use strict";
    var Property_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Property = void 0;
    /**
     * Implements a typed data link.
     *
     *
     *
     * @class Property
     * @template T
     */
    let Property = Property_1 = class Property {
        /**
         *Creates an instance of DataLink.
         *    @memberof Property
         */
        constructor(initialValue, valueReadRequest, valueWriteRequest, valueGetter = undefined) {
            // Holds the change notification callbacks    
            this._valueChangedCallbacks = [];
            // specifies a read response delegate called after a read has successfully been executed.
            this._readResponseDelegates = [];
            // specifies the read rejection delegates
            this._readRejectionResponseDelegates = [];
            // specifies a write response delegate called after a read has successfully been executed.
            this._writeResponseDelegate = undefined;
            // specifies a read response delegate called after a write request has  been rejected.
            this._writeResponseRejectionDelegate = undefined;
            // specifies the write rejection delegate
            this._writeRejectionResponseDelegate = undefined;
            // specifies the data link read request state
            this._readRequestState = PropertyRequestState.Ready;
            // specifies the data link read request state
            this._writeRequestState = PropertyRequestState.Ready;
            // holds observers
            this._observers = [];
            // holds accessors, meaning objects updating the property values
            this._accessors = [];
            this._valueReadRequestDelegate = valueReadRequest;
            this._valueWriteRequestDelegate = valueWriteRequest;
            this._value = initialValue;
            this._readRequestState = PropertyRequestState.Ready;
            this._writeRequestState = PropertyRequestState.Ready;
            this._valueGetter = valueGetter;
        }
        /**
         * Attaches an accessor instance.
         *
         * @param {object} accessorInstance
         * @memberof Property
         */
        attachAccessor(accessorInstance) {
            this.addAccessor(accessorInstance);
        }
        /**
         * Adds an accessor
         *
         * @private
         * @param {object} caller
         * @memberof Property
         */
        addAccessor(caller) {
            this.accessors.push(new PropertyClient(caller));
        }
        /**
         * Detaches the bound object as accessor
         *
         * @param {object} boundObject
         * @memberof Property
         */
        detachAccessor(boundObject) {
            // remove the client object from the accessors list
            this.removeAccessor(boundObject);
        }
        /**
         * Removes an accessor instance
         *
         * @private
         * @param {object} boundObject
         * @memberof Property
         */
        removeAccessor(boundObject) {
            this._accessors = this._accessors.filter((accessor) => { return accessor.client != boundObject; });
        }
        /**
         * Attaches the caller as observer
         *
         * @param {object} caller
         * @memberof Property
         */
        attachObserver(caller, propertyValueChangedDelegate, storeItemTypeConstructor = null) {
            // add the caller as observer
            this.addObserver(caller, propertyValueChangedDelegate);
            // get an initialization value.
            let initValue = this.getInitValue(storeItemTypeConstructor);
            // attach the change notification callback
            this.observePropertyValue(propertyValueChangedDelegate, storeItemTypeConstructor, initValue);
        }
        /**
         * Adds an observer instance
         *
         * @private
         * @param {object} caller
         * @param {T_PROPERTYCHANGED_HANDLER} propertyValueChangedDelegate
         * @memberof Property
         */
        addObserver(caller, propertyValueChangedDelegate) {
            this.observers.push(new PropertyClient(caller, propertyValueChangedDelegate));
        }
        /**
         * Obseres the property value and calls the specified changed delegate after changes.
         *
         * @private
         * @param {T_PROPERTYCHANGED_HANDLER} propertyValueChangedDelegate
         * @memberof Property
         */
        observePropertyValue(propertyValueChangedDelegate, storeItemTypeConstructor, initValue) {
            this.changed(propertyValueChangedDelegate, storeItemTypeConstructor, initValue);
        }
        /**
         * Detaches the bound object as accessor
         *
         * @param {object} boundObject
         * @memberof Property
         */
        detachObserver(boundObject) {
            // get the observer client object
            const observerClient = this._observers.find((observer) => { return observer.client === boundObject; });
            if (observerClient) {
                if (observerClient.valueChangedHandler) {
                    // remove the observers delegate from the changed notifications
                    this.removeValueChangedDelegate(observerClient.valueChangedHandler);
                    // remove the client object from the accessors list
                    this.removeObserver(observerClient);
                }
            }
        }
        /**
         * Removes an observer
         *
         * @private
         * @param {PropertyClient} observerClient
         * @memberof Property
         */
        removeObserver(observerClient) {
            this._observers = this._observers.filter((observer) => { return observer.client != observerClient.client; });
        }
        /**
         * Removes the specified value changed delagate
         *addval
         * @private
         * @param {PropertyClient} observerClient
         * @memberof Property
         */
        removeValueChangedDelegate(valueChangedDelegate) {
            this._valueChangedCallbacks = this._valueChangedCallbacks.filter((vaueChangedHandler) => { return vaueChangedHandler != valueChangedDelegate; });
        }
        /**
         * Returns true if the property is already observed by the specified instance
         *
         * @param {object} observer
         * @returns {boolean}
         * @memberof Property
         */
        isObservedBy(observerInstance) {
            return this.observers.find((observer) => { return observer.client === observerInstance; }) !== undefined;
        }
        /**
         * Returns true if the property is already registered to be accessed by the specified instance
         *
         * @param {object} accessor
         * @returns {boolean}
         * @memberof Property
         */
        isAccessedBy(accessorInstance) {
            return this.accessors.find((accessor) => { return accessor.client === accessorInstance; }) !== undefined;
        }
        /**
         * Gets true if the property is attached, meaning accessed or observed.
         *
         * @readonly
         * @type {boolean}
         * @memberof Property
         */
        get isAttached() {
            return this.observers.length > 0 || this.accessors.length > 0;
        }
        /**
         * Gets the properties observers
         *
         * @readonly
         * @type {Array<PropertyClient>}
         * @memberof Property
         */
        get observers() {
            return this._observers;
        }
        /**
         * Gets the properties accessors
         *
         * @readonly
         * @type { Array<PropertyClient> }
         * @memberof Property
         */
        get accessors() {
            return this._accessors;
        }
        /**
         * Creates a new DataLink object with the specified type
         *
         * @static
         * @template T
         * @param {T} initialValue
         * @returns
         * @memberof Property
         */
        static create(initialValue, valueReadRequest = undefined, valueWriteRequest = undefined, valueGetter = undefined) {
            valueReadRequest = valueReadRequest ? valueReadRequest : Property_1.DEFAULT_READ_REQUEST_HANDLER;
            valueWriteRequest = valueWriteRequest ? valueWriteRequest : Property_1.DEFAULT_WRITE_REQUEST_HANDLER;
            valueGetter = valueGetter ? valueGetter : Property_1.DEFAULT_VALUE_GETTER;
            return new Property_1(initialValue, valueReadRequest, valueWriteRequest, valueGetter);
        }
        /**
         * Gets an init value for the property to be passed when attaching and updating the consumer the first time.
         *
         * @private
         * @param {(TStoreItemConstructor | null)} storeItemTypeConstructor
         * @returns
         * @memberof Property
         */
        getInitValue(storeItemTypeConstructor) {
            // if there is a known type (storeItemConstructor) we use a copy of the existing instance as init value.
            return storeItemTypeConstructor ? Property_1.copyValue(this._value, storeItemTypeConstructor) : this._value;
        }
        /**
         * Sets the DataLink Objects value.
         *
         * @memberof Property
         */
        set value(newValue) {
            let oldValue = this._value;
            this._value = newValue;
            this.onValueChanged(this._value, oldValue);
        }
        /**
         * Gets the property object value.
         *
         * @type {T}
         * @memberof Property
         */
        get value() {
            let value = this._value;
            // get the value via the value getter delegate, if defined. Otherwise use the original value.
            if (this._valueGetter) {
                value = this._valueGetter(value);
            }
            return value;
        }
        /**
         * Updates the properties value.
         *
         * @param {*} newValue
         * @param {TStoreItemConstructor} propertyValueType
         * @memberof Property
         */
        update(newValue, propertyValueType) {
            let oldValue = this._value;
            // update the value with a copy
            this._value = Property_1.copyValue(newValue, propertyValueType);
            // forward a value copy to the changed consumers ..
            let copiedValue = Property_1.copyValue(newValue, propertyValueType);
            // _value and the forwarded value need to be different instances (copies) to provide proper updating!
            this.onValueChanged(copiedValue, oldValue, propertyValueType);
        }
        /**
         * Called whenever the value has been set. Notifies listeners from a value change
         *
         * @param {T} _value
         * @returns {*}
         * @memberof Property
         */
        onValueChanged(newValue, oldValue, propertyValueType = null) {
            // invoke the value changed callbacks
            this._valueChangedCallbacks.forEach((callback) => { callback(newValue, oldValue); });
        }
        /**
         * Called whenever the property value has been changed
         *
         * @param {(newValue: T, oldValue: T) => void} onValueChangedCallBack
         * @param {(TStoreItemConstructor|null)} [propertyValueType=null] specefies the type of th property value.
         * @memberof Property
         */
        changed(onValueChangedCallBack, propertyValueType = null, initValue = null) {
            if (!this._valueChangedCallbacks.includes(onValueChangedCallBack)) {
                // add the new handler
                this.addValueChangedDelegate(onValueChangedCallBack);
                // if there is already a value or init value available, we forward it to the new listener.
                let initialChangedValue = initValue ? initValue : this._value;
                if (initialChangedValue) {
                    this.onValueChanged(initialChangedValue, this._value, propertyValueType);
                }
            }
            else {
                console.error("Property change already observed by the same handler");
            }
        }
        /**
         * Adds the specified value changed delegate.
         *
         * @private
         * @param {T_PROPERTYCHANGED_HANDLER} onValueChangedDelegate
         * @memberof Property
         */
        addValueChangedDelegate(onValueChangedDelegate) {
            this._valueChangedCallbacks.push(onValueChangedDelegate);
        }
        /**
         * Forces a refresh o the data links value
         *
         * @memberof Property
         */
        read(readResponseDelegate = undefined, rejectionResponseDelegate = undefined) {
            // add a response delegate for every read caller. This makes sure, that more callers possibly from different components, receive the results as well !
            // add read request delegate 
            if (readResponseDelegate) {
                this._readResponseDelegates.push(readResponseDelegate);
            }
            // add read rejection delegate
            if (rejectionResponseDelegate) {
                this._readRejectionResponseDelegates.push(rejectionResponseDelegate);
            }
            // invoke the read request if not already running
            if (this._readRequestState === PropertyRequestState.Ready) {
                this.beginReadRequest();
            }
        }
        /**
         * Starts the request for reading a data links value. The method delgates the request to the callback if defined.
         *
         * @private
         * @memberof Property
         */
        beginReadRequest() {
            this._readRequestState = PropertyRequestState.Pending;
            if (this._valueReadRequestDelegate) {
                this._valueReadRequestDelegate(this);
            }
        }
        /**
         * Called after a read request has been executed successfully
         *
         * @param {T} componentParameters
         * @memberof Property
         */
        readRequestExecuted(readResult) {
            // update the data links value
            this.value = readResult;
            // recall response handler and pass the updated value
            this._readResponseDelegates.forEach((readResponseDelegate) => {
                readResponseDelegate(this.value);
            });
            // after processing the response calls, the current response list is obsolete!
            this.endReadRequest();
        }
        /**
         * Called after a read request has been rejetced
         *
         * @param {*} error
         * @memberof Property
         */
        readRequestRejected(error) {
            // recall response handler and pass the updated value
            this._readRejectionResponseDelegates.forEach((readRejectionResponseDelegate) => {
                readRejectionResponseDelegate(error);
            });
            this.endReadRequest();
        }
        /**
         * Terminates a read request
         *
         * @private
         * @memberof Property
         */
        endReadRequest() {
            this._readResponseDelegates = [];
            this._readRequestState = PropertyRequestState.Ready;
        }
        /**
         * Forces a write of the data link value to the value provider
         *
         * @param {*} newValue
         * @param {(((writeResult:T)=>void)|undefined)} [writeResponseDelegate=undefined]
         * @memberof Property
         */
        write(writeResponseDelegate = undefined, writeRejectionDelegate = undefined) {
            this._writeResponseDelegate = writeResponseDelegate;
            if (this._writeRequestState === PropertyRequestState.Ready) {
                this.beginWriteRequest();
            }
        }
        /**
         * Terminates the write request
         *
         * @private
         * @memberof Property
         */
        endWriteRequest() {
            this._writeResponseDelegate = undefined;
            this._writeRequestState = PropertyRequestState.Ready;
        }
        /**
         * Starts the request for writing a data links value. The method delgates the request to the callback if defined.
         *
         * @param {*} newValue
         * @returns {*}
         * @memberof Property
         */
        beginWriteRequest() {
            this._writeRequestState = PropertyRequestState.Pending;
            if (this._valueWriteRequestDelegate) {
                this._valueWriteRequestDelegate(this);
            }
        }
        /**
         * Called after a write request has been executed successfully
         *
         * @param {T} writeResult
         * @memberof Property
         */
        writeRequestExecuted(writeResult) {
            // recall response handler and pass the updated value
            if (this._writeResponseDelegate) {
                this._writeResponseDelegate(writeResult);
            }
            // after processing the response calls, the current response list is obsolete!
            this.endWriteRequest();
        }
        /**
         * Called after a write request has been rejected
         *
         * @param {*} error
         * @memberof Property
         */
        writeRequestRejected(error) {
            // recall response handler and pass the updated value
            if (this._writeResponseRejectionDelegate) {
                this._writeResponseRejectionDelegate(error);
            }
            this.endWriteRequest();
        }
        /**
         * Copies the item value to prohibit any indirect change of the original value.
         *
         * @private
         * @template STOREITEMTYPE
         * @param {STOREITEMTYPE} newValue
         * @param {*} storeItemTypeConstructor
         * @returns {STOREITEMTYPE}
         * @memberof Property
         */
        static copyValue(newValue, storeItemTypeConstructor) {
            // retrieve the instances transfer type
            const transferType = newValue.constructor ? metaClassReflectionInfo_1.MetaClassReflectionInfo.getClassMetaPropertyValue(newValue.constructor, Reflection.MetaClassProperty.transferType) : undefined;
            // should the data be transferred by value ?
            const transferByValue = transferType !== undefined && transferType === commonTypes_1.DataTransferType.byValue;
            // if the value is boxed (should be passed as reference ) we just use the unboxed value. 
            // ... otherwise we transfer the object as specified by the transfer type .... if any.
            // all other objects are just passed through without modification or copying.
            return newValue instanceof dataBox_1.DataBox ? newValue.Unbox() : transferByValue ? objectx_1.ObjectX.clone(storeItemTypeConstructor, newValue) : newValue;
        }
    };
    // specifies a default handler for the read request
    Property.DEFAULT_READ_REQUEST_HANDLER = () => { console.error("Property: Read request can not be executed because the request handler is undefined!"); };
    // specifies a default handler for the read request
    Property.DEFAULT_WRITE_REQUEST_HANDLER = () => { console.error("Property: Write request can not be executed because the request handler is undefined!"); };
    // specefies the default value getter
    Property.DEFAULT_VALUE_GETTER = (value) => { return value; };
    Property = Property_1 = __decorate([
        mco.role()
    ], Property);
    exports.Property = Property;
    var PropertyRequestState;
    (function (PropertyRequestState) {
        PropertyRequestState[PropertyRequestState["Ready"] = 0] = "Ready";
        PropertyRequestState[PropertyRequestState["Pending"] = 1] = "Pending";
    })(PropertyRequestState || (PropertyRequestState = {}));
    let PropertyClient = class PropertyClient {
        constructor(client, changedHandler = null) {
            this._client = client;
            this._changedHandler = changedHandler;
        }
        get client() {
            return this._client;
        }
        get valueChangedHandler() {
            return this._changedHandler;
        }
    };
    PropertyClient = __decorate([
        mco.role()
    ], PropertyClient);
});
