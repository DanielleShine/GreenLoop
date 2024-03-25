import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import leavesImage from "../../assets/images/signup-side-panel.webp";
import { signUpUser } from "../../api/auth";
import mindanaoPlaces from "../../constants/mindanaoPlaces";
import { useState } from "react";

const organizationType = [
  { value: "Waste Generator", label: "Waste Generator" },
  { value: "Recycling Startup", label: "Recycling Startup" },
  { value: "Informal Waste Sector", label: "Informal Waste Sector" },
];

const SignUp = () => {
  document.title = "Green Loop | Sign Up";

  const { register, handleSubmit } = useForm();
  const [places, setPlaces] = useState([]);

  const { mutate: createUser } = useMutation({
    mutationFn: (data) => signUpUser(data),
    onSuccess: () => {
      alert("User created successfully");
      navigate("/users/sign-in");
    },
    onError: (error) => {
      alert(error.response?.data);
      console.log("error: ", error);
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data, e) => {
    e.preventDefault();
    createUser(data);
  };

  const handleOnChangeProvince = (e) => {
    if (e.target.id == "provinces" && e.target.value == "Select a Province") {
      setPlaces([]);
    } else {
      const filteredMunicipalities = mindanaoPlaces.filter((province) =>
        province.name.includes(e.target.value)
      );
      console.log("filteredMunicipalities: ", filteredMunicipalities);
      setPlaces(filteredMunicipalities[0].places);

      document.getElementById("municipalities").value =
        filteredMunicipalities[0].places[0];
    }
  };

  return (
    <div className="h-dvh flex w-dvw items-center">
      <div className="flex flex-row shadow-lg justify-center w-2/4 h-9/10 max-w-6xl mx-auto lg:h-full lg:flex-col md:items-start md:w-2/4 sm:w-3/4 sm:h-screen xsm:w-full">
        <div className="w-2/4 h-full border border-palette-lighter bg-red-500 rounded shadow-lg lg:mb-3 md:mb-0 lg:h-[8%] lg:w-full">
          <img
            src={leavesImage}
            alt="Forrest illustration"
            className="w-full h-full object-cover xsm:h-36"
          />
        </div>
        <div className="flex flex-col justify-center h-full w-full max-w-sm mx-auto space-y-4 min-h-128 lg:w-4/6 xsm:w-3/4">
          <div className="text-clamp-form-greenloop font-extrabold text-[#31572C] text-center ">
            GreenLoop
          </div>
          <div className="text-clamp-form-header font-extrabold px-12 md:ml-0">
            Sign Up
          </div>

          <form
            className="flex flex-col justify-start items-left px-12 w-full md:px-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              name="companyName"
              placeholder="company name"
              className="mb-6"
              register={{ ...register("companyName") }}
            />

            <Input
              name="email"
              type="email"
              placeholder="email"
              className="mb-6"
              register={{ ...register("email") }}
            />
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="username"
              className="mb-6"
              register={{ ...register("username") }}
            />
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="password: min 8 characters"
              className="mb-1"
              register={{ ...register("password") }}
            />
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="confirm password"
              className="mt-5"
              register={{ ...register("confirmPassword") }}
            />
            <select
              id="organization-type"
              name="organizationType"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block py-0.5 mt-5"
              {...register("organizationType", {
                required: "Please select organization type",
              })}
            >
              {organizationType.map((item, index) => (
                <option id={index} key={index} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <select
              id="province"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block py-0.5 mt-5"
              {...register("province", {
                onChange: (e) => handleOnChangeProvince(e),
                required: "Please select a province",
              })}
            >
              {mindanaoPlaces.map((province, index) => (
                <option key={index} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
            <select
              id="cityMunicipality"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block py-0.5 mt-5"
              {...register("cityMunicipality", {
                required: "Please select a city or municipality",
              })}
            >
              {places?.map((place, index) => (
                <option key={index} value={place}>
                  {place}
                </option>
              ))}
            </select>

            <div className="text-center">
              <Button
                label="Sign up"
                type="submit"
                className="bg-[#31572C] rounded-3xl mt-5"
              />
            </div>
          </form>
          <div className="mx-auto text-center">
            <span className="text-[#6C6C6C] font-light text-xs">
              Already have an account?{" "}
            </span>
            <span
              className="text-xs font-medium cursor-pointer text-[#86A16E] no-underline md:text-clamp-xs"
              onClick={() => navigate("/users/sign-in")}
            >
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
