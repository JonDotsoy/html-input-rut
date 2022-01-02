type RutBody = `${number}`;

export class ChileanRutMessages {
  cache = new Map<string, string>()
  locales: [Intl.Locale, ...string[]][];

  messages: { [tag: string]: { [lang: string]: string } } = {
    "The format of the chilean RUT is incorrect": {
      "es-CL": "El formato del RUT es incorrecto",
      "en": "The format of the chilean RUT is incorrect",
      "es": "El formato del RUT chileno es incorrecto",
    },
    "The chilean RUT entered is incorrect": {
      "es-CL": "El RUT ingresado es incorrecto",
      "en": "The chilean RUT entered is incorrect",
      "es": "El RUT chileno ingresado es incorrecto",
    },
  }

  constructor(langs?: string | string[]) {
    const languages = !langs ? navigator.languages : Array.isArray(langs) ? langs : [langs];
    this.locales = languages.map(lang => {
      const locale = new Intl.Locale(lang);
      return [
        new Intl.Locale(lang),
        ...[
          locale.baseName && locale.baseName,
          locale.language && locale.region && locale.language + '-' + locale.region,
          locale.language && locale.language,
        ].filter((e): e is string => !!e),
      ];
    })
  }

  translateParts(tag: string) {
    const messageLangs = this.messages[tag];
    if (!messageLangs) {
      return {
        message: tag,
      };
    }

    let langKey: string | undefined

    for (const [locale, ...alts] of this.locales) {
      if (langKey) break
      for (const alt of alts) {
        if (messageLangs[alt]) {
          langKey = alt;
          break;
        }
      }
    }

    const message = langKey ? messageLangs[langKey] : tag;

    return {
      lang: langKey,
      message,
    };
  }

  translate(tag: string) {
    const memValue = this.cache.get(tag);
    if (memValue) return memValue;
    const nextMemValue = this.translateParts(tag).message;
    this.cache.set(tag, nextMemValue);
    return nextMemValue;
  }
}

function isNumberString(value: any): value is RutBody {
  return typeof value === 'string' && /^\d+$/.test(value);
}

const numberFormat = new Intl.NumberFormat('es-CL', { style: 'decimal', useGrouping: true });

const chileanRutMessages = new ChileanRutMessages();

export class ChileanRut {

  static validateRutMessage(value: string) {
    const valueClean = value.replace(/[^0-9kK]/g, "");

    if (!/^\s*\d[\.\d]*-?[\dkK]\s*$/.test(value)) {
      return { valid: false, value, valueClean, message: chileanRutMessages.translate("The format of the chilean RUT is incorrect") };
    }

    const v = ChileanRut.validateRut(valueClean);

    if (!v.valid) {
      return { valid: false, value, valueClean, message: chileanRutMessages.translate("The chilean RUT entered is incorrect") };
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
