require('dotenv').config()

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const port = process.env.PORT
const initializePassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

initializePassport(
    passport,
    email => users.find(user => email === user.email),
    id => users.find(user => id === user.id)
)

app.set('view-engine', 'ejs') 
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const users = []

app.get('/',checkAuthenticate ,(req, res) => {
    res.render('main.ejs', {name: 'sofiane'})
})

app.get('/login', checkNotAuthenticate, (req, res) => {
    res.render('login.ejs')
})
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register',checkNotAuthenticate, (req, res) => {
    res.render('register.ejs')
})
app.post('/register',checkNotAuthenticate, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    console.log(users)
})

function checkAuthenticate(req, res, next) {
        if( req.isAuthenticated()){
            return next()
        }
        return res.redirect('/login')
}
function checkNotAuthenticate(req, res, next) {
        if( req.isAuthenticated()){
            return res.redirect('/')
        }
        return next()
}


app.listen(port, () => {
    console.log('server started at port: ' + port)
})