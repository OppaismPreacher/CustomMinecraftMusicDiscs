exports.handler = async (event, context) => {
    try {
      // Check if the request method is POST
      if (event.httpMethod !== 'POST') {
        return {
          statusCode: 405,
          body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
      }
  
      // Parse the incoming form data
      const formData = new URLSearchParams(event.body);
      const fileName = formData.get('fileName');
      const fileData = formData.get('file');
  
      // Log the file name and binary data to the console
      console.log('Received file name:', fileName);
      console.log('Received file data:', fileData);
  
      // Return a success response
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'File received and logged successfully' }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  };