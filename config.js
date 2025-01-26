const checkConfig = (server) => {
    let config = {};
    switch (server) {
      case "production":
        config = {
          baseUrl: "",
        };
        break;
      case "local":
        config = {
          baseUrl: "http://localhost:5173",
        };
        break;
      default:
        break;
    }
    return config;
  };
  
  export const selectServer = "local";
  export const config = checkConfig(selectServer);
  