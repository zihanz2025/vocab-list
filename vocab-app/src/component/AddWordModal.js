import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Modal, TextInput, Textarea, Select, Button, Group } from '@mantine/core';

export default function AddWordModal({ categories, onClose, onAdded, allWords }) {
  const [word, setWord] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) return;

    const existingWords = allWords || [];
    const isDuplicate = existingWords.some(
      (w) => w.word.toLowerCase() === trimmedWord.toLowerCase()
    );

    if (isDuplicate) {
      setError(`"${trimmedWord}" already exists in your vocabulary list!`);
      return;
    }

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    setError('');
    setLoading(true);
    const { error: dbError } = await supabase.from('user_words').insert([{
      word: trimmedWord,
      category_id: Number(categoryId),
      notes
    }]);
    setLoading(false);

    if (dbError) {
      console.log(dbError);
      setError('Failed to add word. Please try again.');
    } else {
      if (onAdded) onAdded();
      onClose();
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={<span style={{ fontSize: '1.4rem', fontWeight: 600 }}>Add New Word</span>}
      overlayProps={{ color: 'black', opacity: 0.5, blur: 3 }}
      styles={{
        modal: { background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f7fa 100%)' },
      }}
    >
      <TextInput
        placeholder="Enter the word"
        value={word}
        onChange={(e) => {
          setWord(e.currentTarget.value);
          setError('');
        }}
        mb="md"
      />
      <Select
        placeholder="Select category"
        data={Object.values(categories).map(c => ({
          value: String(c.id),
          label: `${c.name} (${c.abbreviation})`,
        }))}
        value={categoryId}
        onChange={setCategoryId}
        mb="md"
      />
      <Textarea
        placeholder="Optional note"
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        autosize
        minRows={10}
        maxRows={20}
        mb="md"
      />
      {error && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: '#fef2f2', 
          border: '1px solid #fecaca', 
          borderRadius: '8px', 
          color: '#991b1b',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}
      <Group position="right">
        <Button onClick={handleAdd} loading={loading}>
          Add
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </Group>
    </Modal>
  );
}
