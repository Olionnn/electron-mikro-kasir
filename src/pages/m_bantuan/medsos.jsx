import React from "react";

const ContactList = () => {
  const contacts = [
    {
      title: "Panduan penggunaan Kasir Pintar",
      role: "Customer Service",
      time: "09.00 - 21.00",
    },
    {
      title: "Laporkan kendala bug",
      role: "Technical Support",
      time: "09.00 - 21.00",
    },
    {
      title: "Konfirmasi pembayaran akun premium",
      role: "Customer Service",
      time: "08.00 - 21.00",
    },
    {
      title: "Program referral",
      role: "Customer Service",
      time: "08.00 - 21.00",
    },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-800 text-[16px]">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <span className="text-2xl mr-3 cursor-pointer">&#8592;</span>
        <h1 className="text-lg font-semibold">Hubungi Kami</h1>
      </div>

      {/* List */}
      <div>
        {contacts.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-4 py-4 border-b border-gray-100"
          >
            <div>
              <p className="text-[15px] font-medium leading-tight">
                {item.title}
              </p>
              <p className="text-[14px] text-[#00B686] leading-tight">
                {item.role}
              </p>
              <p className="text-[14px] text-gray-500 leading-tight">
                {item.time}
              </p>
            </div>
            {/* Phone icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="#00B686"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2 5.5C2 4.12 3.12 3 4.5 3h2.19c.63 0 1.22.3 1.6.81l1.29 1.72a2 2 0 01-.45 2.77l-1.05.79c.44.88 1.1 1.96 1.99 2.85.9.89 1.98 1.55 2.86 1.99l.79-1.05a2 2 0 012.77-.45l1.72 1.29c.51.38.81.97.81 1.6v2.19C21 20.88 19.88 22 18.5 22 10.49 22 2 13.51 2 5.5z"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;
