export const extractPublicIdFromUrl = (url: string): string => {
  const regex = /\/v\d+\/(.+?)(?:\.\w{3,4})?$/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error('Could not extract public ID from URL');
};
