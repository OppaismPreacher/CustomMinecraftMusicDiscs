// simple-log.js
/*exports.handler = async (event, context) => {
    console.log("Simple function was triggered :):):):):):):)!");
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Function ran successfully!" }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow any origin
        "Access-Control-Allow-Methods": "GET, POST", // Allow specific methods
      },
    };
  };
  */

  exports.handler = async (event, context) => {
    console.log("Simple function was triggered :):):):):):):)!");
  
    // Parse the JSON body from the event
    let requestData = {};
    try {
      requestData = JSON.parse(event.body); // Parse the incoming JSON
      console.log("Received data:", requestData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid JSON format" }),
        headers: {
          "Access-Control-Allow-Origin": "*", // Allow any origin
          "Access-Control-Allow-Methods": "GET, POST", // Allow specific methods
        },
      };
    }
  
    // Example: you can now access the data
    const { key } = requestData; // Adjust based on your JSON structure
    console.log("Received key:", key);
  
    // Respond back to the client
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Function ran successfully!", receivedData: requestData }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow any origin
        "Access-Control-Allow-Methods": "GET, POST", // Allow specific methods
      },
    };
  };