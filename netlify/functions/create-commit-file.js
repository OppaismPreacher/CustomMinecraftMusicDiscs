exports.handler = async (event) => {
  try {
      let requestBody = event.body;

      console.log("Full Event Object:", requestBody);
      
      if (event.isBase64Encoded) {
          // Decode the Base64 string into plain text
          requestBody = Buffer.from(event.body, "base64").toString("utf8");
      }

      const { id, file } = JSON.parse(requestBody);
      console.log("Parsed Body:", { id, file });

      return {
          statusCode: 200,
          body: JSON.stringify({ message: "Data received successfully" }),
      };
  } catch (error) {
      console.error("Error processing data:", error);

      return {
          statusCode: 500,
          body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
      };
  }
};