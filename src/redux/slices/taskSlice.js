import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWeatherData } from '../../Services/weatherAPI';
import { saveToLocalStorage, getFromLocalStorage } from '../../utils/localStorage';

export const fetchWeatherForTask = createAsyncThunk(
  'tasks/fetchWeatherForTask',
  async (location, { rejectWithValue }) => {
    try {
      const weatherData = await getWeatherData(location);
      return weatherData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch weather data');
    }
  }
);

// Helper function to save tasks by username
const saveTasksByUsername = (tasks) => {
  const tasksByUser = {};
  
  // Group tasks by username
  tasks.forEach(task => {
    if (!tasksByUser[task.username]) {
      tasksByUser[task.username] = [];
    }
    tasksByUser[task.username].push(task);
  });
  
  // Save to localStorage
  saveToLocalStorage('tasks', tasks);
  saveToLocalStorage('tasksByUser', tasksByUser);
};

const initialState = {
  tasks: getFromLocalStorage('tasks', []),
  status: 'idle',
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      saveTasksByUsername(state.tasks);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      saveTasksByUsername(state.tasks);
    },
    updateTaskPriority: (state, action) => {
      const { id, priority } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.priority = priority;
        saveTasksByUsername(state.tasks);
      }
    },
    updateTaskWeather: (state, action) => {
      const { id, weather } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.weather = weather;
        saveTasksByUsername(state.tasks);
      }
    },
    toggleTaskCompletion: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        saveTasksByUsername(state.tasks);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherForTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWeatherForTask.fulfilled, (state) => {
        state.status = 'succeeded';
        // Weather data will be handled by updateTaskWeather action
      })
      .addCase(fetchWeatherForTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { 
  addTask, 
  deleteTask, 
  updateTaskPriority, 
  updateTaskWeather,
  toggleTaskCompletion 
} = taskSlice.actions;

export default taskSlice.reducer;
