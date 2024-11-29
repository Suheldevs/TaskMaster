import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
function SignIn() {
  const navigate = useNavigate();
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(null);
  const handleSubmit = async (e) => {
    setError(null);
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    if (!name) {
      setError('Please Enter a Valid Name');
      return;
    }

    if (!email) {
      setError('Please Enter a Valid Email');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    const formData = new FormData();
    formData.append("Username", e.target.name.value);
    formData.append("email", e.target.email.value);
    formData.append("password", e.target.password.value);

    const obj = Object.fromEntries(formData.entries());
    try {
    setLoading(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/signin`, obj);
      setLoading(false);
      console.log(res);
      Swal.fire({
        title: "Signup successfully",
        text: "Please go to Login page",
        icon: "success"
      });
      navigate('/login', { state: { userData: res.data.userData } })

    }
    catch (err) {
      setError(err.response.data.message);
      setLoading(false);
    }
  }
  return (
    <>
      <div className=' w-screen flex items-center justify-center min-h-[90vh] bg-slate-100 '>
        <form className=' rounded-lg shadow-xl bg-white w-96 p-3 flex flex-col gap-3 ' onSubmit={handleSubmit}>
          <div className='text-center text-2xl  '>SIGN IN</div>
          {error ? 
          (<div className=''><Alert color='failure'>{error}</Alert></div>):''
          }
          <div className=''>
            <Label value='Name'></Label>
            <TextInput type='text' name='name' required/>
          </div>
          <div>
            <Label value='Email' />
            <TextInput type='email' name='email' required/>
          </div>
          <div>
            <Label value='Password' />
            <TextInput type='password' name='password' required />
          </div>
          <div>
            <Button className='w-full mt-2' gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>{loading?(<><Spinner size={'sm'}/> Loading...</>):(' SING IN')}</Button>
          </div>
          <div className=''>
            <span>Have an account? </span> <span className='text-blue-800 hover:text-blue-500'><Link to='/login'> Log In </Link></span>
          </div>
        </form>
      </div>
    </>
  )
}

export default SignIn