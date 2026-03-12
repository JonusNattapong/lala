import CoreLocation
import Foundation
import LalaKit
import UIKit

typealias LalaCameraSnapResult = (format: String, base64: String, width: Int, height: Int)
typealias LalaCameraClipResult = (format: String, base64: String, durationMs: Int, hasAudio: Bool)

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: LalaCameraSnapParams) async throws -> LalaCameraSnapResult
    func clip(params: LalaCameraClipParams) async throws -> LalaCameraClipResult
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: LalaLocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: LalaLocationGetParams,
        desiredAccuracy: LalaLocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: LalaLocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

@MainActor
protocol DeviceStatusServicing: Sendable {
    func status() async throws -> LalaDeviceStatusPayload
    func info() -> LalaDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: LalaPhotosLatestParams) async throws -> LalaPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: LalaContactsSearchParams) async throws -> LalaContactsSearchPayload
    func add(params: LalaContactsAddParams) async throws -> LalaContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: LalaCalendarEventsParams) async throws -> LalaCalendarEventsPayload
    func add(params: LalaCalendarAddParams) async throws -> LalaCalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: LalaRemindersListParams) async throws -> LalaRemindersListPayload
    func add(params: LalaRemindersAddParams) async throws -> LalaRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: LalaMotionActivityParams) async throws -> LalaMotionActivityPayload
    func pedometer(params: LalaPedometerParams) async throws -> LalaPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: LalaWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
