export interface IUser {
  _id: string;
  email: string;
  role: "user" | "admin";
  name?: string;
}

export interface IAuthResponse {
  message: string;
  token: string;
  user: IUser;
}

export interface IValidateResponse {
  success: boolean;
}
