var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../framework/events"], function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageEventNotification = exports.StorageEventNotificationArgs = exports.StorageEventNotificationType = void 0;
    var StorageEventNotificationType;
    (function (StorageEventNotificationType) {
        StorageEventNotificationType[StorageEventNotificationType["dataLoaded"] = 0] = "dataLoaded";
        StorageEventNotificationType[StorageEventNotificationType["dataSaved"] = 1] = "dataSaved";
        StorageEventNotificationType[StorageEventNotificationType["storageConnected"] = 2] = "storageConnected";
        StorageEventNotificationType[StorageEventNotificationType["storageCleared"] = 3] = "storageCleared";
        StorageEventNotificationType[StorageEventNotificationType["error"] = 4] = "error";
    })(StorageEventNotificationType = exports.StorageEventNotificationType || (exports.StorageEventNotificationType = {}));
    let StorageEventNotificationArgs = class StorageEventNotificationArgs {
        constructor(type, data) {
            this.type = type;
            this.data = data;
        }
    };
    StorageEventNotificationArgs = __decorate([
        mco.role()
    ], StorageEventNotificationArgs);
    exports.StorageEventNotificationArgs = StorageEventNotificationArgs;
    let StorageEventNotification = class StorageEventNotification extends events_1.TypedEvent {
    };
    StorageEventNotification = __decorate([
        mco.role()
    ], StorageEventNotification);
    exports.StorageEventNotification = StorageEventNotification;
    ;
});
