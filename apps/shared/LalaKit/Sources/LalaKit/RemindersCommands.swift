import Foundation

public enum LalaRemindersCommand: String, Codable, Sendable {
    case list = "reminders.list"
    case add = "reminders.add"
}

public enum LalaReminderStatusFilter: String, Codable, Sendable {
    case incomplete
    case completed
    case all
}

public struct LalaRemindersListParams: Codable, Sendable, Equatable {
    public var status: LalaReminderStatusFilter?
    public var limit: Int?

    public init(status: LalaReminderStatusFilter? = nil, limit: Int? = nil) {
        self.status = status
        self.limit = limit
    }
}

public struct LalaRemindersAddParams: Codable, Sendable, Equatable {
    public var title: String
    public var dueISO: String?
    public var notes: String?
    public var listId: String?
    public var listName: String?

    public init(
        title: String,
        dueISO: String? = nil,
        notes: String? = nil,
        listId: String? = nil,
        listName: String? = nil)
    {
        self.title = title
        self.dueISO = dueISO
        self.notes = notes
        self.listId = listId
        self.listName = listName
    }
}

public struct LalaReminderPayload: Codable, Sendable, Equatable {
    public var identifier: String
    public var title: String
    public var dueISO: String?
    public var completed: Bool
    public var listName: String?

    public init(
        identifier: String,
        title: String,
        dueISO: String? = nil,
        completed: Bool,
        listName: String? = nil)
    {
        self.identifier = identifier
        self.title = title
        self.dueISO = dueISO
        self.completed = completed
        self.listName = listName
    }
}

public struct LalaRemindersListPayload: Codable, Sendable, Equatable {
    public var reminders: [LalaReminderPayload]

    public init(reminders: [LalaReminderPayload]) {
        self.reminders = reminders
    }
}

public struct LalaRemindersAddPayload: Codable, Sendable, Equatable {
    public var reminder: LalaReminderPayload

    public init(reminder: LalaReminderPayload) {
        self.reminder = reminder
    }
}
