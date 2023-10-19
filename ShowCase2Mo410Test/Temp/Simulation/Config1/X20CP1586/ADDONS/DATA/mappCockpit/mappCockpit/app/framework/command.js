var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Command_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Command = void 0;
    /**
     * Implements a typed commoand with command parameters and command result. A command call may be executed asynchronous.
     * Thus the execution and the optional result is acknowledged and returned via a callback.
     *
     * @class Command
     * @template T_COMMAND_PARS Specifies the command parameters type
     * @template T_COMMAND_RESULT Specifies the command result type
     */
    let Command = Command_1 = class Command {
        /**
         * Creates an instance of Command.
         * @memberof Command
         */
        constructor(caller, commandExecutionDelegate) {
            // Holds the execution state
            this._commandExecutionState = CommandExecutionState.READY;
            this._caller = caller;
            this._commandExecutionDelegate = commandExecutionDelegate;
            this._commandExecutionState = CommandExecutionState.READY;
            this._commandResponse = new CommandExecutionResponse(this);
        }
        /**
         * Creates a command instance
         *
         * @static
         * @template T_COMMAND_PARS
         * @template T_COMMAND_RESULT
         * @returns {Command<T_COMMAND_PARS, T_COMMAND_RESULT>}
         * @memberof Command
         */
        static create(caller, commandExecutionDelegate) {
            return new Command_1(caller, commandExecutionDelegate.bind(caller));
        }
        /**
         * Callback hook for execution success
         *
         * @param {( resultData: any) => void} onSuccess
         * @returns {Command<T_COMMAND_PARS,T_COMMAND_RESULT>}
         * @memberof Command
         */
        executed(onSuccess) {
            this._commandResponse.setSuccessResponseDelegate(this.commandExecuted.bind(this), onSuccess);
            return this;
        }
        /**
         * Callback hook for execution error
         *
         * @param {( rejectionInfo: any) => void} onRejection
         * @returns {Command<T_COMMAND_PARS,T_COMMAND_RESULT>}
         * @memberof Command
         */
        error(onRejection) {
            this._commandResponse.setRejectionResponseDelegate(this.commandRejected.bind(this), onRejection);
            return this;
        }
        /**
         * Invokes the execution of a command
         *
         * @param {T_COMMAND_PARS} [commandPars]
         * @param {(commandResult: T_COMMAND_RESULT) => void} [onSuccess]
         * @param {(errorData: any) => void} [onRejection]
         * @returns {void}
         * @memberof Command
         */
        execute(commandPars, onSuccess, onRejection) {
            if (this.canInvokeCommand()) {
                this.beginCommandExecution();
                // create a new command for execution
                this.executeInternal(commandPars, onSuccess, onRejection);
            }
            else {
                // if a command is still pending, we ignore the new request and notify an error...
                let errorMsg = "The command could not be invoke because another execution is pending";
                console.error(errorMsg);
                if (onRejection) {
                    onRejection(errorMsg);
                }
            }
        }
        /**
         * Starts a command execution
         *
         * @private
         * @memberof Command
         */
        beginCommandExecution() {
            this._commandExecutionState = CommandExecutionState.PENDING;
        }
        /**
         * Terminates a command execution
         *
         * @private
         * @memberof Command
         */
        endCommandExecution() {
            this._commandExecutionState = CommandExecutionState.READY;
        }
        /**
         * Creates and invokes a new command
         *
         * @private
         * @param {(T_COMMAND_PARS | undefined)} commandPars
         * @param {(((commandResult: T_COMMAND_RESULT) => void) | undefined)} onSuccess
         * @param {(((errorData: any) => void) | undefined)} onRejection
         * @memberof Command
         */
        invokeNewCommand(commandPars, onSuccess, onRejection) {
            // create new command
            let command = Command_1.create(this._caller, this._commandExecutionDelegate);
            // execute this command
            command.executeInternal(commandPars, onSuccess, onRejection);
        }
        /**
         * Returns if a command can be invoked
         *
         * @returns {*}
         * @memberof Command
         */
        canInvokeCommand() {
            return this._commandExecutionState === CommandExecutionState.READY;
        }
        /**
         * Invokes the internal execution of the command
         *
         * @private
         * @param {T_COMMAND_PARS} [commandPars]
         * @param {(commandResult: T_COMMAND_RESULT) => void} [onSuccess]
         * @param {(errorData: any) => void} [onRejection]
         * @returns {void}
         * @memberof Command
         */
        executeInternal(commandPars, onSuccess, onRejection) {
            // if there is a command method defined ?....
            if (this._commandExecutionDelegate) {
                // install execution delegates
                this._commandResponse.setSuccessResponseDelegate(this.commandExecuted.bind(this), onSuccess);
                this._commandResponse.setRejectionResponseDelegate(this.commandRejected.bind(this), onRejection);
                // invoke the execution delegate
                this._commandExecutionDelegate(commandPars, this._commandResponse);
            }
            return;
        }
        /**
         * Controls the success command execution
         *
         * @param {T_COMMAND_PARS} [commandPars]
         * @memberof Command
         */
        commandExecuted(successResultData) {
            console.log("Command.commandExecuted: %o %o", this, successResultData);
            if (this._commandResponse.notifyCommandExecution) {
                this._commandResponse.notifyCommandExecution(successResultData);
            }
            this.endCommandExecution();
        }
        /**
         * Controls the rejection command execution
         *
         * @param {T_COMMAND_PARS} [commandPars]
         * @memberof Command
         */
        commandRejected(errorData) {
            console.log("Command.commandRejected: %o", this, errorData);
            if (this._commandResponse.notifyCommandRejection) {
                this._commandResponse.notifyCommandRejection(errorData);
            }
            this.endCommandExecution();
        }
    };
    Command = Command_1 = __decorate([
        mco.role()
    ], Command);
    exports.Command = Command;
    /**
     * Implements handling the command execution response.
     *
     * @class CommandExecutionResponse
     * @implements {ICommandExecutionResponseDelegate<T_COMMAND_RESULT>}
     * @template T_COMMMAND_PARS
     * @template T_COMMAND_RESULT
     */
    let CommandExecutionResponse = class CommandExecutionResponse {
        /**
         * Sets the delegate for responding the successful execution of the command
         *
         * @param {( resultData: any) => any} executed
         * @returns {*}
         * @memberof CommandExecutionResponse
         */
        setClientSuccessResponseDelegate(executed) {
            this._clientExecutionCallback = executed;
        }
        /**
         * Sets the delegate for responding the rejection of the command
         *
         * @param {( rejectionInfo: any) => any} onError
         * @returns {*}
         * @memberof CommandExecutionResponse
         */
        setClientRejectionResponseDelegate(onError) {
            this._clientRejectionCallback = onError;
        }
        /**
         * Creates an instance of CommandExecutionResponse.
         * @param {Command<T_COMMMAND_PARS,T_COMMAND_RESULT>} command
         * @memberof CommandExecutionResponse
         */
        constructor(command) {
            // Holds the callback for controlling commadn rejection
            this._rejectionCallback = () => { console.error("CommandExecutionResponse: No execution delegate defined!"); };
            // Holds the callback for controlling command execution
            this._executionCallback = () => { console.error("CommandExecutionResponse: No success delegate defined!"); };
            this._command = command;
        }
        /**
         * Gets the execution callbacks
         *
         * @readonly
         * @memberof CommandExecutionResponse
         */
        get notifyCommandExecution() {
            return this._clientExecutionCallback;
        }
        /**
         * Gets the rejection callbacks
         *
         * @readonly
         * @memberof CommandExecutionResponse
         */
        get notifyCommandRejection() {
            return this._clientRejectionCallback;
        }
        /**
         * Called when the command has been executed succssful. It calles the success delegates and passes the result parameters to them.
         *
         * @param {*} [resultData=null]
         * @memberof CommandExecutionResponse
         */
        executed(resultData = null) {
            this.onResponsecommandExecutedSuccessfull(resultData);
        }
        ;
        /**
         * Called when the command has been rejected. It calls the rejection delegates and passes the rejection info to them.
         *
         * @param {*} rejectionInfo
         * @memberof CommandExecutionResponse
         */
        rejected(rejectionInfo) {
            this.onResponseTaskExecutedWithError(rejectionInfo);
        }
        ;
        /**
         * Handles forwarding the command success.
         *
         * @private
         * @param {ICommandExecutionResponseDelegate<T_COMMAND_RESULT>} successResultData
         * @memberof CommandExecutionResponse
         */
        onResponsecommandExecutedSuccessfull(successResultData) {
            // invoke the execution callbacks
            this._executionCallback(successResultData);
        }
        /**
         * Handles forwarding the command rejection.
         *
         * @private
         * @param {ICommandExecutionResponseDelegate<T_COMMAND_RESULT>} errorResponseData
         * @memberof CommandExecutionResponse
         */
        onResponseTaskExecutedWithError(errorResponseData) {
            // invoke the rejection callbacks
            this._rejectionCallback(errorResponseData);
        }
        /**
         * Sets the execution control delegate
         *
         * @param {(commandPars?: any ) => void} commandExecuted
         * @returns {*}
         * @memberof CommandExecutionResponse
         */
        setSuccessResponseDelegate(commandExecuted, onSuccess) {
            this._executionCallback = commandExecuted;
            if (onSuccess) {
                this.setClientSuccessResponseDelegate(onSuccess);
            }
        }
        /**
      * Sets the rejection control delegate
      *
      * @param {(commandPars?: any) => void} commandRejected
      * @returns {*}
      * @memberof CommandExecutionResponse
      */
        setRejectionResponseDelegate(commandRejected, onError) {
            this._rejectionCallback = commandRejected;
            if (onError) {
                this.setClientRejectionResponseDelegate(onError);
            }
        }
    };
    CommandExecutionResponse = __decorate([
        mco.role()
    ], CommandExecutionResponse);
    var CommandExecutionState;
    (function (CommandExecutionState) {
        CommandExecutionState[CommandExecutionState["READY"] = 0] = "READY";
        CommandExecutionState[CommandExecutionState["PENDING"] = 1] = "PENDING";
    })(CommandExecutionState || (CommandExecutionState = {}));
});
