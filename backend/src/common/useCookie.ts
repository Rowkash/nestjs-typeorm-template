import { Response } from 'express';

export const setCookie = (refreshToken: string, res: Response) => {
  return res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    domain: 'localhost',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: 'lax',
  });
};

export const clearCookie = (res: Response) => {
  return res.clearCookie('refreshToken', {
    httpOnly: true,
    domain: 'localhost',
    secure: true,
    sameSite: 'lax',
  });
};
