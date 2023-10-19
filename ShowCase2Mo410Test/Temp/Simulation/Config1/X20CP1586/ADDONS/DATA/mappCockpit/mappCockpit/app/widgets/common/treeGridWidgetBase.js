var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./widgetBase", "./treeGridColumnDefinition", "./treeGridToolbarBase", "../../common/utilities/utilities"], function (require, exports, widgetBase_1, treeGridColumnDefinition_1, treeGridToolbarBase_1, utilities_1) {
    "use strict";
    var TreeGridWidgetBase_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TreeGridWidgetBase = void 0;
    let TreeGridWidgetBase = TreeGridWidgetBase_1 = class TreeGridWidgetBase extends widgetBase_1.WidgetBase {
        constructor() {
            super(...arguments);
            this._columnIndexForDynamicSize = -1; // -1 for no dynamic size behavior
            this._minColumnWidthForDynamicColumn = 10;
            this._hideColumnHeader = false;
            this._hideHeaderFilterBar = false;
            this._previousScrollSettings = { "vertical": 0, "horizontal": 0 };
            this._toolbar = new treeGridToolbarBase_1.TreeGridToolbarBase(this.mainDiv);
            this.refreshEnabled = true;
        }
        initialize() {
            this.initializeLocales();
            // Initialize the widget
            super.initialize();
        }
        /**
         * Dispose the tree grid data
         *
         * @memberof TreeGridWidgetBase
         */
        dispose() {
            super.dispose();
            let treeGridObject = this.getTreeGridObject();
            if (treeGridObject != undefined) {
                treeGridObject.destroy();
            }
        }
        /**
         * TreeGrid was created
         *
         * @private
         * @memberof TreeGridWidgetBase
         */
        treeGridCreated() {
            // Sets the default toolbar button states
            this._toolbar.initToolbarStates();
        }
        /**
         * Sets a dynamic column
         * This column will be resized if the window/widget were resized
         *
         * @protected
         * @param {number} columnIndex
         * @param {number} minColumnWidthForDynamicColumn
         * @memberof TreeGridWidgetBase
         */
        setDynamicColumn(columnIndex, minColumnWidthForDynamicColumn) {
            this._columnIndexForDynamicSize = columnIndex;
            this._minColumnWidthForDynamicColumn = minColumnWidthForDynamicColumn;
        }
        /**
         * Loads the styles for the tree grid widget base
         *
         * @memberof TreeGridWidgetBase
         */
        loadStyles() {
            // TODO: Load in this class when timing problem while initialization with the resize is solved
            // this.addStyle("widgets/common/style/css/treeGridStyle.css");
            this.addStyle("widgets/common/style/css/treeGridScrollBarStyle.css");
            this.addStyle("widgets/common/style/css/treeGridIconStyle.css");
            this.addStyle("widgets/common/style/css/treeGridToolbarButtonStyle.css");
            this.addStyle("widgets/common/style/css/widgetHeaderFooterStyle.css");
        }
        setCellEdit(value) {
            var treeGridObject = this.getTreeGridObject();
            treeGridObject.model.isEdit = value;
        }
        /**
         * Sets the flag that the column header of the tree grid should be hidden
         *
         * @memberof TreeGridWidgetBase
         */
        setColumnHeaderHidden() {
            this._hideColumnHeader = true;
        }
        /**
         * Sets the flag that the header filterbar of the tree grid should be hidden
         *
         * @memberof TreeGridWidgetBase
         */
        setHeaderFilterBarHidden() {
            this._hideHeaderFilterBar = true;
        }
        /** resizes the tree grid widget
         *
         * @param {number} width
         * @param {number} height
         * @memberof TreeGridWidgetBase
         */
        resize(width, height) {
            this._actualWidth = width;
            this._actualHeight = height;
            var newWidth = "";
            var newHeight = "";
            if (width != 0) {
                newWidth = width + "px";
            }
            if (height != 0) {
                newHeight = this.getNewHeight(height);
            }
            var treeGridObj = this.getTreeGridObject(), sizeSettings = {
                height: newHeight, width: newWidth, // 100% would be wrong => set empty string to resize the treegrid correct
            };
            if (treeGridObj) {
                // Save cell if currently in edit mode before start resizing the treegrid, otherwise errors would occur
                treeGridObj.saveCell();
                treeGridObj.option("sizeSettings", sizeSettings, true); // force the setting to resize the treegrid correct
            }
            if (this._columnIndexForDynamicSize != -1) {
                this.fillSpaceWithDynamicColumn(width);
            }
            //When treeGrid is resized, syncf scrollbar can be added or removed
            this.updatescrollbarsObservation();
            this._toolbar.resize(width);
        }
        /**
         * Returns the tree grid object definition for using a toolbar
         *
         * @returns {*}
         * @memberof TreeGridWidgetBase
         */
        getTreeGridToolbarSupport(activeSearchSupport = false) {
            if (activeSearchSupport == true) {
                return {
                    toolbarSettings: {
                        showToolbar: true,
                        toolbarItems: [ej.TreeGrid.ToolbarItems.Search],
                        customToolbarItems: this._toolbar.getCustomToolbars(),
                    },
                    toolbarClick: (args) => this.toolbarClick(args),
                };
            }
            return {
                toolbarSettings: {
                    showToolbar: true,
                    customToolbarItems: this._toolbar.getCustomToolbars(),
                },
                toolbarClick: (args) => this.toolbarClick(args),
            };
        }
        /**
         * Get new height of treegrid
         *
         * @param {number} height
         * @returns {string}
         * @memberof TreeGridWidgetBase
         */
        getNewHeight(height) {
            let newHeight = height - this._headerHeight - this._footerHeight + "px";
            if (this._footerHeight != 0) {
                let nonContentHeight = this.getNonTreeGridContentHeight();
                if (parseFloat(newHeight) < nonContentHeight) {
                    if (this.footerDiv != undefined) {
                        this.footerDiv.hidden = true;
                    }
                    newHeight = height - this._headerHeight + "px";
                }
                else {
                    if (this.footerDiv != undefined) {
                        this.footerDiv.hidden = false;
                    }
                }
            }
            return newHeight;
        }
        /**
         * Get height of treegrid without content (toolbar + header)
         *
         * @returns {number}
         * @memberof TreeGridWidgetBase
         */
        getNonTreeGridContentHeight() {
            let toolbar = $(this.mainDiv).find('.e-treegridtoolbar');
            let header = $(this.mainDiv).find('.e-gridheader');
            let toolbarHeight = parseFloat(toolbar.css('height'));
            let headerHeight = parseFloat(header.css('height'));
            toolbarHeight = Number.isNaN(toolbarHeight) ? 0 : toolbarHeight;
            headerHeight = Number.isNaN(headerHeight) ? 0 : headerHeight;
            //1 is added if it is not a Gantt chart (syncfusion internal weird stuff)
            return toolbarHeight + headerHeight + 1;
        }
        /**
         * Sets the datamodel to the dataSource of the treegrid, also if an edit operation is active
         *
         * @protected
         * @param {*} datamodel
         * @returns
         * @memberof TreeGridWidgetBase
         */
        setModelWithEditSupport(datamodel) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isTreeGridInEditMode() == false) {
                    // To refresh TreeGrid with new datasource
                    this.setModel(datamodel);
                }
                else {
                    // treegrid is in edit mode => refresh would not work => wait for editing is finished
                    for (let i = 0; i < 100; i++) {
                        yield utilities_1.Utilities.sleep(200);
                        // is editing already finished
                        if (this.isTreeGridInEditMode() == false) {
                            this.setModel(datamodel);
                            return;
                        }
                    }
                }
            });
        }
        /**
         * Returns true if the treegrid is currently in editmode
         *
         * @private
         * @returns {boolean}
         * @memberof TreeGridWidgetBase
         */
        isTreeGridInEditMode() {
            let treegridObj = this.getTreeGridObject();
            if (treegridObj.model.isEdit == true) {
                return true;
            }
            return false;
        }
        /**
         * Sets the datamodel to the dataSource of the treegrid
         *
         * @protected
         * @param {*} model
         * @param {boolean} [force=false]
         * @memberof TreeGridWidgetBase
         */
        setModel(model, force = false) {
            var treeGridObj = this.getTreeGridObject();
            if (treeGridObj != undefined) {
                treeGridObj.setModel({ "dataSource": model }, force);
                if (this._columnIndexForDynamicSize != -1) {
                    // To avoid empty space after last column because of removing the scrollbar if less data is available
                    this.fillSpaceWithDynamicColumn(this.width);
                }
            }
        }
        /**
         * Resize dynamic column
         * If changed column was dynamic column the size of the last column will be adapted
         *
         * @protected
         * @param {*} columnIndex	columnIndex of changed column
         * @param {*} treeGridModel
         * @memberof TreeGridWidgetBase
         */
        resizeDynamicColumn(columnIndex, treeGridModel) {
            let treeGridWidth = parseInt(treeGridModel.sizeSettings.width, 10); // parseInt to remove "px"
            if (columnIndex != this._columnIndexForDynamicSize && columnIndex < this._columnIndexForDynamicSize) {
                this.fillSpaceWithDynamicColumn(treeGridWidth);
            }
            else {
                // Dynamic column size was changed => update last "visible" column to fill space
                let lastVisibleColumnIndex = this.getLastVisibleColumnIndex(treeGridModel);
                this.fillSpaceWithColumn(lastVisibleColumnIndex, treeGridWidth);
            }
        }
        /**
         * Returns the settings of this component
         *
         * @param {boolean} onlyModified
         * @returns {ComponentSettings}
         * @memberof TreeGridWidgetBase
         */
        getComponentSettings(onlyModified) {
            // Add treegrid persisting data
            this.component.setSetting(TreeGridWidgetBase_1.ColumnsSettingId, this.getColumnSettings());
            this.component.setSetting(TreeGridWidgetBase_1.ScrollbarsSettingsId, this.getScrollBarSettings());
            return super.getComponentSettings(onlyModified);
        }
        /**
         * Sets the given settings to this component
         *2
         * @param {ComponentSettings} componentSettings
         * @memberof TreeGridWidgetBase
         */
        setComponentSettings(componentSettings) {
            if (componentSettings != undefined) {
                super.setComponentSettings(componentSettings);
                this.setColumnSettings(this.component.getSetting(TreeGridWidgetBase_1.ColumnsSettingId));
                this.setScrollBarSettings(this.component.getSetting(TreeGridWidgetBase_1.ScrollbarsSettingsId));
                // Hide tableheader/filter row after setting new column sizes if needed
                if (this.hideSomeTableHeaderParts() == true) {
                    // After setting the treegrid column sizes, the header parts will be shown => hide header parts if not needed
                    this.hideTableHeader();
                }
            }
        }
        /**
         * Returns the column settings
         *
         * @private
         * @returns {Array<TreeGridColumnDefinition>}
         * @memberof TreeGridWidgetBase
         */
        getColumnSettings() {
            let columnData = new Array();
            let treeGridObject = this.getTreeGridObject();
            if (treeGridObject != undefined) {
                let columnSettings = treeGridObject.option("columns");
                if (columnSettings != undefined) {
                    for (let i = 0; i < columnSettings.length; i++) {
                        columnData.push(new treeGridColumnDefinition_1.TreeGridColumnDefinition(columnSettings[i].field, columnSettings[i].width, columnSettings[i].visible));
                    }
                }
            }
            return columnData;
        }
        /**
         * Sets the given columns settings
         *
         * @param {Array<TreeGridColumnDefinition>} columnData
         * @memberof TreeGridWidgetBase
         */
        setColumnSettings(columnData) {
            let treeGridObject = this.getTreeGridObject();
            if (treeGridObject != undefined) {
                if (columnData != undefined) {
                    let columnSettings = treeGridObject.option("columns");
                    if (columnSettings != undefined) {
                        for (let i = 0; i < columnData.length; i++) {
                            let columnSetting = columnSettings.find(colSetting => colSetting.field == columnData[i].id);
                            if (columnSetting != undefined) {
                                columnSetting.visible = columnData[i].isVisible;
                                columnSetting.width = columnData[i].width;
                            }
                            else {
                                console.error("columnSettings not available for index: " + i);
                            }
                        }
                    }
                    treeGridObject.option("columns", columnSettings, true);
                }
                // Hide tableheader/filter row after setting new column sizes if needed
                if (this.hideSomeTableHeaderParts() == true) {
                    // After setting the treegrid column sizes, the header parts will be shown => hide header parts if not needed
                    this.hideTableHeader();
                }
            }
        }
        getScrollBarSettings() {
            let treeGridObject = this.getTreeGridObject();
            let settings = {
                "vertical": treeGridObject.getScrollTopOffset(),
                "horizontal": treeGridObject.getScrollLeftOffset()
            };
            return settings;
        }
        setScrollBarSettings(data) {
            if (data == undefined) {
                return;
            }
            let treeGridObject = this.getTreeGridObject();
            treeGridObject.scrollOffset(data.horizontal, data.vertical);
        }
        /**
         * Returns the index of the last visible column
         *
         * @private
         * @param {*} treeGridModel
         * @returns
         * @memberof TreeGridWidgetBase
         */
        getLastVisibleColumnIndex(treeGridModel) {
            for (let i = treeGridModel.columns.length - 1; i >= 0; i--) {
                if (treeGridModel.columns[i].visible == true) {
                    return i;
                }
            }
            return -1;
        }
        /**
         * creates the tree grid
         *
         * @memberof TreeGridWidgetBase
         */
        createLayout() {
            this.createTemplates();
            this.createTreeGrid();
            if (this.hideSomeTableHeaderParts() == true) {
                // Hide some header parts of treegrid
                this.hideTableHeader();
            }
        }
        /**
         * Returns the ej tree grid object
         *
         * @returns {ej.TreeGrid}
         * @memberof TreeGridWidgetBase
         */
        getTreeGridObject() {
            return $(this.mainDiv).data("ejTreeGrid");
        }
        /**
         * clears the dragged records list(needed after drag & drop was canceled)
         *
         * @protected
         * @memberof TreeGridWidgetBase
         */
        clearDraggedRecords() {
            let treeGridObject = this.getTreeGridObject();
            if (treeGridObject != undefined) {
                treeGridObject._draggedRecords = [];
            }
        }
        /**
         * Returns the tree record for the given element
         *
         * @protected
         * @param {*} element
         * @returns {any}
         * @memberof TreeGridWidgetBase
         */
        getTreeRecord(element) {
            let treegridObj = this.getTreeGridObject();
            let tr = element.closest("tr");
            if (tr != undefined) {
                let index = tr.rowIndex;
                if (treegridObj.model.currentViewData != undefined) {
                    return treegridObj.model.currentViewData[index];
                }
            }
            return undefined;
        }
        /**
         * Set the focus to the current tree grid
         *
         * @memberof TreeGridWidgetBase
         */
        focus() {
            // TODO: No public focus method available for tree grid, but needed for forcing the focus to the tree grid if draggable is used in a tree grid
            // (in case of draggable tree grid will not be focused because not the treegrid row will be selected on a click, but the directly div will by selected => svg or other div)
            this.getTreeGridObject()._focusTreeGridElement();
        }
        /**
         * Initializes locale resources
         *
         * @private
         * @memberof TreeGridWidgetBase
         */
        initializeLocales() {
            // get the locales for the treegrid
            let loc = ej.TreeGrid.Locale;
            // show an empty string if no records are available
            loc.default.emptyRecord = "";
        }
        fillSpaceWithDynamicColumn(treegridWidth) {
            if (this._columnIndexForDynamicSize == -1) {
                return;
            }
            this.fillSpaceWithColumn(this._columnIndexForDynamicSize, treegridWidth);
        }
        fillSpaceWithColumn(fillSpaceColumnIndex, treegridWidth) {
            var treeObj = this.getTreeGridObject();
            if (!treeObj) {
                return;
            }
            var columns = treeObj.option("columns");
            if (!columns) {
                return;
            }
            let newColumnWidth = this.getNewColumnWidth(treegridWidth, columns, fillSpaceColumnIndex);
            if (newColumnWidth > this._minColumnWidthForDynamicColumn) {
                columns[fillSpaceColumnIndex].width = newColumnWidth - 3; //-3 to avoid scrollbar
                columns[fillSpaceColumnIndex].width -= this.getScrollBarWidth(); // remove scrollbar size
                treeObj.option("columns", columns, true);
                if (this.hideSomeTableHeaderParts() == true) {
                    // After setting the treegrid co6lumn sizes, the header parts will be shown => hide header parts if not needed
                    this.hideTableHeader();
                }
            }
        }
        setColumnWidth(index, width) {
            var treeObj = this.getTreeGridObject();
            if (!treeObj) {
                return;
            }
            var columns = treeObj.option("columns");
            if (!columns) {
                return;
            }
            columns[index].width = width;
            treeObj.option("columns", columns, true);
            this.fillSpaceWithColumn(this._columnIndexForDynamicSize, this._actualWidth);
        }
        /**
         * Returns true if some parts of the table header should be hidden(e.g. column header, filterbar, ...)
         *
         * @private
         * @returns {boolean}
         * @memberof TreeGridWidgetBase
         */
        hideSomeTableHeaderParts() {
            if (this._hideColumnHeader == true) {
                return true;
            }
            if (this._hideHeaderFilterBar == true) {
                return true;
            }
            return false;
        }
        getScrollBarWidth() {
            var viewDiv = $(this.mainDiv).find('.e-gridcontent');
            for (let childIndex = 0; childIndex < viewDiv[0].children.length; childIndex++) {
                let child = viewDiv[0].children[childIndex];
                if (child.classList.contains("e-vscrollbar") == true) {
                    return child.clientWidth;
                }
            }
            return 0;
        }
        getNewColumnWidth(treegridWidth, columns, fillSpaceColumnIndex) {
            let newColumnWidth = treegridWidth;
            for (let columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                if (columnIndex != fillSpaceColumnIndex) {
                    if (columns[columnIndex] != undefined && columns[columnIndex].visible == true) {
                        newColumnWidth -= columns[columnIndex].width;
                    }
                }
            }
            return newColumnWidth;
        }
        /**
         * Hides the table header parts which are currently defined to be hidden(e.g. _hideColumnHeader, _hideHeaderFilterBar, ...)
         *
         * @private
         * @memberof TreeGridWidgetBase
         */
        hideTableHeader() {
            let $treeGridHeader = $(this.mainDiv).find(".e-gridheader");
            let tableHeader = $treeGridHeader[0].children[0].children[0];
            if (tableHeader != undefined) {
                let columnHeader = tableHeader.rows[0];
                let filterBar = tableHeader.rows[1];
                if (columnHeader != undefined) {
                    if (this._hideColumnHeader == true) {
                        // hide column header
                        columnHeader.style.display = "none";
                    }
                }
                if (filterBar != undefined) {
                    if (this._hideHeaderFilterBar == true) {
                        // hide filterbar
                        filterBar.style.display = "none";
                    }
                }
            }
        }
        /**
         * Called when a button in the toolbar is clicked
         *
         * @protected
         * @param {*} args
         * @memberof TreeGridWidgetBase
         */
        toolbarClick(args) {
            let treeGridObj = this.getTreeGridObject();
            //Cancel edit cell when toolbar button is clicked
            if (treeGridObj != undefined && treeGridObj.model.isEdit == true) {
                treeGridObj.cancelEditCell();
            }
            if (this._toolbar.isExpandCollapseSelected(args) == true) {
                // Disables refresh caused by syncfusion calls
                this.enableTreeGridRefresh(false);
                this._toolbar.toolbarClick(args, this);
                this.enableTreeGridRefresh(true);
                this.refresh();
            }
            else {
                this._toolbar.toolbarClick(args, this);
            }
        }
        /**
         * Save tree grid settings
         *
         * @protected
         * @memberof TreeGridWidgetBase
         */
        saveTreeGridSettings() {
            if (this.component.getPersistency()) {
                this.updatescrollbarsObservation();
                this.saveSettings();
            }
        }
        /**
         * Updates scrollbar observation for both scrollbars
         *
         * @protected
         * @memberof TreeGridWidgetBase
         */
        updatescrollbarsObservation() {
            var verticalScrollbar = this.getVerticalScrollbar();
            var horizontalScrollbar = this.getHorizontalScrollbar();
            this.updateScrollbarObservation(verticalScrollbar, this._verticalScrollbarObserver);
            this.updateScrollbarObservation(horizontalScrollbar, this._horizontalScrollbarObserver);
        }
        /**
         * Observe scrollbar, unobserve scrollbar or don't do anything.
         *
         * @private
         * @param {(HTMLElement | undefined)} element
         * @param {(MutationObserver | undefined)} observer
         * @memberof TreeGridWidgetBase
         */
        updateScrollbarObservation(element, observer) {
            if (element !== undefined && observer === undefined) {
                this.observeScrollbar(element, observer);
            }
            else if (element === undefined) {
                this.unobserveScrollbar(observer);
            }
        }
        /**
         * Get element of vertical scrollbar
         *
         * @private
         * @returns {(HTMLElement | undefined)}
         * @memberof TreeGridWidgetBase
         */
        getVerticalScrollbar() {
            var scrollbarElement = $(this.mainDiv).find('.e-vscrollbar');
            if (scrollbarElement.length > 0) {
                return scrollbarElement.find('.e-vhandle')[0];
            }
            return undefined;
        }
        /**
         * Get element of horizontal scrollbar
         *
         * @private
         * @returns {(HTMLElement | undefined)}
         * @memberof TreeGridWidgetBase
         */
        getHorizontalScrollbar() {
            var scrollbarElement = $(this.mainDiv).find('.e-hscrollbar');
            if (scrollbarElement.length > 0) {
                return scrollbarElement.find('.e-hhandle')[0];
            }
            return undefined;
        }
        /**
         * Observe scrollbar for changes
         *
         * @private
         * @param {HTMLElement} target
         * @param {(MutationObserver | undefined)} observer
         * @memberof TreeGridWidgetBase
         */
        observeScrollbar(target, observer) {
            var widget = this;
            observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutationRecord) {
                    let scrollSettings = widget.getComponentSettings(true).data.scrollbars;
                    if (scrollSettings.horizontal != widget._previousScrollSettings.horizontal || scrollSettings.vertical != widget._previousScrollSettings.vertical) {
                        widget._previousScrollSettings = scrollSettings;
                        widget.saveSettings();
                    }
                });
            });
            observer.observe(target, { attributes: true });
        }
        /**
         * Unobserve scrollbar
         *
         * @private
         * @param {(MutationObserver | undefined)} observer
         * @memberof TreeGridWidgetBase
         */
        unobserveScrollbar(observer) {
            if (observer !== undefined) {
                observer.disconnect();
                observer = undefined;
            }
        }
        /**
         * Sets flags that enables/disables refresh of treegrid
         *
         * @protected
         * @param {boolean} value
         * @memberof TreeGridWidgetBase
         */
        enableTreeGridRefresh(value) {
            this.refreshEnabled = value;
        }
        refresh() { }
        ;
        /**
         * Creates the templates(e.g. column, row, ...) for the tree grid and adds them to the widget container
         *
         * @protected
         * @memberof TreeGridWidgetBase
         */
        createTemplates() {
        }
    };
    TreeGridWidgetBase.ColumnsSettingId = "columns";
    TreeGridWidgetBase.ScrollbarsSettingsId = "scrollbars";
    TreeGridWidgetBase = TreeGridWidgetBase_1 = __decorate([
        mco.role()
    ], TreeGridWidgetBase);
    exports.TreeGridWidgetBase = TreeGridWidgetBase;
});
