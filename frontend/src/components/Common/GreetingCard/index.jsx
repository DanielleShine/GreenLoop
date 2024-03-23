const GreetingCard = ({ user }) => {
  return (
    <div className="p-4 bg-gradient-to-r from-[#50792D] to-[#66A62E] border border-gray-200 shadow-sm rounded-3xl my-2">
      <div className="items-center justify-between lg:flex">
        <div className="flex h-[9rem] py-5 px-8 text-left justify-start items-center lg:mb-0 lg:px-3 sm:h-[5rem] xsm:px-3 xsm:h-[5rem]">
          <div>
            <h3 className="text-2xl font-normal text-white sm:text-xl xsm:text-sm xsm:leading-6">
              Welcome back,
            </h3>
            <h2 className="text-[2.2rem] leading-8 font-bold text-white sm:text-2xl sm:leading-none xsm:text-xl ">
              {user?.companyName}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GreetingCard;
