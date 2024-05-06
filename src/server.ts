import "dotenv/config";
import express, { NextFunction, Request, Response, json } from "express";
import MongoDB from "./db";
import usersRouter from "./routes/users-router";
import cors from "cors";

const connectMongoDB = async () => {
	try {
		await MongoDB.open();
	} catch (e) {
		console.error(`Erro ao conectar no MongoDB: ${(e as Error).message}`);
		process.exit(1);
	}

	const closeHandler = async () => {
		await MongoDB.close();
		process.exit(0);
	};

	process.on("SIGTERM", closeHandler);
	process.on("SIGINT", closeHandler);
};

const startServer = () => {
	const port = parseInt(process.env.HTTP_PORT || "3000");

	const app = express();

	app.use(express.json());
	app.use(cors());

	app.use("/users", usersRouter);

	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		const status = err.statusCode || 500;
		const message = err.message || "";
		res.status(status).json({
			status,
			message,
		});
	});

	app.listen(port, () => {
		console.log(`Server running in port ${port}`);
	});
};

const main = async () => {
	await connectMongoDB();
	startServer();
};

main();
