import { useState } from 'react';
import { supabase } from '../supaBaseClient';
import { Modal, TextInput, Textarea, Select, Button, Group } from '@mantine/core';

export default function AddWordModal({ categories, onClose, onAdded }) {
  const [word, setWord] = useState('');
  const [notes, setNotes] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!word || !categoryId) return;

    setLoading(true);
    const { error } = await supabase.from('user_words').insert([{
      word,
      category_id: Number(categoryId),
      notes
    }]);
    setLoading(false);

    if (error) console.log(error);
    else {
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
        label="Word"
        placeholder="Enter the word"
        value={word}
        onChange={(e) => setWord(e.currentTarget.value)}
        mb="sm"
      />
      <Select
        label="Category"
        data={Object.values(categories).map(c => ({
          value: String(c.id),
          label: `${c.name} (${c.abbreviation})`,
        }))}
        value={categoryId}
        onChange={setCategoryId}
        mb="sm"
      />
      <Textarea
        label="Note"
        placeholder="Optional note"
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
        autosize
        minRows={10}
        maxRows={20}
        mb="sm"
      />
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
