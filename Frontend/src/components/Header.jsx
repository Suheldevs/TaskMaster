import React from 'react'
import { FaGithub } from 'react-icons/fa'

function Header() {
  return (
    <div>
          <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 flex justify-center items-center">
        <h1 className="text-2xl font-semibold text-center">Task Management</h1>
        <div className='ms-4 text-lg ' >Code- </div>
        <div><a href='https://github.com/Suheldevs/TaskMaster'><FaGithub/></a></div>
      </header>
    </div>
  )
}

export default Header