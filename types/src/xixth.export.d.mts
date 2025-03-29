/**
 * @description
 * how to use:
 * - create your `setupFile`
 * ```js
 * // setupFile.mjs
 * #!/usr/bin/env node
 * // @ts-check
 * import { xixth } from 'xixth';
 *
 * new xixth({ ...flagKeys:{src:'path', dest:'path'} });
 * ```
 * - flagKeys are identifier for the user to overwrite its `dest` path with their own `custom path`;
 * - example:
 * ```js
 * // setupFile.mjs
 * #!/usr/bin/env node
 * // @ts-check
 * import { xixth } from 'xixth';
 *
 * new xixth({ devs:{src:'dev', dest:'default_dev'} });
 * ```
 * >- by calling:
 * ```shell
 * // using binary with bin object setting
 * npx your-package-name -devs custom_dev
 * // OR
 * // using postInstall with scripts object setting
 * npm i your-package-name -devs custom_dev
 * ```
 * >- will overwrite user `devs.dest` with `"custom_dev"`
 */
export class xixth {
    static __dirname: string;
    /**
     * @param {string} relativePath
     * @returns {string}
     */
    static absolutePath: (relativePath: string) => string;
    /** @typedef {{ name: string, value: string }} FlagEntry */
    /**
     * Parses command-line arguments into a Set<{name, value}>
     * @returns {Set<FlagEntry>}
     */
    static parseArgs: () => Set<{
        name: string;
        value: string;
    }>;
    /**
     * @param {string} src
     * @param {string} dest
     */
    static copyFiles: (src: string, dest: string) => Promise<void>;
    /**
     * @param {Object} options
     * @param {{[key:string]:{src:string, dest:string}}} options.pathCopyHandler
     * - export relativePath to project root, works for dirs and files alike;
     */
    constructor(options: {
        pathCopyHandler: {
            [key: string]: {
                src: string;
                dest: string;
            };
        };
    });
    /**
     * @private
     */
    private options;
    run: () => Promise<void>;
}
