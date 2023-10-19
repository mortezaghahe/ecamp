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
define(["require", "exports", "../../framework/events", "../../communication/rest/opcUaRestServices"], function (require, exports, events_1, opcUaRestServices_1) {
    "use strict";
    var OpcUaWebSocket_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SockeEventType = exports.OpcUaWebSocketEventArgs = exports.OpcUaWebSocket = void 0;
    /**
     * specifies socket event types
     *
     * @enum {number}
     */
    var SockeEventType;
    (function (SockeEventType) {
        SockeEventType[SockeEventType["undefined"] = 0] = "undefined";
        SockeEventType[SockeEventType["OPENED"] = 1] = "OPENED";
        SockeEventType[SockeEventType["CLOSED"] = 2] = "CLOSED";
        SockeEventType[SockeEventType["MESSAGE"] = 3] = "MESSAGE";
        SockeEventType[SockeEventType["ERROR"] = 4] = "ERROR";
    })(SockeEventType || (SockeEventType = {}));
    exports.SockeEventType = SockeEventType;
    /**
     * implements socket event arguments
     *
     * @class OpcUaWebSocketEventArgs
     */
    let OpcUaWebSocketEventArgs = class OpcUaWebSocketEventArgs {
        get type() {
            return this._type;
        }
        get data() {
            return this._data;
        }
        constructor(eventType, eventData) {
            this._type = SockeEventType.undefined;
            this._data = eventData;
            this._type = eventType;
        }
    };
    OpcUaWebSocketEventArgs = __decorate([
        mco.role()
    ], OpcUaWebSocketEventArgs);
    exports.OpcUaWebSocketEventArgs = OpcUaWebSocketEventArgs;
    // declares an event for receiving opc-ua web socket messages
    let EventOpcUaWebSocket = class EventOpcUaWebSocket extends events_1.TypedEvent {
    };
    EventOpcUaWebSocket = __decorate([
        mco.role()
    ], EventOpcUaWebSocket);
    ;
    /**
     * implements receiving of opc-ua events with web sockets.
     *
     * @class OpcUaWebSocket
     */
    let OpcUaWebSocket = OpcUaWebSocket_1 = class OpcUaWebSocket {
        /**
     * creates an instance of OpcUaWebSocket.
     * @memberof OpcUaWebSocket
     */
        constructor() {
            // create web socket event
            this.eventOpcUaWebSocket = new EventOpcUaWebSocket();
        }
        /**
         * creates an opc-ua web socket
         *
         * @static
         * @returns {OpcUaWebSocket}
         * @memberof OpcUaWebSocket
         */
        static create() {
            return new OpcUaWebSocket_1();
        }
        /**
         * opens and connects an opc-ua socket
         *
         * @returns {*}
         * @memberof OpcUaWebSocket
         */
        connect() {
            return __awaiter(this, void 0, void 0, function* () {
                const connectionPromise = new Promise((resolve, reject) => {
                    try {
                        // if no web socket is defined ....
                        if (!this._webSocket) {
                            // ... we create a web socket instance
                            this.createWebSocketConnection(resolve);
                        }
                        else {
                            // ...otherwise we are already done
                            resolve();
                        }
                    }
                    catch (error) {
                        reject("could not create opc-ua web socket connection");
                    }
                });
                return connectionPromise;
            });
        }
        /**
         * Creates a web socket connection
         *
         * @private
         * @param {(value?: any) => void} resolve
         * @memberof OpcUaWebSocket
         */
        createWebSocketConnection(resolve) {
            this._webSocket = new WebSocket(opcUaRestServices_1.OpcUaRestServices.getWsBaseUrl());
            // handle web socket callbacks
            this._webSocket.onopen = () => {
                this.onSocketOpened();
                resolve();
            };
            this._webSocket.onmessage = (socketMsg) => {
                this.onSocketMessageReceived(socketMsg.data);
            };
            this._webSocket.onclose = () => {
                this.onSocketClosed(this._webSocket.readyState);
            };
        }
        /**
         * closes an opc-ua web socket connection
         *
         * @returns {*}
         * @memberof OpcUaWebSocket
         */
        close() {
            if (this._webSocket) {
                this._webSocket.close();
            }
        }
        /**
         *
         * notify that the socket has been opened
         * @returns {*}
         * @memberof OpcUaWebSocket
         */
        onSocketOpened() {
            this.eventOpcUaWebSocket.raise(this, new OpcUaWebSocketEventArgs(SockeEventType.OPENED, null));
        }
        /**
         * notify that the socket has been closed
         *
         * @param {number} readyState
         * @returns {*}
         * @memberof OpcUaWebSocket
         */
        onSocketClosed(readyState) {
            this.eventOpcUaWebSocket.raise(this, new OpcUaWebSocketEventArgs(SockeEventType.CLOSED, null));
        }
        /**
         * handles receiving socket messages
         *
         * @param {MessageEvent} socketMsg
         * @returns {*}
         * @memberof OpcUaWebSocket
         */
        onSocketMessageReceived(socketMsg) {
            let socketMsgData = JSON.parse(socketMsg);
            // check if its a valid message
            if (socketMsgData.sessionId && socketMsgData.subscriptionId && socketMsgData.DataNotifications) {
                this.eventOpcUaWebSocket.raise(this, new OpcUaWebSocketEventArgs(SockeEventType.MESSAGE, socketMsgData));
            }
        }
    };
    OpcUaWebSocket = OpcUaWebSocket_1 = __decorate([
        mco.role()
    ], OpcUaWebSocket);
    exports.OpcUaWebSocket = OpcUaWebSocket;
});
