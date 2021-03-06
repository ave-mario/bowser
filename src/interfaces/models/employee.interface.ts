export interface IEmployee {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  status: number;
  identifiedToken?: string;
}

export interface IEmployeeFieldsToRegister {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface IEmployeeToLogin {
  email: string;
  password: string;
}
