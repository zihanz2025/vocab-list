import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import WordDetailModal from './WordDetailModal';
import AddWordModal from './AddWordModal';
import WordSearch from './SearchBar';
import {Table, Paper, Button, Group, Text, Title, Stack, Container, ScrollArea, ActionIcon, Tooltip, Select, Box, Grid, Badge} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconBook2, IconUser, IconSettings, IconLogout } from '@tabler/icons-react';

export default function Listview({onLogout}) {
  const [words, setWords] = useState([]);
  const [nickname, setNickname] = useState('');
  const [categories, setCategories] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [addingWord, setAddingWord] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const scrollAreaRef = useRef(null);
  const rowRefs = useRef({});
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchWords() {
      const { data, error } = await supabase
        .from('user_words')
        .select('id, word, view_count, notes, category_id, created_at')
        .order(sortField, { ascending: sortOrder === 'asc' });

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

    async function fetchNickname(){
      const { data: { user }, userError } = await supabase.auth.getUser();
      if (!user || userError) console.log('Error fetching user info:', error);
      const userId = user.id;
      const { data, error } = await supabase
      .from('profiles')
      .select('nickname')
      .eq('id', userId)
      .single();

    if (error) console.log('Error fetching nickname:', error);
    else setNickname(data.nickname);
    }
    fetchCategories();
    fetchWords();
    fetchNickname();
  }, []);

  let categoryOptions = [
  { value: 'noms', label: 'nom' },
  ...Object.values(categories).map((c) => ({
    value: c.name.toLowerCase(),
    label: c.name.toLowerCase(),
  })),
  ];
  categoryOptions.sort((a, b) => a.label.localeCompare(b.label, 'fr'));
  categoryOptions.unshift({ value: 'all', label: 'All Words' });
  const filteredWords = (() => {
  if (selectedCategory === 'all') return words;
  if (selectedCategory === 'noms') {
    return words.filter((w) => {
      const cat = categories[w.category_id]?.name?.toLowerCase();
      return cat && cat.includes('nom') && cat !=='prenom';
    });
  }

  return words.filter((w) => {
    const cat = categories[w.category_id]?.name?.toLowerCase();
    return cat === selectedCategory;
  });
})();


  const goToWordReference = (w) => {
    updateViewCount(w);
    window.open(
      `https://www.wordreference.com/fren/${encodeURIComponent(w.word)}`,
      '_blank'
    );
  };

  const goToConjugation = (word) => {
    window.open(
      `https://www.wordreference.com/conj/frverbs.aspx?v=${encodeURIComponent(word)}`,
      '_blank'
    );
  };

  const toggleRow = (id) => {
  setExpandedRows((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    return newSet;
  });
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
        .select('id, word, view_count, notes, category_id, created_at')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) console.log(error);
      else setWords(data);
  }

  useEffect(() => {
    refreshWords();
  }, [sortField, sortOrder]);


  async function locateWord(wordToFind, options = {}) {
    const target = words.find(
    (w) => w.word.toLowerCase() === wordToFind.toLowerCase()
  );
  if (!target) return false;
  if (options.overrideFilter) {
    setSelectedCategory('all');
  }
  updateViewCount(target)
  const rowEl = rowRefs.current[target.id];
  if (rowEl && scrollAreaRef.current) {
    rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  setHighlightedId(target.id);
  return true;
}

async function deleteWord(word) {
  const confirmDelete = window.confirm("Are you sure you want to delete this word?");
  if (!confirmDelete) return;

  const { error } = await supabase
    .from('user_words')
    .delete()
    .eq('id', word.id);

  if (error) {
    console.log("Failed to delete word:", error);
  } else {
    setWords(words.filter(w => w.id !== word.id));
  }
}

    const handleLogout = async () => {

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
      return;
    }
    setWords([]);
    setCategories({});
    navigate('/', { replace: true });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 100%)',
      }}
    >
      <header style={{ 
        background: '#800020',
        padding: '1rem 2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              background: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <IconBook2 size={22} color="white" />
            </div>
            <div>
              <Title order={3} style={{ color: 'white', margin: 0, fontWeight: 600 }}>
                Vocabulary List
              </Title>
              <Text size="xs" c="white" style={{ opacity: 0.8 }}>
                {words.length} entries
              </Text>
            </div>
          </div>

          <Group spacing="md">
            <Button 
              variant="subtle" 
              component={Link} 
              to="/about" 
              size="sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              About
            </Button>
            <Button 
              variant="subtle" 
              component={Link} 
              to="/profile" 
              size="sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <IconUser size={16} style={{ marginRight: '6px' }} />
              {nickname || 'Profile'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              size="sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            >
              <IconLogout size={16} style={{ marginRight: '6px' }} />
              Logout
            </Button>
          </Group>
        </div>
      </header>

      <Container
      size="lg"
      py="xs"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        }}>
        <Paper 
          shadow="lg" 
          radius="xl" 
          p="md"
          style={{ 
            background: 'white',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Select
                value={`${sortField}-${sortOrder}`}
                onChange={(value) => {
                  const [field, order] = value.split('-');
                  setSortField(field);
                  setSortOrder(order);
                }}
                data={[
                  { value: 'created_at-desc', label: 'Date Added (Newest)' },
                  { value: 'created_at-asc', label: 'Date Added (Oldest)' },
                  { value: 'word-asc', label: 'Alphabetical (A–Z)' },
                  { value: 'view_count-desc', label: 'Views (Most)' },
                  { value: 'view_count-asc', label: 'Views (Least)' },
                ]}
                placeholder="Sort by"
                size="sm"
                style={{ width: '180px' }}
              />
              <Select
                data={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: '200px' }}
                placeholder="Filter by category"
                size="sm"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, minWidth: '200px', marginLeft: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <WordSearch words={filteredWords} allWords={words} onLocateWord={locateWord} />
              </div>
              <Button 
                onClick={() => setAddingWord(true)}
                size="sm"
                style={{ 
                  background: 'linear-gradient(135deg, #800020 0%, #A52A2A 100%)',
                  boxShadow: '0 4px 14px 0 rgba(128, 0, 32, 0.4)',
                  fontWeight: 600,
                }}
              >
                <IconPlus size={16} style={{ marginRight: '6px' }} />
                Add Word
              </Button>
            </div>
          </div>
          <div
          style={{
            maxHeight: '550px',
            overflowY: 'auto',
            overflowX: 'hidden',
            }}>
              <Table style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Word</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Category</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Note</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Views</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Date Added</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWords.map((w) => {
                    const cat = categories[w.category_id];
                    const shortNote = w.notes?.length > 60 ? w.notes.slice(0, 60) + '...' : w.notes;
                    const isVerb = cat?.name?.toLowerCase() === 'verbe';
                    const dateCreated = w.created_at ? w.created_at.substring(0, 10) : '';

                    return (
                      <tr
                        key={w.id}
                        ref={(el) => (rowRefs.current[w.id] = el)}
                        style={{
                          backgroundColor: highlightedId === w.id ? '#d9e2ec' : 'white',
                          borderRadius: '12px',
                          boxShadow: highlightedId === w.id ? '0 4px 20px rgba(16, 42, 67, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => setHighlightedId(null)}
                      >
                        <td style={{ padding: '16px', borderBottom: 'none' }}>
                          <Text 
                            component="span"
                            sx={{ cursor: 'pointer' }}
                            onClick={() => goToWordReference(w)}
                            style={{ 
                              fontSize: '1rem', 
                              fontWeight: 500, 
                              color: '#1e293b',
                              textDecoration: 'underline',
                              textDecorationColor: 'transparent',
                              transition: 'text-decoration-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.target.style.textDecorationColor = '#667eea'}
                            onMouseLeave={(e) => e.target.style.textDecorationColor = 'transparent'}
                          >
                            {w.word}
                          </Text>
                        </td>
                        <td style={{ padding: '16px', borderBottom: 'none' }}>
                          <Badge 
                            variant="light" 
                            color={isVerb ? 'purple' : 'blue'}
                            style={{ 
                              cursor: isVerb ? 'pointer' : 'default',
                              padding: '4px 12px',
                              fontSize: '0.75rem',
                              textTransform: 'none',
                            }}
                            onClick={() => {
                              if (isVerb) goToConjugation(w.word);
                            }}
                          >
                            {cat?.abbreviation?.toLowerCase() || ''}
                          </Badge>
                        </td>
                        <td style={{ padding: '16px', borderBottom: 'none', cursor: 'pointer', maxWidth: '300px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }} onClick={() => toggleRow(w.id)}>
                          <Text size="sm" c="neutral.6" style={{ lineHeight: '1.5' }}>
                            {expandedRows.has(w.id) ? w.notes : shortNote}
                          </Text>
                        </td>
                        <td style={{ padding: '16px', borderBottom: 'none' }}>
                          <Badge 
                            variant="outline" 
                            color="neutral"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            {w.view_count}
                          </Badge>
                        </td>
                        <td style={{ padding: '16px', borderBottom: 'none' }}>
                          <Text size="sm" c="neutral.5" style={{ fontSize: '0.8125rem' }}>
                            {dateCreated}
                          </Text>
                        </td>
                        <td style={{ padding: '16px', borderBottom: 'none', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                          <Group justify="center" gap="0.5rem">
                            <Tooltip label="Edit">
                              <ActionIcon
                                variant="light"
                                onClick={() => setSelectedWord(w)}
                                style={{ 
                                  borderRadius: '8px',
                                  hover: { backgroundColor: '#f1f5f9' },
                                }}
                              >
                                <IconEdit size={16} color="#64748b" />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Delete">
                              <ActionIcon
                                variant="light"
                                onClick={() => deleteWord(w)}
                                style={{ borderRadius: '8px' }}
                              >
                                <IconTrash size={16} color="#ef4444" />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>

              {filteredWords.length === 0 && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '4rem',
                  color: '#94a3b8',
                }}>
                  <IconBook2 size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <Text size="lg" style={{ fontWeight: 500 }}>No words found</Text>
                  <Text size="sm" style={{ marginTop: '0.5rem' }}>
                    {selectedCategory !== 'all' ? 'Try changing the filter' : 'Start by adding your first word'}
                  </Text>
                </div>
              )}
          </div>
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