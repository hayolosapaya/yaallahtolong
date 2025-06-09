import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req, res) {
  console.log('Request received:', req.method);

  if (req.method === 'POST') {
    const { name, score } = req.body;

    console.log('Received data:', { name, score });

    if (!name || typeof score !== 'number') {
      console.error('Invalid data:', { name, score });
      return res.status(400).json({ error: 'Invalid player name or score' });
    }

    const { data, error } = await supabase
      .from('scores')
      .insert([{ player_name: name, score }]);

    if (error) {
      console.error('Insert error:', error);
      return res.status(500).json({ error: 'Failed to save score', detail: error.message });
    }

    console.log('Insert success:', data);
    res.status(200).json({ message: 'Score saved successfully', data });
  } else {
    console.warn('Method not allowed:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
