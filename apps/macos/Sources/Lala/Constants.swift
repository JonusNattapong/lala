import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-lala writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.lala.mac"
let gatewayLaunchdLabel = "ai.lala.gateway"
let onboardingVersionKey = "lala.onboardingVersion"
let onboardingSeenKey = "lala.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "lala.pauseEnabled"
let iconAnimationsEnabledKey = "lala.iconAnimationsEnabled"
let swabbleEnabledKey = "lala.swabbleEnabled"
let swabbleTriggersKey = "lala.swabbleTriggers"
let voiceWakeTriggerChimeKey = "lala.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "lala.voiceWakeSendChime"
let showDockIconKey = "lala.showDockIcon"
let defaultVoiceWakeTriggers = ["lala"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "lala.voiceWakeMicID"
let voiceWakeMicNameKey = "lala.voiceWakeMicName"
let voiceWakeLocaleKey = "lala.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "lala.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "lala.voicePushToTalkEnabled"
let talkEnabledKey = "lala.talkEnabled"
let iconOverrideKey = "lala.iconOverride"
let connectionModeKey = "lala.connectionMode"
let remoteTargetKey = "lala.remoteTarget"
let remoteIdentityKey = "lala.remoteIdentity"
let remoteProjectRootKey = "lala.remoteProjectRoot"
let remoteCliPathKey = "lala.remoteCliPath"
let canvasEnabledKey = "lala.canvasEnabled"
let cameraEnabledKey = "lala.cameraEnabled"
let systemRunPolicyKey = "lala.systemRunPolicy"
let systemRunAllowlistKey = "lala.systemRunAllowlist"
let systemRunEnabledKey = "lala.systemRunEnabled"
let locationModeKey = "lala.locationMode"
let locationPreciseKey = "lala.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "lala.peekabooBridgeEnabled"
let deepLinkKeyKey = "lala.deepLinkKey"
let modelCatalogPathKey = "lala.modelCatalogPath"
let modelCatalogReloadKey = "lala.modelCatalogReload"
let cliInstallPromptedVersionKey = "lala.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "lala.heartbeatsEnabled"
let debugPaneEnabledKey = "lala.debugPaneEnabled"
let debugFileLogEnabledKey = "lala.debug.fileLogEnabled"
let appLogLevelKey = "lala.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
