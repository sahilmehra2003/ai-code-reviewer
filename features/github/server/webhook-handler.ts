import type { NextRequest } from "next/server";
import { getGithubApp } from "../utils/github-app";
import { NextResponse } from "next/server";
import { savePullRequest } from "@/features/reviews/server/save-pull-request";
import { inngest } from "@/features/inngest/client";
const REVIEWABLE_ACTIONS=["opened","synchronize","reopened"]

export type PullRequestWebhookPayload = {
  /** Webhook action, e.g. `opened`, `synchronize`, `reopened` */
  action: string;
  /** GitHub App installation that received the event */
  installation: { id: number };
  repository: { full_name: string };
  pull_request: {
    number: number;
    title: string;
    user: { login: string } | null;
    head: { sha: string };
    base: { ref: string };
  };
};

async function isSignatureValid(payload:string,signature:string | null):Promise<boolean> {
     if (!signature) {
        return false;
     }
     const app= getGithubApp();
     // Octokit wraps Github's Webhook crypto- rejects forged payloads
     return app.webhooks.verify(payload,signature);
}


export async function handleGithubWebhook(request:NextRequest) {
    const payload=await request.text();
    const signature=request.headers.get("x-hub-signature-256");
    const eventName=request.headers.get('x-github-event');
    const isValid=await isSignatureValid(payload,signature);
    if (!isValid) {
        return NextResponse.json({error:"Invalid signature"},{status:401});
    }
    if (eventName!=="pull_request") {
        return NextResponse.json({received:true});
    }
    const event=JSON.parse(payload) as PullRequestWebhookPayload
    console.log("event: ",event);
    if (!REVIEWABLE_ACTIONS.includes(event.action)) {
        return NextResponse.json({received:true});
    }
    
    const pullRequest=await savePullRequest(event)

    console.log("pull request: ",pullRequest)

  // todo : Map Github installtaion id

  // TODO : TriggerReviewJob
  await inngest.send({
    name: "github/pr.received",
    data: { pullRequestId: pullRequest.id },
  });

  return NextResponse.json({received:true});
}