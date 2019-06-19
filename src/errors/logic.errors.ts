import { LogicErrCodes } from './errCode';

export const logicErr = {
  userIsAlreadyRegistered: {
    code: LogicErrCodes.UserIsAlreadyRegistered,
    msg: 'User is already registered'
  },
  incorrectDataToLogin: {
    code: LogicErrCodes.IncorrectDataToLogin,
    msg: 'Email or password incorrect'
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
  userBlocked: {
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
  },
  dataAlreadyExist: {
    code: 400,
    msg: 'Data already exist'
  }
};
