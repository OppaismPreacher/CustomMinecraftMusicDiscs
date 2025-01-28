exports.handler = async (event) => {
  try {

      console.log(event);

      // Parse the JSON payload
      const { id, file } = JSON.parse(event.body);

      // Decode the Base64-encoded binary file
      const binaryFile = Buffer.from(file, "base64");

      console.log("ID:", id);
      console.log("Binary File:", binaryFile);

      // Process the data (e.g., save it, commit to GitHub, etc.)

      return {
          statusCode: 200,
          body: JSON.stringify({ message: "Data received successfully" }),
      };
  } catch (error) {
      console.error("Error processing data:", error);

      return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal Server Error" }),
      };
  }
};