exports.handler = async (event, context) => {
    console.log("Simple function was triggered!");

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Function ran successfully!" })
    };
};