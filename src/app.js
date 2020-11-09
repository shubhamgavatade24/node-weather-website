const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast') 

const app = express()
const port = process.env.PORT || 3000
// process.env.PORT is for heroku to set up the port number

// define paths for express config
const publicDirectoryPath = path.join(__dirname ,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Routes 

app.get('',(req,res) => {
    res.render('index', {
        title : 'Weather' ,
        name : 'sg24'
    })
})

app.get('/about', (req,res) =>{
    res.render('about', {
        title : 'About me' ,
        name : 'sg24'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title : 'Help',
        name : 'sg24',
        helpText : "This is a help msg"
    })
})

app.get('/weather', (req,res) => {

    if ( !req.query.address) {
        return res.send({
            error:'You must provide the address'
        })
    }

    geocode(req.query.address, (error,{latitude,longitude,location} = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude,longitude, (error,forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast : forecastData,
                location ,
                address : req.query.address
            })
        })
    })

})

app.get('/products' , (req,res) => {

    console.log(req.query.search)

    if ( !req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products : []
    })
})

app.get('/help/*', (req,res) => {
    res.render('404',{
        title: 'Error 404',
        name : 'abc',
        errorMsg : 'Help article not found'
    })
})

// * is wildcard character . it matches everthing
app.get('*', (req,res) => {
    res.render('404',{
        title: 'Error 404',
        name : 'abc',
        errorMsg : 'page not found'
    })
})

// callback function is optional in listen  ??
app.listen(port, () =>{
    console.log('Server is up on port '+ port )
})
