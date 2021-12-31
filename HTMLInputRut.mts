
import { ChileanRut } from './ChileanRut.mjs';

export class HTMLInputRut extends HTMLInputElement {
  currentValue = '';

  constructor() {
    super();
    this.validateRutValue();

    this.addEventListener("change", () => this.validateRutValue(true));
    this.addEventListener("keyup", () => this.validateRutValue());
  }

  validateRutValue(formatValue = false) {
    if (this.value.length > 0) {
      const { message, rutFormatted } = ChileanRut.validateRutMessage(this.value);
      if (formatValue && rutFormatted) {
        this.value = rutFormatted;
      }
      this.setCustomValidity(message);
      this.reportValidity();
    } else {
      this.setCustomValidity("");
      this.reportValidity();
    }
  }
}
