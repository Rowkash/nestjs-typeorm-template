export interface IUserCacheData {
  id: number;
  email: string;
}

export interface ICacheData {
  user: IUserCacheData;
  refreshToken: string;
}

export interface ISessionData {
  userId: number;
  email: string;
}

export interface IUpdateSessionsData {
  sessions: string[];
  cacheData: ICacheData;
}
