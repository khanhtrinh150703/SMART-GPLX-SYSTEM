import { commonSchemas } from './common.schemas';
import { authSchemas } from './auth.schemas';
import { userSchemas } from './user.schemas';
import { licenseSchemas } from './license.schemas';
import { chapterSchemas } from './chapter.chemas';
import { questionSchemas } from './question.schemas';
import { importSchemas } from './import.schemas';
import { examMatrixSchemas } from './exam-matrix.schemas';
import { examSchemas } from './exam.schemas';
import { roleSchemas } from './role.schema';
import { activeSessionSchemas } from './active-session.schemas';
import { examAttemptSchemas } from './exam-attempt.schema';

export const schemas = {
  ...commonSchemas,
  ...authSchemas,
  ...userSchemas,
  ...licenseSchemas,
  ...chapterSchemas,
  ...questionSchemas,
  ...commonSchemas,
  ...importSchemas,
  ...examMatrixSchemas,
  ...examSchemas,
  ...roleSchemas,
  ...activeSessionSchemas,
  ...examAttemptSchemas,
};