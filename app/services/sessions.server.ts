import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
	productId: number;
}[];

type SessionFlashData = {
	error: string;
};

export const sessionStorage = createCookieSessionStorage<
	SessionData,
	SessionFlashData
>({
	cookie: {
		name: "__session",
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: "/",
		sameSite: "lax",
		secrets: ["test"],
	},
});

export const { getSession, commitSession, destroySession } = sessionStorage;
