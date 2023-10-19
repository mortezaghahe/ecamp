var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var MessagesViewModel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessagDataItem = exports.MessagesData = exports.MessagesViewModel = void 0;
    let MessagesViewModel = MessagesViewModel_1 = class MessagesViewModel {
        /**
         * splits the content of the message parameters and creates the effective message data model
         *
         * @static
         * @param {MappCockpitComponentParameter[]} messageParameters
         * @returns {MessagesData}
         * @memberof MessagesViewModel
         */
        static convertParametersToMessageData(messageParameters) {
            let messageParameterObject = MessagesViewModel_1.retrieveMessageParameters(messageParameters);
            var messageData = new MessagesData();
            if (messageParameterObject.severity != undefined && Array.isArray(messageParameterObject.severity.value)) {
                for (let i = 0; i < messageParameterObject.severity.value.length; i++) {
                    const description = messageParameterObject.description.value[i];
                    const event = messageParameterObject.eventId.value[i];
                    const severity = this.convertSeverity(messageParameterObject.severity.value[i]);
                    const time = messageParameterObject.timeStamp.value[i];
                    messageData.addMessage(severity, event, time, description);
                }
            }
            return messageData;
        }
        /**
         * Convert Severity to severity id if severity name is defined
         *
         * @static
         * @param {string} severity
         * @returns {string}
         * @memberof MessagesViewModel
         */
        static convertSeverity(severity) {
            if (severity == "Success") {
                return "0";
            }
            if (severity == "Information") {
                return "1";
            }
            if (severity == "Warning") {
                return "2";
            }
            if (severity == "Error") {
                return "3";
            }
            return severity;
        }
        /**
         * retrieves the message parameters from the component parameters
         *
         * @static
         * @param {Array<MappCockpitComponentParameter>} componentParameters
         * @returns {MessageParameters}
         * @memberof MessagesViewModel
         */
        static retrieveMessageParameters(componentParameters) {
            let messageParameters = new MessageParameters;
            if (componentParameters[0] == undefined) {
                return messageParameters;
            }
            let messageSeverityParameter = componentParameters.filter(parameter => { return parameter.browseName === "intArraySeverity"; })[0];
            if (messageSeverityParameter == undefined) {
                messageSeverityParameter = componentParameters.filter(parameter => { return parameter.browseName === "strArraySeverity"; })[0];
            }
            messageParameters.severity = messageSeverityParameter;
            messageParameters.description = componentParameters.filter(parameter => { return parameter.browseName === "strArrayDescription"; })[0];
            messageParameters.eventId = componentParameters.filter(parameter => { return parameter.browseName === "strArrayEventID"; })[0];
            messageParameters.timeStamp = componentParameters.filter(parameter => { return parameter.browseName === "strArrayTime"; })[0];
            return messageParameters;
        }
    };
    MessagesViewModel = MessagesViewModel_1 = __decorate([
        mco.role()
    ], MessagesViewModel);
    exports.MessagesViewModel = MessagesViewModel;
    let MessageParameters = class MessageParameters {
    };
    MessageParameters = __decorate([
        mco.role()
    ], MessageParameters);
    let MessagDataItem = class MessagDataItem {
        constructor(severity, eventId, timeStam, description) {
            this.severity = severity;
            this.eventId = eventId;
            this.timeStamp = timeStam;
            this.description = description;
        }
    };
    MessagDataItem = __decorate([
        mco.role()
    ], MessagDataItem);
    exports.MessagDataItem = MessagDataItem;
    let MessagesData = class MessagesData {
        constructor() {
            this._messages = [];
            this._messages = [];
        }
        get messages() {
            return this._messages;
        }
        addMessage(severity, eventId, timeStamp, description) {
            this._messages.push(new MessagDataItem(severity, eventId, timeStamp, description));
        }
    };
    MessagesData = __decorate([
        mco.role()
    ], MessagesData);
    exports.MessagesData = MessagesData;
});
