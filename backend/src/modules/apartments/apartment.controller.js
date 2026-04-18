// src/modules/apartments/apartment.controller.js
import * as service from './apartment.service.js';

export const listApartments = async (req, res, next) => {
  try {
    const result = await service.listApartments(req.query, req.user?.id);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const getApartmentById = async (req, res, next) => {
  try {
    const apt = await service.getApartmentById(req.params.id, req.user?.id);
    res.status(200).json({ data: apt });
  } catch (err) { next(err); }
};

export const getApartmentsInBounds = async (req, res, next) => {
  try {
    const markers = await service.getApartmentsInBounds(req.query);
    res.status(200).json({ data: markers, count: markers.length });
  } catch (err) { next(err); }
};

export const getApartmentsInRadius = async (req, res, next) => {
  try {
    const results = await service.getApartmentsInRadius(req.query);
    res.status(200).json({ data: results, count: results.length });
  } catch (err) { next(err); }
};

export const getNearbyPois = async (req, res, next) => {
  try {
    const pois = await service.getNearbyPois(req.params.id, req.query);
    res.status(200).json({ data: pois, count: pois.length });
  } catch (err) { next(err); }
};

export const createApartment = async (req, res, next) => {
  try {
    const apt = await service.createApartment(req.body, req.user.id);
    res.status(201).json({ data: apt });
  } catch (err) { next(err); }
};

export const updateApartment = async (req, res, next) => {
  try {
    const apt = await service.updateApartment(req.params.id, req.body, req.user.id);
    res.status(200).json({ data: apt });
  } catch (err) { next(err); }
};

export const deleteApartment = async (req, res, next) => {
  try {
    await service.deleteApartment(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};

export const deleteImage = async (req, res, next) => {
  try {
    await service.deleteApartmentImage(req.params.id, req.params.imageId);
    res.status(204).send();
  } catch (err) { next(err); }
};
