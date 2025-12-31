
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const ELECTRON_RUN_AS_NODE: string;
	export const AMENT_PREFIX_PATH: string;
	export const CHROME_DESKTOP: string;
	export const CLUTTER_IM_MODULE: string;
	export const CMAKE_PREFIX_PATH: string;
	export const CONDA_EXE: string;
	export const CONDA_PYTHON_EXE: string;
	export const CONDA_SHLVL: string;
	export const COSMIC_PANEL_ANCHOR: string;
	export const COSMIC_PANEL_BACKGROUND: string;
	export const COSMIC_PANEL_NAME: string;
	export const COSMIC_PANEL_OUTPUT: string;
	export const COSMIC_PANEL_PADDING_OVERLAP: string;
	export const COSMIC_PANEL_SIZE: string;
	export const COSMIC_PANEL_SPACING: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const DCONF_PROFILE: string;
	export const DISPLAY: string;
	export const FC_FONTATIONS: string;
	export const GDK_BACKEND: string;
	export const GSM_SKIP_SSH_AGENT_WORKAROUND: string;
	export const GTK_IM_MODULE: string;
	export const GTK_MODULES: string;
	export const GZ_CONFIG_PATH: string;
	export const GZ_SIM_RESOURCE_PATH: string;
	export const GZ_VERSION: string;
	export const HOME: string;
	export const IM_CONFIG_CHECK_ENV: string;
	export const IM_CONFIG_PHASE: string;
	export const LANG: string;
	export const LD_LIBRARY_PATH: string;
	export const LESSCLOSE: string;
	export const LESSOPEN: string;
	export const LOGNAME: string;
	export const LS_COLORS: string;
	export const MOZ_ENABLE_WAYLAND: string;
	export const NVM_BIN: string;
	export const NVM_DIR: string;
	export const NVM_INC: string;
	export const PANEL_NOTIFICATIONS_FD: string;
	export const PATH: string;
	export const PWD: string;
	export const PYENV_ROOT: string;
	export const PYENV_SHELL: string;
	export const PYTHONPATH: string;
	export const QT_ACCESSIBILITY: string;
	export const QT_AUTO_SCREEN_SCALE_FACTOR: string;
	export const QT_ENABLE_HIGHDPI_SCALING: string;
	export const QT_IM_MODULE: string;
	export const QT_QPA_PLATFORM: string;
	export const ROS_AUTOMATIC_DISCOVERY_RANGE: string;
	export const ROS_DISTRO: string;
	export const ROS_DOMAIN_ID: string;
	export const ROS_PYTHON_VERSION: string;
	export const ROS_VERSION: string;
	export const SHELL: string;
	export const SHLVL: string;
	export const SSH_AUTH_SOCK: string;
	export const TERM: string;
	export const USER: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const VSCODE_CWD: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_NLS_CONFIG: string;
	export const VSCODE_PID: string;
	export const WAYLAND_DISPLAY: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const XDG_DATA_DIRS: string;
	export const XDG_RUNTIME_DIR: string;
	export const XDG_SEAT: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XDG_SESSION_ID: string;
	export const XDG_SESSION_TYPE: string;
	export const XDG_VTNR: string;
	export const XMODIFIERS: string;
	export const X_MINIMIZE_APPLET: string;
	export const X_PRIVILEGED_WAYLAND_SOCKET: string;
	export const _: string;
	export const _CONDA_EXE: string;
	export const _CONDA_ROOT: string;
	export const _JAVA_AWT_WM_NONREPARENTING: string;
	export const VSCODE_DOTNET_INSTALL_TOOL_ORIGINAL_HOME: string;
	export const APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: string;
	export const APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: string;
	export const VSCODE_L10N_BUNDLE_LOCATION: string;
	export const CLAUDE_AGENT_SDK_VERSION: string;
	export const ELECTRON_NO_ASAR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		ELECTRON_RUN_AS_NODE: string;
		AMENT_PREFIX_PATH: string;
		CHROME_DESKTOP: string;
		CLUTTER_IM_MODULE: string;
		CMAKE_PREFIX_PATH: string;
		CONDA_EXE: string;
		CONDA_PYTHON_EXE: string;
		CONDA_SHLVL: string;
		COSMIC_PANEL_ANCHOR: string;
		COSMIC_PANEL_BACKGROUND: string;
		COSMIC_PANEL_NAME: string;
		COSMIC_PANEL_OUTPUT: string;
		COSMIC_PANEL_PADDING_OVERLAP: string;
		COSMIC_PANEL_SIZE: string;
		COSMIC_PANEL_SPACING: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		DCONF_PROFILE: string;
		DISPLAY: string;
		FC_FONTATIONS: string;
		GDK_BACKEND: string;
		GSM_SKIP_SSH_AGENT_WORKAROUND: string;
		GTK_IM_MODULE: string;
		GTK_MODULES: string;
		GZ_CONFIG_PATH: string;
		GZ_SIM_RESOURCE_PATH: string;
		GZ_VERSION: string;
		HOME: string;
		IM_CONFIG_CHECK_ENV: string;
		IM_CONFIG_PHASE: string;
		LANG: string;
		LD_LIBRARY_PATH: string;
		LESSCLOSE: string;
		LESSOPEN: string;
		LOGNAME: string;
		LS_COLORS: string;
		MOZ_ENABLE_WAYLAND: string;
		NVM_BIN: string;
		NVM_DIR: string;
		NVM_INC: string;
		PANEL_NOTIFICATIONS_FD: string;
		PATH: string;
		PWD: string;
		PYENV_ROOT: string;
		PYENV_SHELL: string;
		PYTHONPATH: string;
		QT_ACCESSIBILITY: string;
		QT_AUTO_SCREEN_SCALE_FACTOR: string;
		QT_ENABLE_HIGHDPI_SCALING: string;
		QT_IM_MODULE: string;
		QT_QPA_PLATFORM: string;
		ROS_AUTOMATIC_DISCOVERY_RANGE: string;
		ROS_DISTRO: string;
		ROS_DOMAIN_ID: string;
		ROS_PYTHON_VERSION: string;
		ROS_VERSION: string;
		SHELL: string;
		SHLVL: string;
		SSH_AUTH_SOCK: string;
		TERM: string;
		USER: string;
		VSCODE_CODE_CACHE_PATH: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		VSCODE_CWD: string;
		VSCODE_ESM_ENTRYPOINT: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_NLS_CONFIG: string;
		VSCODE_PID: string;
		WAYLAND_DISPLAY: string;
		XDG_CURRENT_DESKTOP: string;
		XDG_DATA_DIRS: string;
		XDG_RUNTIME_DIR: string;
		XDG_SEAT: string;
		XDG_SESSION_DESKTOP: string;
		XDG_SESSION_ID: string;
		XDG_SESSION_TYPE: string;
		XDG_VTNR: string;
		XMODIFIERS: string;
		X_MINIMIZE_APPLET: string;
		X_PRIVILEGED_WAYLAND_SOCKET: string;
		_: string;
		_CONDA_EXE: string;
		_CONDA_ROOT: string;
		_JAVA_AWT_WM_NONREPARENTING: string;
		VSCODE_DOTNET_INSTALL_TOOL_ORIGINAL_HOME: string;
		APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL: string;
		APPLICATIONINSIGHTS_CONFIGURATION_CONTENT: string;
		VSCODE_L10N_BUNDLE_LOCATION: string;
		CLAUDE_AGENT_SDK_VERSION: string;
		ELECTRON_NO_ASAR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
