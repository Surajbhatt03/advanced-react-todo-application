import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTaskPriority, toggleTaskCompletion } from '../../redux/slices/taskSlice';
import '../../styles/TaskItem.css';

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  
  const priorityClasses = {
    high: 'task-priority-high',
    medium: 'task-priority-medium',
    low: 'task-priority-low'
  };
  
  const handleDelete = () => {
    dispatch(deleteTask(task.id));
  };
  
  const handlePriorityChange = (e) => {
    dispatch(updateTaskPriority({ id: task.id, priority: e.target.value }));
  };
  
  const handleToggleCompletion = () => {
    dispatch(toggleTaskCompletion(task.id));
  };
  
  return (
    <div className={`task-item ${priorityClasses[task.priority]} ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-item-content">
        <div className="task-item-main">
          <div className="task-item-header">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggleCompletion}
              className="task-item-checkbox"
            />
            <h3 className={`task-item-text ${task.completed ? 'task-text-completed' : ''}`}>
              {task.text}
            </h3>
          </div>
          
          <div className="task-item-details">
            <p className="task-item-date">Created: {new Date(task.createdAt).toLocaleString()}</p>
            
            {task.location && (
              <p className="task-item-location">Location: {task.location}</p>
            )}
          </div>
          
          {task.weather && (
            <div className="task-item-weather">
              <div className="task-item-weather-content">
                {task.weather.icon && (
                  <img 
                    src={`https://openweathermap.org/img/wn/${task.weather.icon}.png`} 
                    alt="Weather icon" 
                    className="task-item-weather-icon"
                  />
                )}
                <div className="task-item-weather-data">
                  <p className="task-item-weather-temp">{task.weather.temperature}°C</p>
                  <p className="task-item-weather-desc">{task.weather.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="task-item-actions">
          <select
            value={task.priority}
            onChange={handlePriorityChange}
            className="task-item-priority-select"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <button
            onClick={handleDelete}
            className="task-item-delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
