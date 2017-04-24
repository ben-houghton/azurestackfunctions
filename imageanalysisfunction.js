
var request = require('request');

　
module.exports = function (context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    // Make a call out to Cognitive Services
    if (req.body.url)
    {
        var queryString = 'visualFeatures=Categories,Tags,Description,Faces,ImageType,Color,Adult&details=Celebrities&language=en';

        request.post({
            url: 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze?'+ queryString,
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": "[Cogntive Services Key]"
            },
            json: { "url": req.body.url }
        },
        function (err, res, body) {
            context.log("Response from Cog API (err, res, body)");
            context.log(JSON.stringify(err, null, " "));
            context.log(JSON.stringify(res, null, " "));
            context.log(JSON.stringify(body, null, " "));

            // Check to see if we succeeded.
            if (err || res.statusCode != 200) {
                context.log(err);
                context.res = {
                    status: 500,
                    body: err
                }
                context.done();
                return
            }

            context.res = {
                // status: 200, /* Defaults to 200 */
                // Send back the score we got from the Cog API
                body: { caption: body.description.captions[0].text, raw: body }
            };
            context.done();
        });
    }
    else {
        // Bad request - Missing property on body
        context.res = {
            status: 400,
            body: "Expected 'text' property on query string"
        };
        context.done();
    }
};
