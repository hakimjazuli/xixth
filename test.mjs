#!/usr/bin/env node
// @ts-check

import { Xixth } from 'xixth';
import { Paths } from 'vivth';

new Paths({
	root: process?.env?.INIT_CWD ?? process?.cwd(),
});
new Xixth({
	packageName: 'xixth',
	pathCopyHandlers: { testflag: { src: 'test-copy', dest: 'test-paste' } },
	flagCallbacks: {
		async beforeCopy(flags) {
			console.log(flags);
			console.log('beforeCopy');
		},
		async afterCopy(flags) {
			console.log(flags);
			console.log('afterCopy');
		},
	},
});
