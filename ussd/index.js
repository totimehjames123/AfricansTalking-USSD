const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

//messaging
const sendSMS = require('./sendSMS');

const smsServer = require("./smsServer");

const app = express();
const PORT = 8000

//MODELS
const  User = require('./model/user')


//MONGODB CONNECTION
const database_url = 'mongodb://127.0.0.1:27017/ussd'
mongoose.connect(database_url)

const db = mongoose.connection;
db.on('error', (err) => {
    console.log(err);
})

db.once('open', ()=>{
    console.log('Database is running.')
})


//BODY PARSER
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send("Success Message")
})

app.post('/', (req, res) => {
    // console.log(req.body)
    const {phoneNumber, text, sessionID} = req.body
    let response;

    if (text === ''){
        response = 'CON Enter your first name'
    }
    if (text !== ''){
        let array = text.split('*')
        if (array.length === 1){
            response = 'CON Enter your ID number'
        }
        else if (array.length === 2){
            //ID NUMBER
            if (parseInt(array[1]) > 0){
                response = "CON Please confirm if you want to save the data. \n1. Confirm \n2. Cancel \n3. View all users"

            }
            else{
                response = "END Network Error. Please try again!"
            }
            
        }
        else if (array.length === 3){
            if (parseInt(array[2]) === 1){
                let data = new User();
                data.fullname = array[0];
                data.id_number = array[1];

                data.save()
                response = 'END Your data has been saved successfully : ' + array[0] + " with ID " + array[1]

                // TODO: Call sendSMS function
                sendSMS(phoneNumber, array[0], array[1]);

                // TODO: Call start sms server
                smsServer();
            }
            else if (parseInt(array[2]) === 2){
                response = "END Sorry, data was not saved"
            }
            else if (parseInt(array[2]) === 3){
                try {
                    User.find({})
                        .then(users => {

                        if (users.length > 0) {
                            users_data = users.map((item, index) => `${index + 1}. ${item.fullname}`).join('\n');
                            response = `END Current users. \n${users_data}`;
                        } else {
                            response = 'END No users found.';
                        }
                    })
                  } catch (error) {
                    response = 'END Failed to fetch user data. Please try again!';
                  }
            
            }
            else {
                response = "END Invalid input"
            }
        }
        else {
            response = 'END Network error. Please try again!'
        }
    }


    setTimeout(() => {
        console.log(text)
        res.send(response);
        res.end()
    }, 2000)
})



//listening?
app.listen(PORT, () => {
    console.log("app is running on port " + PORT)
})
