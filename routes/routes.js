const { Router } = require('express');
const router = Router();

// aca configuramos las rutas.
function checkLogin(req, res, next) {

    
    if (req.session.user == null){
        req.flash('errors', "Tienes que estar logeado para entrar a esta parte del sistema.");
        return res.redirect('/login');
    }

    res.locals.user = req.session.user;

    next();
}

function checkAdmin(req, res, next){

    if (req.session.user.rol != "DOCTOR"){
        req.flash('errors', "No tienes permisos de Administrador. No puedes entrar a esta parte del sistema.");
        return res.redirect('/');
    }

    next();

}


router.get("/", [checkLogin ] , (req,res) => {


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");



    res.render("usuariopro.ejs",{ errors, mensajes})
});


router.get("/admin", [checkLogin, checkAdmin ] , (req,res) => {


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    res.render("adminpro.ejs",{ errors, mensajes })
});


module.exports = router;
