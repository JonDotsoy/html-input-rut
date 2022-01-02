
import { ChileanRut } from './ChileanRut.mjs';
import { RutValidity } from './RutValidity.mjs';

export class HTMLInputRut extends HTMLInputElement {
  chileanRut = new ChileanRut();
  valueRut?: { rut: number | undefined; dv: string | undefined; formatted: string | undefined; clean: string; valid: boolean; };
  rutValidity: undefined | RutValidity;

  constructor() {
    super();
    this.validateRutValue(true);

    this.addEventListener("change", () => this.validateRutValue(true));
    this.addEventListener("keyup", () => this.validateRutValue());
  }

  validateRutValue(formatValue = false) {
    if (this.value.length > 0) {
      const check = this.chileanRut.validateRutMessage(this.value);
      if (formatValue && check.rutFormatted) {
        this.value = check.rutFormatted;
      }
      this.rutValidity = check.validity;
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
      this.rutValidity = undefined;
      this.setCustomValidity("");
      this.reportValidity();
    }
  }
}
