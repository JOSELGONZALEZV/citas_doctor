const Sequelize = require('sequelize');
const { Model, DataTypes, Deferrable } = require("sequelize");
const clave = require('./secret')

// acá creamos la conexión a la Base de Datos
const sql = new Sequelize('db_doc_cites', 'root', clave.clave, {
    host: 'localhost',
    dialect: 'mysql'
});

const User = sql.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar un nombre'
            },
            len: {
                args: [2],
                msg: 'El nombre debe ser de largo al menos 2'
            }
        }
    },
    rol: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:"NORMAL"
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Debe indicar un email'
            },
            len: {
                args: [3],
                msg: 'El email debe ser de largo al menos 3'
            },
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar una contraseña'
            },
            len: {
                args: [3],
                msg: 'La contraseña debe ser de largo al menos 3'
            },
        }
    }
},{timetamps: true});

const Cite = sql.define('Cite', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: {
            notNull: {  
                msg: 'debe ingresar un mensaje',            
                format: 'MM,dd,yy'
            }
        }
    },
    time: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notNull: {  
                msg: 'debe ingresar una hora',
                format: 'HH,mm'
            }
            
        }
    },
    complain: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {  
                msg: 'debe idetificar los sintomas y enfermades'
            }
        }
    }    
},{timetamps: true});

//  después sincronizamos nuestro código con la base de datos
sql.sync()
    .then(() => {
        console.log('Tablas creadas (SI NO EXISTEN) ...');
});

    User.hasMany(Cite);
    Cite.belongsTo(User);

// finalmente acá listamos todos los modelos que queremos exportar
module.exports = {
    User, Cite
};