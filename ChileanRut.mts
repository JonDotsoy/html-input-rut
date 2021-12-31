type RutBody = `${number}`;

function isNumberString(value: any): value is RutBody {
  return typeof value === 'string' && /^\d+$/.test(value);
}

export class ChileanRut {
  static validateRutMessage(value: string) {
    const valueClean = value.replace(/[^0-9kK]/g, "");

    if (!/^\s*\d[\.\d]*-?[\dkK]\s*$/.test(value)) {
      return { valid: false, value, valueClean, message: "El formato del RUT es incorrecto" };
    }

    if (!ChileanRut.validateRut(valueClean)) {
      return { valid: false, value, valueClean, message: "El RUT ingresado es incorrecto" };
    }

    return { valid: true, value, valueClean, message: "" };
  }

  static validateRut(rutClean: string) {
    if (!/^[0-9]+[0-9kK]{1}$/.test(rutClean))
      return false;
    const digv = rutClean.slice(-1).toLowerCase();
    const rut = rutClean.slice(0, -1);
    if (!isNumberString(rut)) return false;
    return ChileanRut.dv(rut) == digv;
  }

  static dv(rutBodyNumber: RutBody) {
    let T = Number(rutBodyNumber);
    let M = 0;
    let S = 1;
    for (; T; T = Math.floor(T / 10))
      S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : "k";
  }
}
