// swift-tools-version: 6.2
// Package manifest for the Lala macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "Lala",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "LalaIPC", targets: ["LalaIPC"]),
        .library(name: "LalaDiscovery", targets: ["LalaDiscovery"]),
        .executable(name: "Lala", targets: ["Lala"]),
        .executable(name: "lala-mac", targets: ["LalaMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.3.0"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/LalaKit"),
        .package(path: "../../packages/Swabble"),
    ],
    targets: [
        .target(
            name: "LalaIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "LalaDiscovery",
            dependencies: [
                .product(name: "LalaKit", package: "LalaKit"),
            ],
            path: "Sources/LalaDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "Lala",
            dependencies: [
                "LalaIPC",
                "LalaDiscovery",
                .product(name: "LalaKit", package: "LalaKit"),
                .product(name: "LalaChatUI", package: "LalaKit"),
                .product(name: "LalaProtocol", package: "LalaKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/Lala.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "LalaMacCLI",
            dependencies: [
                "LalaDiscovery",
                .product(name: "LalaKit", package: "LalaKit"),
                .product(name: "LalaProtocol", package: "LalaKit"),
            ],
            path: "Sources/LalaMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "LalaIPCTests",
            dependencies: [
                "LalaIPC",
                "Lala",
                "LalaDiscovery",
                .product(name: "LalaProtocol", package: "LalaKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
