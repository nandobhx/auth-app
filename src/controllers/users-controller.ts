import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import MongoDB from "../db";
import jwt from "jsonwebtoken";
import User from "../models/user";

export default class UsersController {
	static async auth(req: Request, res: Response, next: NextFunction) {
		const { username, password } = req.body;

		if (typeof username !== "string" || typeof password !== "string") {
			next(createError[400]("Usuário ou senha não informado!"));
			return;
		}

		try {
			const conn = MongoDB.conn;
			if (conn) {
				const db = conn.db();
				const users = db.collection<User>("users");
				const user = await users
					.find({
						username,
						password,
					})
					.toArray();

				if (user.length == 0) {
					next(createError[404]("Usuário ou senha não encontrado!"));
					return;
				}

				const token = jwt.sign(
					{
						id: user[0]._id,
						username: user[0].username,
					},
					process.env.JWT_SECRET || "",
					{ expiresIn: 60 }
				);

				res.status(200).json({ token });
			}
		} catch (e) {
			next(createError[500]((e as Error).message));
		}
	}

	static verifyToken(req: Request, res: Response, next: NextFunction) {
		const authorization = req.headers.authorization?.split(" ");

		if (
			!authorization ||
			authorization.length !== 2 ||
			authorization[0] != "Bearer"
		) {
			next(createError[401]("Não autorizado!"));
			return;
		}

		try {
			jwt.verify(authorization[1], process.env.JWT_SECRET || "");
			res.status(200).json({ status: 200, message: "Autorizado!" });
		} catch (e) {
			next(createError[401]("Não autorizado!"));
		}
	}
}
