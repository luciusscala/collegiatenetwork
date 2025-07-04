import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  asChild = false,
  size = "default",
  variant = "default",
  ...props 
}) => {
  const baseClasses = "rounded-lg font-black transition-colors duration-150 font-sans";
  
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    default: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "h-10 w-10 p-0"
  };
  
  const variantClasses = {
    default: "bg-[#B04F17] text-[#02503B] hover:bg-[#963f0f]",
    outline: "border-2 border-[#B04F17] text-[#B04F17] bg-transparent hover:bg-[#B04F17] hover:text-[#02503B]"
  };
  
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  if (asChild) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: buttonClasses,
      style: { fontFamily: 'Inter, sans-serif' },
      ...props
    });
  }
  
  return (
    <button
      type="submit"
      className={buttonClasses}
      style={{ fontFamily: 'Inter, sans-serif' }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
