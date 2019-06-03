export enum statusUsers {
  ChangePassword = 1,
  Active = 2,
  Bloking = 3
}

export enum Roles {
  Client = 'client',
  Employee = 'employee'
}

export const Validate = {
  phoneNumber: /\+375\d{9}$/,
  password: /^[a-zA-Z0-9]{6,30}$/
};
