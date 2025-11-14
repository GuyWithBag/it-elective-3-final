const express = require('express');
const pool = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT item_id AS id, item_name, category, stock_qty, unit_price
       FROM inventory_items
       ORDER BY item_id DESC`,
    );
    return res.json(rows);
  } catch (error) {
    console.error('Fetch items error', error);
    return res.status(500).json({ message: 'Failed to load items' });
  }
});

router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  const { item_name, category, stock_qty, unit_price } = req.body;

  if (!item_name || !category || stock_qty == null || unit_price == null) {
    return res.status(400).json({ message: 'All item fields are required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO inventory_items (item_name, category, stock_qty, unit_price)
       VALUES (?, ?, ?, ?)`,
      [item_name, category, stock_qty, unit_price],
    );

    return res.status(201).json({
      id: result.insertId,
      item_name,
      category,
      stock_qty,
      unit_price,
    });
  } catch (error) {
    console.error('Create item error', error);
    return res.status(500).json({ message: 'Failed to add item' });
  }
});

router.put('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { item_name, category, stock_qty, unit_price } = req.body;

  if (!item_name || !category || stock_qty == null || unit_price == null) {
    return res.status(400).json({ message: 'All item fields are required' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE inventory_items
       SET item_name = ?, category = ?, stock_qty = ?, unit_price = ?
       WHERE item_id = ?`,
      [item_name, category, stock_qty, unit_price, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json({
      id: Number(id),
      item_name,
      category,
      stock_qty,
      unit_price,
    });
  } catch (error) {
    console.error('Update item error', error);
    return res.status(500).json({ message: 'Failed to update item' });
  }
});

module.exports = router;



