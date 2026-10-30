import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import { keyStyle } from './brand.js'
import { FALLBACK_PRIORITIES, moduleDropdown, perModuleChoices, type ModuleId } from './choices.js'
import type { NotesListInstance } from './main.js'

export function UpdateFeedbacks(self: NotesListInstance): void {
	const feedbacks: CompanionFeedbackDefinitions = {
		outstanding_above: {
			type: 'boolean',
			name: 'Outstanding count above threshold',
			description: 'Turns the key red while the chosen module has more outstanding notes than the threshold.',
			defaultStyle: { bgcolor: combineRgb(220, 38, 38), color: combineRgb(255, 255, 255) },
			options: [
				moduleDropdown('work'),
				{ type: 'number', id: 'threshold', label: 'More than', default: 0, min: 0, max: 9999 },
			],
			callback: (fb) => self.counts[fb.options.module as ModuleId] > Number(fb.options.threshold ?? 0),
		},
		type_color: {
			type: 'advanced',
			name: 'Colour key by note type (matches the chip in the app)',
			description: "Colours the key with the chosen note type's colour in the show, as the chip shows it in the app.",
			options: [moduleDropdown(), ...perModuleChoices('type', 'Type', (m) => self.options?.[m]?.types ?? [], '')],
			callback: (fb) => {
				const mod = fb.options.module as ModuleId
				const opt = (self.options?.[mod]?.types ?? []).find((t) => t.value === fb.options[`type_${mod}`])
				return opt?.color ? keyStyle(opt.color) : {}
			},
		},
		priority_color: {
			type: 'advanced',
			name: 'Colour key by priority (matches the chip in the app)',
			description: "Colours the key with the chosen priority's colour in the show, as the chip shows it in the app.",
			options: [
				moduleDropdown(),
				...perModuleChoices(
					'priority',
					'Priority',
					(m) => self.options?.[m]?.priorities ?? FALLBACK_PRIORITIES,
					'medium',
				),
			],
			callback: (fb) => {
				const mod = fb.options.module as ModuleId
				const opt = (self.options?.[mod]?.priorities ?? []).find((p) => p.value === fb.options[`priority_${mod}`])
				return opt?.color ? keyStyle(opt.color) : {}
			},
		},
		selected_cue_off_live: {
			type: 'boolean',
			name: 'Selected cue is not the live cue',
			description: 'Turns the key amber while the selected cue has been stepped away from the live cue.',
			defaultStyle: { bgcolor: combineRgb(245, 158, 11), color: combineRgb(0, 0, 0) },
			options: [],
			callback: () => self.isOffLive(),
		},
		selected_cue_on_live: {
			type: 'boolean',
			name: 'Selected cue is the live cue (desk connected)',
			description: 'Turns the key green while the selected cue follows the live cue of a connected Eos desk.',
			defaultStyle: { bgcolor: combineRgb(0, 70, 0), color: combineRgb(255, 255, 255) },
			options: [],
			callback: () => self.isOnLive(),
		},
		eos_connected: {
			type: 'boolean',
			name: 'Eos desk connected (read-only reader)',
			description: 'Turns the key green while the module is connected to the Eos desk.',
			defaultStyle: { bgcolor: combineRgb(22, 163, 74), color: combineRgb(255, 255, 255) },
			options: [],
			callback: () => self.eosConnected,
		},
		connected: {
			type: 'boolean',
			name: 'Connected',
			description: 'Turns the key green while the station is paired and The Notes List server answers.',
			defaultStyle: { bgcolor: combineRgb(22, 163, 74), color: combineRgb(255, 255, 255) },
			options: [],
			callback: () => self.connected,
		},
	}
	self.setFeedbackDefinitions(feedbacks)
}
