import express, {
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express";
import bodyParser from "body-parser";
import { z, ZodSchema } from "zod";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;

const isoDateSchema = z.string().datetime();

const apiCalendarEventSchema = z.object({
	name: z.string(),
	startAt: isoDateSchema,
	endAt: isoDateSchema,
});

const prisma = new PrismaClient();

function validateBody<TBody extends ZodSchema>(
	schema: TBody,
): RequestHandler<Record<string, string>, any, z.infer<TBody>> {
	function handler(req: Request, res: Response, next: NextFunction) {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			res.sendStatus(400);
			return;
		}

		req.body = result.data;

		next();
	}

	return handler;
}

app.get("/", (_req, res) => {
	res.send("Hello World!");
});

app.get("/events", async (_req, res) => {
	const events = await prisma.events.findMany();
	res.json({ events });
});

app.post(
	"/events",
	bodyParser.json(),
	validateBody(apiCalendarEventSchema),
	async (req, res) => {
		await prisma.events.create({
			data: req.body,
		});

		res.sendStatus(203);
	},
);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
