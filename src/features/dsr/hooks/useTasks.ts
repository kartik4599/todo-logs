import { useState } from "react";
import type { TasksState } from "../types";

const initialTasks: TasksState = {
  incompletePrevious: ["", "", ""],
  newTasks: ["", "", ""],
  activitiesPerformed: ["", "", ""],
  incompleteEndOfDay: ["", "", ""],
};

export function useTasks() {
  const [tasks, setTasks] = useState<TasksState>(initialTasks);

  const updateTask = (
    category: keyof TasksState,
    index: number,
    value: string,
  ) => {
    setTasks((prev) => ({
      ...prev,
      [category]: prev[category].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addTask = (category: keyof TasksState) => {
    setTasks((prev) => ({
      ...prev,
      [category]: [...prev[category], ""],
    }));
  };

  const removeTask = (category: keyof TasksState, index: number) => {
    if (tasks[category].length > 1) {
      setTasks((prev) => ({
        ...prev,
        [category]: prev[category].filter((_, i) => i !== index),
      }));
    }
  };

  const resetTasks = () => {
    setTasks(initialTasks);
  };

  return {
    tasks,
    updateTask,
    addTask,
    removeTask,
    resetTasks,
  };
}
