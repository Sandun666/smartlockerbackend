// set database password before running the app
const config = require('../config/databaseConfig');
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

const router = express.Router();

const connection = config.connection;

router.get('/:locationId', auth, (req, res) => {

    //validating request body
    const schema = Joi.object({
    });

    const result = schema.validate(req.body);

    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    
    // retrive from database
    connection.query('SELECT * FROM Locker WHERE LockerLocationId = ?', [req.params.locationId], (err, rows, fields) => {
        if (err) return res.status(500).send("Database failure");
        if (!rows.length) return res.status(400).send("Invalid LocationID");
        if (rows.length) {
            const token = jwt.sign({ jwtEmail: req.fromUser.jwtEmail, jwtUserId: req.fromUser.jwtUserId}, 'smartLocker_jwtPrivateKey');
            res.header('x-auth-token', token).send(rows);
        }
    });
});

module.exports = router;