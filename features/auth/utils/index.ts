export const SIGN_IN_PATH="/sign-in";
export const DEFAULT_AUTH_CALLBACK="/dashboard";

export function getSafeCallbackPath(
    callbackURL: string | null | undefined
):string{
    if (callbackURL?.startsWith("/") && !callbackURL.startsWith("//")) {
        return callbackURL
    }
    return DEFAULT_AUTH_CALLBACK
}