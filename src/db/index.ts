import { MongoClient } from "mongodb";

const uri = `mongodb://${process.env.DB_HOST || "localhost"}:${
	process.env.DB_PORT || "27017"
}/${process.env.DB_NAME || "database"}`;

export default class MongoDB {
	static conn: MongoClient | null = null;

	static async open() {
		this.conn = new MongoClient(uri);
		await this.conn.connect();
		console.log("Conexão com o MongoDB iniciada com sucesso!");
	}

	static async close() {
		if (this.conn) {
			await this.conn.close();
			console.log("Conexão com o MongoDB encerrada com sucesso!");
		}
	}
}
