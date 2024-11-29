import React, { useState, useEffect } from 'react';
import { Button, Dialog } from '@headlessui/react';
import axios from 'axios';
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; // Import icons
import { useLocation } from 'react-router-dom';
import { Dropdown, Spinner } from 'flowbite-react';

import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status:'Pending',
    category: 'Other',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To handle the edit modal
  const [editTask, setEditTask] = useState(null); // Store the task to be updated
const [statusFilter,setStatusFilter] = useState('')
const [filterData,setFilterData] = useState([])
  const backendURL = import.meta.env.VITE_BACKEND_URL; // Adjust your backend URL

const location = useLocation();
const userLoginData = location.state || {};
  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/tasks/get`, {
        params: { email: userLoginData.email },
      });
      setTasks(response.data);
      setFilterData(response.data);
      setLoading(false);
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching tasks:', error);
    }
  };
  useEffect(() => {

    fetchTasks();

  }, [userLoginData.email]);

  // Handle form submission for creating tasks
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const dataToSubmit = {
        ...formData,
        email: userLoginData.email, 
      };
      const response = await axios.post(`${backendURL}/tasks/post`, dataToSubmit);
      console.log(response)
      setTasks((prev) => [...prev, response.data]); // Add new task to the task list
      setFormData({ title: '', description: '', category: 'Other', status: 'Pending' }); // Reset form
      setIsModalOpen(false);
      fetchTasks();

 // Show success toast
 toast.success('Task added successfully!', {
  position: "top-right", // Position of the toast
  autoClose: 5000, // Duration in ms
  hideProgressBar: false, // Whether to hide progress bar
  closeOnClick: true, // Close when clicked
  pauseOnHover: true, // Pause on hover
  draggable: true, // Allow dragging
  progress: undefined,
});

    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
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
      fetchTasks();
      // Update the state by filtering out the deleted task
      // Show success toas
      toast.success('Task deleted successfully!', {
        position: "top-right", // Position of the toast
      autoClose: 5000, // Duration in ms
      hideProgressBar: false, // Whether to hide progress bar
      closeOnClick: true, // Close when clicked
      pauseOnHover: true, // Pause on hover
      draggable: true, // Allow dragging
      progress: undefined,
    });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error('Failed to delete task. Please try again.', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
       // Show success toast
    toast.success('Task edited successfully!', {
      position: "top-right", // Position of the toast
      autoClose: 5000, // Duration in ms
      hideProgressBar: false, // Whether to hide progress bar
      closeOnClick: true, // Close when clicked
      pauseOnHover: true, // Pause on hover
      draggable: true, // Allow dragging
      progress: undefined,
    });
    } catch (error) {
      console.error('Error updating task:', error);
      setLoading(false);
      toast.error('Failed to add task. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  

  const handleFilterData = (statusType)=>{
    setStatusFilter(statusType);
    if(statusType == ''){
      const filterData = tasks.filter((item)=>(item));
      setFilterData(filterData);
     
    }
    else{
    console.log(statusType);
    const filterData = tasks.filter((item)=>(item.status == statusType || item.category == statusType));
    console.log(filterData);
    setFilterData(filterData)
    }
  }



  return (
    <div className="min-h-[90vh] bg-gray-100">
      {/* Header */}
      <ToastContainer />

      {/* Task List */}
      <main className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-xl font-bold"><span>{userLoginData.Username}'s </span>Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
          >
            Add New Task
          </button>
        </div>
        {tasks?(<>
          <div className='px-4 flex items-center gap-4 flex-col lg:flex-row '> 
  <div className='text-lg font-bold'>Filters </div>
  <Dropdown
  label={'Status'}
  color='purple'
  >
<Dropdown.Item onClick={()=>handleFilterData('')}>All</Dropdown.Item>
<Dropdown.Item onClick={()=>handleFilterData('Completed')}>Completed</Dropdown.Item>
<Dropdown.Item onClick={()=>handleFilterData('In Progress')}>In Progress</Dropdown.Item>
<Dropdown.Item onClick={()=>handleFilterData('Pending')}>Pending</Dropdown.Item>
  </Dropdown>

<div className='flex gap-2  items-center font-semibold lg:items-center justify-center '>
  <input type='checkbox' onChange={()=>handleFilterData('')} checked/> All
  <input type='checkbox' onChange={()=>handleFilterData('Personal')}/> Personal
  <input type='checkbox' onChange={()=>handleFilterData('Work')}/> Work
  <input type='checkbox' onChange={()=>handleFilterData('Urgent')}/> Urgent
  <input type='checkbox' onChange={()=>handleFilterData('Other')}/> Other
</div>
</div>
        </>):''}

        {/* Task Items */}
        <div className="grid gap-4 lg:px-0 px-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {filterData.length > 0  ? (filterData.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-white rounded-md shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-center">{task.title}</h3>
              <p className="text-sm text-gray-600 overflow-hidden text-ellipsis text-nowrap max-h-6">{task.description}</p>
              <div className="mt-2">
                <span className=" font-medium  text-purple-500">
                <span className='text-purple-600'>Category: </span>{task.category}
                </span>
              </div>
              <div className="mt-2 text-sm "><span className='bg-purple-500 text-white p-1 me-1 font-medium rounded'>Status :</span> {task.status}</div>
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
                      status:task.status,
                      id:task._id,
                    });
                    setIsEditModalOpen(true);
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500  hover:text-red-700"
                >
                <FaTrashAlt />
                </button>
              </div>
            </div>
          ))):(<div className='min-h-[80vh] flex  w-full  justify-center items-center text-2xl font-bold '>{loading ? (<><Spinner size={'xl'} color='purple'/> &nbsp; Loading tasks..</>):(<>No task yet! &nbsp; <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
          >
            Add Task
          </button> </>)} </div>)}
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
              <div>
                <label className="block text-gray-700 font-medium">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
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
