export interface IUser {
  name: string;
  _id: string;
  email: string;
  role: "user" | "admin";
}

export interface IGetAllUsersResponse {
  success: boolean;
  count: number;
  users: IUser[];
}

export interface IDeleteUserResponse {
  success: boolean;
  message: string;
}
