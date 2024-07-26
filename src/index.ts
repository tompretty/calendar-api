import express from "express";
import bodyParser from "body-parser";
import { z } from "zod";

const app = express();
const port = 3000;

interface CalendarEvent {
	name: string;
	startAt: Date;
	endAt: Date;
}

const isoDateSchema = z.string().datetime().pipe(z.coerce.date());

const apiCalendarEventSchema = z.object({
	name: z.string(),
	startAt: isoDateSchema,
	endAt: isoDateSchema,
});

const EVENTS: CalendarEvent[] = [
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

app.get("/", (_req, res) => {
	res.send("Hello World!");
});

app.get("/events", (_req, res) => {
	res.json({ events: EVENTS });
});

app.post("/events", bodyParser.json(), (req, res) => {
	console.log(req.body);
	const result = apiCalendarEventSchema.safeParse(req.body);

	if (!result.success) {
		res.sendStatus(400);
		return;
	}

	EVENTS.push(result.data);

	res.sendStatus(203);
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
