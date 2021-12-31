
import { ChileanRut } from './ChileanRut.mjs';

export class HTMLInputRut extends HTMLInputElement {
  valueRut?: { rut: number | undefined; dv: string | undefined; formatted: string | undefined; clean: string; valid: boolean; };

  constructor() {
    super();
    this.validateRutValue();

    this.addEventListener("change", () => this.validateRutValue(true));
    this.addEventListener("keyup", () => this.validateRutValue());
  }

  validateRutValue(formatValue = false) {
    if (this.value.length > 0) {
      const check = ChileanRut.validateRutMessage(this.value);
      if (formatValue && check.rutFormatted) {
        this.value = check.rutFormatted;
      }
      this.valueRut = check.valid
        ? {
          rut: check.parts?.rut,
          dv: check.parts?.dv,
          formatted: check.rutFormatted,
          clean: check.valueClean,
          valid: check.valid,
        }
        : undefined;
      this.setCustomValidity(check.message);
      this.reportValidity();
    } else {
      this.setCustomValidity("");
      this.reportValidity();
    }
  }
}
