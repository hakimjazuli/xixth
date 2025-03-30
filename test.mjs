#!/usr/bin/env node
// @ts-check

import { xixth } from 'xixth';

new xixth({
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
