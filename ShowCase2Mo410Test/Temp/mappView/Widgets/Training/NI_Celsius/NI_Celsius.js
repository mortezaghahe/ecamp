define(['widgets/brease/NumericInput/NumericInput'], function (SuperClass) {

    'use strict';

    /**
    * @class widgets.Training.NI_Celsius
    * @extends widgets.brease.NumericInput
    */
    var defaultSettings = {
        "draggable": false,
        "ellipsis": false,
        "enable": true,
        "format": {
                "metric": {
                        "decimalPlaces": 1,
                        "minimumIntegerDigits": 1
                },
                "imperial": {
                        "decimalPlaces": 1,
                        "minimumIntegerDigits": 1
                },
                "imperial-us": {
                        "decimalPlaces": 1,
                        "minimumIntegerDigits": 1
                }
        },
        "keyboard": true,
        "limitViolationPolicy": "noSubmit",
        "maxValue": 100,
        "minValue": 0,
        "numPadStyle": "default",
        "numpadPosition": "right",
        "showUnit": true,
        "style": "default",
        "submitOnChange": true,
        "tabIndex": 0,
        "tooltip": "",
        "unit": {
                "metric": "CEL",
                "imperial": "FAH",
                "imperial-us": "FAH"
        },
        "unitAlign": "left",
        "unitTextAlign": "center",
        "unitWidth": 0,
        "useDigitGrouping": true,
        "value": 0,
        "visible": true,
        "maxHeight": 0,
        "minHeight": 0,
        "maxWidth": 0,
        "minWidth": 0,
        "height": "30",
        "width": "100"
},

    WidgetClass = SuperClass.extend(function NI_Celsius() {
        SuperClass.apply(this, arguments);
    }, defaultSettings),

    p = WidgetClass.prototype;

    return WidgetClass;

});
