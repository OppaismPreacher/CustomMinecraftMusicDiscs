const Busboy = require("busboy");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {

        console.log("Not POST");

        return {
            statusCode: 405,
            body: "Method Not Allowed",
        };
    }

    console.log(event);

    return new Promise((resolve, reject) => {
        const busboy = new Busboy({
            headers: {
                "content-type": event.headers["content-type"],
            },
        });

        const fields = {};
        const files = [];

        busboy.on("field", (fieldname, val) => {
            fields[fieldname] = val;
        });

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            let fileBuffer = Buffer.alloc(0);

            file.on("data", (data) => {
                fileBuffer = Buffer.concat([fileBuffer, data]);
            });

            file.on("end", () => {
                files.push({
                    fieldname,
                    filename,
                    encoding,
                    mimetype,
                    content: fileBuffer.toString("base64"), // Encode file content as base64
                });
            });
        });

        busboy.on("finish", () => {
            console.log("Fields:", fields);
            console.log("Files:", files);

            resolve({
                statusCode: 200,
                body: JSON.stringify({
                    message: "Data received",
                    fields,
                    files,
                }),
            });
        });

        busboy.on("error", (error) => {
            reject({
                statusCode: 500,
                body: `Error parsing form data: ${error.message}`,
            });
        });

        busboy.end(Buffer.from(event.body, "base64"));
    });
};