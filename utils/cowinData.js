const request = require("postman-request")  //requiring the postman-request npm package to handle our http requests

function cowin() {
    var pincodes = [ "411001", "411002", "411028", "411011", "411037", "411016", "411046", "411040", "411004" ] //pincodes around to search
    var dates = []

    //to automate getting the current date
    var day = new Date()
    var today = day.getDate()
    var month = day.getMonth()+1
    var year = day.getFullYear()

    if(today<10 || month<10) {      //since today will give a single digit date if it is < 10, but the API requires a parameter of dd-mm-yyyy
        newtoday = '0'+today;
        newMonth = '0'+month;
        dates.push(newtoday+"-"+newMonth+"-"+year)
    }

    for(i=1; i<=4; i++) {
        currentDay = (today+i)+"-"+newMonth+"-"+year
        dates.push(currentDay.toString())
    }
    // var dates = [ "09-05-2021", "10-05-2021", "11-05-2021", "12-05-2021" ]

    for(i=0; i<pincodes.length; i++) {
        for(j=0;j<dates.length;j++) {
            url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pincodes[i]+"&date="+dates[j]
            request({url: url, json: true}, function(error, response) {
                if(error) {
                    console.log("Error: ", error);
                }
                else {
                    data = response.body.centers;
                    if(data.length === 0) {
                        return 
                    }
                    else {
                        const name = data[0].name;
                        const address = data[0].address;
                        const pincode = data[0].pincode;
                        const date = data[0].sessions[0].date;
                        const capacity = data[0].sessions[0].available_capacity;
                        const age = data[0].sessions[0].min_age_limit;
                        
                        if(18 <= age <= 44 && capacity>0) {
                            console.log("AVAILABLE..");
                            console.log("Pincode: ", pincode);
                            console.log("Name: ", name);
                            console.log("Address: ", address);
                            console.log("Date: ", date);
                            console.log("\n\n");
                        }
                    }
                }
            })
        }
    }
}

module.exports = {
    cowin: cowin
}