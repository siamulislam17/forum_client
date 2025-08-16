import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../Context/AuthContext';
import { Typewriter } from 'react-simple-typewriter';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import UseAsios from '../../../UrlInstance/UseURL';
import animation from '../../../../public/Login.json';
import { Player } from '@lottiefiles/react-lottie-player';


const LogIn = () => {
    const { SignIn, GoogleLogIn, toggleDarkMode,handleForgotPassword  } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [forgotModalOpen, setForgotModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const axiosInstance = UseAsios();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    // Normal login
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
                navigate(from, { replace: true });
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: err.message
                });
            });
    };

    // Google login
    const HandleGoogleLogIn = async () => {
        try {
            const result = await GoogleLogIn();
            const loggedUser = result.user;

            await axiosInstance.post('/users', {
                name: loggedUser.displayName,
                email: loggedUser.email,
                photo: loggedUser.photoURL,
                role: 'user',
                membership: false
            });

            Swal.fire('Welcome!', 'Logged in with Google!', 'success');
            navigate(from, { replace: true });
        } catch (err) {
            Swal.fire('Error!', err.message, 'error');
        }
    };

    // Forgot password handler
    const handleForgotPasswordModal = async () => {
        if (!resetEmail) {
            Swal.fire('Error', 'Please enter your email!', 'error');
            return;
        }

        try {
            await handleForgotPassword(resetEmail);
            Swal.fire('Success', 'Password reset email sent! Please check your inbox and spam folder.', 'success');
            setForgotModalOpen(false);
            setResetEmail('');
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };

    return (
        <div className={`min-h-screen flex flex-col md:flex-row items-center justify-center
            ${toggleDarkMode
                ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white'
                : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-800'}`}>

            {/* Left Animation */}
            <div className="md:w-1/2 w-full p-8 flex flex-col items-center">
                <Player
                    autoplay
                    loop
                    src={animation}
                    style={{ height: '400px', width: '400px' }}
                />
                <h2 className="text-3xl md:text-4xl font-extrabold mt-4 text-center">
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
            </div>

            {/* Right Form */}
            <div className="md:w-1/2 w-full p-8">
                <form onSubmit={handleLogin} className={`space-y-4 ${toggleDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
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
                            className="w-full p-2 rounded border border-gray-300 mt-1 dark:bg-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-xl text-gray-600 dark:text-gray-300"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>

                        {/* Forgot Password Link */}
                        <p className="text-right mt-1">
                            <button
                                type="button"
                                className="text-blue-600 hover:underline text-sm"
                                onClick={() => setForgotModalOpen(true)}
                            >
                                Forgot Password?
                            </button>
                        </p>
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
                        className="w-full border border-gray-400 flex items-center justify-center gap-2 p-2 rounded"
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

            {/* Forgot Password Modal */}
            <input type="checkbox" id="forgot-modal" className="modal-toggle" checked={forgotModalOpen} readOnly />
            <div className="modal">
                <div className={`modal-box ${toggleDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                    <h3 className="font-bold text-lg">Reset Your Password</h3>
                    <p className="py-2">Enter your email address to receive a password reset link.</p>

                    <input
                        type="email"
                        placeholder="Email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="input input-bordered w-full mt-2"
                    />

                    <div className="modal-action">
                        <button
                            className="btn text-white bg-blue-600 hover:bg-blue-700"
                            onClick={handleForgotPasswordModal} // <- fixed
                        >
                            Send Reset Link
                        </button>
                        <button className="btn" onClick={() => setForgotModalOpen(false)}>Cancel</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LogIn;
