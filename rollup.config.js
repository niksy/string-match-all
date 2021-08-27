'use strict';

const path = require('path');
const { promises: fs } = require('fs');
const { default: resolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { default: babel } = require('@rollup/plugin-babel');
const babelCore = require('@babel/core');
const execa = require('execa');

const transpileDependencies = babel({
	include: 'node_modules/clone-regexp/**',
	babelHelpers: process.env.BABEL_ENV === 'test' ? 'runtime' : 'bundled',
	babelrc: false,
	configFile: path.resolve(__dirname, '.babelrc')
});
transpileDependencies.name = 'babel-transpileDependencies';

module.exports = {
	input: 'index.js',
	output: [
		{
			file: 'cjs/index.js',
			format: 'cjs',
			exports: 'named',
			sourcemap: true
		},
		{
			file: 'esm/index.js',
			format: 'esm',
			exports: 'named',
			sourcemap: true
		}
	],
	plugins: [
		(() => {
			return {
				name: 'types',
				async writeBundle(output) {
					let prefix;
					if (output.file.includes('cjs/')) {
						prefix = 'cjs';
					} else if (output.file.includes('esm/')) {
						prefix = 'esm';
					}
					if (typeof prefix !== 'undefined') {
						const tsconfig = {
							extends: './tsconfig',
							exclude: ['test/**/*.js'],
							compilerOptions: {
								declaration: true,
								declarationMap: true,
								declarationDir: prefix,
								emitDeclarationOnly: true,
								noEmit: false,
								listEmittedFiles: true
							}
						};
						const file = `.${prefix}.tsconfig.json`;
						try {
							await fs.writeFile(
								file,
								JSON.stringify(tsconfig),
								'utf-8'
							);
							const { stdout } = await execa(
								'tsc',
								['-p', file],
								{
									preferLocal: true
								}
							);
							console.log(stdout);
						} finally {
							await fs.unlink(file);
						}
					}
				}
			};
		})(),
		(() => {
			return {
				name: 'package-type',
				async writeBundle(output) {
					let prefix, type;
					if (output.file.includes('cjs/')) {
						prefix = 'cjs';
						type = 'commonjs';
					} else if (output.file.includes('esm/')) {
						prefix = 'esm';
						type = 'module';
					}
					if (typeof prefix !== 'undefined') {
						const package_ = path.join(prefix, 'package.json');
						try {
							await fs.unlink(package_);
						} catch (error) {}
						await fs.writeFile(
							package_,
							JSON.stringify({ type }),
							'utf8'
						);
					}
				}
			};
		})(),
		babel({
			babelHelpers: 'bundled',
			exclude: 'node_modules/**'
		}),
		transpileDependencies,
		resolve(),
		commonjs(),
		{
			async transform(code, id) {
				if (id.includes('@ungap/array-iterator')) {
					const result = await babelCore.transformAsync(code, {
						sourceMaps: true,
						plugins: [
							babelCore.createConfigItem(({ types: t }) => {
								return {
									visitor: {
										MemberExpression(path) {
											if (
												path.matchesPattern(
													'Symbol.iterator'
												)
											) {
												path.replaceWith(
													t.numericLiteral(0)
												);
											}
										}
									}
								};
							})
						]
					});
					return {
						code: result.code,
						map: result.map
					};
				}
				return {
					code: code,
					map: null
				};
			}
		}
	]
};
