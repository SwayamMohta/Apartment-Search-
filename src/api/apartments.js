// src/api/apartments.js
import client from './client';

export const getApartments = async (params = {}) => {
  const { data } = await client.get('/apartments', { params: { limit: 100, ...params } });
  return data; // { data: [...], pagination: {...} }
};

export const getApartmentById = async (id) => {
  const { data } = await client.get(`/apartments/${id}`);
  return data.data;
};

export const getNearbyPois = async (id, radiusKm = 2) => {
  const { data } = await client.get(`/apartments/${id}/nearby-pois`, { params: { radiusKm } });
  return data.data;
};

export const getMapMarkers = async (bounds) => {
  // bounds: { swLat, swLng, neLat, neLng }
  const { data } = await client.get('/apartments/map/bounds', { params: bounds });
  return data.data;
};

// Admin methods
export const createApartment = async (aptData) => {
  const { data } = await client.post('/apartments', aptData);
  return data.data;
};

export const updateApartment = async (id, aptData) => {
  const { data } = await client.put(`/apartments/${id}`, aptData);
  return data.data;
};

export const deleteApartment = async (id) => {
  await client.delete(`/apartments/${id}`);
};
