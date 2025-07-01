import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = "", autoComplete, ...props }) => (
  <div className="flex flex-col mb-8 w-full max-w-lg mx-auto">
    <label
      htmlFor={id}
      className="text-[#B04F17] font-black text-lg mb-2 lowercase font-sans"
      style={{ fontFamily: 'Inter, sans-serif', textTransform: 'lowercase' }}
    >
      {label}
    </label>
    <input
      id={id}
      autoComplete={autoComplete || "off"}
      className={`w-full py-2 px-4 rounded-lg border-4 border-[#B04F17] bg-[#02503B] text-[#B04F17] font-black text-base font-sans focus:outline-none focus:ring-2 focus:ring-[#B04F17] placeholder-[#B04F17] placeholder:font-normal ${className}`}
      style={{ fontFamily: 'Inter, sans-serif' }}
      {...props}
    />
  </div>
);

export default Input;
