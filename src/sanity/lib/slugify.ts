/**
 * Turkish slugify function to replace Turkish characters and handle punctuation correctly.
 * Prevents Sanity's default behavior of adding 'e' after Turkish vowels (e.g. ö -> oe, ü -> ue).
 */
export function turkishSlugify(input: string): string {
  if (!input) return "";

  const turkishMap: { [key: string]: string } = {
    'ç': 'c', 'Ç': 'c',
    'ğ': 'g', 'Ğ': 'g',
    'ı': 'i', 'I': 'i',
    'İ': 'i', 'i': 'i',
    'ö': 'o', 'Ö': 'o',
    'ş': 's', 'Ş': 's',
    'ü': 'u', 'Ü': 'u'
  };

  // Convert to lowercase and trim
  let str = input.trim().toLowerCase();

  // Replace Turkish characters
  str = str.replace(/[çğıİöşüÇĞIÖŞÜ]/g, (match) => turkishMap[match] || match);

  // Replace punctuation and special characters, keeping only alphanumeric, spaces, and hyphens
  str = str
    .replace(/[^a-z0-9\s-]/g, "") // Remove all characters except alphanumeric, spaces, hyphens
    .replace(/\s+/g, "-")         // Replace spaces with hyphens
    .replace(/-+/g, "-")          // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "");     // Trim leading/trailing hyphens

  return str;
}
