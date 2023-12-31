//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/signup.html');
});

const theKey = process.env.KEY;

// mailchimp.setConfig({
//     apiKey: process.env.KEY,
//     server: "us10"
// });


app.post('/', (req, res) => {
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firstName, lastName, email); 

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us10.api.mailchimp.com/3.0/lists/fcc33287c1';

    const options = {
        method: 'POST',
        //auth: `omar: ${process.env.KEY}`
        headers: {
            Authorization: `OAuth ${theKey}`
        }
    };

    const request = https.request(url, options, (response) =>{
        
        if(response.statusCode == 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', (data) =>{
            console.log(JSON.parse(data));
        })
    });
  
    request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res)=> {
    res.redirect('/');
});


app.listen(port, ()=> {
    console.log(`Started on port ${port}`);
  });

