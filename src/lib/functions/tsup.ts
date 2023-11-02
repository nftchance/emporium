import dedent from 'dedent'
import { execa } from 'execa'
import { default as fs } from 'fs-extra'
import path from 'path'
import type { Format, Options } from 'tsup'

type GetConfig = Omit<
	Options,
	'bundle' | 'clean' | 'dts' | 'entry' | 'format'
> & {
	entry?: string[]
	dev?: boolean
	noExport?: string[]
}

export function getConfig({ dev, noExport, ...options }: GetConfig): Options {
	if (!options.entry?.length) throw new Error('entry is required')
	const entry: string[] = options.entry ?? []

	// Hacks tsup to create Preconstruct-like linked packages for development
	// https://github.com/preconstruct/preconstruct
	if (dev) {
		const entry: string[] = options.entry ?? []
		const formats = process.env.FORMAT
			? [process.env.FORMAT as Format]
			: ['esm' as Format, 'cjs' as Format]

		return {
			clean: true,
			// Only need to generate one file with tsup for development since we will create links in `onSuccess`
			entry: [entry[0] as string],
			format: formats,
			silent: true,
			async onSuccess() {
				// remove all files in dist
				await fs.emptyDir('dist')
				// symlink files and type definitions
				for (const file of entry) {
					const filePath = path.resolve(file)
					const distSourceFile = filePath
						.replace(file, file.replace('src/', 'dist/'))
						.replace(/\.ts$/, '.js')
					// Make sure directory exists
					await fs.ensureDir(path.dirname(distSourceFile))
					// Create symlink between source and dist file
					await fs.symlink(filePath, distSourceFile, 'file')
					// Create file linking up type definitions
					const srcTypesFile = path
						.relative(path.dirname(distSourceFile), filePath)
						.replace(/\.ts$/, '')
					await fs.outputFile(
						distSourceFile.replace(/\.js$/, '.d.ts'),
						`export * from '${srcTypesFile}'`
					)
				}
				const exports = await generateExports(entry, noExport)
				await generateProxyPackages(exports)
			}
		}
	}

	const formats = process.env.FORMAT
		? [process.env.FORMAT as Format]
		: ['esm' as Format, 'cjs' as Format]

	return {
		bundle: true,
		clean: true,
		dts: true,
		format: formats,
		splitting: true,
		target: 'es2021',
		async onSuccess() {
			if (typeof options.onSuccess === 'function')
				await options.onSuccess()
			else if (typeof options.onSuccess === 'string')
				execa(options.onSuccess)

			const exports = await generateExports(entry, noExport)
			await generateProxyPackages(exports)
		},
		...options
	}
}

type Exports = {
	[key: string]: string | { types?: string; default: string }
}

/**
 * Generate exports from entry files
 */
async function generateExports(entry: string[], noExport?: string[]) {
	const exports: Exports = {}
	for (const file of entry) {
		if (noExport?.includes(file)) continue
		const extension = path.extname(file)
		const fileWithoutExtension = file.replace(extension, '')
		const name = fileWithoutExtension
			.replace(/^src\//g, '')
			.replace(/\/index$/, '')
		const distSourceFile = `${fileWithoutExtension.replace(
			/^src\//g,
			'./dist/'
		)}.js`
		const distTypesFile = `${fileWithoutExtension.replace(
			/^src\//g,
			'./dist/'
		)}.d.ts`
		exports[name] = {
			types: distTypesFile,
			default: distSourceFile
		}
	}

	exports['package.json'] = './package.json'

	const packageJson = await fs.readJSON('package.json')
	packageJson.exports = exports
	await fs.writeFile(
		'package.json',
		JSON.stringify(packageJson, null, 2) + '\n'
	)

	return exports
}

/**
 * Generate proxy packages files for each export
 */
async function generateProxyPackages(exports: Exports) {
	const ignorePaths = []
	const files = new Set<string>()
	for (const [key, value] of Object.entries(exports)) {
		if (typeof value === 'string') continue
		if (key === '.') continue
		if (!value.default) continue
		await fs.ensureDir(key)
		const entrypoint = path.relative(key, value.default)
		const fileExists = await fs.pathExists(value.default)
		if (!fileExists)
			throw new Error(
				`Proxy package "${key}" entrypoint "${entrypoint}" does not exist.`
			)

		await fs.outputFile(
			`${key}/package.json`,
			dedent`{
        "type": "module",
        "main": "${entrypoint}"
      }`
		)
		ignorePaths.push('/' + key.replace(/^\.\//g, ''))

		const file = key.replace(/^\.\//g, '').split('/')[0]
		if (!file || files.has(file)) continue
		files.add(`/${file}`)
	}

	files.add('/dist')
	const packageJson = await fs.readJSON('package.json')
	packageJson.files = [...files.values()]
	await fs.writeFile(
		'package.json',
		JSON.stringify(packageJson, null, 2) + '\n'
	)

	if (ignorePaths.length === 0) return
	await fs.outputFile(
		'.gitignore',
		dedent`
# Generated file. Do not edit directly.
# Based on https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore

# Logs

logs
_.log
npm-debug.log_
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)

report.[0-9]_.[0-9]_.[0-9]_.[0-9]_.json

# Runtime data

pids
_.pid
_.seed
\*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover

lib-cov

# Coverage directory used by tools like istanbul

coverage
\*.lcov

# nyc test coverage

.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)

.grunt

# Bower dependency directory (https://bower.io/)

bower_components

# node-waf configuration

.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)

build/Release

# Dependency directories

node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)

web_modules/

# TypeScript cache

\*.tsbuildinfo

# Optional npm cache directory

.npm

# Optional eslint cache

.eslintcache

# Optional stylelint cache

.stylelintcache

# Microbundle cache

.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history

.node_repl_history

# Output of 'npm pack'

\*.tgz

# Yarn Integrity file

.yarn-integrity

# dotenv environment variable files

.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)

.cache
.parcel-cache

# Next.js build output

.next
out

# Nuxt.js build / generate output

.nuxt
dist

# Gatsby files

.cache/

# Comment in the public line in if your project uses Gatsby and not Next.js

# https://nextjs.org/blog/next-9-1#public-directory-support

# public

# vuepress build output

.vuepress/dist

# vuepress v2.x temp and cache directory

.temp
.cache

# Docusaurus cache and generated files

.docusaurus

# Serverless directories

.serverless/

# FuseBox cache

.fusebox/

# DynamoDB Local files

.dynamodb/

# TernJS port file

.tern-port

# Stores VSCode versions used for testing VSCode extensions

.vscode-test

# yarn v2

.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.\*

node_modules
.env
dist/
coverage
coverage.json
typechain
typechain-types

# Hardhat files
cache
artifacts

    ${ignorePaths.join('/**\n')}/**
  `
	)
}
