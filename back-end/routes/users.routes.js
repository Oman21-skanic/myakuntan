const express = require('express');
const {protectedMiddleware, isAdmin, protectedUser} = require('../middleware/authMiddleware');
const {allUser, getUserById, updateUserHandler, updatePasswordHandler, deleteUserByIdHandler, createAccountsByRoleHandler} = require('../controllers/userController');
const {registerUser, currentUser} = require('../controllers/authController');
// eslint-disable-next-line new-cap
const router = express.Router();


// Register a new user
router.post('/', registerUser);

// previlege admin ambil data all user
router.get('/', protectedMiddleware, isAdmin, allUser);

// get data user login atau tidak
router.get('/me', protectedMiddleware, currentUser);

// get user berdasarkan id
router.get('/:id', protectedMiddleware, protectedUser, getUserById);

// update user {name}
router.put('/:id', protectedMiddleware, protectedUser, updateUserHandler);

// end points update password {oldPassword, newPassword}
router.put('/:id/password', protectedMiddleware, protectedUser, updatePasswordHandler),

// end points delete user by id
router.delete('/:id', protectedMiddleware, protectedUser, deleteUserByIdHandler);

// create accounts/ select bidang_usaha
router.post('/:id/accounts', protectedMiddleware, protectedUser, createAccountsByRoleHandler);

module.exports = router;
