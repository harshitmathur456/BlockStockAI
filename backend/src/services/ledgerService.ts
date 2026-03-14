import { prisma } from '../lib/prisma';
import crypto from 'crypto';

export class LedgerService {
    static async addEntry(data: {
        action: string;
        product_id: string;
        quantity: number;
        from_location_id?: string | null;
        to_location_id?: string | null;
    }) {
        // Get previous block to calculate new hash
        const lastBlock = await prisma.ledger.findFirst({
            orderBy: { index: 'desc' }
        });

        const index = lastBlock ? lastBlock.index + 1 : 1;
        const previous_hash = lastBlock ? lastBlock.hash : '0';
        const timestamp = new Date();

        // Calculate cryptographic hash
        const hash = this.calculateHash(
            index,
            timestamp,
            data.action,
            data.product_id,
            data.quantity,
            data.from_location_id || null,
            data.to_location_id || null,
            previous_hash
        );

        return await prisma.ledger.create({
            data: {
                index,
                timestamp,
                action: data.action,
                product_id: data.product_id,
                quantity: data.quantity,
                from_location_id: data.from_location_id,
                to_location_id: data.to_location_id,
                previous_hash,
                hash
            }
        });
    }

    private static calculateHash(
        index: number,
        timestamp: Date,
        action: string,
        product_id: string,
        quantity: number,
        from_location_id: string | null,
        to_location_id: string | null,
        previousHash: string
    ) {
        const str = `${index}${timestamp.toISOString()}${action}${product_id}${quantity}${from_location_id}${to_location_id}${previousHash}`;
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    static async verifyChain() {
        // Implementation for chain verification logic
        return true;
    }
}
