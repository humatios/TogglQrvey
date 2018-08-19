const express = require('express');
const controller = require('./task.controller');
import { isAuthenticated } from '../../auth/auth.service';

const router = express.Router();

router.get('/', isAuthenticated(), controller.index);
router.get('/:id', isAuthenticated(), controller.show);
router.post('/', isAuthenticated(), controller.create);
router.put('/:id', isAuthenticated(), controller.upsert);
router.patch('/:id', isAuthenticated(), controller.patch);
router.delete('/:id', isAuthenticated(), controller.destroy);

module.exports = router;
