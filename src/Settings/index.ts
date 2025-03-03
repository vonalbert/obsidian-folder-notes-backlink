export interface Settings {
	propertyName: string;
}

export const DEFAULT_SETTINGS: Settings = {
	propertyName: 'parent'
}

export interface SettingsProvider {
	settings: Settings;
}
