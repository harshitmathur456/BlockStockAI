import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get all products with inventory levels
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                Inventory: {
                    include: {
                        location: true
                    }
                }
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Create a product
router.post('/', async (req, res) => {
    const { name, sku, category, minimum_stock } = req.body;
    try {
        const product = await prisma.product.create({
            data: { name, sku, category, minimum_stock }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: 'SKU already exists or invalid data' });
    }
});

export default router;
