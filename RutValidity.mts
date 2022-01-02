
export const tagsValidations = ['formatInvalid', 'dvInvalid'] as const;

export type A = {
  [k in typeof tagsValidations[number]]: boolean;
}

export class RutValidity implements A {
  formatInvalid = false;
  dvInvalid = false;

  constructor() {
    const dataValidation: { [k: string]: boolean; } = {};

    RutValidity.tagsValidations.forEach(tag => {
      Object.defineProperty(this, tag, {
        get() {
          return dataValidation[tag] ?? false;
        },
        set(value: true) {
          dataValidation[tag] = value;
        },
        enumerable: true,
      });
    });
  }

  static valid = Symbol('RutValidity.valid');
  static isValid(rutValidity: RutValidity) { }
  static tagsValidations = tagsValidations;
}
