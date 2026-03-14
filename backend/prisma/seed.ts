import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function calculateHash(index: number, timestamp: Date, action: string, productId: string | null, quantity: number | null, fromLocationId: string | null, toLocationId: string | null, previousHash: string) {
    const data = `${index}${timestamp.toISOString()}${action}${productId}${quantity}${fromLocationId}${toLocationId}${previousHash}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

async function main() {
    console.log('Seeding data...');

    // 1. Clear existing data
    await prisma.ledger.deleteMany();
    await prisma.movement.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.location.deleteMany();
    await prisma.product.deleteMany();

    // 2. Create Products
    const products = await Promise.all([
        prisma.product.create({ data: { name: 'Steel Rod', sku: 'STL-001', category: 'Raw Material', minimum_stock: 20 } }),
        prisma.product.create({ data: { name: 'Plastic Chair', sku: 'CHR-002', category: 'Furniture', minimum_stock: 15 } }),
        prisma.product.create({ data: { name: 'Copper Wire', sku: 'CWR-003', category: 'Electrical', minimum_stock: 10 } }),
        prisma.product.create({ data: { name: 'Wooden Table', sku: 'TBL-004', category: 'Furniture', minimum_stock: 5 } }),
        prisma.product.create({ data: { name: 'Pipe Connector', sku: 'PCN-005', category: 'Plumbing', minimum_stock: 30 } }),
    ]);

    const [steelRod, plasticChair, copperWire, woodenTable, pipeConnector] = products;

    // 3. Create Locations
    const rackA = await prisma.location.create({ data: { name: 'Rack A', warehouse: 'Main Jaipur', position_x: 1, position_y: 1 } });
    const rackB = await prisma.location.create({ data: { name: 'Rack B', warehouse: 'Main Jaipur', position_x: 2, position_y: 1 } });
    const rackC = await prisma.location.create({ data: { name: 'Rack C', warehouse: 'Main Jaipur', position_x: 3, position_y: 1 } });
    const rackD = await prisma.location.create({ data: { name: 'Rack D', warehouse: 'Main Jaipur', position_x: 4, position_y: 1 } });
    const rackE = await prisma.location.create({ data: { name: 'Rack E', warehouse: 'Main Jaipur', position_x: 5, position_y: 1 } });
    const warehouseAdmin = await prisma.location.create({ data: { name: 'Warehouse Admin', warehouse: 'Main Jaipur', position_x: 0, position_y: 0 } });

    await prisma.location.create({ data: { name: 'Full Section', warehouse: 'Secondary Jodhpur', position_x: 1, position_y: 1 } });

    // 4. Populate Inventory
    await prisma.inventory.createMany({
        data: [
            { product_id: steelRod.id, location_id: rackA.id, quantity: 50 },
            { product_id: steelRod.id, location_id: rackB.id, quantity: 25 },
            { product_id: pipeConnector.id, location_id: rackB.id, quantity: 35 },
            { product_id: plasticChair.id, location_id: rackC.id, quantity: 20 },
            { product_id: copperWire.id, location_id: rackD.id, quantity: 8 },
            { product_id: woodenTable.id, location_id: rackE.id, quantity: 6 },
        ]
    });

    // 5. Create History (Ledger)
    let prevHash = '0';

    // 09:00 - Receive 100 Steel Rods
    const t1 = new Date(); t1.setHours(9, 0, 0);
    const h1 = calculateHash(1, t1, 'Receive', steelRod.id, 100, null, warehouseAdmin.id, prevHash);
    await prisma.ledger.create({
        data: { index: 1, timestamp: t1, action: 'Receive', product_id: steelRod.id, quantity: 100, to_location_id: warehouseAdmin.id, previous_hash: prevHash, hash: h1 }
    });
    prevHash = h1;

    // 09:10 - Transfer 50 Steel Rods to Rack A
    const t2 = new Date(); t2.setHours(9, 10, 0);
    const h2 = calculateHash(2, t2, 'Transfer', steelRod.id, 50, warehouseAdmin.id, rackA.id, prevHash);
    await prisma.ledger.create({
        data: { index: 2, timestamp: t2, action: 'Transfer', product_id: steelRod.id, quantity: 50, from_location_id: warehouseAdmin.id, to_location_id: rackA.id, previous_hash: prevHash, hash: h2 }
    });
    prevHash = h2;

    // 09:15 - Transfer 25 Steel Rods to Rack B
    const t3 = new Date(); t3.setHours(9, 15, 0);
    const h3 = calculateHash(3, t3, 'Transfer', steelRod.id, 25, warehouseAdmin.id, rackB.id, prevHash);
    await prisma.ledger.create({
        data: { index: 3, timestamp: t3, action: 'Transfer', product_id: steelRod.id, quantity: 25, from_location_id: warehouseAdmin.id, to_location_id: rackB.id, previous_hash: prevHash, hash: h3 }
    });
    prevHash = h3;

    // 6. Create Purchase Orders
    await prisma.purchaseOrder.createMany({
        data: [
            { supplier: 'Tata Steel', product_id: steelRod.id, quantity: 100, status: 'ordered' },
            { supplier: 'Jaipur Furniture Supply', product_id: plasticChair.id, quantity: 40, status: 'draft' },
            { supplier: 'Rajasthan Electrical Supplies', product_id: copperWire.id, quantity: 50, status: 'ordered' },
        ]
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
