import { useEffect, useState } from 'react';
import { supabase } from '../supaBaseClient';
import WordDetailModal from './WordDetailModal';
import AddWordModal from './AddWordModal';
import {
  Table,
  Paper,
  Button,
  Group,
  Text,
  Title,
  Container,
  ScrollArea,
  Box,
} from '@mantine/core';

export default function Listview({ onLogout }) {
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [addingWord, setAddingWord] = useState(false);

  // Fetch words
  useEffect(() => {
    async function fetchWords() {
      const { data, error } = await supabase
        .from('user_words')
        .select('id, word, view_count, notes, category_id')
        .order('created_at', { ascending: false });

      if (error) console.log(error);
      else setWords(data);
    }

    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (!error) {
        const map = {};
        data.forEach((c) => (map[c.id] = c));
        setCategories(map);
      }
    }

    fetchCategories();
    fetchWords();
  }, []);

  const goToWordReference = (w) => {
    updateViewCount(w);
    window.open(
      `https://www.wordreference.com/fren/${encodeURIComponent(w.word)}`,
      '_blank'
    );
  };

  const goToConjugation = (word) => {
    window.open(
      `https://www.wordreference.com/conj/frverbs.aspx?v=${encodeURIComponent(
        word
      )}`,
      '_blank'
    );
  };

  async function updateViewCount(word) {
    setWords(
      words.map((w) =>
        w.id === word.id ? { ...w, view_count: w.view_count + 1 } : w
      )
    );
    const { error } = await supabase
      .from('user_words')
      .update({ view_count: word.view_count + 1 })
      .eq('id', word.id);

    if (error) console.log('Failed to update view count:', error);
  }

  async function refreshWords() {
      const { data, error } = await supabase
        .from('user_words')
        .select('id, word, view_count, notes, category_id')
        .order('created_at', { ascending: false });

      if (error) console.log(error);
      else setWords(data);
    }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f7fa 100%)',
      }}
    >
      <Container size="lg" style={{ width: '80%' }}>
        <Group position="apart" mb="md">
          <Title order={2}>Your Vocabulary List</Title>
          <Button color="cyan" onClick={() => setAddingWord(true)}>
            Add Word
          </Button>
          <Button color="cyan" variant="outline" onClick={onLogout}>
            Logout
          </Button>
        </Group>

        <Paper shadow="sm" p="md" radius="md">
          <ScrollArea style={{ height: 500 }}>
            <Table highlightOnHover verticalSpacing="sm">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Word - Category</th>
                  <th style={{ textAlign: 'left' }}>Views</th>
                  <th style={{ textAlign: 'left' }}>Note</th>
                  <th></th> {/* Button column */}
                </tr>
              </thead>
              <tbody>
                {words.map((w) => {
                  const cat = categories[w.category_id];
                  const shortNote =
                    w.notes?.length > 20
                      ? w.notes.slice(0, 20) + '...'
                      : w.notes;
                  const isVerb = cat?.name?.toLowerCase().includes('verb');

                  return (
                    <tr key={w.id}>
                      <td style={{ textAlign: 'left' }}>
                        <Text
                          component="span"
                          color="blue"
                          underline
                          sx={{ cursor: 'pointer' }}
                          onClick={() => goToWordReference(w)}
                        >
                          {w.word}
                        </Text>
                        {' - '}
                        <Text
                          component="span"
                          color={isVerb ? 'green' : 'dimmed'}
                          underline={isVerb}
                          sx={{ cursor: isVerb ? 'pointer' : 'default' }}
                          onClick={() => {
                            if (isVerb) goToConjugation(w.word);
                          }}
                        >
                          {cat?.abbreviation || ''}
                        </Text>
                      </td>
                      <td style={{ textAlign: 'left' }}>{w.view_count}</td>
                      <td style={{ textAlign: 'left' }}>{shortNote}</td>
                      <td>
                        <Button
                          size="xs"
                          color="cyan"
                          variant="light"
                          onClick={() => setSelectedWord(w)}
                        >
                          Edit / Detail
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </ScrollArea>
        </Paper>

        {selectedWord && (
          <WordDetailModal
            word={selectedWord}
            categories={categories}
            onClose={() => setSelectedWord(null)}
            onUpdated={refreshWords}
          />
        )}
        {addingWord && (
        <AddWordModal
          categories={categories}
          onClose={() => setAddingWord(false)}
          onAdded={refreshWords}
        />
      )}
      </Container>
     </div>
  );
}
