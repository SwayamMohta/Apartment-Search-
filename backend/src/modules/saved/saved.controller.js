// src/modules/saved/saved.controller.js
import * as service from './saved.service.js';

export const getSaved = async (req, res, next) => {
  try {
    const data = await service.getSavedApartments(req.user.id);
    res.status(200).json({ data, count: data.length });
  } catch (err) { next(err); }
};

export const save = async (req, res, next) => {
  try {
    await service.saveApartment(req.user.id, req.params.aptId);
    res.status(200).json({ message: 'Apartment saved successfully' });
  } catch (err) { next(err); }
};

export const unsave = async (req, res, next) => {
  try {
    await service.unsaveApartment(req.user.id, req.params.aptId);
    res.status(200).json({ message: 'Apartment removed from saved homes' });
  } catch (err) { next(err); }
};
