type RutBody = `${number}`;

function isNumberString(value: any): value is RutBody {
  return typeof value === 'string' && /^\d+$/.test(value);
}

const numberFormat = new Intl.NumberFormat('es-CL', { style: 'decimal' });

export class ChileanRut {
  static validateRutMessage(value: string) {
    const valueClean = value.replace(/[^0-9kK]/g, "");

    if (!/^\s*\d[\.\d]*-?[\dkK]\s*$/.test(value)) {
      return { valid: false, value, valueClean, message: "El formato del RUT es incorrecto" };
    }

    const v = ChileanRut.validateRut(valueClean);

    if (!v.valid) {
      return { valid: false, value, valueClean, message: "El RUT ingresado es incorrecto" };
    }

    const rutFormatted = `${numberFormat.format(v.rut)}-${v.dv}`;

    return {
      valid: true,
      parts: {
        rut: v.rut,
        dv: v.dv,
      },
      value,
      valueClean,
      rutFormatted,
      message: "",
    };
  }

  static validateRut(rutClean: string) {
    if (!/^[0-9]+[0-9kK]{1}$/.test(rutClean))
      return { valid: false } as const;
    const digv = rutClean.slice(-1).toLowerCase();
    let rut = rutClean.slice(0, -1);
    if (!isNumberString(rut)) return { valid: false } as const;

    const rutBody = Number(rut);

    return {
      rut: rutBody,
      dv: digv,
      valid: ChileanRut.dv(rutBody).toString() === digv,
    } as const
  }

  static dv(rutBodyNumber: number) {
    let T = Number(rutBodyNumber);
    let M = 0;
    let S = 1;
    for (; T; T = Math.floor(T / 10))
      S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return S ? S - 1 : "k";
  }
}
