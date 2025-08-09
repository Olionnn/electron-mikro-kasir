import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom'; 
import Logo from '../../assets/images/logo/logo.png'; // Adjust the path as necessary

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <>
        <div className="flex h-full w-full">
        <div className="w-1/2 bg-green-600 flex flex-col justify-center items-center text-white p-8">
          <img src={ Logo } alt="Handshake" className="w-80 h-80 mb-10" />
          <h1 className="text-4xl font-bold text-center">Tersedia Untuk iOS, Mac, & Dekstop</h1>
        </div>
    
        <div className="w-1/2 bg-white flex flex-col justify-center px-24 py-12 text-2xl">
    
        <div className='flex items-center justify-between'>
            <h2 className="text-5xl font-bold mb-6 flex items-center gap-4">
                <img src={ Logo } className="w-[120px]" />
                Masuk
            </h2>
            <div className="flex justify-end mb-6">
                <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9f/Flag_of_Indonesia.svg"
                alt="Indonesian Flag"
                className="w-12 h-12 rounded-full border-2 border-gray-300"
                />
            </div>
        </div>

    
          <p className="mb-6 text-xl">Kamu dapat masuk sebagai <strong>Owner</strong> ataupun <strong>Staff</strong></p>

        <label htmlFor="email" className="text-xl font-light text-gray-600 mb-2">Email</label>
        <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full border-2 rounded-xl px-6 py-5 mb-6 text-2xl focus:outline-green-500"
        />

        <label htmlFor="password" className="text-xl font-light text-gray-600 mb-2">Password</label>
        <div className="relative mb-6">
        <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border-2 rounded-xl px-6 py-5 text-2xl focus:outline-green-500"
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-7 transform -translate-y-1 text-gray-500"
        >
            {showPassword ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 16 16">
                <path fill="currentColor" d="M.143 2.31a.75.75 0 0 1 1.047-.167l14.5 10.5a.75.75 0 1 1-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.619 1.619 0 0 1 0-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 0 1 .143 2.31Zm1.536 5.622A.12.12 0 0 0 1.657 8c0 .021.006.045.022.068c.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 0 1 6.058 7.52L3.529 5.688a14.207 14.207 0 0 0-1.85 2.244ZM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 1 1-.473-1.423A6.207 6.207 0 0 1 8 2c1.981 0 3.67.992 4.933 2.078c1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.11.166-.248.365-.41.587a.75.75 0 1 1-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 0 0 0-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5Z"/>
            </svg>
            : 
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <g fill="none" fillRule="evenodd">
                    <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
                    <path fill="currentColor" d="M4 12.001V12c.003-.016.017-.104.095-.277c.086-.191.225-.431.424-.708c.398-.553.993-1.192 1.745-1.798C7.777 7.996 9.812 7 12 7c2.188 0 4.223.996 5.736 2.216c.752.606 1.347 1.245 1.745 1.798c.2.277.338.517.424.708c.078.173.092.261.095.277V12c-.003.016-.017.104-.095.277a4.251 4.251 0 0 1-.424.708c-.398.553-.993 1.192-1.745 1.798C16.224 16.004 14.188 17 12 17c-2.188 0-4.223-.996-5.736-2.216c-.752-.606-1.347-1.245-1.745-1.798a4.226 4.226 0 0 1-.424-.708A1.115 1.115 0 0 1 4 12.001ZM12 5C9.217 5 6.752 6.254 5.009 7.659c-.877.706-1.6 1.474-2.113 2.187a6.157 6.157 0 0 0-.625 1.055C2.123 11.23 2 11.611 2 12c0 .388.123.771.27 1.099c.155.342.37.7.626 1.055c.513.713 1.236 1.48 2.113 2.187C6.752 17.746 9.217 19 12 19c2.783 0 5.248-1.254 6.991-2.659c.877-.706 1.6-1.474 2.113-2.187c.257-.356.471-.713.625-1.055c.148-.328.271-.71.271-1.099c0-.388-.123-.771-.27-1.099a6.197 6.197 0 0 0-.626-1.055c-.513-.713-1.236-1.48-2.113-2.187C17.248 6.254 14.783 5 12 5Zm-1 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Zm1-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6Z"/>
                </g>
            </svg>
        }
        </button>
        </div>
    
          <div className="text-right mb-10">
            <a href="#" className="text-green-600 font-semibold text-xl">Lupa Password?</a>
          </div>

            <Link to="/pos" className="bg-green-600 text-white py-5 text-3xl rounded-full w-full hover:bg-green-700 mb-10 text-center">Masuk</Link>


          <div className="flex justify-center mb-8">
            <button className="border rounded-full p-3 hover:bg-gray-100">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-12 h-12" />
            </button>
          </div>
    
          <p className="text-center text-xl">
            Belum punya akun?
            {/* <a href="#" className="text-green-600 font-bold">Daftar disini</a> */}
            <Link to="/register" className="text-green-600 font-bold"> Daftar disini</Link>
          </p>
        </div>
      </div>
        </>   
    );

}

export default Login;
