export enum LogicErrCodes {
  UserIsAlreadyRegistered = 400,
  NotFoundUser = 400,
  WrongCodeToLogin = 400
}

export enum TechnicalErrCodes {
  DatabaseCrash = 500,
  EmailServiceCrash = 500
}
