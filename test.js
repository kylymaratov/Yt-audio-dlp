const express = require("express")

const {    getAudioStreamById} = require("./dist/index");
 
const app = express();

app.get("/video/:id", (req, res) => {
     res.send(`<audio controls autoplay src="/listen/${req.params.id}"></audio>`)
})

app.get("/listen/:id", (req, res) => {
    getAudioStreamById(req.params.id).then((response) => {
        response.stream.pipe(res);
    }).catch((err) => res.send(err.message))
})


app.listen(3000)