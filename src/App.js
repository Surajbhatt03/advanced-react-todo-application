// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Components
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import TaskInput from './components/Tasks/TaskInput';
import TaskList from './components/Tasks/TaskList';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router basename="/advanced-react-todo-application">
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <div className="max-w-4xl mx-auto">
                      <TaskInput />
                      <div className="mt-6">
                        <TaskList />
                      </div>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="/" element={<Navigate to="/tasks" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
