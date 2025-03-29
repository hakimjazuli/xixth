export class getFlags {
    /**
     * @typedef {import('../index.mjs').FlagEntry} FlagEntry
     */
    /**
     * Parses command-line arguments into a Set<{name, value}>
     * @private
     * @returns {FlagEntry}
     */
    private static parseArgs;
    /**
     * @private
     * @type {null|FlagEntry}
     */
    private static flags_;
    /**
     * @type {FlagEntry}
     */
    static get flags(): import("../index.mjs").FlagEntry;
}
