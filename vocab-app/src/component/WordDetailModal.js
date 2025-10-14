import { useState } from 'react';
import { supabase } from '../supaBaseClient';
import { Modal, Textarea, Select, Button, Group } from '@mantine/core';

export default function WordDetailModal({ word, categories, onClose, onUpdated }) {
  const [notes, setNote] = useState(word.notes || '');
  const [categoryId, setCategoryId] = useState(word.category_id);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('user_words')
      .update({ notes, category_id: categoryId })
      .eq('id', word.id);

    setLoading(false);
    if (error) console.log(error);
    else {
      if (onUpdated) onUpdated();
      onClose();
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={word.word}
      overlayProps={{
        color: 'black',
        opacity: 0.5,
        blur: 3,
      }}
      styles={{
        modal: { background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f7fa 100%)' },
      }}
    >
      <Select
        label="Category"
        data={Object.values(categories).map(c => ({
          value: String(c.id),
          label: `${c.name} (${c.abbreviation})`,
        }))}
        value={String(categoryId)}
        onChange={(val) => setCategoryId(Number(val))}
        mb="sm"
      />
      <Textarea
        label="Note"
        placeholder="Add your note..."
        value={notes}
        onChange={(e) => setNote(e.currentTarget.value)}
        autosize
        minRows={10}
        maxRows={20}
        mb="sm"
      />
      <Group position="right">
        <Button color="cyan" onClick={handleSave} loading={loading}>
          Save
        </Button>
        <Button color="gray" variant="outline" onClick={onClose}>
          Close
        </Button>
      </Group>
    </Modal>
  );
}
