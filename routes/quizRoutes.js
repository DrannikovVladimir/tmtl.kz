const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = require(`../quizzes/data/${quizId}.js`);
        res.json(quiz);
    } catch (error) {
        res.status(404).json({ 
            error: 'Quiz not found',
            message: 'Запрашиваемый тест не найден или недоступен'
        });
    }
});

module.exports = router;