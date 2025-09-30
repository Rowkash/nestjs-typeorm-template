export interface IUserDataCreation {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserDataUpdate {
  id: number;
  name?: string;
  lastName?: string;
}

export interface IUserDataRemoving {
  id: number;
  password: string;
}

export interface IGetUserFilterOptions {
  id?: number;
  name?: string;
  email?: string;
}

export interface IGetOneUserOptions {
  id?: number;
  email?: string;
}
