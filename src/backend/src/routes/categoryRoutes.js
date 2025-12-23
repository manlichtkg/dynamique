const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const { verifyAdmin } = require('../middlewares/authMiddleware'); // For later

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory); // Add auth middleware later
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
