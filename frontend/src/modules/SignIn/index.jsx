import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import { signInUser } from "../../api/auth";
import forrestImage from "../../assets/images/login-side-panel.webp";
import greenLoopLogo from "../../assets/images/greenloop-logo.png";

const SignIn = () => {
  document.title = "Green Loop | Sign In";

  const { register, handleSubmit, reset } = useForm();

  const navigate = useNavigate();

  const { mutateAsync: submitUser } = useMutation({
    mutationFn: (data) => signInUser(data),
    onSuccess: (res) => {
      localStorage.setItem("user:token", res.data.token);
      localStorage.setItem("user:detail", JSON.stringify(res.data.user));
      navigate("/");
      reset();
    },
    onError: (error) => {
      alert(error.response?.data || error?.data);
      console.log("error: ", error);
      reset();
    },
  });

  const onSubmit = (data, e) => {
    e.preventDefault();
    submitUser(data);
  };

  return (
    <div className="flex h-dvh w-dvw">
      <div className="flex shadow-lg justify-center my-auto w-2/4 h-9/10 items-center max-w-6xl mx-auto lg:flex-col md:items-start md:w-3/5 sm:w-3/4 sm:h-full xsm:w-full xsm:h-screen">
        <div className="w-2/4 h-full border border-palette-lighter rounded shadow-lg lg:mb-3 md:mb-0 lg:h-1/6 lg:w-full">
          <img
            src={forrestImage}
            alt="Forrest illustration"
            className="w-full h-full object-cover xsm:h-36"
          />
        </div>
        <div className="flex flex-col justify-center h-full w-full max-w-sm mx-auto space-y-4 lg:w-4/6 xsm:w-3/4">
          <div className="mx-auto w-20 h-20 justify-center lg:w-14 lg:h-14">
            <img
              src={greenLoopLogo}
              alt="Greenloop Logo"
              className="w-full h-full object-cover "
            />
          </div>
          <div className="text-4xl font-extrabold text-[#31572C] text-center pb-9 lg:text-clamp-form-greenloop lg:pb-3">
            GreenLoop
          </div>
          <div className="text-clamp-form-header font-extrabold px-12 md:ml-0">
            Sign In
          </div>

          <form
            className="flex flex-col justify-start items-left px-12 w-full md:px-0"
            onSubmit={handleSubmit(onSubmit)}
          >
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
              placeholder="password"
              className="mb-1"
              register={{ ...register("password") }}
            />
            <span className="text-right mb-7">
              <span
                className="text-xs cursor-pointer text-end text-[#86A16E] no-underline"
                onClick={() => navigate("/users/sign-up")}
              >
                Forgot Password?
              </span>
            </span>
            <div className="text-center">
              <Button
                label="Sign in"
                type="submit"
                className="bg-[#31572C] rounded-3xl mb-2"
              />
            </div>
          </form>
          <div className="mx-auto text-center">
            <span className="text-[#6C6C6C] font-light text-xs">
              Don&apos;t have an account yet?{" "}
            </span>

            <span
              className="text-xs font-medium cursor-pointer text-[#86A16E] no-underline md:text-clamp-xs"
              onClick={() => navigate("/users/sign-up")}
            >
              Create here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
