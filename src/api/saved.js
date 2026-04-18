// src/api/saved.js
import client from './client';

export const getSaved = async () => {
  const { data } = await client.get('/users/me/saved');
  return data.data;
};

export const saveApartment = async (aptId) => {
  await client.post(`/users/me/saved/${aptId}`);
};

export const unsaveApartment = async (aptId) => {
  await client.delete(`/users/me/saved/${aptId}`);
};
