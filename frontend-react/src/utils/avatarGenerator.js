/**
 * Light matte background palette — clearly distinct light matte colors
 * designed for high-contrast legibility with pure black (#000000) text on top.
 */
export const LIGHT_MATTE_COLORS = [
  '#F4A298', // Matte Coral Light
  '#A3D9B1', // Matte Mint Sage
  '#9BC4E8', // Matte Sky Blue
  '#F7D98B', // Matte Warm Sand
  '#C9B3E6', // Matte Soft Lavender
  '#F6BA92', // Matte Peach Apricot
  '#8FD6D4', // Matte Seafoam Aqua
  '#EBAAC4', // Matte Dusty Rose
  '#C8DF95', // Matte Pistachio Green
  '#D7C0A8'  // Matte Warm Taupe
];

const LEGACY_DEFAULT_AVATAR_PREFIX = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'";

/**
 * Extracts participant initials strictly preserving uppercase and lowercase:
 * 1) 1 word: first 2 letters (e.g., "Valeria" -> "Va")
 * 2) 2 words: first letter of each word (e.g., "Player 1" -> "P1")
 * 3) 3 or more words: first letter of the first 2 words (e.g., "pablo valenciano blanco" -> "pv")
 */
export function getParticipantInitials(name) {
  if (!name || typeof name !== 'string') return '?';
  const trimmed = name.trim();
  if (!trimmed) return '?';

  const rawWords = trimmed.split(/\s+/).filter(Boolean);
  if (rawWords.length === 0) return '?';

  const cleanToken = (word) => {
    const stripped = word.replace(/^#+/, '');
    return stripped.length > 0 ? stripped : word;
  };

  if (rawWords.length === 1) {
    const w1 = cleanToken(rawWords[0]);
    return Array.from(w1).slice(0, 2).join('');
  }

  // 2 words or 3+ words: first character of word 1 + first character of word 2
  const w1 = cleanToken(rawWords[0]);
  const w2 = cleanToken(rawWords[1]);
  const c1 = Array.from(w1)[0] || '';
  const c2 = Array.from(w2)[0] || '';
  return `${c1}${c2}`;
}

/**
 * Returns a deterministic light matte background color for the participant index.
 */
export function getParticipantMatteColor(index = 0) {
  const safeIdx = Math.abs(Number.isFinite(index) ? Math.floor(index) : 0);
  return LIGHT_MATTE_COLORS[safeIdx % LIGHT_MATTE_COLORS.length];
}

/**
 * Checks whether an avatar string is missing, legacy default, or auto-generated.
 */
export function isCustomAvatar(avatarUrl) {
  if (!avatarUrl || typeof avatarUrl !== 'string') return false;
  if (avatarUrl.startsWith(LEGACY_DEFAULT_AVATAR_PREFIX)) return false;
  if (avatarUrl.includes('data-auto-avatar')) return false;
  return true;
}

/**
 * Generates an SVG Data URL with a light matte background and black (#000000) initials text.
 */
export function generateInitialsAvatarDataUrl(name, index = 0) {
  const initials = getParticipantInitials(name);
  const bgColor = getParticipantMatteColor(index);
  const safeInitials = initials
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" data-auto-avatar="true" viewBox="0 0 120 120" width="120" height="120"><rect width="120" height="120" fill="${bgColor}"/><text x="50%" y="52%" dominant-baseline="central" text-anchor="middle" fill="#000000" font-family="Inter, Segoe UI, system-ui, -apple-system, sans-serif" font-weight="800" font-size="50">${safeInitials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Resolves the avatar URL to display for a participant: returns their custom uploaded photo
 * if present, or generates the automatic initials avatar with light matte background and black text.
 */
export function resolveParticipantAvatar(profileOrAvatar, name, index = 0) {
  const avatarCandidate = typeof profileOrAvatar === 'object' && profileOrAvatar !== null
    ? (profileOrAvatar.customAvatar || profileOrAvatar.avatar)
    : profileOrAvatar;
  const resolvedName = typeof profileOrAvatar === 'object' && profileOrAvatar !== null
    ? (name ?? profileOrAvatar.name)
    : name;

  if (isCustomAvatar(avatarCandidate)) {
    return avatarCandidate;
  }
  return generateInitialsAvatarDataUrl(resolvedName, index);
}

