export const logicErr = {
  userIsAlreadyRegistered: {
    code: 409,
    msg: 'User is already registered'
  },
  incorrectDataToLogin: {
    code: 401,
    msg: 'Email or password incorrect'
  },
  notFoundUser: {
    code: 401,
    msg: 'Not found user'
  },
  wrongCodeToLogin: {
    code: 401,
    msg: 'Wrong code in login'
  },
  forbidden: {
    msg: 'Forbidden',
    code: 403
  },
  userBlocked: {
    code: 404,
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
    code: 409,
    msg: 'Data already exist'
  }
};
