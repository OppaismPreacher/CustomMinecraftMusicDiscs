let fetch;

async function loadFetch() {
    if (!fetch) {
      fetch = (await import('node-fetch')).default; // Dynamically import node-fetch
    }
    return fetch;
  }

const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME } = process.env;

exports.handler = async (event, context) => {
    if (event.httpMethod === 'POST') {
        // Log incoming event data
        console.log('Received event:', event);

        const { fileName, fileContent } = JSON.parse(event.body);

        // Log parsed data
        console.log('File name:', fileName);
        console.log('File content length:', fileContent.length);

        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`;

        const body = JSON.stringify({
            message: `Create file: ${fileName}`,
            content: Buffer.from(fileContent).toString('base64')
        });

        try {
            const fetch = await loadFetch(); // Ensure fetch is loaded dynamically
            console.log('Making API request to GitHub...');
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: body,
            });

            if (response.ok) {
                console.log('File created successfully!');
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'File created and committed successfully!' }),
                };
            } else {
                console.log('GitHub API response error:', await response.text());
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Failed to create file on GitHub.' }),
                };
            }
        } catch (error) {
            console.error('Error occurred while making GitHub API request:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Internal Server Error' }),
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
    };
};