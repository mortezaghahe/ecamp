var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../../../common/componentBase/componentBase", "../../common/series/YTSeries", "../../common/series/FFTSeries", "../../common/series/XYSeries", "./componentDefaultDefinition", "../../../common/persistence/persistDataProvider", "../../common/series/settingIds"], function (require, exports, componentBase_1, YTSeries_1, FFTSeries_1, XYSeries_1, componentDefaultDefinition_1, persistDataProvider_1, settingIds_1) {
    "use strict";
    var SeriesProvider_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeriesProvider = void 0;
    let SeriesProvider = SeriesProvider_1 = class SeriesProvider {
        /**
         * gets a singleton instance of SeriesProvider
         * (TODO: Remove Singleton to have the possibility to use more SerieProviders in parallel(for different Trace analyses))
         *
         * @readonly
         * @type {ISeriesProvider}
         * @memberof SeriesProvider
         */
        static getInstance() {
            this._instance = this._instance ? this._instance : new SeriesProvider_1();
            return this._instance;
        }
        /**
         * Creates an instance of SeriesProvider
         * @memberof SeriesProvider
         */
        constructor() {
            this._serieDataChangedHandler = (sender, args) => this.onSerieDataChanged(sender, args);
            this._series = new Map();
            this._settingSeriesIds = "seriesIds";
            this._settingSeries = "series";
            this.component = new componentBase_1.ComponentBase(undefined, this);
            // TODO: create initialize method(but call only once in component factory)
            //this.initializeComponent();
        }
        /**
         * Disposes the SeriesProvider
         *
         * @memberof SeriesProvider
         */
        dispose() {
            this._series.clear();
            SeriesProvider_1._instance = undefined;
        }
        /**
         * Clears all the data of the SeriesProvider
         *
         * @memberof SeriesProvider
         */
        clear() {
            this._series.clear();
        }
        /**
         * Returns the current ComponentSettings
         *
         * @returns {ComponentSettings}
         * @memberof SeriesProvider
         */
        getComponentSettings(onlyModified) {
            let series = new Array();
            this._series.forEach((serie) => {
                series.push(serie.persistID);
            });
            if (onlyModified == false) {
                let seriesObjects = new Array();
                // Only list of series should be exported, not the serie data
                this._series.forEach((serie) => {
                    seriesObjects.push(serie.getSettings());
                });
                this.component.setSetting(this._settingSeries, seriesObjects);
            }
            else {
                this.component.setSetting(this._settingSeries, undefined);
            }
            this.component.setSetting(this._settingSeriesIds, series);
            return this.component.getComponentSettings(onlyModified);
        }
        /**
         * Sets the given ComponentSettings
         *
         * @param {(ComponentSettings|undefined)} settings
         * @returns
         * @memberof SeriesProvider
         */
        setComponentSettings(settings) {
            this.clear();
            this.component.setComponentSettings(settings);
            if (settings == undefined) {
                return;
            }
            let seriesSettingsObjects = this.component.getSetting(this._settingSeries);
            if (seriesSettingsObjects != undefined) {
                // if series informations are available add to persisting data
                seriesSettingsObjects.forEach(seriesSettingsObject => {
                    persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(this.getSeriesPersistingId(seriesSettingsObject.data[settingIds_1.SettingIds.SeriesId]), seriesSettingsObject);
                });
                // Clear internal series list because the list will be created with the series list info from the given settings
                this.clear();
            }
            let seriesIds = this.component.getSetting(this._settingSeriesIds);
            if (seriesIds != undefined) {
                seriesIds.forEach(serieID => {
                    let serie = persistDataProvider_1.PersistDataProvider.getInstance().getDataWithId(serieID);
                    //Workaround for import problem with mce files where series are not stored seperatly
                    let newSerie;
                    if (serie == undefined) {
                        newSerie = this.createSerie(serieID);
                    }
                    else {
                        newSerie = this.createSerie(serie);
                    }
                    if (newSerie != undefined) {
                        this._series.set(newSerie.id, newSerie);
                    }
                    else {
                        console.error("Serie with the following id could not be created: " + serieID);
                    }
                });
            }
        }
        /**
         * Returns the serie id which should be used for persisting a serie object
         *
         * @public
         * @param {string} serieID
         * @returns {string}
         * @memberof SeriesProvider
         */
        getSeriesPersistingId(serieID) {
            return SeriesProvider_1.getSeriesPersistingIdForComponent(serieID, this.component.id);
        }
        /**
         * Returns the serie id which should be used for persisting or export/import a serie object for the given component id
         *
         * @static
         * @param {string} serieID
         * @param {string} componentID
         * @returns {string}
         * @memberof SeriesProvider
         */
        static getSeriesPersistingIdForComponent(serieID, componentID) {
            return componentID + "_series_" + serieID;
        }
        /**
         * Initializes the component of this SeriesProvider (e.g. load component settings if found)
         *
         * @memberof SeriesProvider
         */
        initializeComponent() {
            this.component.setDefaultDefinition(new componentDefaultDefinition_1.ComponentDefaultDefinition());
        }
        initialize() {
            this.component.loadComponentSettings();
        }
        initialized() {
        }
        /**
         * Returns a unique id for a new serie
         *
         * @returns {string}
         * @memberof SeriesProvider
         */
        getUniqueId() {
            for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
                let id = i.toString();
                if (this._series.has(id) == false) {
                    return id;
                }
            }
            console.error("No unique id for serie available!");
            return "";
        }
        /**
         * Returns a unique id for a new calculation
         *
         * @returns {string}
         * @memberof SeriesProvider
         */
        getUniqueCalculationId() {
            let usedIds = new Array();
            this._series.forEach((serie) => {
                if (serie.calculationDataInfo != undefined) {
                    usedIds.push(serie.calculationDataInfo.uniqueId);
                }
            });
            for (let i = 1; i < Number.MAX_SAFE_INTEGER; i++) {
                let id = i.toString();
                if (usedIds.includes(id) == false) {
                    return id;
                }
            }
            console.error("No unique calculation id for serie available!");
            return "";
        }
        /**
         * Returns html information(e.g img, svg, ...) with the icons for a series(main icon + overlays)
         *
         * @param {BaseSeries} series
         * @returns {string}
         * @memberof SeriesProvider
         */
        getIcon(series) {
            let seriesIconProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SeriesIconProviderId);
            if (seriesIconProvider != undefined) {
                return seriesIconProvider.getIcon(series);
            }
            return "";
        }
        /**
         * Returns a specific icon for series (e.g. only a single overlay icon)
         *
         * @param {string} svgName (e.g. "autoUpdatedOverlay" or "exclamationOverlay")
         * @returns {string}
         * @memberof SeriesProvider
         */
        getSpecificIcon(svgName) {
            let seriesIconProvider = this.component.getSubComponent(componentDefaultDefinition_1.ComponentDefaultDefinition.SeriesIconProviderId);
            if (seriesIconProvider != undefined) {
                return seriesIconProvider.getSvgPath(svgName);
            }
            return "";
        }
        /**
         * Adds the given serie with the id of the serie to the SeriesProvider
         *
         * @param {BaseSeries} serie
         * @memberof SeriesProvider
         */
        add(serie) {
            if (this._series.has(serie.id) == true) {
                console.error("Serie with the given id already in serie provider! => id: " + serie.id);
            }
            this._series.set(serie.id, serie);
            persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(serie.persistID, serie.getSettings());
            persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(this.component.id, this.getComponentSettings(true));
            serie.eventDataChanged.attach(this._serieDataChangedHandler);
        }
        /**
         * Updates the data of an existing serie
         *
         * @param {BaseSeries} serie
         * @memberof SeriesProvider
         */
        onSerieDataChanged(serie, args) {
            if (this._series != undefined && this._series.has(serie.id) == false) {
                console.error("Serie with the given id is not set in the series provider! => id: " + serie.id);
            }
            this._series.set(serie.id, serie);
            persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(serie.persistID, serie.getSettings());
        }
        /**
         * Removes the serie with the given id from the SeriesProvider
         *
         * @param {string} id
         * @memberof SeriesProvider
         */
        remove(id, disposeSeries = true) {
            persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(this.getSeriesPersistingId(id), undefined);
            if (disposeSeries) {
                let series = this._series.get(id);
                if (series != undefined) {
                    series.eventDataChanged.detach(this._serieDataChangedHandler);
                    series.dispose();
                }
            }
            this._series.delete(id);
            persistDataProvider_1.PersistDataProvider.getInstance().setDataWithId(this.component.id, this.getComponentSettings(true));
        }
        /**
         * Returns the serie for the given id
         *
         * @param {(string|undefined)} id
         * @returns {(BaseSeries|undefined)}
         * @memberof SeriesProvider
         */
        get(id) {
            if (id == undefined) {
                return undefined;
            }
            return this._series.get(id);
        }
        /**
         * Creates a serie for the given settings
         *
         * @param {ISettings} settings
         * @returns {(BaseSeries|undefined)}
         * @memberof SeriesProvider
         */
        createSerie(settings) {
            // TODO: Handle with settings object factory
            let serie;
            if (settings.type == "YTSeries") {
                serie = YTSeries_1.YTSeries.create(settings, this);
            }
            else if (settings.type == "FFTSeries") {
                serie = FFTSeries_1.FFTSeries.create(settings, this);
            }
            else if (settings.type == "XYSeries") {
                serie = XYSeries_1.XYSeries.create(settings, this);
            }
            if (serie != undefined) {
                this.add(serie);
            }
            return serie;
        }
    };
    SeriesProvider = SeriesProvider_1 = __decorate([
        mco.role()
    ], SeriesProvider);
    exports.SeriesProvider = SeriesProvider;
});
