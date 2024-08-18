const { getVideoById } = require("./dist/index");
const http = require("https");
getVideoById("v2AC41dglnM")
    .then((response) => {
        console.log(response);
    })
    .catch((err) => console.log(err));
