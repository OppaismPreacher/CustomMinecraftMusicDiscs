const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME } = process.env;

const formidable = require('formidable');
const fs = require('fs');
const fetch = require('node-fetch'); // Assuming you're using node-fetch for GitHub API requests

exports.handler = async (event, context) => {

    console.log('Received event:', event);

    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(event, async (err, fields, files) => {  // Mark the callback as async
            if (err) {
                console.error('Error parsing form:', err);
                return resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'File upload failed' }),
                });
            }

            // Extract the text data (fileName) and the uploaded file (MP3 file)
            const { fileName } = fields; 
            const uploadedFile = files.file; // Assuming the input field is named "file"

            if (!fileName || !uploadedFile) {
                console.error('Invalid input: Missing fileName or file');
                return resolve({
                    statusCode: 400,
                    body: JSON.stringify({ error: 'fileName and file are required' }),
                });
            }

            console.log('File name:', fileName);
            console.log('Uploaded file:', uploadedFile); // This is the MP3 file

            // Read the file content as binary (using file.path)
            const fileContent = fs.readFileSync(uploadedFile.path);

            // Now that we have fileContent, we can send it to GitHub (or any other service)
            const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`;
            const body = JSON.stringify({
                message: `Create file: ${fileName}`,
                content: Buffer.from(fileContent).toString('base64'), // Convert to base64 for GitHub API
            });

            try {
                // Make the GitHub API request
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: body,
                });

                if (response.ok) {
                    console.log('File created successfully on GitHub!');
                    return resolve({
                        statusCode: 200,
                        body: JSON.stringify({ message: 'File created and committed successfully!' }),
                    });
                } else {
                    const errorText = await response.text();
                    console.error('GitHub API response error:', errorText);
                    return resolve({
                        statusCode: response.status,
                        body: JSON.stringify({ error: `GitHub API error: ${errorText}` }),
                    });
                }
            } catch (error) {
                console.error('Error occurred during GitHub API request:', error);
                return resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Internal Server Error' }),
                });
            }
        });
    });
};