// src/modules/auth/auth.repository.js
import db from '../../config/db.js';

export const findUserByEmail = async (email) => {
  return db.get('SELECT id, email, password_hash, role, full_name FROM users WHERE email = $1', [email]);
};

export const findUserById = async (id) => {
  return db.get('SELECT id, email, role, full_name, created_at FROM users WHERE id = $1', [id]);
};

export const createUser = async ({ email, password_hash, full_name, role = 'user' }) => {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  await db.run(
    `INSERT INTO users (id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [id, email, password_hash, full_name || null, role]
  );
  return findUserById(id);
};
