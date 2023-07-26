const AfricasTalking = require('africastalking');

// TODO: Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: 'bf445eb97882d6b9a43be0a20426c3081c27ef967b3acaa541cc571cb4eaa99f', 
  username: 'sandbox'
});


module.exports = async function sendSMS(to, name, id) {
    
    // TODO: Send message
    setTimeout(()=>{
    try {
        
            const result= africastalking.SMS.send({
                to: to, 
                message: `Hey ${name} with ID of ${id}. Your details has been successfully saved into our database. Your telephone number is ${to}.`,
                from: 'UniqueGeeks'
            });
        
        
        console.log(result);
    } catch(ex) {
        console.error(ex);
    } 
    }, 5000)

};