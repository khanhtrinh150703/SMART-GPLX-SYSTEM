import { SwaggerPaths, applyBaseUrl } from '../swagger-path.util';
import { authPaths } from './auth.paths';
import { userPaths } from './user.paths';
import { licensePaths } from './license-category.paths';
import { chapterPaths } from './chapter.paths';
import { questionPaths } from './question.paths';
import { selectionPaths } from './selection.paths';
import { importPaths } from './import.paths';
import { exanMatrixPaths } from './exam-matrix.paths';
import { examPaths } from './exam.paths';
import { activeSessionPaths } from './active-session.paths';
import { examAttemptPaths } from './exam-attempt.paths';

/**
 * @description Danh sách các module đã được định nghĩa.
 * English: List of defined modules.
 */
const modules: SwaggerPaths[] = [
  authPaths,
  userPaths,
  licensePaths,
  chapterPaths,
  questionPaths,
  selectionPaths,
  importPaths,
  exanMatrixPaths,
  examPaths,
  activeSessionPaths,
  examAttemptPaths,
];

/**
 * @description Gộp tất cả các paths và áp dụng Base URL.
 * Sử dụng Object.assign để đạt hiệu suất tốt hơn so với Spread Operator trong vòng lặp.
 * English: Merge all paths and apply Base URL.
 */
export const paths: SwaggerPaths = modules.reduce((acc, currentModule) => 
  Object.assign(acc, applyBaseUrl(currentModule)), 
  {} as SwaggerPaths
);