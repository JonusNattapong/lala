import Foundation
import SwabbleKit
import Testing
@testable import Lala

private let lalaTranscript = "hey lala do thing"

private func lalaSegments(postTriggerStart: TimeInterval) -> [WakeWordSegment] {
    makeSegments(
        transcript: lalaTranscript,
        words: [
            ("hey", 0.0, 0.1),
            ("lala", 0.2, 0.1),
            ("do", postTriggerStart, 0.1),
            ("thing", postTriggerStart + 0.2, 0.1),
        ])
}

@Suite struct VoiceWakeManagerExtractCommandTests {
    @Test func extractCommandReturnsNilWhenNoTriggerFound() {
        let transcript = "hello world"
        let segments = makeSegments(
            transcript: transcript,
            words: [("hello", 0.0, 0.1), ("world", 0.2, 0.1)])
        #expect(VoiceWakeManager.extractCommand(from: transcript, segments: segments, triggers: ["lala"]) == nil)
    }

    @Test func extractCommandTrimsTokensAndResult() {
        let segments = lalaSegments(postTriggerStart: 0.9)
        let cmd = VoiceWakeManager.extractCommand(
            from: lalaTranscript,
            segments: segments,
            triggers: ["  lala  "],
            minPostTriggerGap: 0.3)
        #expect(cmd == "do thing")
    }

    @Test func extractCommandReturnsNilWhenGapTooShort() {
        let segments = lalaSegments(postTriggerStart: 0.35)
        let cmd = VoiceWakeManager.extractCommand(
            from: lalaTranscript,
            segments: segments,
            triggers: ["lala"],
            minPostTriggerGap: 0.3)
        #expect(cmd == nil)
    }

    @Test func extractCommandReturnsNilWhenNothingAfterTrigger() {
        let transcript = "hey lala"
        let segments = makeSegments(
            transcript: transcript,
            words: [("hey", 0.0, 0.1), ("lala", 0.2, 0.1)])
        #expect(VoiceWakeManager.extractCommand(from: transcript, segments: segments, triggers: ["lala"]) == nil)
    }

    @Test func extractCommandIgnoresEmptyTriggers() {
        let segments = lalaSegments(postTriggerStart: 0.9)
        let cmd = VoiceWakeManager.extractCommand(
            from: lalaTranscript,
            segments: segments,
            triggers: ["", "   ", "lala"],
            minPostTriggerGap: 0.3)
        #expect(cmd == "do thing")
    }
}

private func makeSegments(
    transcript: String,
    words: [(String, TimeInterval, TimeInterval)])
-> [WakeWordSegment] {
    var searchStart = transcript.startIndex
    var output: [WakeWordSegment] = []
    for (word, start, duration) in words {
        let range = transcript.range(of: word, range: searchStart..<transcript.endIndex)
        output.append(WakeWordSegment(text: word, start: start, duration: duration, range: range))
        if let range { searchStart = range.upperBound }
    }
    return output
}
