export type HandleOnCopyHandler_ = import("./HandleOnCopyHandler.mjs").HandleOnCopyHandlerOptions;
export type HandleOnCopyHandler = import("./HandleOnCopyHandler.mjs").HandleOnCopyHandler;
export type PathCopyHandler = {
    /**
     * - relative source path to `packageRoot`;
     */
    src: HandleOnCopyHandler_["src"];
    /**
     * - relative destination path from `projectRoot`;
     */
    dest: HandleOnCopyHandler_["dest"];
    on?: {
        success?: import("./HandleOnCopyHandler.mjs").HandleOnCopyHandler | undefined;
        failed?: import("./HandleOnCopyHandler.mjs").HandleOnCopyHandler | undefined;
    } | undefined;
};
