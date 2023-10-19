define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NwctDatagramType = void 0;
    /**
     * the type of a data entry
     * this information is used to find out if a request or response should be available
     *
     * @export
     * @enum {number}
     */
    var NwctDatagramType;
    (function (NwctDatagramType) {
        NwctDatagramType[NwctDatagramType["BREADCAST_COMMAND"] = 1] = "BREADCAST_COMMAND";
        NwctDatagramType[NwctDatagramType["WRITE_REQUEST"] = 2] = "WRITE_REQUEST";
        NwctDatagramType[NwctDatagramType["WRITE_RESPONSE"] = 3] = "WRITE_RESPONSE";
        NwctDatagramType[NwctDatagramType["READ_REQUEST"] = 4] = "READ_REQUEST";
        NwctDatagramType[NwctDatagramType["READ_RESPONSE"] = 5] = "READ_RESPONSE";
        NwctDatagramType[NwctDatagramType["STATUS"] = 6] = "STATUS";
        NwctDatagramType[NwctDatagramType["INFORMATION"] = 7] = "INFORMATION";
    })(NwctDatagramType = exports.NwctDatagramType || (exports.NwctDatagramType = {}));
});
