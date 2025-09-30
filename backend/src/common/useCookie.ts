import type { CookieOptions, Response } from 'express';

export interface ISetCookieParams {
  accessToken: string;
  refreshToken: string;
  res: Response;
}

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
};

export const setCookie = (params: ISetCookieParams) => {
  const { accessToken, refreshToken, res } = params;

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    domain: 'localhost',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    domain: 'localhost',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return res;
};

export const clearCookie = (res: Response) => {
  res.clearCookie('accessToken', {
    ...cookieOptions,
    domain: 'localhost',
  });

  res.clearCookie('refreshToken', {
    ...cookieOptions,
    domain: 'localhost',
  });
};
