const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html")
});

app.post("/", function(req, res){
    const FirstName = req.body.fname;
    const LastName = req.body.lname;
    const Email = req.body.email;

    const data = {
        members: [
            {
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: FirstName,
                    LNAME: LastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/601241bf5c";

    const Options = {
        method: "POST",
        auth: "tskhayagreeva:adc344933d2445dc459de1eb59d043f27-us7"
    }

    const request = https.request(url, Options, function(response){
            if (response.statusCode === 200){
                res.sendFile(__dirname+"/success.html");
            } else {
                res.sendFile(__dirname+"/failure.html");
            }

            response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });


    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});

// api id
// dc344933d2445dc459de1eb59d043f27-us7

// list id 
// 601241bf5c