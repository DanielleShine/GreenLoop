const envRoute = (productionRoute, developmentRoute) => {
  return import.meta.env.VITE_ENV === "production"
    ? productionRoute
    : developmentRoute;
};

export const getEndpoint = envRoute(
  import.meta.env.VITE_PROD_BASE_URL,
  import.meta.env.VITE_DEV_BASE_URL
);

export const socketPort =
  import.meta.env.VITE_ENV === "production"
    ? import.meta.env.VITE_PROD_BASE_URL + ":8080"
    : "http://localhost:8080";

export const devPrint = (message, ...rest) => {
  if (import.meta.env.VITE_ENV === "development") {
    console.log(message, ...rest);
  }
};
