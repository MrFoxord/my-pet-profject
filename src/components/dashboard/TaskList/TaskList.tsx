"use client";

import { Task, TaskListProps } from "@/types";
import TaskItem from "./TaskItem";
import {useState} from "react";

export default function TaskList({ tasks }: TaskListProps) {
    const [taskList, setTaskList] = useState(tasks);

    const handleStatusChange = (id: string, newStatus: Task["status"]) => {
        setTaskList(prev => 
            prev.map(task =>(task.id === id ? {...task,status: newStatus} : task))
        );
    };
    return (
        <div>
            {taskList.map((task)=> (
                <TaskItem key={task.id} task={task} onStatusChange={handleStatusChange}/>
            ))}
        </div>
    );
}