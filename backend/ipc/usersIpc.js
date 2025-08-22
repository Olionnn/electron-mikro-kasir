import Users from "../models/users.js";
import db from "../../config/database.js";
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { signAccessToken } from "../utils/jwt.js";
import { ipcMain } from "electron";
import {
  GetDataList as GetUserList,
  GetDataById as GetUserById,
  CreateData as CreateUser,
  UpdateData as UpdateUser,
  DeleteData as DeleteUser,
  findUserByEmail,
  UsersResponse,
} from "../models/users.js";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../helpers/response.js";
import { parsePayload } from "../utils/utils.js";

import {
    GetDataList as GetTokoList,
    GetDataById as GetTokoById,
    CreateData as CreateToko,
    UpdateData as UpdateToko,
    DeleteData as DeleteToko,
} from '../models/toko.js';
import { requireAuth } from "../middleware/auth.js";


var EXP_SECONDS = 60 * 60 * 2; // 2 jam

ipcMain.handle("usersIpc:login", async (event, payload) => {
  try {
    const { email, password } = parsePayload(payload);
    const user = await findUserByEmail(email);
    if (!user) return createErrorResponse("User not found");

    const toko = await GetTokoById(user.toko_id);
    if (!toko) return createErrorResponse("Toko not found");


    // if (user.status === false) {
    //   return createErrorResponse("Akun nonaktif");
    // }

    // if (Number(user.is_valid) === 0) {
    //   return createErrorResponse("Akun belum divalidasi");
    // }
    const ok = await verifyPassword(password, user.password);
    if (!ok) return createErrorResponse("Invalid password");

    const token = signAccessToken(
      { id: user.id, toko_id: user.toko_id, role: user.role },
    );

    const res = {
      accesstoken: token,
      expire_in: EXP_SECONDS,
      user: UsersResponse(user),
      toko: {
        id: toko.id,
        nama_toko: toko.nama_toko,
        nama_pemilik: toko.nama_pemilik,
        no_telp: toko.no_telp,
        alamat_toko: toko.alamat_toko,
        image: toko.image,
      },
    };

    return createSuccessResponse( "Login successful", {
      data: res,
      pagination: {},
    });
  } catch (err) {
    return createErrorResponse(err?.message || "Gagal login");
  }
});


ipcMain.handle("usersIpc:register", async (event, payload) => {


    try {
        var { nama, email, password, username, no_telp, alamat, role, status } = parsePayload(payload);
        const existingUser = await findUserByEmail(email);

        if (existingUser != null) {
            return createErrorResponse("Email already in use");
        }

        await db.transaction(async (t) => {
            const toko = await CreateToko(t, {
                nama_toko: `Toko ${nama}`,
                nama_pemilik: nama,
                no_telp,
                status: true,
            });


            // Buat user
            const user = await CreateUser(t, {
                nama,
                email,
                username,
                no_telp,
                alamat,
                role,
                status,
                toko_id: toko.id,
                is_valid: 1,
                password: await hashPassword(password),
            });

            return { toko, user };
        });

        const user = await findUserByEmail(email);
        if (!user) return createErrorResponse("User not found");

        const toko = await GetTokoById(user.toko_id);
        if (!toko) return createErrorResponse("Toko not found");

        const ok = await verifyPassword(password, user.password);
        if (!ok) return createErrorResponse("Invalid password");

        const token = signAccessToken(
          { id: user.id, toko_id: user.toko_id, role: user.role },
        );

        const res = {
          accesstoken: token,
          expire_in: EXP_SECONDS,
          user: UsersResponse(user),
          toko: {
            id: toko.id,
            nama_toko: toko.nama_toko,
            nama_pemilik: toko.nama_pemilik,
            no_telp: toko.no_telp,
            alamat_toko: toko.alamat_toko,
            image: toko.image,
          },
        };

        return createSuccessResponse("User registered successfully",{
          data: res,
          pagination: {}
        });

    } catch (err) {
        return createErrorResponse(err?.message || "Gagal registrasi");
    }
});

ipcMain.handle("usersIpc:getList", requireAuth(async (event, params) => {
  try {
    const { pagination, filter } = params || {};
    const res = await GetUserList(pagination, filter);
    return createSuccessResponse("Berhasil memuat daftar user", {
      items: res.data,
      pagination: res.pagination,
    });
  } catch (error) {
    console.error('Error getting users list:', error);
    return createErrorResponse(error, 'getting users list');
  }
}));

ipcMain.handle("usersIpc:getById", requireAuth(async (event, { id }) => {
  try {
    console.log('Getting user by ID:', id);
    const user = await GetUserById(id);
    if (!user) {
      return createErrorResponse("User not found");
    }
    return createSuccessResponse("Berhasil mendapatkan user", {
      items: UsersResponse(user),
      pagination: {},
    });
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return createErrorResponse(error, 'getting user by ID');
  }
}));


ipcMain.handle("usersIpc:create", requireAuth(async (event, {data}) => {
  try {
    const payload = { ...(data || {}) };

    if (payload.image && payload.image.dataBase64) {
      const relPath = await saveImageAndGetRelPath(payload.image, 'users');
      payload.image = relPath;
    } else {
      payload.image = null;
    }

    const normalizedPayload = {
      nama: payload.nama ?? "",
      email: payload.email ?? "",
      username: payload.username ?? "",
      no_telp: payload.no_telp ?? null,
      alamat: payload.alamat ?? "",
      role: payload.role || "user",
      status: payload.status !== false,
      password: await hashPassword(payload.password),
    };

    const result = await db.transaction(async (trx) => {
      return await CreateUser(trx, normalizedPayload);
    });

    return createSuccessResponse("Berhasil Membuat User", {
      data: UsersResponse(result),
      pagination: {},
    });
    
  } catch (error) {
    console.error('Error creating user:', error);
    return createErrorResponse(error?.message || "Gagal membuat user");
  }
}));


ipcMain.handle("usersIpc:update", requireAuth(async (event, { id, data }) => {
  try {
    const payload = { ...(data || {}) };

    if (payload.image && payload.image.dataBase64) {
      const relPath = await saveImageAndGetRelPath(payload.image, 'users');
      payload.image = relPath;
    } else {
      payload.image = null;
    }

    const userData = await GetUserById(id);
    if (!userData) {
      return createErrorResponse("User not found");
    }

    const normalizedPayload = {
      nama: payload.nama ?? userData.nama ?? "",
      email: payload.email ?? userData.email ?? "",
      username: payload.username ?? userData.username ?? "",
      no_telp: payload.no_telp ?? userData.no_telp ?? null,
      alamat: payload.alamat ?? userData.alamat ?? "",
      role: payload.role ?? userData.role ?? "",
      status: payload.status ?? userData.status ?? true,
      image: payload.image ?? userData.image ?? "",
    };

    const result = await db.transaction(async (trx) => {
      return await UpdateUser(trx, id, normalizedPayload);
    });

    return createSuccessResponse("Berhasil Mengupdate User", {
      data: UsersResponse(result),
      pagination: {},
    });
    
  } catch (error) {
    return createErrorResponse(error?.message || "Gagal mengupdate user");
  }
}));



// ipcMain.handle("usersIpc:logout", async (event, payload) => {
//   try {
//     const { user_id } = parsePayload(payload);
//     if (!user_id) return createErrorResponse("user_id missing");

//     // await db.transaction(async (t) => {
//     //   const user = await GetUserById(user_id);
//     //   if (!user) throw new Error("User not found");
//     //   const nextTV = (user.token_version ?? 0) + 1;
//     //   await UpdateUser(t, user_id, { token_version: nextTV });
//     // });

//     return createSuccessResponse("Logged out", { data: {}, pagination: {} });
//   } catch (err) {
//     return createErrorResponse(err?.message || "Gagal logout");
//   }
// });



