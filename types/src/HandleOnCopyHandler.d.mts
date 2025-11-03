export type HandleOnCopyHandlerOptions = {
    /**
     * - relative source path to `packageRoot`;
     */
    src: string;
    /**
     * - relative destination path from `projectRoot`;
     */
    dest: string;
};
export type HandleOnCopyHandler = (options: HandleOnCopyHandlerOptions) => Promise<void>;
