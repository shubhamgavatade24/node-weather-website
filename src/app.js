const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast') 

const app = express()

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
        name : 'abc'
    })
})

app.get('/about', (req,res) =>{
    res.render('about', {
        title : 'About me' ,
        name : 'abc'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title : 'Help',
        name : 'abc',
        helpText : "this is a help msg"
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
app.listen(3000, () =>{
    console.log('Server is up on port 3000.')
})
