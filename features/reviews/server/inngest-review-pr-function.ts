import { inngest } from "@/features/inngest/client";
import { prisma } from "@/lib/db";
import { chunkPrFiles } from "../utils/chunk-code";
import { formatPrFilesForReview, getPullRequestFiles } from "./pr-files";
import { generateReview } from "./generate-review";

export const reviewPullRequest=inngest.createFunction(
    {id:"review-pull-request",triggers:{event:"github/pr.received"}},
    async({event,step})=>{
        // 
        const pullRequestId=event.data.pullRequestId

        // mark status of pullRequest as processing
        const pullRequest=await step.run("mark-processing",async()=>{
            return prisma.pullRequest.update({
                where:{
                    id:pullRequestId
                },
                data:{
                    status:"processing"
                }
            })
        })

        // const chunks=await step.run("breakdown-code",async()=>{
        //     const files=await getPullRequestFiles(
        //         pullRequest.installationId,
        //         pullRequest.repoFullName,
        //         pullRequest.prNumber
        //     )
        //     return chunkPrFiles(pullRequest.prNumber,files)
        // })
        // if (chunks.length===0) {
        //     await step.run("mark-reviewed-no-code",async()=>{
        //         await prisma.pullRequest.update({
        //             where:{id:pullRequestId},
        //             data:{status:"reviewed"}
        //         })
        //     })
        //     return {pullRequestId,status:"reviewed",reason:"no code to review"}
        // }
         // TODO: PR namespace isolates this diff from other file and from repo-wide sync data (add for pinecone db)
        // await step.sleep("wait-for-vectors-to-index","10s")

        const diff = await step.run("fetch-pr-diff", async () => {
            const files = await getPullRequestFiles(
                pullRequest.installationId,
                pullRequest.repoFullName,
                pullRequest.prNumber
            );

            return formatPrFilesForReview(files);
        });

        if (!diff.trim()) {
            await step.run("mark-reviewed-no-code", async () => {
                await prisma.pullRequest.update({
                    where: { id: pullRequestId },
                    data: { status: "reviewed" },
                });
            });

            return { pullRequestId, status: "reviewed", reason: "no code to review" };
        }

        const review=await step.run("generate-ai-review",async()=>{
            return generateReview({
                repoFullName:pullRequest.repoFullName,
                title:pullRequest.title
            })
        })
        await step.run("post-pr-comment",async()=>{
            await postPrComment(
                pullRequest.installationId,
                pullRequest.repoFullName,
                pullRequest.prNumber,
                review
            )
        })

        await step.run("mark-as-reviewed",async()=>{
            await prisma.pullRequest.update({
                where:{id:pullRequestId},
                data:{
                    status:"reviewed",
                    reviewComment:review,
                    reviewedAt:new Date(),
                }
            })
        })
        return {pullRequestId,status:"reviewed"}
    }
)