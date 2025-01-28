const formidable = require('formidable');

exports.handler = async (event, context) => {
  try {
    // Ensure the request is a POST method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    // Parse the form data
    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return reject({
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
          });
        }

        // Access the form fields (e.g., fileName)
        const fileName = fields.fileName[0]; // Assuming it's the first field
        const file = files.file[0]; // The uploaded file

        // Log the received data
        console.log('Received file name:', fileName);
        console.log('Received file data:', file);

        // Respond with success
        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'File received successfully' }),
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};