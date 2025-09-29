import { useState } from 'react';
import { supabase } from '../supaBaseClient';

export default function WordDetailModal({ word, categories, onClose }) {
  const [notes, setNote] = useState(word.notes || '');
  const [categoryId, setCategoryId] = useState(word.category_id);

  const handleSave = async () => {
    const { data, error } = await supabase
      .from('user_words')
      .update({ notes, category_id: categoryId })
      .eq('id', word.id);

    if (error) console.log(error);
    else onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
        <h3>{word.word}</h3>
        <div>
          <label>Category: </label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {Object.values(categories).map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.abbreviation})</option>
            ))}
          </select>
        </div>
        <div>
          <label>Note: </label>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
