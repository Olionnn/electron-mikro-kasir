import React, { useState } from "react";

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="bg-white min-h-screen text-gray-800 text-[16px]">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        {/* <span className="text-2xl mr-3 cursor-pointer">&#8592;</span> */}
        <h1 className="text-lg font-semibold">Feedback Aplikasi</h1>
      </div>

      {/* Form */}
      <div className="px-4 mt-4">
        <label className="block text-[15px] font-medium mb-2">
          Kritik, saran, dan masukan
        </label>

        <textarea
          className="w-full h-32 p-3 bg-[#F2F6F9] rounded-md text-[14px] placeholder-gray-400 focus:outline-none resize-none"
          placeholder="Kritik, saran, dan masukan"
          maxLength={500}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <p className="text-[13px] text-gray-500 mt-2">Maks 500 karakter</p>

        <button
          className="mt-4 w-full bg-[#FFC107] text-white text-[15px] font-medium py-2 rounded-full shadow-md active:scale-[0.98] transition"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
