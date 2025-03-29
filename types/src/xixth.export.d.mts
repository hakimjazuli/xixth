/**
 * @description
 * how to use:
 * - create your `setupFile`
 * ```js
 * // setupFile.mjs
 * // @ts-check
 * import { xixth } from 'xixth';
 * new xixth({ dirs:[...relativeDirPaths], files:[...relativeFilePaths] });
 * ```
 * that's it...
 */
export class xixth {
    static __dirname: string;
    /**
     * @param {string} relativePath
     * @returns {string}
     */
    static absolutePath: (relativePath: string) => string;
    /**
     * @param {string} src
     * @param {string} dest
     */
    static copyFiles: (src: string, dest: string) => Promise<void>;
    /**
     * @param {Object} options
     * @param {{src:string, dest:string}[]|false} [options.dirs]
     * - export dirs relative to project root
     * @param {{src:string, dest:string}[]|false} [options.files]
     * - export files relative to project root
     */
    constructor(options: {
        dirs?: {
            src: string;
            dest: string;
        }[] | false;
        files?: {
            src: string;
            dest: string;
        }[] | false;
    });
    /**
     * @private
     */
    private options;
    run: () => void;
}
