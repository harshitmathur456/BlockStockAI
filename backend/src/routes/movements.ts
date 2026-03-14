import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { LedgerService } from '../services/ledgerService';

const router = Router();

// Get all movements
router.get('/', async (req, res) => {
    try {
        const movements = await prisma.movement.findMany({
            include: {
                product: true,
            },
            orderBy: { timestamp: 'desc' }
        });
        res.json(movements);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movements' });
    }
});

// Transfer inventory (Core Logic)
router.post('/', async (req, res) => {
    const { product_id, from_location_id, to_location_id, quantity, performed_by } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update/Decrement 'from' location (if it's not a 'Receive' from outside)
            if (from_location_id) {
                const fromInv = await tx.inventory.findUnique({
                    where: { product_id_location_id: { product_id, location_id: from_location_id } }
                });

                if (!fromInv || fromInv.quantity < quantity) {
                    throw new Error('Insufficient stock in source location');
                }

                await tx.inventory.update({
                    where: { id: fromInv.id },
                    data: { quantity: { decrement: quantity } }
                });
            }

            // 2. Update/Increment 'to' location
            if (to_location_id) {
                await tx.inventory.upsert({
                    where: { product_id_location_id: { product_id, location_id: to_location_id } },
                    update: { quantity: { increment: quantity } },
                    create: { product_id, location_id: to_location_id, quantity }
                });
            }

            // 3. Record Movement
            const movement = await tx.movement.create({
                data: { product_id, from_location: from_location_id, to_location: to_location_id, quantity, performed_by }
            });

            // 4. Update Ledger (Tamper-proof record)
            await LedgerService.addEntry({
                action: from_location_id ? (to_location_id ? 'Transfer' : 'Dispatch') : 'Receive',
                product_id,
                quantity,
                from_location_id,
                to_location_id
            });

            return movement;
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error("Movement error:", error);
        res.status(400).json({ error: error.message });
    }
});

export default router;
