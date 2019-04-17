class CalcController {
  constructor() {
    this._audio = new Audio("click.mp3");
    this._audioOnOff = false;
    this._lastOperator = "";
    this._lastNumber = "";
    this._operation = [];
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._dateEl = document.querySelector("#data");
    this._timeEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
    this.initKeyBoard();
  }

  copyToClipboard() {
    let input = document.createElement("input");
    input.value = this.displayCalc;

    document.body.appendChild(input);

    input.select();

    document.execCommand("Copy");

    input.remove();
  }

  pasteFomClipboard() {
    document.addEventListener("paste", event => {
      let text = event.clipboardData.getData("Text");
      this.displayCalc = parseFloat(text);
    });
  }

  toggleAudio() {
    this._audioOnOff = !this._audioOnOff;
  }

  playAudio() {
    if (this._audioOnOff) {
      this._audio.currentTime = 0;
      this._audio.play();
    }
  }

  initialize() {
    this.setDisplayDateTime();

    setInterval(() => this.setDisplayDateTime(), 1000);

    this.setLastNumberToDisplay();
    this.pasteFomClipboard();

    document.querySelectorAll(".btn-ac").forEach(button => {
      button.addEventListener("dblclick", () => {
        this.toggleAudio();
      });
    });
  }

  initKeyBoard() {
    document.addEventListener("keyup", event => {
      this.playAudio();
      switch (event.key) {
        case "Escape":
          this.clearAll();
          break;
        case "Backspace":
          this.clearEntry();
          break;
        case ".":
        case ",":
          this.setDot(".");
          break;
        case "=":
        case "Enter":
          this.calc();
          break;
        case "/":
        case "*":
        case "+":
        case "-":
        case "%":
          this.setOperation(event.key);
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
          this.setOperation(parseInt(event.key));
          break;

        case "c":
          if (event.ctrlKey) this.copyToClipboard();
          break;
      }
    });
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
    this._lastNumber = "";
    this.lastOperation = "";

    this.setLastNumberToDisplay();
  }

  clearEntry() {
    this._operation.pop();

    this.setLastNumberToDisplay();
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

  getResult() {
    try {
      return eval(this._operation.join(""));
    } catch (e) {
      setTimeout(() => {
        this.setError();
      }, 1);
    }
  }

  calc() {
    let lastOperation = "";

    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      let firstItem = this._operation[0];

      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      lastOperation = this._operation.pop();
      this._lastNumber = this.getResult();
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false);
    }

    let result = this.getResult();

    if (lastOperation == "%") {
      result /= 100;
      this._operation = [result];
    } else {
      this._operation = [result];
      if (lastOperation) this.pushOperation(lastOperation);
    }

    this.setLastNumberToDisplay();
  }

  getLastItem(isOperator = true) {
    let lastItem;

    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      lastItem = isOperator ? this._lastOperator : this._lastNumber;
    }

    return lastItem;
  }

  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false);

    if (!lastNumber) lastNumber = 0;

    this.displayCalc = lastNumber;
  }

  setOperation(value) {
    if (isNaN(this.getLastOperation())) {
      if (this.isOperator(value)) {
        this.setLastOperation(value);
      } else {
        this.pushOperation(value);
        this.setLastNumberToDisplay();
      }
    } else {
      //number
      if (this.isOperator(value)) {
        this.pushOperation(value);
      } else {
        let newValue = this.getLastOperation().toString() + value.toString();

        this.setLastOperation(newValue);
        this.setLastNumberToDisplay();
      }
    }
  }

  setDot() {
    let lastOperation = this.getLastOperation();
    console.log(lastOperation);

    if (
      typeof lastOperation === "string" &&
      lastOperation.split("").indexOf(".") > -1
    )
      return;

    console.log("2", lastOperation);

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperation("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }

    this.setLastNumberToDisplay();
    console.log(lastOperation);
  }

  setError() {
    this.displayCalc = "error";
  }

  execButton(value) {
    this.playAudio();
    switch (value) {
      case "ac":
        this.clearAll();
        break;
      case "ce":
        this.clearEntry();
        break;
      case "ponto":
        this.setDot(".");
        break;
      case "igual":
        this.calc();
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
    if (value.toString().length > 10) {
      this.setError();
      return;
    }
    this._displayCalcEl.innerHTML = value;
  }

  get currentDate() {
    return new Date();
  }

  set currentDate(value) {
    this._currentDate = value;
  }
}
