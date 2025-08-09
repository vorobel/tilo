"use server";

import {SignJWT, jwtVerify} from "jose";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export type Session = {
    user: {
        id: string,
        name: string
    },
    // accessToken: string,
    // refreshToken: string,
};

export async function createSession(payload: Session) {
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const session = await new SignJWT(payload)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiredAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get("session")?.value;

    if (!cookie) return null;

    try {
        const {payload} = await jwtVerify(cookie, encodedKey, {
            algorithms: ["HS256"],
        });

        return payload as Session;
    } catch (error) {
        console.error("Failed to verify the session", error);
        redirect("/auth/signin")
    }
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}