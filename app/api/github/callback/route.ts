import  {DASHBOARD_ROUTES} from "@/features/dashboard/lib/routes";
import { saveInstallation } from "@/features/github/server/installation";
import { getServerSession } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

// from where are we coming to sign-in page
function buildSignInCallbackUrl(installationId: string | null): string {
    if (installationId) {
      return `/api/github/callback?installation_id=${installationId}`;
    }
  
    return DASHBOARD_ROUTES.github;
}


export async function GET(request:NextRequest) {
    const {searchParams}=new URL(request.url);
     const installationId=searchParams.get("installation_id");
     const session=await getServerSession();
   //   create a sign-in callback and redirect user to sign-in
     if(!session){
     // provide user context =>  from where are we coming to sign-in page
        const callbackURL=buildSignInCallbackUrl(installationId);
        redirect(`/sign-in?callback=${encodeURIComponent(callbackURL)}`)
     }
     if (installationId) {
        await saveInstallation(session.user.id,Number(installationId)); 
     } 
   //   send back to githb page
     redirect(DASHBOARD_ROUTES.github);
}