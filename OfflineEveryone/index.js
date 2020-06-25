const makeEveryoneOffline = require("../shared/makeEveryoneOffline");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        const x = await makeEveryoneOffline();
        console.log(x);

        context.res = {
            status: 200, /* Defaults to 200 */
        };
    }
    catch
    {
        context.res = {
            status: 500

        };
    }
}