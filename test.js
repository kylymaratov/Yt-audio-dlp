const { getVideoById } = require("./dist/index");

getVideoById("v2AC41dglnM")
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
