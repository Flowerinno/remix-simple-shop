// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
	productId: number;
}[];

type SessionFlashData = {
	error: string;
};

const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData, SessionFlashData>({
		cookie: {
			name: "store",
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 30, // 30 days
			path: "/",
			sameSite: "lax",
			secrets: ["test"],
		},
	});

export { getSession, commitSession, destroySession };
