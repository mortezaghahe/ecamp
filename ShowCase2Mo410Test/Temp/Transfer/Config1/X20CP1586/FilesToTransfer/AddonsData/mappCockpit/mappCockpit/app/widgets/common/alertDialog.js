var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AlertDialog = exports.messageBoxType = void 0;
    var messageBoxType;
    (function (messageBoxType) {
        messageBoxType[messageBoxType["CancelDelete"] = 0] = "CancelDelete";
        messageBoxType[messageBoxType["YesNo"] = 1] = "YesNo";
        messageBoxType[messageBoxType["Warning"] = 2] = "Warning";
    })(messageBoxType = exports.messageBoxType || (exports.messageBoxType = {}));
    let AlertDialog = class AlertDialog {
        constructor() {
            this._activeElement = document.activeElement;
        }
        /**
         * Creates a warning message box
         *
         * @param {string} header
         * @param {string} message
         * @param {messageBoxType} type
         * @param {(JQuery.Deferred<any, any, any> | undefined)} deferred
         * @returns
         * @memberof AlertDialog
         */
        createMessageBox(header, message, type, deferred) {
            this._createMessageBox(header, message);
            this.createButtons(type, deferred);
            $(this._activeElement).blur();
            this.handleEvents();
        }
        _createMessageBox(header, message) {
            let ALERT_TITLE = header;
            let d = document;
            if (d.getElementById("modalContainer")) {
                return;
            }
            let mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
            mObj.id = "modalContainer";
            mObj.style.height = d.documentElement.scrollHeight + "px";
            let alertObj = mObj.appendChild(d.createElement("div"));
            alertObj.id = "alertBox";
            if (d.all /*&& !window.opera*/) {
                alertObj.style.top = document.documentElement.scrollTop + "px";
            }
            alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth) / 2 + "px";
            alertObj.style.visibility = "visible";
            alertObj.style.display = "block";
            let h1 = alertObj.appendChild(d.createElement("h1"));
            h1.appendChild(d.createTextNode(ALERT_TITLE));
            let img = alertObj.appendChild(d.createElement("img"));
            img.src = './widgets/common/style/images/messageBox/warning.svg';
            let container = alertObj.appendChild(d.createElement("div"));
            container.id = 'containerMsgBox';
            container.style.display = 'flow-root';
            let msg = container.appendChild(d.createElement("p"));
            msg.innerHTML = message;
        }
        /**
         * Creates buttons for the message box
         *
         * @private
         * @param {*} container
         * @param {*} type
         * @param {(JQuery.Deferred<any, any, any> | undefined)} deferred
         * @memberof AlertDialog
         */
        createButtons(type, deferred) {
            let buttonsData = this.getButtonData(type);
            let container = document.getElementById('containerMsgBox');
            let btn1 = container.appendChild(document.createElement("div"));
            btn1.classList.add('msgButton', 'highlighted');
            btn1.style.left = '111px';
            btn1.appendChild(document.createTextNode('Ok'));
            btn1.onclick = () => {
                this.removeMessageBox();
                if (deferred != undefined) {
                    deferred.resolve();
                }
                return false;
            };
            if (buttonsData.number == 2) {
                btn1.innerText = buttonsData.text[0];
                btn1.style.left = '56px';
                let btn2 = container.appendChild(document.createElement("div"));
                btn2.classList.add('msgButton', 'notMain');
                btn2.style.left = '166px';
                btn2.appendChild(document.createTextNode(buttonsData.text[1]));
                btn2.onclick = () => {
                    this.removeMessageBox();
                    return false;
                };
            }
        }
        keyActions(e) {
            if (e.keyCode == 13) { //key enter
                let btn = document.getElementsByClassName('highlighted')[0];
                $(btn).click();
            }
            else if (e.keyCode == 27) { //key escape
                this.removeMessageBox();
            }
            else if (e.keyCode == 37 || e.keyCode == 39) { //right left arrow keys
                //Currently just working for 1 or 2 buttons
                let buttons = document.getElementsByClassName('msgButton');
                if (buttons.length > 1) {
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].classList.value.includes('highlighted')) {
                            buttons[i].classList.remove('highlighted');
                        }
                        else {
                            buttons[i].classList.add('highlighted');
                        }
                    }
                }
            }
        }
        /**
         * Gets button information according to the type of message box
         *
         * @private
         * @param {messageBoxType} type
         * @returns
         * @memberof AlertDialog
         */
        getButtonData(type) {
            let btnData = {
                number: 1,
                text: new Array(),
            };
            switch (type) {
                case messageBoxType.CancelDelete: {
                    btnData.number = 2;
                    btnData.text[0] = 'Delete';
                    btnData.text[1] = 'Cancel';
                    return btnData;
                }
                case messageBoxType.YesNo: {
                    btnData.number = 2;
                    btnData.text[0] = 'Yes';
                    btnData.text[1] = 'No';
                    return btnData;
                }
                case messageBoxType.Warning: {
                    btnData.number = 1;
                    btnData.text[0] = 'Ok';
                    return btnData;
                }
            }
        }
        handleEvents() {
            this.focusOut = this.focusOut.bind(this);
            this.keyActions = this.keyActions.bind(this);
            document.addEventListener('keydown', this.keyActions);
            this._activeElement.addEventListener('focusin', this.focusOut);
        }
        focusOut() {
            $(document.activeElement).blur();
        }
        /**
         * Removes message box
         *
         * @private
         * @memberof AlertDialog
         */
        removeMessageBox() {
            document.removeEventListener('keydown', this.keyActions);
            this._activeElement.removeEventListener('focusin', this.focusOut);
            $(this._activeElement).focus();
            document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
        }
    };
    AlertDialog = __decorate([
        mco.role()
    ], AlertDialog);
    exports.AlertDialog = AlertDialog;
});
