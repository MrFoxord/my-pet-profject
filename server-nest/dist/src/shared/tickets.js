"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICKET_PRIORITY_VALUES = exports.TICKET_TYPE_VALUES = exports.TICKET_STATUS_VALUES = exports.TicketPriority = exports.TicketType = exports.TicketStatus = void 0;
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["TODO"] = "todo";
    TicketStatus["IN_PROGRESS"] = "in-progress";
    TicketStatus["DONE"] = "done";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var TicketType;
(function (TicketType) {
    TicketType["BUG"] = "bug";
    TicketType["FEATURE"] = "feature";
    TicketType["TASK"] = "task";
})(TicketType || (exports.TicketType = TicketType = {}));
var TicketPriority;
(function (TicketPriority) {
    TicketPriority["LOW"] = "low";
    TicketPriority["MEDIUM"] = "medium";
    TicketPriority["HIGH"] = "high";
    TicketPriority["CRITICAL"] = "critical";
})(TicketPriority || (exports.TicketPriority = TicketPriority = {}));
exports.TICKET_STATUS_VALUES = Object.values(TicketStatus);
exports.TICKET_TYPE_VALUES = Object.values(TicketType);
exports.TICKET_PRIORITY_VALUES = Object.values(TicketPriority);
//# sourceMappingURL=tickets.js.map