// src/api/auth.js
import client from './client';

export const login = async (credentials) => {
  const { data } = await client.post('/auth/login', credentials);
  localStorage.setItem('accessToken', data.accessToken);
  return data.user;
};

export const register = async (userData) => {
  const { data } = await client.post('/auth/register', userData);
  localStorage.setItem('accessToken', data.accessToken);
  return data.user;
};

export const logout = async () => {
  try {
    await client.post('/auth/logout');
  } finally {
    localStorage.removeItem('accessToken');
  }
};

export const getMe = async () => {
  const { data } = await client.get('/auth/me');
  return data.user;
};
