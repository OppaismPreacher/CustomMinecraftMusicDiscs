const formidable = require("formidable");

exports.handler = async (event) => {
    try {
        // Ensure the request is a POST
        if (event.httpMethod !== "POST") {
            console.log("Not a POST method");
            return {
                statusCode: 405,
                body: "Method Not Allowed",
            };
        }


        console.log("event");

        // Parse the form data
        const form = new formidable.IncomingForm();

        return new Promise((resolve, reject) => {
            form.parse(event, (err, fields, files) => {
                if (err) {
                    console.error("Error parsing form data:", err);
                    reject({
                        statusCode: 500,
                        body: "Internal Server Error",
                    });
                    return;
                }

                console.log("Text Field:", fields); // The text field
                console.log("File Field:", files); // The uploaded file

                resolve({
                    statusCode: 200,
                    body: `Received text: ${fields.text}, file name: ${files.file.originalFilename}`,
                });
            });
        });
    } catch (error) {
        console.error("Error processing request:", error);

        return {
            statusCode: 500,
            body: "Internal Server Error",
        };
    }
};