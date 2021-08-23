const getHome = (req,res) => {
    if(req.isAuthenticated()){
        res.redirect('/login-success');
    }else{
        res.send('<h1>Home</h1><h3>Welcome to my website</h3><p>Please <a href="/register">register</a> or <a href="/login">login</a></p>');
    }
    
}
const getLogin = (req,res)=>{
    if(req.isAuthenticated()){
        res.redirect('/login-success');
    }else{
        const form = '<h1>Login Page</h1><form method="POST" action="/login">\
        Enter Username:<br><input type="text" name="username">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form><a href="/register">register</a>';
    
        res.send(form);
    }
}
const getRegister = (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/login-success');
    }else{
        const form = '<h1>Register Page</h1><form method="post" action="register">\
        Enter Username:<br><input type="text" name="username">\
        <br>Enter Password:<br><input type="password" name="password">\
        <br><br><input type="submit" value="Submit"></form><a href="/login">Login</a>';

        res.send(form);
    }
}

const getProtected = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1><h3>*The earth is not flat*</h3><h5>This is a secret, only authenticated user can see it, so dont tell any one</h5><p><a href="/logout">Logout and reload</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><h3>Login to se a secret</h3><p><a href="/login">Login</a></p>');
    }
}
const getLogout = (req, res) => {
    req.logout();
    res.redirect('/protected-route');
}
const getLoginSuccsess = (req, res) => {
    res.send('<p>You are logged in. --> <a href="/protected-route">Go to protected route</a></p>');
}
const getLoginFailure = (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/login-success');
    }else{
        res.send('Wrong credential, try <a href="/login">login</a> again!.');
    }
    
}

module.exports = {
    getHome,
    getLogin,
    getRegister,
    getProtected,
    getLogout,
    getLoginSuccsess,
    getLoginFailure
}