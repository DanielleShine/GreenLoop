import "./index.css";

const FullPageSpinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-70 z-50">
      <span className="loader"></span>
    </div>
  );
};

export default FullPageSpinner;
