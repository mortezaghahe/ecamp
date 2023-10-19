define(["require", "exports", "./calculatorBase", "../calculationDataPoints", "../calculationDataDisplayInfo"], function (require, exports, calculatorBase_1, calculationDataPoints_1, calculationDataDisplayInfo_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /********************************************************************************************************************************************************
     *   This skeleton should assist in creating new calculators.                                                                                           *
     *   Copy the content into a new file within the folder "src/app/models/common/calculatorProvider/calculators/".                                        *
     *   Change the class name to a meaningful name for YOUR calculator.                                                                                    *
     *   Implement your specific functionality in the marked areas within each function.                                                                    *
     *   It is recommended and the default of this skeleton, to call the overridden functions of the base class to utilize centralized common behaviour.    *
     *   To not perform the default behavior when overriding, delete the super calls.                                                                       *
     *   Remove functions only if you dont provide a specialised behavior (careful, some default implementations might do nothing).                         *
     *   You may introduce new functions to use within the provided (overridden) functions whenever necessary.                                              *
     *   After finishing the implementation, remove the skeleton specific comments and add your own code documentation/comments.                            *
     *                                                                                                                                                      *
     *   ATTENTION: The functions in this skeleton are overrides. Do not change the function signature.                                                     *
     *   ATTENTION: Do not forget to export the new calculator class to make it available in other code files.                                              *
     *   ATTENTION: Make sure to add your calculator to the CalculatorProvider in the file 'calculatorProvider.ts' to be able to access it within the UI.   *
     ********************************************************************************************************************************************************/
    class CalculatorSkeleton extends calculatorBase_1.CalculatorBase {
        /**************************************************************************************************************************************************/
        constructor() {
            super("calculator id here", "calculator display name here", "calculator description here");
            /*************************************************************************************************************************************************
             * Use private properties to have centralized control over displaynames and others.                                                              *
             * A minimal basic example is implemented to provide an idea of the naming and the purpose.                                                      *
             *************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
            this.inputId = "id for input signal here";
            this.inputName = "displayname for input signal here";
            this.outputId = "id for output signal here";
            this.outputName = "displayname for output signal here";
            this.outputValue = "signalname for output signal here";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            /*************************************************************************************************************************************************
             *   Add your default input data here (Push it on the array defaultInputData).                                                                   *
             *   You can accept a number (CalculationDataNumber) or a signal (CalculationDataPoints) or both (CalculationDataNumberOrPoints) as input.       *
             *   You can also accept a string (CalculationDataString) as input                                                                               *
             *   Consider to store the displaynames as private property.                                                                                     *
             *   A minimal basic example is implemented where one signal is the default input data.                                                          *
             *************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(this.inputId, this.inputName, "", new Array(), "description for the input signal here", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            /**************************************************************************************************************************************************/
            return defaultInputData;
        }
        getDefaultOutputData() {
            let defaultOutputData = super.getDefaultOutputData();
            /*************************************************************************************************************************************************
             *   Add your default output data here (Push it on the array defaultOuputData).                                                                  *
             *   Consider to store the displaynames and signalnames as private property.                                                                     *
             *   A minimal basic example is implemented where one signal is the default putput data.                                                         *
             *************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
            defaultOutputData.push(new calculationDataPoints_1.CalculationDataPoints(this.outputId, this.outputName, this.outputValue, new Array()));
            /**************************************************************************************************************************************************/
            return defaultOutputData;
        }
        prepareCalculationData() {
            super.prepareCalculationData();
            //retrieve calculation input data
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            /*************************************************************************************************************************************************
             *   Perform necessary data preparations for the calculator here.                                                                                *
             *   This data preparations are performed before verification of the calculation input data takes place.                                         *
             *   Store the changed data in the data property of the respective CalculationInputData.                                                         *
             *************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            //retrieve calculation input data
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            /*************************************************************************************************************************************************
             *   Verify the calculation input data here.                                                                                                     *
             *   Add an error with addErrorByType() or addError() methods id something is wrong.                                                             *
             *************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            //retrieve calculation input data and initialize result
            let calculationInputData = this.getCalculationInputDataContainer();
            let result = new Array();
            /*************************************************************************************************************************************************
             *   Execute the algorithm your calculator represents here.                                                                                      *
             *   Store the result of the algorithm in the array result.                                                                                      *
             *************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
            //add the result of the calculation to the calculationOutpuContainer
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        verifyCalculationOutputData() {
            super.verifyCalculationOutputData();
            //retrieve calculation output data
            let calculationOutputDataContainer = this.getCalculationOutputDataContainer();
            /*************************************************************************************************************************************************
             *   Verify the calculation output data here.                                                                                                    *
             *   Add an error with addErrorByType() or addError() methods if something is wrong.                                                             *
             *************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
            /**************************************************************************************************************************************************/
        }
    }
});
