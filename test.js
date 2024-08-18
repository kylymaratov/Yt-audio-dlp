const { getVideoById } = require("./dist/index");
const http = require("https");
getVideoById("v2AC41dglnM")
    .then((response) => {
        http.get(response.adaptiveFormats[1].url, (response) => {
            response.on("data", (chunk) => console.log(chunk));
        });
    })
    .catch((err) => console.log(err));
