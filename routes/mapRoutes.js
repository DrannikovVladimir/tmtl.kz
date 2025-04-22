/**
 * Маршруты API для работы с картами
 * @module routes/mapRoutes
 */

const express = require('express');
const router = express.Router();

/**
 * Получение данных карты по ID
 * GET /api/maps/:id
 * 
 * @param {string} req.params.id - Идентификатор карты
 * @returns {Object} Данные карты
 */
router.get('/:id', async (req, res) => {
    try {
        const mapId = req.params.id;
        // Динамически импортируем файл с данными карты
        const mapData = require(`../maps/data/${mapId}.js`);
        res.json(mapData);
    } catch (error) {
        console.error(`Error loading map data for ID: ${req.params.id}`, error);
        res.status(404).json({ 
            error: 'Map not found',
            message: 'Запрашиваемая карта не найдена или недоступна'
        });
    }
});

module.exports = router;