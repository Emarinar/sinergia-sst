// src/utils/validations.js

/**
 * Valida que el correo tenga un formato correcto.
 * @param {string} email
 * @returns {boolean} true si el email es válido, false en caso contrario.
 */
export function isValidEmail(email) {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(email);
  }
  
  /**
   * Verifica que el valor proporcionado no esté vacío.
   * @param {string} value
   * @returns {boolean} true si el valor no está vacío, false de lo contrario.
   */
  export function isNotEmpty(value) {
    return value.trim() !== "";
  }
  
  /**
   * Verifica que el valor sea numérico.
   * @param {any} value
   * @returns {boolean} true si es un número, false en caso contrario.
   */
  export function isNumeric(value) {
    return !isNaN(value);
  }
  
  /**
   * Valida que una fecha tenga un formato correcto (YYYY-MM-DD).
   * @param {string} dateStr
   * @returns {boolean} true si la fecha es válida, false de lo contrario.
   */
  export function isValidDate(dateStr) {
    // Verifica el formato: YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  }
  