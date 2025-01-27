let fetch;

async function loadFetch() {
    try {
      if (!fetch) {
        console.log('Loading fetch dynamically...');
        fetch = (await import('node-fetch')).default; // Dynamically import node-fetch
        console.log('fetch loaded successfully');
      }
      return fetch;
    } catch (error) {
      console.error('Failed to load fetch:', error);
      throw new Error('fetch failed');
    }
  }

const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME } = process.env;

exports.handler = async (event, context) => {
    console.log('Function triggered');

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    console.log('Received event:', event);

    try {
        const { fileName, fileContent } = JSON.parse(event.body);

        if (!fileName || !fileContent) {
            console.error('Invalid input: Missing fileName or fileContent');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'fileName and fileContent are required' }),
            };
        }

        console.log('File name:', fileName);
        console.log('File content length:', fileContent.length);

        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${fileName}`;
        const body = JSON.stringify({
            message: `Create file: ${fileName}`,
            content: Buffer.from(fileContent).toString('base64'),
        });

        const fetch = await loadFetch(); // Dynamically load fetch if necessary

        console.log('Making API request to GitHub...');
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API response error:', errorText);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `GitHub API error: ${errorText}` }),
            };
        }

        console.log('File created successfully!');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File created and committed successfully!' }),
        };

    } catch (error) {
        console.error('Error occurred:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};