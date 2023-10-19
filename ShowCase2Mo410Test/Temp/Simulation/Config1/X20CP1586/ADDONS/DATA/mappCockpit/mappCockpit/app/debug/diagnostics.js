var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Diagnostics = void 0;
    let Diagnostics = class Diagnostics {
    };
    Diagnostics.DEBUG = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    
    <head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>mapp Cockpit</title>
    
    <!-- the following icon is displayed in the browser tab-->
    <link rel="icon" type="image/png" sizes="16x16" href="../../../mappCockpit/app/common/resources/images/favicon-16x16.png"> 
    <link rel="stylesheet" type="text/css" href="../../../mappCockpit/app/libs/ui/themes/default-theme/ej.web.all.min.css">
  
    
    </head>
    <!--  -->
    <body style="overflow:hidden" oncontextmenu="return false">
        <script data-main="./debug/startDebug" src="libs/require.js"></script>
    </body>
    
    </html>`;
    Diagnostics = __decorate([
        mco.role()
    ], Diagnostics);
    exports.Diagnostics = Diagnostics;
});
