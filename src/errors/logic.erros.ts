import { LogicErrCodes } from './errCode';

export const logicErr = {
  userIsAlreadyRegistered: {
    code: LogicErrCodes.UserIsAlreadyRegistered,
    msg: 'User is already registered'
  },
  notFoundUser: {
    code: LogicErrCodes.NotFoundUser,
    msg: 'Can not found user'
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
    msg: 'User bloked'
  }
};
