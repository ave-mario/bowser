export enum statusUsers {
  Active = 1,
  Bloking = 2
}

export const Validate = {
  phoneNumber: /\+375(29|33|44|25)\d{7}$/,
  password: /^[a-zA-Z0-9]{6,30}$/
};
