import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { Link, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import UseURL from '../../UrlInstance/UseURL';


const SignUp = () => {
  const {
    CreateAccountWithEmail,
    GoogleLogIn,
    UserUpdate,
    toggleDarkMode,
    user
  } = useContext(AuthContext);


  const axiosUrl = UseURL();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', photo: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { name, photo, email, password } = formData;

    try {
      await CreateAccountWithEmail(email, password);
      await UserUpdate(name, photo);

      
    // ✅ Send user info to backend
      await axiosUrl.post('/users', {
        name,
        email,
        photo,
        role: 'user', // default role
        mebbership: false // default mebbership
      });

      Swal.fire('Success!', 'Account created successfully!', 'success');
      navigate('/');
    } catch (err) {
      Swal.fire('Error!', err.message, 'error');
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await GoogleLogIn();
      const loggedUser = result.user;

        // ✅ Send user info to backend
        await axiosUrl.post('/users', {
            name: loggedUser.displayName,
            email: loggedUser.email,
            photo: loggedUser.photoURL,
            role: 'user',
            membership: false,

        });
      Swal.fire('Welcome!', 'Logged in with Google!', 'success');
      navigate('/');
    } catch (err) {
      Swal.fire('Error!', err.message, 'error');
    }
  };

  // Common input classes with conditional dark mode
  const inputClass = `w-full p-3 rounded-lg border transition-colors duration-300
    ${toggleDarkMode
      ? 'bg-gray-800 border-amber-400 placeholder:text-gray-400 text-white focus:border-amber-500'
      : 'bg-white border-gray-300 placeholder:text-gray-500 text-gray-900 focus:border-blue-600'}`;

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row items-center pt-20 justify-center transition-colors duration-300
        ${toggleDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
          : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-900'}`}>
      
      {/* Left Banner */}
      <div className="md:w-1/2 w-full p-8 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
          <Typewriter
            words={['Join the Community', 'Explore More of Your Life']}
            loop
            cursor
            cursorStyle="_"
            typeSpeed={80}
            deleteSpeed={40}
            delaySpeed={2000}
          />
        </h2>
        <p className={`${toggleDarkMode ? 'text-gray-300' : 'text-gray-700'} text-lg max-w-md mx-auto`}>
          Become a part of our amazing community and unlock new experiences every day.
        </p>
      </div>

      {/* Right Form */}
      <div className={`md:w-1/2 mx-6 mt-7  p-8 max-w-md rounded-3xl shadow-xl transition-colors duration-300
        ${toggleDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <h3 className="text-3xl font-bold mb-8 text-center">Create an Account</h3>

        <form onSubmit={handleSignUp} className="space-y-6 ">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className={inputClass}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            accept="image/*"
            className={`${inputClass} file:text-sm file:border-0 file:bg-transparent`}
            onChange={async (e) => {
              const image = e.target.files[0];
              if (!image) return;

              const formDataImage = new FormData();
              formDataImage.append('image', image);

              try {
                const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
                  method: 'POST',
                  body: formDataImage,
                });

                const data = await res.json();
                if (data.success) {
                  setFormData(prev => ({ ...prev, photo: data.data.url }));
                  
                } else {
                  console.error(data);
                  Swal.fire('Error', 'Something went wrong uploading the image.', 'error');
                }
              } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Something went wrong uploading the image.', 'error');
              }
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className={inputClass}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className={inputClass + ' pr-12'}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-xl
                ${toggleDarkMode ? 'text-gray-400 hover:text-amber-300' : 'text-gray-600 hover:text-blue-600'}`}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300
              ${toggleDarkMode
                ? 'bg-amber-500 hover:bg-amber-600 text-gray-900'
                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className={`divider mt-6 mb-4 ${toggleDarkMode ? 'before:bg-gray-600 after:bg-gray-600 text-gray-300' : ''}`}>
          OR
        </div>

        <button
          onClick={handleGoogle}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg border transition-colors duration-300
            ${toggleDarkMode
              ? 'border-gray-400 text-white hover:bg-gray-700'
              : 'border-gray-300 text-gray-900 hover:bg-gray-100'}`}
        >
          <FaGoogle className="text-xl" /> Sign Up with Google
        </button>

        <p className={`mt-6 text-center text-sm ${toggleDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
