import type {
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionStaticUpgradeScript,
	CompanionUpgradeContext,
} from '@companion-module/base'
import type { ModuleConfig, ModuleSecrets } from './config.js'

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig, ModuleSecrets>[] = [
	/*
	 * Place your upgrade scripts here
	 * Remember that once it has been added it cannot be removed!
	 */
	// The station token moves from the plain config into the secrets store (kept out of exports).
	function (
		_context: CompanionUpgradeContext<ModuleConfig>,
		props: CompanionStaticUpgradeProps<ModuleConfig, ModuleSecrets>,
	): CompanionStaticUpgradeResult<ModuleConfig, ModuleSecrets> {
		const token = props.config?.token
		if (!props.config || !token) return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
		const { token: _moved, ...config } = props.config
		return {
			updatedConfig: config,
			updatedSecrets: { ...(props.secrets ?? {}), token },
			updatedActions: [],
			updatedFeedbacks: [],
		}
	},
	// Configs from before cue labels existed have no value, which the module treats as on but the
	// settings window shows as off. Save it as on so the switch matches what the module does.
	function (
		_context: CompanionUpgradeContext<ModuleConfig>,
		props: CompanionStaticUpgradeProps<ModuleConfig, ModuleSecrets>,
	): CompanionStaticUpgradeResult<ModuleConfig, ModuleSecrets> {
		if (!props.config || props.config.sendCueLabels !== undefined)
			return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
		return { updatedConfig: { ...props.config, sendCueLabels: true }, updatedActions: [], updatedFeedbacks: [] }
	},
]
