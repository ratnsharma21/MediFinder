/**
 * Utility functions for handling image and avatar URLs
 */

export const getAvatarUrl = (url?: string | null): string | undefined => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return undefined;
  }

  const trimmed = url.trim();

  // If already absolute or data URI, return as-is
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // If relative path from backend uploads
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return `/${trimmed}`;
};
