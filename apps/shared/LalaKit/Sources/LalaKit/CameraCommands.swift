import Foundation

public enum LalaCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum LalaCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum LalaCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum LalaCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct LalaCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: LalaCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: LalaCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: LalaCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: LalaCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct LalaCameraClipParams: Codable, Sendable, Equatable {
    public var facing: LalaCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: LalaCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: LalaCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: LalaCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
