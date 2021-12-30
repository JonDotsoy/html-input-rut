
import { ChileanRut } from './ChileanRut.mjs';

export class HTMLInputRut extends HTMLInputElement {
  inputValue = document.createElement('input')

  constructor() {
    super();
    const inputValue = this.inputValue;
    inputValue.type = 'hidden'
    inputValue.name = this.name
    inputValue.value = this.value
    this.name = `::input::${this.name}`

    if (this.form) {
      this.form.appendChild(inputValue)
    }

    this.validateRutValue();

    this.addEventListener("change", () => this.validateRutValue());
    this.addEventListener("keyup", () => this.validateRutValue());
  }

  validateRutValue() {
    if (this.value.length > 0) {
      const value = this.value;
      const { message, valueClean } = ChileanRut.validateRutMessage(this.value);
      this.inputValue.value = valueClean;
      this.setCustomValidity(message);
      this.reportValidity();
    } else {
      this.setCustomValidity("");
      this.reportValidity();
    }
  }
}
