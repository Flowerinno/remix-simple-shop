import { Authenticator } from "remix-auth";
import { sessionStorage } from "./sessions.server";
import { FormStrategy } from "remix-auth-form";

type User = {
	email: string;
	token: string | null;
};

export let authenticator = new Authenticator<User | null>(sessionStorage, {
	sessionErrorKey: "authError",
});

const registeredUser: User = {
	email: "akellastoopi@gmail.com",
	token: "1234",
};

const pass = "1234";

authenticator.use(
	new FormStrategy(async ({ form }: any) => {
		let email = form.get("email");
		let password = form.get("password"); // this is not secure, don't do this in production
		// here we can do some validation, like check if the user exists in the database etc.

		const user = login(email, password);

		return user;
	}),
	"user-pass"
);

export const login = (email: string, password: string) => {
	if (email !== registeredUser.email || password !== pass) {
		return null;
	}
	return registeredUser;
};
