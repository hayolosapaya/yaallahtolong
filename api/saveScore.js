import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, nrp, score, duration } = req.body;

  const { data: oldData, error: selectError } = await supabase
    .from('scores')
    .select('score')
    .eq('nrp', nrp)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    return res.status(500).json({ error: selectError.message });
  }

  if (oldData && score <= oldData.score) {
    return res.status(200).json({ message: 'Score is not higher.', existingScore: oldData.score });
  }

  const { data, error } = await supabase
    .from('scores')
    .upsert({ name, nrp, score, duration }, { onConflict: 'nrp' });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Score saved successfully', data });
};
