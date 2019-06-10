import { LogicErrCodes } from './errCode';

export const logicErr = {
  userIsAlreadyRegistered: {
    code: LogicErrCodes.UserIsAlreadyRegistered,
    msg: 'User is already registered'
  },
  incorrectDataToLogin: {
    code: LogicErrCodes.IncorrectDataToLogin,
    msg: 'Email or password incorrecrt'
  },
  notFoundUser: {
    code: LogicErrCodes.NotFoundUser,
    msg: 'Not found user'
  },
  wrongCodeToLogin: {
    code: LogicErrCodes.WrongCodeToLogin,
    msg: 'Wrong code in login'
  },
  forbidden: {
    msg: 'Forbidden'
  },
  userBloking: {
    code: 400,
    msg: 'User is blocked'
  },
  wrongOldPassword: {
    code: 400,
    msg: 'Wrong old password'
  },
  wrongNewPassword: {
    code: 400,
    msg: 'Wrong new password'
  }
};
