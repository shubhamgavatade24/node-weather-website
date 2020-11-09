const request = require('request')

const forecast = (latitude , longitude ,callback) => {
    const url = 'https://api.darksky.net/forecast/96aa84042bf57d45a4344f680d8a6148/'+latitude+','+longitude + '?units=uk'

    request({url , json:true}, (error,{body}) => {
        if (error){
            callback('Unable to connect to weather service!')
        }
        else if(body.error){
            callback('Unable to find location')
        }
        else {            
            const curr = body.currently
            callback(undefined,body.daily.data[0].summary +' It is currently ' + curr.temperature + ' degrees out. The high today is '+ body.daily.data[0].temperatureHigh + ' with a low of ' + body.daily.data[0].temperatureLow +'. There is a ' + curr.precipProbability + '% chance of rain')    
        }
    })
}

module.exports = forecast
