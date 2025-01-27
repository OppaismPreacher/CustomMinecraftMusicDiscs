// simple-log.js
exports.handler = async (event, context) => {
    console.log("Simple function was triggered!");
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Function ran successfully!" }),
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow any origin
        "Access-Control-Allow-Methods": "GET, POST", // Allow specific methods
      },
    };
  };