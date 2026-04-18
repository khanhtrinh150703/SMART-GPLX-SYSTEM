import { authPaths } from './auth.paths';
import { userPaths } from './user.paths';
import { licensePaths } from './license-category.paths';
import { chapterPaths } from './chapter.paths';
import { questionPaths } from './question.paths';
import { selectionPaths } from './selection.paths';
import { importPaths } from './import.swagger';


export const paths = {
  ...authPaths,
  ...userPaths,
  ...licensePaths,
  ...chapterPaths,
  ...questionPaths,
  ...selectionPaths,
  ...importPaths,
};