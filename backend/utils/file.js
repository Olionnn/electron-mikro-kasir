import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_FILES_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/csv",
  "application/csv",
]);

function getExtByMime(mime) {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  if (mime === "application/pdf") return "pdf";
  if (mime === "application/msword") return "doc";
  if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (mime === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "xlsx";
  if (mime === "application/vnd.ms-excel") return "xls";
  if (mime === "application/vnd.openxmlformats-officedocument.presentationml.presentation") return "pptx";
  if (mime === "text/csv" || mime === "application/csv") return "csv";
  return null;
}

function stripDataUrlPrefix(b64 = "") {
  // Terima "data:<mime>;base64,AAAA..." atau langsung "AAAA..."
  const i = b64.indexOf("base64,");
  return i >= 0 ? b64.slice(i + "base64,".length) : b64;
}

async function ensureDir(dirAbs) {
  try { await fs.mkdir(dirAbs, { recursive: true }); } catch {}
}

function safeExtFromMime(mime, fallbackName = "", fallback = "bin") {
  let ext = getExtByMime(mime);
  if (!ext) {
    const unsafeExt = (fallbackName || "").split(".").pop()?.toLowerCase();
    if (unsafeExt) ext = unsafeExt;
  }
  return (ext || fallback).replace(/[^a-z0-9]/gi, "");
}



/**
 * Simpan gambar & kembalikan path relatif DB
 * @param {{name:string, type:string, dataBase64:string}} image
 * @param {string} pathto - path tujuan untuk menyimpan gambar
 * @returns {Promise<string>} ex: "/uploads/toko/abc123.jpg"
 */
async function saveImageAndGetRelPath(image, pathto) {
    if (!image?.dataBase64 || !image?.type) return "";

    if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
        throw new Error(`Tipe gambar tidak didukung: ${image.type}`);
    }

    const ext = safeExtFromMime(image.type, image.name, "jpg");
    const fileName = `${randomUUID()}.${ext}`;
    
    const uploadDir = path.join("uploads", pathto);
    const saveDir = path.join(process.cwd(), "public", uploadDir);
    
    await ensureDir(saveDir);
    
    const filePath = path.join(saveDir, fileName);
    const buffer = Buffer.from(stripDataUrlPrefix(image.dataBase64), "base64");
    
    await fs.writeFile(filePath, buffer);
    
    return `/${path.posix.join("uploads", pathto, fileName)}`;
}


/**
 * Simpan SATU file dokumen (pdf/doc/xls/ppt/csv) dan kembalikan metadata
 * @param {{name:string, type:string, dataBase64:string}} file
 * @param {string} pathto - path tujuan untuk menyimpan file (ex: "toko", "menu", "produk")
 * @param {{subdir?: string}} opts - subdir tambahan di bawah pathto (optional)
 * @returns {Promise<{ path: string, size: number, name: string, mime: string }>} 
 *          path: "/uploads/xxx/uuid.ext"
 */
async function saveFileAndGetRelPath(file, pathto, opts = {}) {
    // Validasi input file
    if (!file?.dataBase64 || !file?.type) {
        throw new Error("File tidak valid (missing dataBase64/type).");
    }

    // Validasi tipe file yang diizinkan
    if (!ALLOWED_FILES_TYPES.has(file.type)) {
        throw new Error(`Tipe file tidak didukung: ${file.type}`);
    }

    // Generate nama file unik dengan ekstensi yang tepat
    const ext = safeExtFromMime(file.type, file.name, "bin");
    const fileName = `${randomUUID()}.${ext}`;

    // Tentukan struktur folder
    const subdir = opts.subdir || "files";
    const targetDir = path.join(pathto, subdir);
    
    // Path untuk filesystem
    const uploadDir = path.join("uploads", targetDir);
    const saveDir = path.join(process.cwd(), "public", uploadDir);
    
    // Pastikan direktori ada
    await ensureDir(saveDir);

    // Konversi base64 ke buffer dan simpan file
    const buffer = Buffer.from(stripDataUrlPrefix(file.dataBase64), "base64");
    const filePath = path.join(saveDir, fileName);
    await fs.writeFile(filePath, buffer);

    // Return path untuk database/URL (format POSIX untuk URL)
    const relativePathForDb = `/${path.posix.join("uploads", targetDir.replace(/\\/g, "/"), fileName)}`;

    return {
        path: relativePathForDb,
        size: buffer.length,
        name: file.name || fileName,
        mime: file.type,
    };
}

/**
 * Simpan BANYAK file sekaligus
 * @param {Array<{name:string, type:string, dataBase64:string}>} files
 * @param {{subdir?: string}} opts
 * @returns {Promise<Array<{ path:string, size:number, name:string, mime:string }>>}
 */
async function saveFilesAndGetRelPaths(files = [], opts = {}) {
  if (!Array.isArray(files)) return [];
  const results = [];
  for (const f of files) {
    const saved = await saveFileAndGetRelPath(f, opts);
    results.push(saved);
  }
  return results;
}

async function deletePublicFileIfExists(relPath) {
  try {
    if (!relPath) return;
    const normalized = String(relPath).replace(/^\/+/, ""); // buang leading slash
    const abs = path.join(process.cwd(), "public", normalized);
    await fs.unlink(abs);
  } catch (err) {
    // Abaikan jika file sudah tidak ada
    if (err?.code !== "ENOENT") {
      console.warn("Gagal menghapus file:", relPath, err?.message);
    }
  }
}


export {
  saveImageAndGetRelPath,
  saveFileAndGetRelPath,
  saveFilesAndGetRelPaths,
  stripDataUrlPrefix,
  safeExtFromMime,
  ensureDir,
  deletePublicFileIfExists,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_FILES_TYPES,
};