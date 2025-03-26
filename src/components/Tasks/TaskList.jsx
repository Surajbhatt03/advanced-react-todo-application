import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TaskItem from './TaskItem';
import '../../styles/TaskList.css';

const TaskList = () => {
  const { user } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => {
    const { tasks } = state.tasks;
    // Filter tasks to only show those belonging to the current user
    return {
      tasks: tasks.filter(task => task.username === user.username)
    };
  });
  
  const [filterPriority, setFilterPriority] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Filter tasks based on priority
  const filteredTasks = tasks.filter(task => {
    if (filterPriority === 'all') return true;
    return task.priority === filterPriority;
  });
  
  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2 className="task-list-title">Your Tasks</h2>
        <div className="task-list-controls">
          <div className="task-list-control">
            <label htmlFor="filter">Filter by</label>
            <select
              id="filter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          
          <div className="task-list-control">
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>
      </div>
      
      {sortedTasks.length === 0 ? (
        <div className="task-list-empty">
          <p className="task-list-empty-text">No tasks found</p>
          <p className="task-list-empty-subtext">Add a new task to get started</p>
        </div>
      ) : (
        <div className="task-list-items">
          {sortedTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
