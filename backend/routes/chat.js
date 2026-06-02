const express = require('express');
const router = express.Router();
const { supabase } = require('../db');
const { authenticateToken } = require('../middleware');
const crypto = require('crypto');

// In-Memory Fallback Store if Supabase Table 'chat_messages' is not yet created
const inMemoryMessages = {};

// Get all messages for a batch
router.get('/:batchId', authenticateToken, async (req, res) => {
  const { batchId } = req.params;

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('batch_id', batchId)
      .order('created_at', { ascending: true });

    if (error) {
      // Table doesn't exist fallback
      console.warn(`Supabase chat lookup warning: ${error.message}. Using in-memory fallback.`);
      const messages = inMemoryMessages[batchId] || [];
      return res.json(messages);
    }

    return res.json(data || []);
  } catch (err) {
    console.error('Chat GET error:', err);
    const messages = inMemoryMessages[batchId] || [];
    return res.json(messages);
  }
});

// Post a message
router.post('/:batchId', authenticateToken, async (req, res) => {
  const { batchId } = req.params;
  const { message } = req.body;
  const user = req.user; // populated by authenticateToken: { id, name, role }

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  const newMessage = {
    id: crypto.randomUUID(),
    batch_id: batchId,
    sender_id: user.id,
    sender_name: user.name,
    sender_role: user.role,
    message: message.trim(),
    created_at: new Date().toISOString()
  };

  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert(newMessage);

    // Even if error, fallback to memory
    if (error) {
      console.warn(`Supabase chat insert warning: ${error.message}. Saving to memory.`);
      if (!inMemoryMessages[batchId]) inMemoryMessages[batchId] = [];
      inMemoryMessages[batchId].push(newMessage);
    } else {
      // Clean up in-memory if successfully written to DB
      if (inMemoryMessages[batchId]) {
        delete inMemoryMessages[batchId];
      }
    }

    // Broadcast message via WebSocket to all listening clients
    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast({
        type: 'CHAT_MESSAGE',
        batchId,
        message: newMessage
      });
    }

    return res.status(201).json(newMessage);
  } catch (err) {
    console.error('Chat POST error:', err);
    if (!inMemoryMessages[batchId]) inMemoryMessages[batchId] = [];
    inMemoryMessages[batchId].push(newMessage);

    const wssBroadcast = req.app.get('wssBroadcast');
    if (wssBroadcast) {
      wssBroadcast({
        type: 'CHAT_MESSAGE',
        batchId,
        message: newMessage
      });
    }

    return res.status(201).json(newMessage);
  }
});

module.exports = router;
