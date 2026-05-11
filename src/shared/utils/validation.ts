/**
 * Utilidades de validación para campos de entrada
 */

/**
 * Permite solo letras (incluyendo acentos y ñ) y espacios
 */
export const cleanLettersOnly = (value: string) => {
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
};

/**
 * Permite solo letras, números y espacios
 */
export const cleanAlphanumeric = (value: string) => {
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]/g, "");
};

/**
 * Permite solo números
 */
export const cleanNumbersOnly = (value: string) => {
  return value.replace(/\D/g, "");
};

/**
 * Permite formato de cédula (números y guiones)
 */
export const cleanCedula = (value: string) => {
  return value.replace(/[^0-9-]/g, "");
};
