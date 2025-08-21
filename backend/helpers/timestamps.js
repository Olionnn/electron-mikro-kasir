// utils/timeProfile.js
import { DateTime } from "luxon";

/**
 * UBAH SATU VARIABEL INI SAJA:
 * - "WIB"    → zona Asia/Jakarta
 * - "UTC+7"  → zona offset UTC+07:00
 */
export let TIME_PRESET = "WIB"; // "WIB" | "UTC+7"

/** Mapping preset → zone & format */
function getProfile() {
  if (TIME_PRESET === "UTC+7") {
    return {
      zone: "UTC+07:00",                // fixed offset
      format: "yyyy-MM-dd HH:mm:ss",    // bebas kamu ganti
      label: "UTC+7",
    };
  }
  // default WIB
  return {
    zone: "Asia/Jakarta",
    format: "yyyy-MM-dd HH:mm:ss",      // bebas kamu ganti
    label: "WIB",
  };
}

/** Sekadar bantu akses profile saat ini */
export function currentTimeProfile() {
  return getProfile();
}

/** Now (UTC) untuk disimpan ke DB → bentuk JS Date (direkomendasikan tetap UTC) */
export function nowForDB() {
  return DateTime.now().toUTC().toJSDate();
}

/** Format tampilan sesuai preset (WIB/UTC+7) dari berbagai input (Date/ISO/SQL) */
export function formatForDisplay(raw) {
  if (!raw) return null;
  const { zone, format } = getProfile();

  let dt;
  if (raw instanceof Date) {
    dt = DateTime.fromJSDate(raw, { zone: "utc" });
  } else if (typeof raw === "string") {
    dt = DateTime.fromISO(raw, { setZone: true });
    if (!dt.isValid) dt = DateTime.fromSQL(raw, { zone: "utc" });
  } else {
    return null;
  }
  return dt.setZone(zone).toFormat(format);
}

/** Convenience: timestamp display “sekarang” sesuai preset (string terformat) */
export function nowDisplay() {
  const { zone, format } = getProfile();
  return DateTime.now().setZone(zone).toFormat(format);
}



export function registerManualTimestamps(sequelize, { createdAt = "created_at", updatedAt = "updated_at" } = {}) {
  const setCreate = (inst, now) => {
    if (inst?.rawAttributes?.[createdAt] && inst.getDataValue(createdAt) == null) {
      inst.setDataValue(createdAt, now);
    }
    if (inst?.rawAttributes?.[updatedAt]) {
      inst.setDataValue(updatedAt, now);
    }
  };
  const setUpdate = (inst, now) => {
    if (inst?.rawAttributes?.[updatedAt]) {
      inst.setDataValue(updatedAt, now);
    }
  };

  sequelize.addHook("beforeCreate", (inst) => setCreate(inst, nowForDB()));
  sequelize.addHook("beforeBulkCreate", (instances) => {
    const now = nowForDB();
    for (const inst of instances) setCreate(inst, now);
  });
  sequelize.addHook("beforeUpdate", (inst) => setUpdate(inst, nowForDB()));
  sequelize.addHook("beforeBulkUpdate", (options) => {
    options.attributes = options.attributes || {};
    options.attributes[updatedAt] = nowForDB();
  });
  sequelize.addHook("beforeUpsert", (values) => {
    const now = nowForDB();
    if (values[createdAt] == null) values[createdAt] = now;
    values[updatedAt] = now;
  });
}


export function toJakarta(raw) {
  if (!raw) return null;
  let dt;
  if (raw instanceof Date) {
    // Sequelize biasanya kirim Date untuk DataTypes.DATE
    dt = DateTime.fromJSDate(raw, { zone: 'utc' });
  } else if (typeof raw === 'string') {
    // SQLite bisa simpan string; coba parse ISO dulu, kalau gagal pakai fromSQL
    dt = DateTime.fromISO(raw, { setZone: true });
    if (!dt.isValid) dt = DateTime.fromSQL(raw, { zone: 'utc' });
  } else {
    return null;
  }
  return dt.setZone('Asia/Jakarta').toFormat('yyyy-MM-dd HH:mm:ss');
}