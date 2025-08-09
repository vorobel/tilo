"use server";

import {redirect} from "next/navigation";

import {FormState, SignupFormSchema, LoginFormSchema} from "@/lib/type";
import {BACKEND_URL} from "@/lib/constants";
import {createSession} from "@/lib/session";

export async function signUp(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const validationFields = SignupFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if(!validationFields.success) {
        return {
            error: validationFields.error.flatten().fieldErrors
        }
    }

    console.log("Sending data to backend:", validationFields.data);

    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(validationFields.data)
    });
    console.log("Status", response.status);
    console.log("Response", await response.text());

    if (response.ok) {
        redirect("/auth/signin")
    } else {
        return {
            message: response.status === 409 ?
                "User already exists!" :
                response.statusText
        }
    }
}

export async function signIn(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if(!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors }
    }

    const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedFields.data)
    });

    if(response.ok) {
        const result = await response.json();
        // TODO: Create the session for authenticated users
        await createSession({
            user: {
                id: result.id,
                name: result.name,
            }
        });
        redirect("/")
        console.log({ result });
    } else {
        return {
            message: response.status === 401 ? 'Invalid credentials' : response.statusText
        }
    }
}