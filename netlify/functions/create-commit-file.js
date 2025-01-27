exports.handler = async (event, context) => {
    try {
      // Check if the request method is POST
      if (event.httpMethod !== 'POST') {
        console.log("NOT POST")
        
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
      }
  
    console.log(event);

      const { isBase64Encoded, body } = event;
  
      // Handle Base64-encoded body
      if (isBase64Encoded) {
        const decodedBody = Buffer.from(body, 'base64');
        console.log('Received file data (Base64 decoded):', decodedBody);
      } else {
        console.log('Received file data (Plain text):', body);
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'File received successfully' }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  };