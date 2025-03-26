import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, fetchWeatherForTask, updateTaskWeather } from '../../redux/slices/taskSlice';
import { v4 as uuidv4 } from 'uuid';
import '../../styles/TaskInput.css';

const TaskInput = () => {
  const [taskText, setTaskText] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  // Get the current user from auth state
  const { user } = useSelector((state) => state.auth);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!taskText.trim()) return;
    
    const newTaskId = uuidv4();
    const newTask = {
      id: newTaskId,
      text: taskText,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      location: location || null,
      weather: null,
      username: user.username
    };
    
    // Add task first
    dispatch(addTask(newTask));
    
    // If location is provided, fetch weather data
    if (location) {
      setIsLoading(true);
      try {
        const resultAction = await dispatch(fetchWeatherForTask(location));
        
        if (fetchWeatherForTask.fulfilled.match(resultAction)) {
          dispatch(updateTaskWeather({ 
            id: newTaskId, 
            weather: resultAction.payload 
          }));
        } else if (fetchWeatherForTask.rejected.match(resultAction)) {
          setError(`Weather data error: ${resultAction.payload || 'Failed to fetch weather'}`);
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setError('Failed to fetch weather data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    // Reset form
    setTaskText('');
    setLocation('');
    setPriority('medium');
  };

  return (
    <div className="task-input-container">
      <h2 className="task-input-title">Add New Task</h2>
      
      {error && (
        <div className="task-input-error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="task-input-form">
        <div className="task-input-group">
          <label htmlFor="task">Task Description</label>
          <input
            id="task"
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="What needs to be done?"
            required
          />
        </div>
        
        <div className="task-input-group">
          <label htmlFor="location">Location (optional, for weather data)</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., New York, London, etc."
          />
        </div>
        
        <div className="task-input-group">
          <label>Priority</label>
          <div className="priority-options">
            <label className="priority-option">
              <input
                type="radio"
                name="priority"
                value="high"
                checked={priority === 'high'}
                onChange={() => setPriority('high')}
              />
              <span className="priority-high">High</span>
            </label>
            
            <label className="priority-option">
              <input
                type="radio"
                name="priority"
                value="medium"
                checked={priority === 'medium'}
                onChange={() => setPriority('medium')}
              />
              <span className="priority-medium">Medium</span>
            </label>
            
            <label className="priority-option">
              <input
                type="radio"
                name="priority"
                value="low"
                checked={priority === 'low'}
                onChange={() => setPriority('low')}
              />
              <span className="priority-low">Low</span>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="task-input-button"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskInput;
