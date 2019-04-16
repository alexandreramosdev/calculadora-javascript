class CalcController {
  constructor() {
    this._operation = [];
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
  }

  initialize() {
    this.setDisplayDateTime();

    setInterval(() => this.setDisplayDateTime(), 1000);
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
  }

  clearEntry() {
    this._operation.pop();
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  isOperator(value) {
    return ["%", "+", "-", "/", "*"].indexOf(value) > -1;
  }

  pushOperation(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  calc() {
    let lastOperation = this._operation.pop();
    let newValue = eval(this._operation.join(""));

    this._operation = [parseInt(newValue), lastOperation];

    this.setLastNumberToDisplay();
  }

  setLastNumberToDisplay() {
    let lastNumber;

    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (!this.isOperator(this._operation[i])) {
        lastNumber = this._operation[i];
        break;
      }
    }

    this.displayCalc = lastNumber;
  }

  setOperation(value) {
    //console.log("SetOperation", value, "isNaN", isNaN(this.getLastOperation()));

    if (isNaN(this.getLastOperation())) {
      //string
      if (this.isOperator(value)) {
        //operator
        this.setLastOperation(value);
      } else if (isNaN(value)) {
        //outro operator
        console.log("Outra", value);
      } else {
        this.pushOperation(value);
        this.setLastNumberToDisplay();
      }
    } else {
      //number
      if (this.isOperator(value)) {
        this.pushOperation(value);

        this.calc();
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();

        this.setLastOperation(parseInt(newValue));
        this.setLastNumberToDisplay();
      }
    }

    console.log(this._operation);
  }

  setError() {
    this.displayCalc = "error";
  }

  execButton(value) {
    switch (value) {
      case "ac":
        this.clearAll();
        break;
      case "ce":
        this.clearEntry();
        break;
      case "divisao":
        this.setOperation("/");
        break;
      case "multiplicacao":
        this.setOperation("*");
        break;
      case "soma":
        this.setOperation("+");
        break;
      case "subtracao":
        this.setOperation("-");
        break;
      case "porcento":
        this.setOperation("%");
        break;
      case "igual":
        break;
      case "ponto":
        break;

      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.setOperation(parseInt(value));
        break;

      default:
        this.setError();
        break;
    }
  }

  initButtonsEvents() {
    let buttonsEl = document.querySelectorAll("#buttons > g, #parts > g");

    buttonsEl.forEach(button => {
      this.addEventListenerAll(button, "click drag", () => {
        let textButton = button.className.baseVal.replace("btn-", "");

        this.execButton(textButton);
      });

      this.addEventListenerAll(button, "mouseover mouseup mousedown", () => {
        button.style.cursor = "pointer";
      });
    });
  }

  setDisplayDateTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }

  get displayDate() {
    return this._dateEl.innerHTML;
  }

  set displayDate(value) {
    this._dateEl.innerHTML = value;
  }

  get displayTime() {
    return this._timeEl.innerHTML;
  }

  set displayTime(value) {
    this._timeEl.innerHTML = value;
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  set displayCalc(value) {
    this._displayCalcEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(value) {
    this._currentDate = value;
  }
}
