import { authPaths } from './auth.paths';
import { userPaths } from './user.paths';
import { licensePaths } from './license-category.paths';
import { chapterPaths } from './chapter.paths';
import { questionPaths } from './question.paths';
import { selectionPaths } from './selection.paths';
import { importPaths } from './import.paths';
import { examMatrixPaths } from './exam-matrix.paths';


export const paths = {
  ...authPaths,
  ...userPaths,
  ...licensePaths,
  ...chapterPaths,
  ...questionPaths,
  ...selectionPaths,
  ...importPaths,
  ...examMatrixPaths,
};