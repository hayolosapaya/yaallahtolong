import { supabase } from './_lib/supabaseClient.js';

export default async function handler(req, res) {
  // Hanya izinkan metode GET
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Ambil 10 data teratas dari tabel 'scores'
    // Urutkan berdasarkan 'score' secara menurun (descending)
    const { data, error } = await supabase
      .from('scores')
      .select('name, nrp, score, duration')
      .order('score', { ascending: false })
      .order('duration', { ascending: true })
      .limit(25);

    if (error) {
      throw error;
    }

    // Kirim data sebagai response JSON
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ message: 'Error fetching leaderboard data', error: error.message });
  }
}