import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import WordDetailModal from './WordDetailModal';
import AddWordModal from './AddWordModal';
import WordSearch from './SearchBar';
import {Table, Paper, Button, Group, Text, Title, Stack, Container, ScrollArea, ActionIcon, Tooltip, Select, Box, Grid, Badge, Menu, Burger} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus, IconBook2, IconUser, IconSettings, IconLogout } from '@tabler/icons-react';

export default function Listview({onLogout}) {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (min-width: 640px) {
        .hide-on-mobile {
          display: table-cell !important;
        }
        .hide-on-mobile-header {
          display: table-cell !important;
        }
        thead tr.hide-on-mobile-header {
          display: table-row !important;
        }
        .mobile-only {
          display: none !important;
        }
        .mobile-only-header {
          display: none !important;
        }
        .desktop-only {
          display: flex !important;
        }
        .word-col {
          width: 22% !important;
          text-align: left !important;
        }
        .category-col {
          width: 10% !important;
          text-align: center !important;
        }
        .note-col {
          width: 38% !important;
          text-align: left !important;
        }
        .views-col {
          width: 8% !important;
          text-align: center !important;
        }
        .date-col {
          width: 14% !important;
          text-align: center !important;
        }
        .actions-col {
          width: 8% !important;
          text-align: center !important;
        }
      }
      @media (max-width: 639px) {
        .hide-on-mobile {
          display: none !important;
        }
        .hide-on-mobile-header {
          display: none !important;
        }
        .mobile-only {
          display: table-cell !important;
        }
        .mobile-only-header {
          display: table-cell !important;
        }
        .desktop-only {
          display: none !important;
        }
        .word-col {
          width: 65% !important;
        }
        .category-col {
          width: 20% !important;
        }
        .actions-col {
          width: 15% !important;
          minWidth: '80px' !important;
        }
        .action-icon {
          transform: scale(0.75);
        }
      }
      @media (min-width: 768px) {
        .mobile-only-lg {
          display: none !important;
        }
        .desktop-only-lg {
          display: flex !important;
        }
      }
      @media (max-width: 767px) {
        .mobile-only-lg {
          display: flex !important;
        }
        .desktop-only-lg {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
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

          {/* Desktop Navigation */}
          <Group spacing="md" className="desktop-only" style={{ display: 'none' }}>
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

          {/* Mobile Menu */}
          <div className="mobile-only" style={{ display: 'none' }}>
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <Button variant="subtle" size="sm" style={{ color: 'white', padding: '8px' }}>
                  <IconSettings size={20} />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item component={Link} to="/about">
                  About
                </Menu.Item>
                <Menu.Item component={Link} to="/profile">
                  Profile
                </Menu.Item>
                <Menu.Item onClick={() => handleLogout()}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
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
          {/* Desktop Filters */}
          <div className="desktop-only-lg" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
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
                  background: '#800020',
                  color: 'white',
                }}
              >
                <IconPlus size={16} style={{ marginRight: '6px' }} />
                Add Word
              </Button>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="mobile-only-lg" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
            <Menu position="bottom-start" shadow="md">
              <Menu.Target>
                <Button variant="outline" size="sm" style={{ borderColor: '#800020', color: '#800020' }}>
                  Filters
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <div style={{ padding: '0.5rem' }}>
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
                    style={{ marginBottom: '0.5rem', width: '100%' }}
                  />
                  <Select
                    data={categoryOptions}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    style={{ width: '100%' }}
                    placeholder="Filter by category"
                    size="sm"
                  />
                </div>
              </Menu.Dropdown>
            </Menu>
            
            <div style={{ flex: 1 }}>
              <WordSearch words={filteredWords} allWords={words} onLocateWord={locateWord} />
            </div>
            
            <Button 
              onClick={() => setAddingWord(true)}
              size="sm"
              style={{ 
                background: '#800020',
                color: 'white',
                padding: '8px',
              }}
            >
              <IconPlus size={18} />
            </Button>
          </div>
          <div
          style={{
            maxHeight: '78vh',
            minHeight: '300px',
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            flex: 1,
            }}>
              <div style={{ overflowX: 'hidden', overflowY: 'visible', width: '100%' }}>
              <Table style={{ borderCollapse: 'separate', borderSpacing: '0 8px', width: '100%', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', display: 'none' }} className="hide-on-mobile-header">
                    <th className="word-col" style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem', width: '22%', minWidth: '100px' }}>Word</th>
                    <th className="category-col" style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem', width: '10%', minWidth: '60px' }}>Category</th>
                    <th className="note-col" style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem', width: '40%' }}>Note</th>
                    <th className="views-col" style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem', width: '8%' }}>Views</th>
                    <th className="date-col" style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 600, color: '#475569', fontSize: '0.875rem', width: '14%' }}>Date Added</th>
                    <th className="actions-col" style={{ textAlign: 'center', padding: '12px 4px', fontWeight: 600, color: '#475569', fontSize: '0.875rem', width: '10%', minWidth: '80px' }}>Actions</th>
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
                        <td className="word-col" style={{ padding: '16px', borderBottom: 'none', width: '65%', minWidth: '100px' }}>
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
                        <td className="category-col" style={{ padding: '16px', borderBottom: 'none', width: '10%', minWidth: '60px', textAlign: 'center' }}>
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
                        <td className="note-col" style={{ padding: '16px', borderBottom: 'none', cursor: 'pointer', width: '40%', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', display: 'none' }} className="hide-on-mobile-header" onClick={() => toggleRow(w.id)}>
                          <Text size="sm" c="neutral.6" style={{ lineHeight: '1.5' }}>
                            {expandedRows.has(w.id) ? w.notes : shortNote}
                          </Text>
                        </td>
                        <td className="views-col" style={{ padding: '16px', borderBottom: 'none', width: '8%', display: 'none', textAlign: 'center' }} className="hide-on-mobile-header">
                          <Badge 
                            variant="outline" 
                            color="neutral"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            {w.view_count}
                          </Badge>
                        </td>
                        <td className="date-col" style={{ padding: '16px', borderBottom: 'none', width: '15%', display: 'none', textAlign: 'center' }} className="hide-on-mobile-header">
                          <Text size="sm" c="neutral.5" style={{ fontSize: '0.8125rem' }}>
                            {dateCreated}
                          </Text>
                        </td>
                        <td className="actions-col" style={{ padding: '16px 4px', borderBottom: 'none', width: '10%', minWidth: '80px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>
                          <span className="action-icon" style={{ display: 'inline-block', marginRight: '4px', verticalAlign: 'middle' }}>
                            <ActionIcon
                              variant="light"
                              onClick={() => setSelectedWord(w)}
                              style={{ borderRadius: '8px' }}
                              size="sm"
                            >
                              <IconEdit size={16} color="#64748b" />
                            </ActionIcon>
                          </span>
                          <span className="action-icon" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                            <ActionIcon
                              variant="light"
                              onClick={() => deleteWord(w)}
                              style={{ borderRadius: '8px' }}
                              size="sm"
                            >
                              <IconTrash size={16} color="#ef4444" />
                            </ActionIcon>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              </div>

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