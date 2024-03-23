const Button = ({
  label = "Button",
  type = "submit",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`w-3/6 text-white bg-primary font-medium rounded-full text-sm px-5 py-1 text-center lg:text-clamp-xs md:px-2 hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 ${className}`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
