import { commonSchemas } from './common.schemas';
import { authSchemas } from './auth.schemas';
import { userSchemas } from './user.schemas';
import { licenseSchemas } from './license.schemas';
import { chapterSchemas } from './chapter.chemas';


export const schemas = {
  ...commonSchemas,
  ...authSchemas,
  ...userSchemas,
  ...licenseSchemas,
  ...chapterSchemas,
};