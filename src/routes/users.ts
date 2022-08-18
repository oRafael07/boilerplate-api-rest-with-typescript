const express = require('express');
const router = express.Router();

import { Register, Login, RefreshToken } from '../controllers/users'

router.post('/', Register);
router.post('/login', Login)
router.post('/refresh-token', RefreshToken)

export default router