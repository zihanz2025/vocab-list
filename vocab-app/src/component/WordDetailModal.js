import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Modal, Textarea, Select, Button, Group, TextInput, ActionIcon } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';

export default function WordDetailModal({ word, categories, onClose, onUpdated }) {
  const [wordText, setWordText] = useState(word.word || '');
  const [notes, setNote] = useState(word.notes || '');
  const [categoryId, setCategoryId] = useState(word.category_id);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('user_words')
      .update({ word: wordText, notes, category_id: categoryId })
      .eq('id', word.id);

    setLoading(false);
    if (error) console.log(error);
    else {
      if (onUpdated) onUpdated();
      onClose();
    }
  };

  const handleEditComplete = () => {
    setIsEditing(false);
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isEditing ? (
            <TextInput
              value={wordText}
              onChange={(e) => setWordText(e.currentTarget.value)}
              style={{ fontSize: '1.4rem', fontWeight: 600, border: 'none', backgroundColor: 'transparent', padding: 0 }}
              autoFocus
              onBlur={handleEditComplete}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span style={{ fontSize: '1.4rem', fontWeight: 600 }}>{wordText}</span>
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => setIsEditing(true)}
                style={{ opacity: 0.6, hover: { opacity: 1 } }}
              >
                <IconEdit size={16} />
              </ActionIcon>
            </>
          )}
        </div>
      }
      overlayProps={{
        color: 'black',
        opacity: 0.5,
        blur: 3,
      }}
      styles={{
        modal: { background: 'linear-gradient(180deg, #f0f9ff 0%, #edededff 100%)' },
      }}
    >
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Views:</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{word.view_count}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>Added:</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
            {word.created_at ? new Date(word.created_at).toISOString().split('T')[0] : '-'}
          </span>
        </div>
      </div>
      <Select
        placeholder="Select category"
        data={Object.values(categories).map(c => ({
          value: String(c.id),
          label: `${c.name} (${c.abbreviation})`,
        }))}
        value={String(categoryId)}
        onChange={(val) => setCategoryId(Number(val))}
        mb="md"
      />
      <Textarea
        placeholder="Add your note..."
        value={notes}
        onChange={(e) => setNote(e.currentTarget.value)}
        autosize
        minRows={10}
        maxRows={20}
        mb="md"
        style={{ width: '100%', maxWidth: '100%', resize: 'vertical' }}
      />
      <Group position="right">
        <Button onClick={handleSave} loading={loading}>
          Save
        </Button>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </Group>
    </Modal>
  );
}
