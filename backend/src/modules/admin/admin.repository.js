// src/modules/admin/admin.repository.js
import db from '../../config/db.js';

export const getAllUsers = async ({ limit, offset }) => {
  const { rows } = await db.query(
    `SELECT id, email, role, full_name, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const countRow = await db.get('SELECT COUNT(*) as count FROM users');
  return { rows, total: parseInt(countRow.count) };
};

export const deleteUser = async (id) => {
  const { changes } = await db.run('DELETE FROM users WHERE id = $1', [id]);
  return changes > 0;
};

export const getAuditLogs = async ({ limit, offset }) => {
  const { rows } = await db.query(
    `SELECT al.id, al.action, al.entity, al.entity_id, al.details as payload, al.created_at,
            u.email AS admin_email
     FROM audit_logs al
     LEFT JOIN users u ON al.user_id = u.id
     ORDER BY al.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const countRow = await db.get('SELECT COUNT(*) as count FROM audit_logs');
  return { rows, total: parseInt(countRow.count) };
};

export const insertAuditLog = async ({ adminId, action, entity, entityId, payload }) => {
  await db.run(
    `INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
     VALUES ($1, $2, $3, $4, $5)`,
    [adminId, action, entity, entityId, JSON.stringify(payload)]
  );
};

export const getAnalyticsOverview = async () => {
  const apts   = await db.get('SELECT COUNT(*) as count FROM apartments WHERE is_active = 1');
  const users  = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
  const saves  = await db.get('SELECT COUNT(*) as count FROM saved_homes');
  const newApts = await db.get("SELECT COUNT(*) as count FROM apartments WHERE is_active = 1 AND created_at > datetime('now', '-30 days')");
  
  return {
    total_apartments: parseInt(apts.count),
    total_users:      parseInt(users.count),
    total_saves:      parseInt(saves.count),
    new_this_month:   parseInt(newApts.count)
  };
};
