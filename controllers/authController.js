const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {
    
    // Revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer el email y password
    const { email, password } = req.body;

    try {

        // Revisar que sea un usuario registrado
        let user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Revisar el password
        const passCheck = await bcryptjs.compare(password, user.password);

        if(!passCheck) {
            return res.status(400).json({ msg: 'Password Incorrecto' });
        }

        // Si todo es correcto
        // Crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        // Formar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) {
                throw error;
            }

            // Mensaje de confirmación
            res.json({ token: token });
        });

    } catch(error) {
        console.log(error);
    }
}

// Obtiene el usuario autenticado
exports.userAuthenticated = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select('-password');
        res.json({ user: user });
        
    } catch (error) {
        
        console.log(error);

        res.status(500).json({ msg: 'Hubo un error' })

    }

}