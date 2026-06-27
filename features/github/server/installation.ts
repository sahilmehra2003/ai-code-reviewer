import type { GithubInstallationStatus } from "@/features/dashboard/lib/type";
import { getGithubApp } from "../utils/github-app";
import { prisma } from "@/lib/db";

function getAccountLogin(
    account: { login?: string; slug?: string } | null | undefined
): string | null {
    if (!account) {
        return null;
    }
    if ("login" in account && account.login) {
        return account.login
    }
    if (account.slug) {
        return account.slug
    }
    return null;
}


function buildDisconnectedStatus(): GithubInstallationStatus {
    return { connected: false, accountLogin: null, installedAt: null }
}

// shape of your data
export async function getInstallationStatus(userId: string): Promise<GithubInstallationStatus> {
    const installation = await prisma.githubInstallation.findUnique({
        where: {
            userId
        }
    })
    if (!installation) {
        return buildDisconnectedStatus()
    }
    return { connected: true, accountLogin: installation.accountLogin, installedAt: installation.createdAt.toISOString() }
}

// save installation-> upsert query in db
export async function saveInstallation(userId: string, installationId: number) {
    const app = getGithubApp();
    // octokit ke andar request hit karenge
    const { data } = await app.octokit.request(
        "GET /app/installations/{installation_id}",
        { installation_id: installationId }
    )
    const accountLogin = getAccountLogin(data.account);
    await prisma.githubInstallation.upsert({
        where: { userId },
        create: {
            userId,
            installationId,
            accountLogin,
            accountType: data.target_type ?? null,
        },
        update: {
            installationId,
            accountLogin,
            accountType: data.target_type ?? null,
        }
    },)
}

// remove from db
export async function deleteInstallation(userId: string):Promise<void> {
    await prisma.githubInstallation.delete({ where: { userId } })
}

//Todo delete created github app from github 


export async function getUserIdByInstallationId(installationId: number):Promise<string | null>  {
    const installation = await prisma.githubInstallation.findFirst({ where: { installationId }, select: { userId: true } })
    if (!installation) {
        return null;  
    }
    return installation.userId;
}

export async function getUserInstallationId(userId:string):Promise<number | null> {
    const installation = await prisma.githubInstallation.findFirst({ where: { userId }, select: { installationId: true } })
    if (!installation) {
        return null;  
    }
    return installation.installationId;
}
