const express = require("express")
const mongoose = require("mongoose")
const expressSession = require("express-session")
const connectMongo = require("connect-mongo")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const {generateHashPwd,validatePassword} = require("./helper-functions/auth")
const {
    getHome,
    getLogin,
    getRegister,
    getProtected,
    getLogout,
    getLoginSuccsess,
    getLoginFailure
} = require("./route-functions/routes")





/*
    server setup
*/
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))



/*
    mongodb setup
*/
const mongodbUrl = "mongodb://mongod"

const connection = mongoose.createConnection(mongodbUrl,{useNewUrlParser: true, useUnifiedTopology: true})

connection.on("connected", () => {
    console.log("connected to mongodb successfully!")
})
connection.on("error", (err) => {
    console.log("Failed to connect to mongodb!")
    console.log(err)
})

const userSchema = mongoose.Schema({
    username: String,
    salt: String,
    hashedPwd: String
})

const userModel = connection.model("users", userSchema)




/*
    sesstion setup
*/
const sessionStore = connectMongo.create({mongoUrl:mongodbUrl,collectionName:"session"})

const expressSessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge:1000*60*60*24,
        value:"this is a cookie"
    }
}

app.use(expressSession(expressSessionOptions))




/*
    passport setup
*/

const customField = {
    usernameField:"username",
    passwordField:"password"
}

const cb = (username, password, next) => {
    userModel.findOne({username:username})
        .then(user => {
            if(!user){
                return next(null, false)
            }else{
                const isValid = validatePassword(password, user.hashedPwd, user.salt)
                if(isValid){
                    return next(null, user)
                }else{
                    return next(null, false)
                }
            }
        })
        .catch(err => {
            return next(err)
        })
}

passport.serializeUser((user,done)=>{
    done(null, user._id)
})
passport.deserializeUser((userId, done)=>{
    userModel.findById(userId)
        .then(user => {
            done(null, user)
        })
        .catch(err => {
            done(err)
        })
})

const localStrategy = new LocalStrategy(customField,cb)

passport.use(localStrategy)

app.use(passport.initialize())
app.use(passport.session())






/*
    routes
*/
app.get("/", getHome)
app.get("/login", getLogin)
app.get('/register', getRegister);
app.get('/protected-route', getProtected);
app.get('/logout', getLogout);
app.get('/login-success', getLoginSuccsess);
app.get('/login-failure', getLoginFailure);



app.post("/login", passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }))
app.post("/register", (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    const hashedData = generateHashPwd(password)

    const newUser = new userModel({
        username: username,
        salt: hashedData.salt,
        hashedPwd: hashedData.hashedPwd
    })

    newUser.save()
        .then((user)=>{
            console.log(user)
        })
    
    res.redirect('/login');
})




const port = 3000
app.listen(port, () => {
    console.log("App listen on port " + port)
})