import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; // Import icons
import { useLocation } from 'react-router-dom';
function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To handle the edit modal
  const [editTask, setEditTask] = useState(null); // Store the task to be updated

  const backendURL = import.meta.env.VITE_BACKEND_URL; // Adjust your backend URL

const location = useLocation();
const userLoginData = location.state || {};
  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${backendURL}/tasks/get`, {
            params: { email: userLoginData.email },
          });
        setTasks(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [userLoginData.email]);

  // Handle form submission for creating tasks
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
     setFormData((prev) => ({ ...prev, email: userLoginData.email}));
      const response = await axios.post(`${backendURL}/tasks/post`, formData);
      setTasks((prev) => [...prev, response.data]); // Add new task to the list
      setFormData({ title: '', description: '', category: 'Other', email: '' }); // Reset form
      setIsModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.error('Error adding task:', error);
      setLoading(false);
    }
  };

  // Handle task deletion
  const handleDelete = async (taskId) => {
    const deleteTaskData = { email: `${userLoginData.email}`, taskId: taskId };
  
    try {
      // Send the DELETE request with query parameters
      await axios.delete(`${backendURL}/tasks/delete`, {
        params: deleteTaskData, // Add data as query parameters
      });
  
      // Update the state by filtering out the deleted task
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  // Handle task update
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Ensure formData contains the correct taskId
    try {
        setFormData((prev) => ({ ...prev, email:userLoginData.email  }))
      const response = await axios.put(`${backendURL}/tasks/update/${formData.id}`, formData);
      console.log(response);
      setTasks(tasks.map(task => (task._id === editTask._id ? response.data : task))); // Update task in the state
      setIsEditModalOpen(false); // Close modal after edit
      setLoading(false);
    } catch (error) {
      console.error('Error updating task:', error);
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4">
        <h1 className="text-2xl font-semibold text-center">Task Management</h1>
      </header>

      {/* Task List */}
      <main className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
          >
            Add Task
          </button>
        </div>

        {/* Task Items */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.length > 0  ? (tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-white rounded-md shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="mt-2">
                <span className="text-xs font-medium text-purple-600">
                  Category: {task.category}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">Assigned to: {task.email}</div>
              {/* Action Icons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setEditTask(task);
                    setFormData({
                      title: task.title,
                      description: task.description,
                      category: task.category,
                      email: task.email,
                      id:task._id,
                    });
                    setIsEditModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))):(<p>No task</p>)}
        </div>
      </main>

      {/* Add Task Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
            <Dialog.Title className="text-xl font-bold">Add New Task</Dialog.Title>
            <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-gray-700 font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Other">Other</option>
                </select>
              </div>
             
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Task Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-md shadow-lg">
            <Dialog.Title className="text-xl font-bold">Update Task</Dialog.Title>
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div>
                <label className="block text-gray-700 font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows="3"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Task'}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default TaskManagement;
