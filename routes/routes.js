const { Router } = require('express');
const router = Router();
const { Cite, User } = require('../db');
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
function checkPatient(req, res, next){

    if (req.session.user.rol != "PATIENT"){
        req.flash('errors', "No puedes acceder a esta parte del sistema por que no cuentas con los permisos necesarios.");
        return res.redirect('/');
    }

    next();

}

router.get ("/", [checkLogin ], async (req,res)=>{

	const cites = await Cite.findAll({ include:[{ model: User}]
    
    });
    console.log(cites);
    /*const users = await User.finall({ include:[{ model:Cite}]
    });
    console.log(users);*/

    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

	res.render("usuariopro.ejs", {errors, mensajes, cites});
	
});

/*router.get("/", [checkLogin ] , (req,res) => {


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");



    res.render("usuariopro.ejs",{ errors, mensajes})
});*/


router.get("/admin", [checkLogin, checkAdmin ] , (req,res) => {


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    res.render("adminpro.ejs",{ errors, mensajes })
});

router.get("/newappointement", [checkLogin, checkPatient ] , (req,res) => {


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");

    res.render("newappointement.ejs",{ errors, mensajes })
});

router.post('/newappointement', [checkLogin], async (req,res) =>{
    
      let existeError = false
/*
if (req.body.time <= ) {
	req.flash("error", "no se pueden agendar citas con la fecha indicada");
	existeError = true;
}
if (req.body.quote == "") {
	req.flash("error", "se requiere que ingrese la cita del autor ingresado")
}
*/
if(existeError != true){
    
    await Cite.create({
       
        date: req.body.date,
        time: req.body.time,
        complain: req.body.complain
    })
   
    

    
}
    
res.redirect("/usuariopro.ejs");
req.flash("mensaje", "la cita ha sido creada en la base de datos")
});



//const cites = await Cite.findAll();
  //  res.render('usuariopro.ejs', {cites: cites, mensaje, error})


module.exports = router;
