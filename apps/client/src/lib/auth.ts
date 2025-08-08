"use server";

import {FormState, SignupFormSchema} from "@/lib/type";
import {redirect} from "next/navigation";

import {BACKEND_URL} from "@/lib/constants";

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