import { supabase } from './_lib/supabaseClient';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, nrp, score, duration } = req.body;

  // Ambil skor lama berdasarkan nrp
  const { data: oldData, error: selectError } = await supabase
    .from('scores')
    .select('score')
    .eq('nrp', nrp)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
    return res.status(500).json({ error: selectError.message });
  }

  // Jika skor baru tidak lebih tinggi, jangan update
  if (oldData && score <= oldData.score) {
    return res.status(200).json({ message: 'Score is not higher.', existingScore: oldData.score });
  }

  // Upsert data baru (update jika nrp sudah ada, insert jika belum)
  const { data, error } = await supabase
    .from('leaderboard')
    .upsert({ name, nrp, score, duration }, { onConflict: 'nrp' });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Score saved successfully', data });
}
