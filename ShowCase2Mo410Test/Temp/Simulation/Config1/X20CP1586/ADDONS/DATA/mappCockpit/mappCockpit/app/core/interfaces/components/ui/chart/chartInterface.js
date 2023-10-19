var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../../../framework/events"], function (require, exports, events_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventMouseWheelArgs = exports.EventMouseWheel = exports.EventMouseArgs = exports.EventMouseAction = exports.EventAxisRangeChangedArgs = exports.EventAxisRangeChanged = exports.AxisPosition = exports.AxisOrientation = void 0;
    var AxisOrientation;
    (function (AxisOrientation) {
        AxisOrientation[AxisOrientation["horizontal"] = 0] = "horizontal";
        AxisOrientation[AxisOrientation["vertical"] = 1] = "vertical";
    })(AxisOrientation = exports.AxisOrientation || (exports.AxisOrientation = {}));
    var AxisPosition;
    (function (AxisPosition) {
        AxisPosition[AxisPosition["left"] = 0] = "left";
        AxisPosition[AxisPosition["right"] = 1] = "right";
    })(AxisPosition = exports.AxisPosition || (exports.AxisPosition = {}));
    let EventAxisRangeChanged = class EventAxisRangeChanged extends events_1.TypedEvent {
    };
    EventAxisRangeChanged = __decorate([
        mco.role()
    ], EventAxisRangeChanged);
    exports.EventAxisRangeChanged = EventAxisRangeChanged;
    ;
    let EventAxisRangeChangedArgs = class EventAxisRangeChangedArgs {
        constructor(axisIDs, forceRedraw, syncAxis = false) {
            this.axisIDs = axisIDs;
            this.forceRedraw = forceRedraw;
            this.syncAxis = syncAxis;
        }
    };
    EventAxisRangeChangedArgs = __decorate([
        mco.role()
    ], EventAxisRangeChangedArgs);
    exports.EventAxisRangeChangedArgs = EventAxisRangeChangedArgs;
    let EventMouseAction = class EventMouseAction extends events_1.TypedEvent {
    };
    EventMouseAction = __decorate([
        mco.role()
    ], EventMouseAction);
    exports.EventMouseAction = EventMouseAction;
    ;
    let EventMouseArgs = class EventMouseArgs {
        constructor(mouseActionType, mousePoint, mousePointChart, objectUnderMouse) {
            this.mouseActionType = mouseActionType;
            this.mousePoint = mousePoint;
            this.mousePointChart = mousePointChart;
            this.objectUnderMouse = objectUnderMouse;
        }
    };
    EventMouseArgs = __decorate([
        mco.role()
    ], EventMouseArgs);
    exports.EventMouseArgs = EventMouseArgs;
    let EventMouseWheel = class EventMouseWheel extends events_1.TypedEvent {
    };
    EventMouseWheel = __decorate([
        mco.role()
    ], EventMouseWheel);
    exports.EventMouseWheel = EventMouseWheel;
    ;
    let EventMouseWheelArgs = class EventMouseWheelArgs {
        constructor(mousePoint, objectUnderMouse, wheelDelta) {
            this.mousePoint = mousePoint;
            this.objectUnderMouse = objectUnderMouse;
            this.wheelDelta = wheelDelta;
        }
    };
    EventMouseWheelArgs = __decorate([
        mco.role()
    ], EventMouseWheelArgs);
    exports.EventMouseWheelArgs = EventMouseWheelArgs;
});
