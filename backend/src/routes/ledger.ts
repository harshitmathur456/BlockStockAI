import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Get the entire ledger
router.get('/', async (req, res) => {
    try {
        const ledger = await prisma.ledger.findMany({
            include: {
                product: true,
                fromLocation: true,
                toLocation: true,
            },
            orderBy: { index: 'desc' }
        });
        res.json(ledger);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch ledger' });
    }
});

export default router;
