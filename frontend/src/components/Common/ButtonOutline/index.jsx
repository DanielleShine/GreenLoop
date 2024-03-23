const ButtonOutline = ({ children, className }) => {
  return (
    <button
      className={`font-medium tracking-wide py-2 px-5 sm:px-8 border text-white bg-[#31572C] outline-none rounded-l-full rounded-r-full capitalize hover:bg-[#376331] hover:text-white-500 transition-all hover:shadow-orange ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonOutline;
