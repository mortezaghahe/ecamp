var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../common/widgetBase", "../common/busyInformation", "../common/alertDialog", "../../common/persistence/persistDataController", "../../common/persistence/persistDataProvider", "./componentDefaultDefinition", "../../controller/openViewManagement/controller/openViewMainController", "../common/groupTagProvider"], function (require, exports, widgetBase_1, busyInformation_1, alertDialog_1, persistDataController_1, persistDataProvider_1, componentDefaultDefinition_1, openViewMainController_1, groupTagProvider_1) {
    "use strict";
    var MappCockpitWidget_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MappCockpitWidget = void 0;
    let MappCockpitWidget = MappCockpitWidget_1 = class MappCockpitWidget extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this._mainModelConnectionChangedHandler = (sender, connected) => this.connectionChanged(sender, connected);
            /**
             * Eventhandler for persist data controller events
             *
             * @private
             * @memberof MappCockpitWidget
             */
            this._persistDataControllerNotificationHandler = (sender, eventArgs) => { this.persistDataControllerNotificationHandler(sender, eventArgs); };
        }
        /**
         * Creates the widget content and eventually subwidgets
         *
         * @memberof MappCockpitWidget
         */
        initialized() {
            super.initialized();
            // Connects PersistDataController with the default storage 
            this.initPersistDataController();
        }
        /**
         * Connects to the main datamodel
         *
         * @private
         * @memberof MappCockpitWidget
         */
        connectMainDataModel() {
            // connect the main data model
            this.dataModel = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.MappCockpitDataModelId);
            if (this.dataModel != undefined) {
                let mainDataModel = this.dataModel;
                let mainMappCockpitModel = mainDataModel.dataSource;
                // wait for successfull connection
                mainMappCockpitModel.eventModelConnectionChanged.attach(this._mainModelConnectionChangedHandler);
                // connect the main model
                mainMappCockpitModel.connect();
            }
            else {
                console.error("mappCockpit datamodel not available!");
            }
        }
        /**
         * Initialize to the persist data controller with the default storage
         *
         * @private
         * @memberof MappCockpitWidget
         */
        initPersistDataController() {
            // Create persist data controller
            this._persistDataController = new persistDataController_1.PersistDataController(persistDataProvider_1.PersistDataProvider.getInstance());
            // Handle events when connected or data loaded
            this._persistDataController.eventNotification.attach(this._persistDataControllerNotificationHandler);
            // Connect persist data controller with default storage
            this._persistDataController.connect();
        }
        /**
         * Handles the persist data controller storage connected event
         *
         * @private
         * @param {*} sender
         * @param {PersistDataControllerEventNotificationType} eventArgs
         * @memberof MappCockpitWidget
         */
        persistDataControllerNotificationHandler(sender, eventArgs) {
            if (eventArgs == persistDataController_1.PersistDataControllerEventNotificationType.connected) {
                // Connection done -> load data from default storage
                if (this._persistDataController != undefined) {
                    this._persistDataController.loadData();
                }
            }
            else if (eventArgs == persistDataController_1.PersistDataControllerEventNotificationType.dataLoaded) {
                // Detach _persistDataController events
                if (this._persistDataController != undefined) {
                    this._persistDataController.eventNotification.detach(this._persistDataControllerNotificationHandler);
                }
                // Data loaded from default storage -> start loading the mainDataModel(rest of the mappCockpit)
                this.connectMainDataModel();
            }
        }
        /**
         * Initializes the component
         *
         * @memberof MappCockpitWidget
         */
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
            this.component.disablePersisting();
        }
        /**
         * Dispose this widget
         *
         * @memberof MappCockpitWidget
         */
        dispose() {
            let mainDataModel = this.dataModel;
            if (mainDataModel != undefined) {
                let mainMappCockpitModel = mainDataModel.dataSource;
                if (mainMappCockpitModel != undefined) {
                    mainMappCockpitModel.eventModelConnectionChanged.detach(this._mainModelConnectionChangedHandler);
                }
            }
            this._mainNavigationWidget.dispose();
            super.dispose();
        }
        /**
         *
         *
         * @memberof MappCockpitWidget
         */
        createLayout() {
            this.resize(this._actualWidth, this._actualHeight);
            // Init AlertBox
            new alertDialog_1.AlertDialog();
        }
        /**
         *
         *
         * @param {number} width
         * @param {number} height
         * @memberof MappCockpitWidget
         */
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            if (this._mainNavigationWidget != undefined) {
                this._mainNavigationWidget.resize(width, height);
            }
        }
        /**
         * Load the style informations for the widget
         *
         * @memberof MappCockpitWidget
         */
        loadStyles() {
            super.addStyle("widgets/mappCockpitWidget/style/css/commonStyleVariables.css");
            super.addStyle("widgets/mappCockpitWidget/style/css/commonStyle.css");
            super.addStyle("widgets/mappCockpitWidget/style/css/defaultScrollbarStyle.css");
            super.addStyle("widgets/mappCockpitWidget/style/css/commonToolbarStyle.css");
            super.addStyle("widgets/mappCockpitWidget/style/css/alertBoxStyle.css");
            super.addStyle("widgets/mappCockpitWidget/style/css/dragDropStyle.css");
        }
        connectionChanged(sender, connected) {
            if (connected) {
                this.onMainModelConnected(sender);
            }
            else {
                this.onMainModelDisconnected();
            }
        }
        /**
         * Called after the main model has been connected
         *
         * @private
         * @param {MappCockpitComponentDataModel} mainMappCockpitModel
         * @returns
         * @memberof MappCockpitWidget
         */
        onMainModelConnected(mainMappCockpitModel) {
            console.log("MappCockpitWidget.onMainModelConnected()");
            try {
                // force changing to anonymous to trigger the events for updating the ui state.
                this.changeUserToAnonymous();
                this._mainNavigationWidget = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.MainNavigationWidgetId);
                if (this._mainNavigationWidget != undefined) {
                    this._mainNavigationWidget.initialize();
                    this.resize(this._actualWidth, this._actualHeight);
                    // add widget to the parent container
                    this._mainNavigationWidget.addToParentContainer(this.mainDiv);
                    // Open StartPage
                    openViewMainController_1.OpenViewMainController.getInstance().executeOpenViewByGroupTag(groupTagProvider_1.GroupTag.startPage);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        /**
         * Called after the main model has been disconnected
         *
         * @private
         * @returns {*}
         * @memberof MappCockpitWidget
         */
        onMainModelDisconnected() {
            console.log("MappCockpitWidget.onMainModelDisconnected()");
            this.setBusyInformation(new busyInformation_1.BusyInformation("Connection to server is lost!<br/>&nbsp;Refresh page to reconnect.", busyInformation_1.ImageId.disconnectedImage));
            this.setBusy(true);
        }
        /**
         * Changes the user to anonymous
         *
         * @private
         * @memberof MappCockpitWidget
         */
        changeUserToAnonymous() {
            let mainDataModel = this.dataModel;
            let userInfo = { username: MappCockpitWidget_1.defaultUser.username, password: MappCockpitWidget_1.defaultUser.password };
            mainDataModel.dataSource.commandChangeUser.execute(userInfo, (userRoles) => {
                console.log("%o Logged in with roles: %o", MappCockpitWidget_1.defaultUser.username, userRoles);
            }, (error) => {
                console.error("Could not log in: %o %o", MappCockpitWidget_1.defaultUser.username, error);
            });
        }
    };
    // specifies the default user settings
    MappCockpitWidget.defaultUser = { username: "Anonymous", password: "" };
    MappCockpitWidget = MappCockpitWidget_1 = __decorate([
        mco.role()
    ], MappCockpitWidget);
    exports.MappCockpitWidget = MappCockpitWidget;
});
