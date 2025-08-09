import {NextRequest, NextResponse} from "next/server";
import {revalidatePath} from "next/cache";

import {deleteSession} from "@/lib/session";

export async function GET(req: NextRequest) {
    await deleteSession();

    revalidatePath("/");
    return NextResponse.redirect(new URL("/", req.nextUrl));
}