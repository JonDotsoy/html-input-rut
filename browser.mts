import { customElementName } from "./constant/custom-element-name.mjs";
import { HTMLInputRut } from "./HTMLInputRut.mjs";

globalThis.customElements?.define(customElementName, HTMLInputRut, { extends: 'input' });

export default customElementName;
