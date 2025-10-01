/**
 * Converts a name from "Firstname Lastname" to "Lastname, Firstname" format
 * @param name - The name in "Firstname Lastname" format
 * @returns The name in "Lastname, Firstname" format, or the original name if it cannot be parsed
 */
export function reverseName(name: string): string {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return trimmedName;
  }
  
  // Don't reverse placeholder/fallback text
  if (trimmedName.startsWith("[") || trimmedName.startsWith("(")) {
    return trimmedName;
  }
  
  // Split by space and take the last word as lastname, rest as firstname
  const parts = trimmedName.split(/\s+/);
  
  if (parts.length === 1) {
    // Only one word, return as is
    return trimmedName;
  }
  
  const lastname = parts[parts.length - 1];
  const firstname = parts.slice(0, -1).join(" ");
  
  return `${lastname}, ${firstname}`;
}
