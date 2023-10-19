var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./fft/fft_bilstein", "../../point", "../calculationDataPoints", "../calculationDataDisplayInfo", "./calculatorBase", "./calculatorHelper", "../../../common/series/seriesType"], function (require, exports, fft_bilstein_1, point_1, calculationDataPoints_1, calculationDataDisplayInfo_1, calculatorBase_1, calculatorHelper_1, seriesType_1) {
    "use strict";
    var FftCalculator_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FftCalculator = void 0;
    let FftCalculator = FftCalculator_1 = class FftCalculator extends calculatorBase_1.CalculatorBase {
        constructor() {
            super(FftCalculator_1.id, "FFT", "Calculates the discrete frequency spectrum");
            this.inputName = "Input signal";
            this.outputId = "OutputSignal";
            this.outputName = "Output signal";
            this.outputValue = "spectral lines";
        }
        getDefaultInputData() {
            let defaultInputData = super.getDefaultInputData();
            defaultInputData.push(new calculationDataPoints_1.CalculationDataPoints(FftCalculator_1.inputIdSignal, this.inputName, "", new Array(), "The signal to be transformed into the frequency domain", new calculationDataDisplayInfo_1.CalculationDataDisplayInfo(false, true)));
            return defaultInputData;
        }
        getDefaultOutputData() {
            let defaultOutputData = super.getDefaultOutputData();
            let output = new calculationDataPoints_1.CalculationDataPoints(this.outputId, this.outputName, this.outputValue, new Array());
            output.type = seriesType_1.SeriesType.fftSeries;
            defaultOutputData.push(output);
            return defaultOutputData;
        }
        verifyCalculationInputData() {
            super.verifyCalculationInputData();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let inputSignal = calculationInputDataContainer[0];
            if (inputSignal == undefined || !calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                this.addErrorByType(calculatorBase_1.ErrorMessageType.MissingOrInvalidInput, [this.inputName]);
            }
        }
        executeAlgorithm() {
            super.executeAlgorithm();
            let calculationInputDataContainer = this.getCalculationInputDataContainer();
            let result = new Array();
            let inputSignal = calculationInputDataContainer[0];
            if (calculatorHelper_1.CalculatorHelper.calculationInputDataIsSignal(inputSignal.data)) {
                result = this.clcFft(inputSignal.data);
            }
            this.addCalculationOutputData({
                data: result,
                value: this.outputValue,
                name: this.outputName,
                id: this.outputId
            });
        }
        /**
         * Calculates output data
         *
         * @private
         * @param {Array<IPoint>} inputSignal
         * @returns {Array<IPoint>}
         * @memberof FftCalculator
         */
        clcFft(inputSignal) {
            // prepare input data for fft transformation
            let real = new Array();
            let imag = new Array();
            for (let i = 0; i < inputSignal.length; i++) {
                real.push(inputSignal[i].y);
                imag.push(0.0); // the imaginary part of the recorded signal is 0.0
            }
            // calculate fft
            (0, fft_bilstein_1.transform)(real, imag); // attention: these parameters are both in- and outputs!
            let points = this.getAmplitudeSpectrum(inputSignal, real, imag);
            return points;
        }
        /**
         * Calculates the amplitude spectrum and ignores the phase information
         *
         * @private
         * @param {IPoint[]} inputSignal original time based signal
         * @param {number[]} real real part of the signal in the freqeuncy domain
         * @param {number[]} imag imaginary part of the signal in the freqeuncy domain
         * @returns
         * @memberof FftCalculator
         */
        getAmplitudeSpectrum(inputSignal, real, imag) {
            let points = new Array(); // prepare return data
            // estimate sample time
            let sampleTime = calculatorHelper_1.CalculatorHelper.estimateSampleTime(inputSignal); // [seconds]
            let numberSamples = inputSignal.length;
            // calculate frequency of spectral lines and combine to new signal      
            let deltaFrequency = 1.0 / (sampleTime * numberSamples); // distance between the spectral lines in [Hz]
            let nrSpectralLines = Math.floor(numberSamples / 2.0 + 1); // the frequency spectrum is mirrored; half of it can be ignored
            for (let i = 0; i < nrSpectralLines; i++) {
                let isZeroFrequency = i == 0; // the frequency is zero, if i is 0;
                let amplitude = this.getSpectralAmplitude(real[i], imag[i], numberSamples, isZeroFrequency);
                let newPoint = new point_1.Point(deltaFrequency * i, amplitude);
                points.push(newPoint);
            }
            return points;
        }
        /**
         * Calculate the amplitude of a single spectral line
         *
         * @private
         * @param {number} real real part of the signal in the freqeuncy domain
         * @param {number} imag imaginary part of the signal in the freqeuncy domain
         * @param {number} numberSamples number of samples of the origianl signal in the time domain
         * @param {number} isZeroFrequency must be set to TRUE if the spectral line with frequency 0.0 is to be calculated
         * @returns {number}
         * @memberof FftCalculator
         */
        getSpectralAmplitude(real, imag, numberSamples, isZeroFrequency) {
            let amplitude = Math.sqrt(real * real + imag * imag) / numberSamples; // calculate the vector length of the complex number and scale it:  /numberSamples"
            if (!isZeroFrequency) { // everything except the dc part (frequency == 0) must be rescaled
                amplitude = amplitude * 2.0; // *2.0 because the spectral line is mirrored and only one is taken into account
            }
            return amplitude;
        }
    };
    FftCalculator.id = "fft bilstein";
    FftCalculator.inputIdSignal = "InputSignal";
    FftCalculator = FftCalculator_1 = __decorate([
        mco.role()
    ], FftCalculator);
    exports.FftCalculator = FftCalculator;
});
