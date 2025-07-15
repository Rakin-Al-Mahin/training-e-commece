// /* eslint-disable @typescript-eslint/consistent-type-definitions */
// import { JwtPayload } from 'jsonwebtoken';

// declare global {
//   namespace Express {
//     interface Request {
//       user: JwtPayload | null;
//     }
//   }
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_USER_ROLE } from '../src/enums/user';
import { CloudinaryUploadFile } from './../src/interfaces/cloudinaryUpload';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: ENUM_USER_ROLE;
        orgId?: string;
        [key: string]: any; // For any additional properties
      };
      files?: {
        image?: CloudinaryUploadFile[];
      };
    }
  }
}
