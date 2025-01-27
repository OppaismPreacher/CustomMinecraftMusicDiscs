const fetch = require('node-fetch'); // Ensure this is installed
const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME } = process.env; // GitHub Token and repo details from Netlify's environment variables

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        // Parse the incoming data
        const { fileName, fileContent } = JSON.parse(event.body);

        // GitHub API URL to create or update a file
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`;

        // Prepare the request body for the GitHub API (with base64 encoding)
        const body = JSON.stringify({
            message: `Create file: ${fileName}`,
            content: Buffer.from(fileContent).toString('base64') // Encode content to base64
        });

        try {
            // Make the API request to GitHub
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            // Check if the response is successful
            if (response.ok) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'File created and committed successfully!' }),
                };
            } else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Failed to create file on GitHub.' }),
                };
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Internal Server Error' }),
            };
        }
    }

    // Handle methods other than POST
    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
    };
};