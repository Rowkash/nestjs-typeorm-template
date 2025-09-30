import { Request } from 'express';

export interface ICustomRequest extends Request {
  user: IRequestUser | undefined;
}

export interface IRequestUser {
  id: number;
}
