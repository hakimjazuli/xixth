#!/usr/bin/env node
// @ts-check

import { Xixth } from 'xixth';

import { AddBin } from './src/AddBin.mjs';

new Xixth({
	packageName: 'xixth',
	flagCallbacks: {
		async beforeCopy({
			n: scriptName = 'my-package-new-bin',
			f: fileName = 'my-package-new-bin.mjs',
		}) {
			await AddBin.new(scriptName, fileName);
		},
	},
});
