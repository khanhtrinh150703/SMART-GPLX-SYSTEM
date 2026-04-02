import { authPaths } from './auth.paths';
import { userPaths } from './user.paths';
import { licensePaths } from './license-category.paths';

export const paths = {
  ...authPaths,
  ...userPaths,
  ...licensePaths,
};