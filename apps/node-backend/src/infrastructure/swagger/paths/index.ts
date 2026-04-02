import { authPaths } from './auth.paths';
import { userPaths } from './user.paths';
import { licensePaths } from './license-category.paths';
import { chapterPaths } from './chapter.paths';


export const paths = {
  ...authPaths,
  ...userPaths,
  ...licensePaths,
  ...chapterPaths,
};