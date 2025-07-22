import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import { Typewriter } from 'react-simple-typewriter';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';

const LogIn = () => {
    const { SignIn, GoogleLogIn, toggleDarkMode, user } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        SignIn(email, password)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    showConfirmButton: false,
                    timer: 1500
                });
                form.reset();
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: err.message
                })
            });
            
       
    
        };
         // with goolge
        const HandleGoogleLogIn = async () => {
            try {
                const result = await GoogleLogIn();
                const loggedUser = result.user;

                // Send user data to DB
                await axios.post('http://localhost:3000/users', {
                    name: loggedUser.displayName,
                    email: loggedUser.email,
                    photo: loggedUser.photoURL,
                    role: 'user',
                    membership: false
                });

                Swal.fire('Welcome!', 'Logged in with Google!', 'success');
            } catch (err) {
                Swal.fire('Error!', err.message, 'error');
            }
        };



    return (
        <div className={`min-h-screen flex flex-col md:flex-row items-center justify-center
            ${toggleDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
                : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-800'}`}>
            
            {/* Left Banner */}
            <div className="md:w-1/2 w-full p-8 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    <Typewriter
                        words={['Join the community', 'Explore more of your life']}
                        loop={true}
                        cursor
                        cursorStyle='_'
                        typeSpeed={70}
                        deleteSpeed={50}
                        delaySpeed={1500}
                    />
                </h1>
            </div>

            {/* Right Form */}
            <div className="md:w-1/2 w-full p-8">
                <form onSubmit={handleLogin} className={`space-y-4  ${toggleDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
                    <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

                    {/* Email */}
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full p-2 rounded border border-gray-300 mt-1 dark:bg-gray-700"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label>Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            className="w-full p-2 rounded border border-gray-300  mt-1 dark:bg-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-xl text-gray-600 dark:text-gray-300"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
                        Log In
                    </button>

                    {/* Divider */}
                    <div className="divider">or</div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={HandleGoogleLogIn}
                        className="w-full border border-gray-400 flex items-center justify-center gap-2 p-2 rounded "
                    >
                        <FaGoogle /> Sign in with Google
                    </button>

                    {/* Sign up link */}
                    <p className="text-center mt-4">
                        Don’t have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LogIn;
