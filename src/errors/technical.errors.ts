import { TechnicalErrCodes } from './errCode';

export const technicalErr = {
  databaseCrash: {
    code: TechnicalErrCodes.DatabaseCrash,
    msg: 'Database crashed'
  },
  emailServiceCrash: {
    code: TechnicalErrCodes.EmailServiceCrash,
    msg: 'Email service crashed'
  }
};
