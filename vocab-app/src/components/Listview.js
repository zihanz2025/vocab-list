import { useEffect, useState } from 'react';
import { supabase } from '../supaBaseClient';
import WordDetailModal from './WordDetailModal'; 

export default function Listview() {
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);

  // Fetch words
  useEffect(() => {
    async function fetchWords() {
      const { data, error } = await supabase
        .from('user_words')
        .select(`
          id, word, view_count, notes, category_id
        `)
        .order('created_at', { ascending: false });

      if (error) console.log(error);
      else setWords(data);
    }

    // Fetch categories
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (!error) {
        // Map category id to object for easy lookup
        const map = {};
        data.forEach(c => (map[c.id] = c));
        setCategories(map);
      }
    }

    fetchCategories();
    fetchWords();
  }, []);

  // Open WordReference
  const goToWordReference = (w) => {
    updateViewCount(w);
    window.open(`https://www.wordreference.com/fren/${encodeURIComponent(w.word)}`, '_blank');
  };

  const goToConjugation = (word) => {
    window.open(`https://www.wordreference.com/conj/frverbs.aspx?v=${encodeURIComponent(word)}`, '_blank');
  };

  async function updateViewCount(word) {
    setWords(words.map(w => 
    w.id == word.id ? { ...w, view_count: w.view_count + 1 } : w));
    const { error } = await supabase
    .from('user_words')
    .update({ view_count: word.view_count + 1 })
    .eq('id', word.id);

  if (error) console.log('Failed to update view count:', error);
  } 

  return (
    <div>
      <h2>Your Records</h2>
      <table>
        <thead>
          <tr>
            <th>Word - Category</th>
            <th>Views</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {words.map((w) => {
            const cat = categories[w.category_id];
            const shortNote = w.notes?.length > 20 ? w.notes.slice(0, 20) + '...' : w.notes;
            const isVerb = cat?.name?.toLowerCase().includes('verb');

            return (
              <tr key={w.id}>
                <td>
                  <span
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    onClick={() => goToWordReference(w)}
                  >
                    {w.word}
                  </span>
                  {' - '}
                 <span
                 style={{
                    cursor: isVerb ? 'pointer' : 'default',
                     color: isVerb ? 'green' : 'black',
                     textDecoration: isVerb ? 'underline' : 'none'
                     }}
                      onClick={() => {
                        if (isVerb) goToConjugation(w.word);
                        }}
>
  {cat?.abbreviation || ''}
</span>
                </td>
                <td>{w.view_count}</td>
                <td>{shortNote}</td>
                 <td>
                  <button onClick={() => setSelectedWord(w)}>Edit / Detail</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          categories={categories}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  );
}
