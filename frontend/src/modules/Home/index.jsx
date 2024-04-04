import { Link } from "react-router-dom";

import Card from "../../components/Common/Card";
import GreetingCard from "../../components/Common/GreetingCard";
import PostCard from "../../components/Common/PostCard";
import defaultImage from "../../assets/images/default-image.jpg";
import wasteDefaultImage from "../../assets/images/waste-default-image.webp";
import { useWastes } from "../../hooks/useWaste";

const Home = () => {
  document.title = "Green Loop | Home";

  const user = JSON.parse(localStorage.getItem("user:detail"));
  const { wastes, isLoading } = useWastes();
  const isLoggedIn = user !== null || false;
  console.log("wastes: ", wastes)
  if (isLoading) return;

  return (
    <div className="bg-[#F8F8F8] w-full h-full mt-12 py-14" id="homepage">
      {isLoggedIn && (
        <div className="max-w-screen-md px-6 mx-auto flex flex-col text-center justify-center w-[40%] 2xl:w-[45%] xl:w-[55%] lg:w-[80%] lg:px-16 sm:px-8 xsm:px-0 2xsm:px-0">
          <GreetingCard user={user} />
          <Link to="listing">
            <Card wasteLength={wastes?.length} /> 
          </Link>
          {wastes &&
            wastes?.length > 0 &&
            wastes?.map((waste, index) => (
              <PostCard
                key={index}
                props={waste}
                defaultImage={defaultImage}
                wasteDefaultImage={wasteDefaultImage}
                loggedInUser={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Home;
