var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/widgetBase"], function (require, exports, widgetBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoginWidget = void 0;
    /**
     * implements the login widget
     *
     * @class LoginWidget
     * @extends {WidgetBase}
     */
    let LoginWidget = class LoginWidget extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this._isInitialized = false;
            this._actualUsername = "Anonymous";
        }
        /* initialize the widget
         *
         * @memberof LoginWidget
         */
        initialize() {
            if (this._isInitialized == false) {
                super.initialize();
                this._isInitialized = true;
            }
        }
        /**
         * Creates the widget content and eventually subwidgets
         *
         * @memberof LoginWidget
         */
        createLayout() {
            // Add class to main div
            this.mainDiv.classList.add("loginWidgetMain");
            // initialize the needed div ids
            this.initializeIds();
            // Add inner div with background
            let backgroundDiv = document.createElement("div");
            backgroundDiv.id = this._loginWidgetBackgroundId;
            backgroundDiv.classList.add("loginWidgetMainBackground");
            $(this.mainDiv).append(backgroundDiv);
            // Show the login form within the background div
            this.showLogin();
        }
        /**
         * Sets and defines the interface to the login interface
         *
         * @memberof LoginWidget
         */
        set loginInterface(loginInterface) {
            this._loginInterface = loginInterface;
        }
        /** resizes the login widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof LoginWidget
         */
        resize(width, height) {
            // Resize the main div
            let parentElement = this.mainDiv;
            parentElement.style.width = width.toString() + "px";
            parentElement.style.height = height.toString() + "px";
            // Resize the inner div with background
            let parentElementBackground = $("#" + this._loginWidgetBackgroundId)[0];
            parentElementBackground.style.width = width.toString() + "px";
            parentElementBackground.style.height = height.toString() + "px";
        }
        initializeIds() {
            this._loginWidgetBackgroundId = this.mainDivId + "_background";
            this._loginWidgetId = this.mainDivId + "_loginWidget";
            this._loginWidgetHeaderId = this._loginWidgetId + "_header";
            this._loginWidgetUsernameId = this._loginWidgetId + "_username";
            this._loginWidgetPasswordId = this._loginWidgetId + "_password";
            this._loginWidgetLoginLogoutButtonId = this._loginWidgetId + "_loginLogoutButton";
            this._loginWidgetMessageId = this._loginWidgetId + "_loginMessage";
        }
        /**
         * Loads the styles for the login widget
         *
         * @memberof LoginWidget
         */
        loadStyles() {
            this.addStyle("widgets/loginWidget/style/css/loginWidgetStyle.css");
        }
        showLogin() {
            this.createLoginLogout(true);
        }
        showLogout() {
            this.createLoginLogout(false);
        }
        createLoginLogout(login) {
            // Reset html data
            $("#" + this._loginWidgetBackgroundId)[0].innerHTML = "";
            let data = "";
            if (login == true) {
                data = this.getMainHtmlData("Login");
                data += this.getLoginHtmlData();
            }
            else {
                data = this.getMainHtmlData("Logout");
                data += this.getLogoutHtmlData();
            }
            data += this.getMessageContainerData();
            $("#" + this._loginWidgetBackgroundId).append(data);
            this.createLoginLogoutButton(this._loginWidgetLoginLogoutButtonId, login);
        }
        getMainHtmlData(headerText) {
            return `
            <div class='loginMiddleContainerBorder' id='` + this._loginWidgetId + `'>
            <div class='loginHeader' id='` + this._loginWidgetHeaderId + `'>` + headerText + `</div>`;
        }
        getLoginHtmlData() {
            return `
            <div class='loginInputFieldPosition'>Username:<br><input type="text" id="` + this._loginWidgetUsernameId + `" name="txtName" class="loginInputText" required /><br /></div>
            <div class='loginInputFieldPosition'>Password:<br><input type="password" id="` + this._loginWidgetPasswordId + `" name="txtPassword" class="loginInputText" required /></div>
            <div class='loginButtonPosition' id='` + this._loginWidgetLoginLogoutButtonId + `'></div>`;
        }
        getLogoutHtmlData() {
            return `
            <div class='loginInputFieldPosition'>Username:<br><input type="text" id="` + this._loginWidgetUsernameId + `" value="` + this._actualUsername + `"name="txtName" class="loginInputText loginInputTextReadOnly" readonly /><br /></div>
            <div class='logoutButtonPosition' id='` + this._loginWidgetLoginLogoutButtonId + `'></div>`;
        }
        getMessageContainerData() {
            return `<div class='loginMessagePosition' id='` + this._loginWidgetMessageId + `'></div></div>`;
        }
        createLoginLogoutButton(id, login) {
            let buttonText = "Login";
            if (login == false) {
                buttonText = "Logout";
            }
            $("#" + id).ejButton({
                text: buttonText,
                click: (clickArgs) => {
                    if (login == true) {
                        this.loginClick();
                    }
                    else {
                        this.logoutClick();
                    }
                },
                width: "120px",
                height: "20px",
            });
        }
        loginClick() {
            let usernameElement = $("#" + this._loginWidgetUsernameId);
            let passwordElement = $("#" + this._loginWidgetPasswordId);
            let username = usernameElement[0].value;
            let password = passwordElement[0].value;
            let userInfo = { username: username, password: password };
            this._loginInterface.commandChangeUser.execute(userInfo, (userRoles) => {
                this._actualUsername = username;
                $("#" + this._loginWidgetMessageId)[0].innerHTML = "User: '" + username + "' logged in!";
                this.showLogout();
                console.log("%o Logged in with roles: %o", userInfo.username, userRoles);
            }, (error) => {
                $("#" + this._loginWidgetMessageId)[0].innerHTML = "<font color='red'>Login failed!</font>";
                console.log("Could not log in: %o %o", userInfo.username, error);
            });
        }
        logoutClick() {
            let usernameElement = $("#" + this._loginWidgetUsernameId);
            let username = usernameElement[0].value;
            let userInfo = { username: "Anonymous", password: "" };
            this._loginInterface.commandChangeUser.execute(userInfo, (userRoles) => {
                this._actualUsername = "Anonymous";
                $("#" + this._loginWidgetMessageId)[0].innerHTML = "User: '" + username + "' logged out!";
                this.showLogin();
                console.log("%o Logged in with roles: %o", userInfo.username, userRoles);
            }, (error) => {
                $("#" + this._loginWidgetMessageId)[0].innerHTML = "<font color='red'>Logout failed!</font>";
                console.log("Could not log in: %o %o", userInfo.username, error);
            });
        }
    };
    LoginWidget = __decorate([
        mco.role()
    ], LoginWidget);
    exports.LoginWidget = LoginWidget;
});
