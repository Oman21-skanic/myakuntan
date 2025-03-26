const express = require('express');
const {protectedMiddleware, isAdmin} = require('../middleware/authMiddleware');
const {allUser, getUserById, updateUserHandler, updatePasswordHandler, deleteUserByIdHandler} = require('../controllers/userController');
// eslint-disable-next-line new-cap
const router = express.Router();

// previlege admin get all user
router.get('/all', protectedMiddleware, isAdmin, allUser);
// get user berdasarkan id
router.get('/:id', protectedMiddleware, getUserById);

// update user {email, name}
router.put('/:id', protectedMiddleware, updateUserHandler);

// end points update password {oldPassword, newPassword}
router.put('/:id/password', updatePasswordHandler),
// end points delete user by id
router.delete('/:id', deleteUserByIdHandler);


module.exports = router;
