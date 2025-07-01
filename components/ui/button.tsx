import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = "", ...props }) => (
  <button
    type="submit"
    className={`w-full max-w-lg mx-auto bg-[#B04F17] text-[#02503B] rounded-lg font-black text-lg py-2 transition-colors duration-150 hover:bg-[#963f0f] font-sans ${className}`}
    style={{ fontFamily: 'Inter, sans-serif' }}
    {...props}
  >
    {children}
  </button>
);

export default Button;
