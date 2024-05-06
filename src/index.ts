import "dotenv/config";
import MongoDB from "./db";
import User from "./models/user";

const main = async () => {
	await MongoDB.open();
	try {
		const conn = MongoDB.conn;
		if (conn) {
			const db = conn.db();
			const users = db.collection<User>("users");
			await users.insertMany([
				{
					fullname: "Fernando Belém",
					username: "nando",
					password: "123456",
					role: 0,
				},
				{
					fullname: "Maria Joaquina",
					username: "maria",
					password: "123456",
					role: 0,
				},
			]);
		}
	} finally {
		await MongoDB.close();
	}
};

main();
