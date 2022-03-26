const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

app.post("/", function(req, res){
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    NAME: name,
                    UNAME: username
                }
            }   
        ]
    };


    const jsonData = JSON.stringify(data);

    const url = "https://us18.api.mailchimp.com/3.0/lists/"+process.env.LIST_ID;

    const options = {
        method: "POST",
        auth: "abhayxkumar:"+process.env.API_KEY
    }

    const request = https.request(url, options, function(response) {

        response.statusCode === 200 ? res.sendFile(__dirname + "/success.html") : res.sendFile(__dirname + "/failure.html");

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});



