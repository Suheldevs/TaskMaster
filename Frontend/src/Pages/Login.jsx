import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading,setLoading] = useState(false)
  const userData = location.state?.userData || {}
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    setError(null);
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    if (!email) {
      setError('Please enter a valid name');
      return;
    }
    if (!password) {
      setError('Please enter a valid password');
      return;
    }
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const obj = Object.fromEntries(formData.entries())

    try {
      setLoading(true)
      const res = await axios.post('http://localhost:3000/users/login', obj);
      setLoading(false);
      Swal.fire({
        title: `${res.data.message}`,
        icon: "success"
      });
      navigate('/task', { state:res.data.userData});

    }
    catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  }
  return (
    <>
      <div className=' w-screen flex items-center justify-center min-h-[90vh] bg-gray-100 '>
        <form className=' rounded-lg shadow-xl bg-white w-96 p-3   flex flex-col gap-2 ' onSubmit={handleSubmit}>
          <div className='text-center text-xl '>LOG IN</div>
          {error ?
            <div className=''>
              <Alert color='failure'>{error}</Alert>
            </div> : ''
          }
          <div>
            <Label value='Email' />
            <TextInput type='email' name='email' required />
          </div>
          <div>
            <Label value='Password' />
            <TextInput type='password' name='password' required />
          </div>
          <div>
            <Button className='w-full mt-2' gradientDuoTone='purpleToBlue' type='submit'>{loading?(<><Spinner size={'sm'}/> Loading...</>):(' LOGN IN')}</Button>
          </div>
          <div className=''>
            <span>Don't have an account? </span> <span className='text-blue-800 hover:text-blue-500'><Link to='/signin'> sign In </Link></span>
          </div>
        </form>
      </div>
    </>
  )
}

export default LogIn