export const getAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});
