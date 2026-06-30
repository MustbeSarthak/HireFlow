import type { Request, Response } from 'express';
import pool from '../config/db.js';
import type { AuthRequest } from '../interfaces/auth.interface.js';
/* 
Work Flow to update any profile will be 
    Register --> authValidator --> req.user.id --> Data Recieve --> Profile exist? - yes? UPDATE 
    no? Respond will be error 
 */

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const { phone, bio } = req.body;

    // Validation
    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
        return res.status(422).json({ message: 'Invalid Phone Number' });
    }

    if (bio && bio.length > 300) {
        return res.status(422).json({ message: 'Bio Limit Exceeds' });
    }

    // Check for changes
    if (phone === undefined && bio === undefined) {
        return res.status(400).json({ message: 'No changes' });
    }


    // User exists 
    const userId = typeof req.user === 'object' && req.user !== null && 'id' in req.user ? req.user.id : undefined;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized Access' });
    }

    // Update
    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (phone !== undefined) {
        updates.push(`phone = $${values.length + 1}`);
        values.push(phone);
    }

    if (bio !== undefined) {
        updates.push(`bio = $${values.length + 1}`);
        values.push(bio);
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    
   const profile = await pool.query(
    `SELECT id FROM profiles WHERE user_id = $1`,
    [userId]
);

let query: string;

if (profile.rowCount === 0) {

    const columns: string[] = ['user_id'];
    const insertValues: (string | number | null)[] = [userId];
    const placeholders: string[] = ['$1'];

    if (phone !== undefined) {
        columns.push('phone');
        insertValues.push(phone);
        placeholders.push(`$${insertValues.length}`);
    }

    if (bio !== undefined) {
        columns.push('bio');
        insertValues.push(bio);
        placeholders.push(`$${insertValues.length}`);
    }

    query = `
        INSERT INTO profiles
        (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *;
    `;

    values.length = 0;
    values.push(...insertValues);

} else {

    query = `
        UPDATE profiles
        SET ${updates.join(', ')}
        WHERE user_id = $${values.length + 1}
        RETURNING *;
    `;

    values.push(userId);
}

const result = await pool.query(query, values);

return res.status(200).json({
    message: profile.rowCount === 0
        ? 'Profile created successfully'
        : 'Profile updated successfully',
    user: result.rows[0],
});
}