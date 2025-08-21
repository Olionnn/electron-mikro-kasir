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

var EXP_SECONDS = 60 * 60 * 2; // 2 jam

ipcMain.handle("usersIpc:login", async (event, payload) => {
  try {
    const { email, password } = parsePayload(payload);
    console.log("Login attempt with payload:", parsePayload(payload));
    const user = await findUserByEmail(email);
    if (!user) return createErrorResponse("User not found");

    if (user.status === false) {
      return createErrorResponse("Akun nonaktif");
    }
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
        const trx = await db.transaction();
        const existingUser = await findUserByEmail(email);

        if (existingUser != null) {
            return createErrorResponse("Email already in use");
        }

        const result = await db.transaction(async (t) => {
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
                status: !!status,
                toko_id: toko.id,
                is_valid: 1,
                password: await hashPassword(password),
            });

            return { toko, user };
        });
        return createSuccessResponse({
            message: "User registered successfully",
            data: UsersResponse(result.user)
        });
    } catch (err) {
        return createErrorResponse(err?.message || "Gagal registrasi");
    }
});
