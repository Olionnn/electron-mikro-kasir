import React from "react";


const NavbarAdmin = ({toggleSidebar, pageName}) => {
    return ( 
        <>
        <nav className="bg-white w-full flex items-center justify-between p-6">

            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar}>
                <svg
                    className="w-8 h-8 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
                </button>
                <h1 className="text-2xl font-bold">{pageName}</h1>
            </div>
        </nav>
        </> 
    );
}
 
export default NavbarAdmin;