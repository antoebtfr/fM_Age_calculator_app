class AgeCalculator {
    version = '1.0.0';

    dayInput = $('#day-calc-input');
    monthInput = $('#month-calc-input');
    yearInput = $('#year-calc-input');

    dateNow = new Date();

    smallMonths = [4, 6, 9, 11];
    bigMonths = [1, 3, 5, 7, 8, 10, 12];


    constructor() {

    }

    start() {
        this.listeners();
        $('#calculator-button').on('click', this.run.bind(this));

        console.log('Age Calculator ' + this.version + ' est bien lancé');
    }

    listeners() {
        this.skipInput();

        const inputs = [this.dayInput, this.monthInput, this.yearInput]

        inputs.forEach(x => {
            x.on('keypress', e => {
                if (e.originalEvent.key == "Enter") {
                    this.run();
                }
            })
        })
    }

    run() {
        const dateNow = new Date();
        const date = new Date(this.yearInput.val(), this.monthInput.val() - 1, this.dayInput.val());

        if (this.yearInput.val() <= 99 && this.yearInput.val() >= 0) {
            date.setFullYear(this.yearInput.val());
        }


        this.unsetErrorMode();

        if (!this.validationCheck()) {
            return false;
        };

        this.setDataResults(dateNow, date);

    }

    isNotEmpty(dateInput) {
        let result = true;
        const emptyArray = [];


        if (!dateInput.days) {
            emptyArray.push('days');
            result = false;
        }

        if (!dateInput.months) {
            emptyArray.push('months')
            result = false;
        }

        if (!dateInput.years) {
            emptyArray.push('years')
            result = false;
        }

        return { result: result, emptyArray: emptyArray };

    }

    isValidFormat(dateInput) {

        
        let actualDate = new Date(dateInput.years + '-' + dateInput.months + '-' + dateInput.days);
        const dateNow = new Date();
        
        if (parseInt(dateInput.years) <= 99) {
            actualDate.setFullYear(dateInput.years);
        }

        let result = true;
        let invalidArray = []

        if (dateInput.days.includes('.')) {
            invalidArray.push('days');
            result = false;
        }

        if (dateInput.months.includes('.')) {
            invalidArray.push('months');
            result = false;
        }

        if (dateInput.years.includes('.')) {
            invalidArray.push('years');
            result = false;
        }


        if (dateInput.days > 31 || dateInput.days < 0) {
            invalidArray.push('days');
            result = false;
        }

        if (dateInput.months == 2 && dateInput.days > 28 && (dateInput.years % 4 != 0)) {
            invalidArray.push('days');
            result = false;
        }

        if (dateInput.months == 2 && dateInput.years % 4 === 0 && dateInput.days > 29) {
            invalidArray.push('days');
            result = false;
        }

        if (dateInput.months > 12 || dateInput.months < 0) {
            invalidArray.push('months');
            result = false;
        }

        if (dateInput.years > this.dateNow.getFullYear()) {
            invalidArray.push('years');
            result = false;
        }

        if (this.smallMonths.includes(parseInt(dateInput.months)) && dateInput.days > 30) {
            invalidArray.push('days');
            result = false;
        }

        if (actualDate > dateNow) {
            if (actualDate.getMonth() > dateNow.getMonth()) {
                invalidArray.push('months');
                result = false;
            }

            if (actualDate.getDate() > dateNow.getDate()) {
                invalidArray.push('days');
                result = false;
            }
        }


        return { result: result, invalidArray: invalidArray };

    }

    validationCheck() {

        const inputDate = { years: this.yearInput.val(), months: this.monthInput.val(), days: this.dayInput.val() };
        let result = true;
        let emptyArray = [];
        let invalidFormatArray = [];

        const isNotEmpty = this.isNotEmpty(inputDate);
        const isValidFormat = this.isValidFormat(inputDate);

        if (!isNotEmpty.result) {
            emptyArray = isNotEmpty.emptyArray;
            result = false;
        };

        if (!isValidFormat.result) {
            invalidFormatArray = isValidFormat.invalidArray;
            result = false;
        };

        if (!result) {
            this.setErrorModeForInput(emptyArray, invalidFormatArray);
        }

        return result;

    }

    setErrorModeForInput(emptyArray, invalidFormatArray) {

        let theCorrectInput = undefined;
        let calcContainer = undefined;
        let message = '';

        emptyArray.forEach(x => {
            if (x === 'days') {
                theCorrectInput = this.dayInput;
                calcContainer = $('.day-calc-container');
            }

            if (x === 'months') {
                theCorrectInput = this.monthInput;
                calcContainer = $('.month-calc-container');
            }

            if (x === 'years') {
                theCorrectInput = this.yearInput;
                calcContainer = $('.year-calc-container');
            }

            theCorrectInput.addClass('error');
            calcContainer.children('label').addClass('error');
            calcContainer.children('.error-msg').html('This field is required');
            calcContainer.children('.error-msg').show();
        });

        invalidFormatArray.forEach(x => {
            if (x === 'days') {
                theCorrectInput = this.dayInput;
                calcContainer = $('.day-calc-container');
                message = 'Must be a valid day';
            }

            if (x === 'months') {
                theCorrectInput = this.monthInput;
                calcContainer = $('.month-calc-container');
                message = 'Must be a valid month';
            }

            if (x === 'years') {
                theCorrectInput = this.yearInput;
                calcContainer = $('.year-calc-container');
                message = 'Must be in the past';
            }

            theCorrectInput.addClass('error');
            calcContainer.children('label').addClass('error');
            calcContainer.children('.error-msg').html(message);
            calcContainer.children('.error-msg').show();
        })

        return false;
    }


    unsetErrorMode() {

        let calcContainer = undefined;

        this.dayInput.removeClass('error');
        this.monthInput.removeClass('error');
        this.yearInput.removeClass('error');

        calcContainer = $('.day-calc-container');

        calcContainer.children('label').removeClass('error');
        calcContainer.children('.error-msg').hide();

        calcContainer = $('.month-calc-container');

        calcContainer.children('label').removeClass('error');
        calcContainer.children('.error-msg').hide();

        calcContainer = $('.year-calc-container');

        calcContainer.children('label').removeClass('error');
        calcContainer.children('.error-msg').hide();

    }



    setDataResults(actualDate, dateInput) {

        const result = this.calculateDate(actualDate, dateInput);

        $('.years-result .calc-result').html(result.years);
        $('.months-result .calc-result').html(result.months);
        $('.days-result .calc-result').html(result.days);
    }

    calculateDate(actualDate, dateInput) {
        const yearInput = dateInput.getFullYear();
        const monthInput = dateInput.getMonth() + 1;
        const dayInput = dateInput.getDate();

        let resultYear = actualDate.getFullYear() - yearInput;
        let resultMonth = actualDate.getMonth() + 1 - monthInput;
        let resultDate = actualDate.getDate() - dayInput;


        //Concerne les mois et les années 

        if (resultMonth < 0) {
            resultYear--;
            resultMonth = 12 + resultMonth;
        }

        // Concerne les jours du mois et les mois

        if (monthInput === 2) {
            if (resultDate < 0) {
                resultMonth--;
                if (actualDate.getFullYear() % 4 === 0) {
                    resultDate = 29 + resultDate;
                } else {
                    resultDate = 28 + resultDate;
                }
            }
        }

        if (this.smallMonths.includes(monthInput)) {
            if (resultDate < 0) {
                resultMonth--;
                resultDate = 30 + resultDate;
            }
        }

        if (this.bigMonths.includes(monthInput)) {
            if (resultDate < 0) {
                resultMonth--;
                resultDate = 31 + resultDate;
            }
        }

        if (monthInput === actualDate.getMonth() + 1 && dayInput > actualDate.getDate()) {
            resultMonth = 11;
        }


        return { years: resultYear, months: resultMonth, days: resultDate };
    }

    skipInput() {

        this.dayInput.on('keydown', e => {

            if (this.dayInput.val().length >= 2 && e.originalEvent.key !== "Backspace" && e.originalEvent.key !== 'Tab') {
                this.monthInput.trigger('select');
            };
        })

        this.monthInput.on('keydown', e => {
            if (this.monthInput.val().length >= 2 && e.originalEvent.key !== "Backspace" && e.originalEvent.key !== 'Tab') {
                this.yearInput.trigger('select');
            };
        })

        this.dayInput.on('change', e => {
            if (this.dayInput.val().length > 2) {
                this.dayInput.val('' + this.dayInput.val().slice(0, 2));
            };
        })



    }

}

export default AgeCalculator;