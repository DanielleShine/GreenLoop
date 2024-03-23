import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchUsers } from "../api/user";

export const useUser = (userId) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(userId),
    initialData: {},
  });

  const { data: userData } = !isLoading && user;

  return { userData, isLoading, error };
};

export const useUsers = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
    initialData: [],
  });
  const { data: allUsers } = !isLoading && users;

  return { allUsers, isLoading, error };
};
