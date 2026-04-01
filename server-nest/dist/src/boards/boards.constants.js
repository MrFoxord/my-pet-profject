"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICKET_TYPE_VALUES = exports.TICKET_STATUS_VALUES = exports.TICKET_PRIORITY_VALUES = exports.DEFAULT_ASSIGNEE = exports.DEFAULT_THEME_COLOR = void 0;
exports.DEFAULT_THEME_COLOR = '#f3f4f6';
exports.DEFAULT_ASSIGNEE = {
    name: 'Unassigned',
    avatar: 'https://i.pravatar.cc/100?img=1',
};
var tickets_1 = require("../shared/tickets");
Object.defineProperty(exports, "TICKET_PRIORITY_VALUES", { enumerable: true, get: function () { return tickets_1.TICKET_PRIORITY_VALUES; } });
Object.defineProperty(exports, "TICKET_STATUS_VALUES", { enumerable: true, get: function () { return tickets_1.TICKET_STATUS_VALUES; } });
Object.defineProperty(exports, "TICKET_TYPE_VALUES", { enumerable: true, get: function () { return tickets_1.TICKET_TYPE_VALUES; } });
//# sourceMappingURL=boards.constants.js.map