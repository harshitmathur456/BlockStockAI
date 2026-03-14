import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all locations with current stock
router.get('/', async (req, res) => {
    try {
        const locations = await prisma.location.findMany({
            include: {
                Inventory: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

// Create a location
router.post('/', async (req, res) => {
    const { name, warehouse, position_x, position_y } = req.body;
    try {
        const location = await prisma.location.create({
            data: { name, warehouse, position_x, position_y }
        });
        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ error: 'Location already exists or invalid data' });
    }
});

export default router;
