exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { text } = JSON.parse(event.body); // Extract the text
    const fileContent = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf-8')
      : null; // Handle the file content if sent as base64

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data received",
        text,
        fileContent: fileContent ? fileContent.substring(0, 50) + "..." : "No file received", // Example truncation
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error processing request" }),
    };
  }
};