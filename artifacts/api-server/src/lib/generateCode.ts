const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 18;

/**
 * Génère un code alphanumérique aléatoire de 18 caractères.
 */
export function generateCode(): string {
  let code = "";
  const randomBytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(randomBytes);
  for (const byte of randomBytes) {
    code += CHARS[byte % CHARS.length];
  }
  return code;
}

/**
 * Construit l'URL finale en remplaçant {code} par le code généré.
 */
export function buildLink(template: string, code: string): string {
  return template.replace("{code}", code);
}
