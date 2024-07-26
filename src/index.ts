import express, {
	NextFunction,
	Request,
	RequestHandler,
	Response,
} from "express";
import bodyParser from "body-parser";
import { z, ZodSchema } from "zod";

const app = express();
const port = 3000;

const isoDateSchema = z.string().datetime().pipe(z.coerce.date());

const apiCalendarEventSchema = z.object({
	name: z.string(),
	startAt: isoDateSchema,
	endAt: isoDateSchema,
});

type ApiCalendarEvent = z.infer<typeof apiCalendarEventSchema>;

const EVENTS: ApiCalendarEvent[] = [
	{
		name: "Driving lesson",
		startAt: new Date(2024, 0, 1, 9, 0, 0),
		endAt: new Date(2024, 0, 1, 12, 0, 0),
	},
	{
		name: "Pick up shopping",
		startAt: new Date(2024, 0, 1, 17, 0, 0),
		endAt: new Date(2024, 0, 1, 18, 0, 0),
	},
];

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

app.get("/events", (_req, res) => {
	res.json({ events: EVENTS });
});

app.post(
	"/events",
	bodyParser.json(),
	validateBody(apiCalendarEventSchema),
	(req, res) => {
		EVENTS.push(req.body);

		res.sendStatus(203);
	},
);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
