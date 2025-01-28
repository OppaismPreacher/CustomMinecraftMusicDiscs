exports.handler = async (event) => {
  try {
      console.log("Raw Body Received:", event.body);

      return {
          statusCode: 200,
          body: `Received text: ${event.body}`, // Respond with the same text
      };
  } catch (error) {
      console.error("Error processing request:", error);

      return {
          statusCode: 500,
          body: "Internal Server Error",
      };
  }
};