// create a singleton instance for github app
import {App} from "octokit";

let githubApp:App | null=null;

export function getGithubApp(){
    if (!githubApp) {
        githubApp=new App({
            appId:process.env.GITHUB_APP_ID!,
            privateKey:process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g,"\n"),
            webhooks:{
                secret:process.env.GITHUB_WEBHOOK_SECRET!
            }
        })
    }
    return githubApp;
}

// github app installation url
export function getGithubInstallUrl(userId: string) {
    const url = new URL(`${process.env.NEXT_PUBLIC_GITHUB_PUBLIC_LINK}/installations/new`);
    // `state` round-trips through GitHub so we can link the installation to this user.
    url.searchParams.set("state", userId);
    return url.toString();
}