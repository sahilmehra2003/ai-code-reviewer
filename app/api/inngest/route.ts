import { serve } from "inngest/next";
import { inngest } from "@/features/inngest/client";
import { processTask } from "./function";
import { reviewPullRequest } from "@/features/reviews/server/inngest-review-pr-function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processTask,reviewPullRequest],
});