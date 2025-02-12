const express = require('express');
const router = express.Router();
const user = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async(req, res) => {
    try {
        const userExists = await user.findOne({ email: req.body.email });
        if(userExists) {
            return res.status(200).send({message: 'User already exists', success: false});
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new user(req.body);
        await newUser.save();
        res.status(200).send({message: 'User registered successfully', success: true});
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error creating user', success: false, error});
    }
})

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }); 
        if(!user) {
            return res.status(200).send({message: 'User not found', success: false});
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) {
            return res.status(200).send({message: 'Invalid password', success: false});
        }
        else {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.status(200).send({message: 'User logged in successfully', success: true, data: token});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({message: 'Error logging in', success: false, error});
    }
})

module.exports = router;