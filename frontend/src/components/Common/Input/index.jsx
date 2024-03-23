const Input = ({
  label = "",
  name = "",
  type = "text",
  className = "",
  inputClassName = "",
  isRequired = true,
  placeholder = "",
  register,
  value = "",
  onChange = () => {},
}) => {
  return (
    <div className={`${className}`}>
      <label
        htmlFor={name}
        className="block text-clamp-xs font-medium text-gray-800 md:text-clamp-xs"
      >
        {label}
      </label>

      {register ? (
        <input
          type={type}
          id={name}
          className={`bg-gray-50 border px-3 py-0.5 border-gray-300 text-gray-900 text-clamp-xs rounded-full block w-full focus:ring-blue-500 focus:border-blue-500 lg:w-clamp-form-input md:px-3 ${inputClassName}`}
          placeholder={placeholder}
          required={isRequired}
          {...register}
        />
      ) : (
        <input
          type={type}
          id={name}
          value={value}
          className={`bg-gray-50 border px-3 py-0.5 border-gray-300 text-gray-900 text-clamp-xs rounded-full block w-full focus:ring-blue-500 focus:border-blue-500 lg:w-clamp-form-input md:px-3 ${inputClassName}`}
          placeholder={placeholder}
          required={isRequired}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default Input;
