"use client";

import {useActionState} from "react";

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import SubmitButton from "@/components/ui/submitButton";
import {signUp} from "@/lib/auth";

const SignUpForm = () => {
    const [state, action] = useActionState(signUp, undefined);

    return (
        <form action={action}>
            <div className="flex flex-col gap-2">
                {state?.message && (
                    <p className="text-sm text-red-500">{state.message}</p>
                )}

                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="John Doe"/>
                </div>
                {state?.error?.name && (
                    <p className="text-sm text-red-500">{state.error.name}</p>
                )}

                <div>
                    <Label htmlFor="email">Name</Label>
                    <Input id="email" name="email" placeholder="john.doe@gmail.com"/>
                </div>
                {state?.error?.email && (
                    <p className="text-sm text-red-500">{state.error.email}</p>
                )}

                <div>
                    <Label htmlFor="password">Name</Label>
                    <Input id="password" name="password" type="password"/>
                </div>
                {state?.error?.password && (
                    <div className="text-sm text-red-500">
                        <p>Password must: </p>
                        <ul>
                            {state.error.password.map((error) => (
                                <li key={error}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <SubmitButton>Submit</SubmitButton>
            </div>
        </form>
    )
};

export default SignUpForm;