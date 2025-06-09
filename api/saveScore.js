import { supabase } from './_lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, nrp, score, duration } = req.body;

  const { data, error } = await supabase
    .from('leaderboard')
    .insert([{ name, nrp, score, duration }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Score saved', data });
}
