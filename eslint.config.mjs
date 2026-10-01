import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const config = await generateEslintConfig({
	enableTypescript: true,
})

export default [
	...config,
	{
		// The API client's return types are inferred from each call's generic; spelling them out twice adds nothing.
		rules: { '@typescript-eslint/explicit-module-boundary-types': 'off' },
	},
]
