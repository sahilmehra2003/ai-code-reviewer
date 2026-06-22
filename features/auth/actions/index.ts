"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_AUTH_CALLBACK,getSafeCallbackPath,SIGN_IN_PATH } from "../utils";


// redirect to github conscent screen
export async function signInWithGithub(formData:FormData){
    const callback=formData.get("callbackUrl");
    const redirectTo=getSafeCallbackPath(typeof callback==="string" ? callback : null)
   
   const result=await auth.api.signInSocial({
     body:{
        provider:"github",
        callbackURL:redirectTo //sign-in hone ke baad kahan bhejna ha
     },
     headers:await headers()
   });
   if (result.url) {
    // where we want to redirect the user
      redirect(result.url);
   }
}

export async function getServerSession(){
    return auth.api.getSession({
        headers:await headers()
    })
}

// if user is not authenticated
export async function requireAuth(redirectTo=SIGN_IN_PATH) {
     const session=await getServerSession();
     if (!session) {
        redirect(redirectTo);
     }
     return session;
}

// if user is  authenticated
export async function requireUnAuth(redirectTo=DEFAULT_AUTH_CALLBACK) {
     const session=await getServerSession();
     if (session) {
        redirect(redirectTo);
     }
}