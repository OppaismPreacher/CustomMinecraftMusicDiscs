const fetch = require('node-fetch'); // If not available by default
const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME } = process.env; // Set these in Netlify env variables

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        const { fileName, fileContent } = JSON.parse(event.body);

        // GitHub API URL to create a file
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`;

        // Prepare the request body
        const body = JSON.stringify({
            message: `Create file: ${fileName}`,
            content: Buffer.from(fileContent).toString('base64')
        });

        // Make the API request to GitHub
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: body
        });

        if (!response.ok) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Failed to create file.' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File created and committed successfully!' })
        };
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};