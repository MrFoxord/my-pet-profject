export interface test {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
    dueDate: string;
    assignedTo: string;
}