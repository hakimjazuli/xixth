export type AddBinRegisterReferenceOptions = {
    /**
     * - base name for the script;
     * - will be added to `package.json.bin`;
     */
    baseName: string;
    /**
     * - file name with extentionName;
     * - can also be nested inside folder;
     */
    relativeFilePathFromProject: string;
    /**
     * - default, `true`: register `binScriptName` to `package.json.bin`;
     * - `false`: do nothing;
     */
    registerBin?: boolean | undefined;
    /**
     * - default, `false`: does nothing;
     * - `string`: add `scripts.${binScriptName}`:`${stringifiedScript}`
     */
    stringifiedScript?: string | false | undefined;
    /**
     * - default, `false`: does nothing;
     * - `string`: add `scripts.${binScriptName}-exe`:`${stringifiedExec}`
     */
    stringifiedExec?: string | false | undefined;
};
