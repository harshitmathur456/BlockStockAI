import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { LedgerService } from '../services/ledgerService';

const router = Router();

// Get all purchase orders
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.purchaseOrder.findMany({
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch purchase orders' });
    }
});

// Create purchase order
router.post('/', async (req, res) => {
    const { supplier, product_id, quantity } = req.body;
    try {
        const order = await prisma.purchaseOrder.create({
            data: { supplier, product_id, quantity, status: 'ordered' }
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create purchase order' });
    }
});

// Receive goods from PO
router.post('/:id/receive', async (req, res) => {
    try {
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.purchaseOrder.findUnique({
                where: { id: req.params.id },
            });

            if (!order || order.status === 'received') {
                throw new Error('Order not found or already received');
            }

            // Update PO status
            const updatedOrder = await tx.purchaseOrder.update({
                where: { id: order.id },
                data: { status: 'received' }
            });

            // Increment product quantity in a default "Main Warehouse" if no specific location given
            // For simplicity, let's assume we need a location.
            // We'll look for a 'General' location or use the first available.
            let location = await tx.location.findFirst({ where: { name: 'Main Warehouse' } });
            if (!location) {
                location = await tx.location.create({
                    data: { name: 'Main Warehouse', warehouse: 'A', position_x: 0, position_y: 0 }
                });
            }

            await tx.inventory.upsert({
                where: { product_id_location_id: { product_id: order.product_id, location_id: location.id } },
                update: { quantity: { increment: order.quantity } },
                create: { product_id: order.product_id, location_id: location.id, quantity: order.quantity }
            });

            // Record Ledger
            await LedgerService.addEntry({
                action: 'Receive',
                product_id: order.product_id,
                quantity: order.quantity,
                to_location: location.id
            });

            return updatedOrder;
        });

        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
