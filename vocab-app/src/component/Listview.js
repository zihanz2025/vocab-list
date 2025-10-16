import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supaBaseClient';
import WordDetailModal from './WordDetailModal';
import AddWordModal from './AddWordModal';
import WordSearch from './SearchBar';
import {Table, Paper, Button, Group, Text, Title, Container, ScrollArea, ActionIcon, Tooltip, Select, Box, Grid} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export default function Listview() {
  const [words, setWords] = useState([]);
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
  
  // Fetch words on initialization
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
    fetchCategories();
    fetchWords();
  }, []);

  //filter by categories
  let categoryOptions = [
  { value: 'noms', label: 'nom' },
  ...Object.values(categories).map((c) => ({
    value: c.name.toLowerCase(),
    label: c.name,
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



  //click on word go to definition page on wordreference.com
  const goToWordReference = (w) => {
    updateViewCount(w);
    window.open(
      `https://www.wordreference.com/fren/${encodeURIComponent(w.word)}`,
      '_blank'
    );
  };

  //click on verb category to go to conjugation page on wordreference.com
  const goToConjugation = (word) => {
    window.open(
      `https://www.wordreference.com/conj/frverbs.aspx?v=${encodeURIComponent(word)}`,
      '_blank'
    );
  };

  //expandable rows logic to show full note
  const toggleRow = (id) => {
  setExpandedRows((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    return newSet;
  });
};

  //each click to view word details increase view count by 1
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

  //exposed fetch function to refresh words after add/edit
  async function refreshWords() {
      const { data, error } = await supabase
        .from('user_words')
        .select('id, word, view_count, notes, category_id, created_at')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) console.log(error);
      else setWords(data);
  }
  //refrensh when sorting method changes
  useEffect(() => {
    refreshWords();
  }, [sortField, sortOrder]);


  //locate and highlight searched word in the list
  async function locateWord(wordToFind, options = {}) {
    const target = words.find(
    (w) => w.word.toLowerCase() === wordToFind.toLowerCase()
  );
  if (!target) return false;
  // if overrideFilter is true, reset category to 'all'
  if (options.overrideFilter) {
    setSelectedCategory('all');
  }
  updateViewCount(target)
  const rowEl = rowRefs.current[target.id];
  if (rowEl && scrollAreaRef.current) {
    rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  // persist highlight
  setHighlightedId(target.id);
  return true;
}

// inside Listview component
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
    // remove the word from local state so UI updates immediately
    setWords(words.filter(w => w.id !== word.id));
  }
}


// Logout function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log('Logout failed:', error);
    else {
      // Clear state
      setWords([]);
      setCategories({});
      setSelectedWord(null);
      setAddingWord(false);
      setHighlightedId(null);
      setExpandedRows(new Set());

      window.location.href = '/vocab-list';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        maxHeight: '100vh',
        background: 'linear-gradient(180deg, #fffdfdff 0%, #bab8b8ff 100%)',
      }}
    >
      <Container size="lg" style={{width: '80%'}}>
        <Group justify="space-between" style={{ height:'9vh' }}>
          <Title order={2}>My Vocabulary List</Title>
          <Group>
            <Button variant='subtle' component={Link} to="/about" size="sm" >
              About
            </Button>
          <Button variant='subtle' onClick={handleLogout}>
            Logout
          </Button>

          </Group>
        </Group>
        <Grid style={{ height:'7vh' }}>
          <Grid.Col span="content">
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
          />
          </Grid.Col>
          <Grid.Col span="content">
            <Select
            data={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            styles={{ root: { minWidth: '220px' } }}
            />
          </Grid.Col>
          <Grid.Col span="auto">
            <WordSearch words={filteredWords} allWords={words} onLocateWord={locateWord} />
          </Grid.Col>
          <Grid.Col span="content">
            <Button variant='subtle' onClick={() => setAddingWord(true)}>
            Add Word
          </Button>
          </Grid.Col>
        </Grid>

        <Paper shadow="sm" p="md" >
          <ScrollArea viewportRef={scrollAreaRef} style={{ height:'80vh' }}>
            <Table highlightOnHover verticalSpacing="sm">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Word</th>
                  <th></th> {/* Category column */}
                  <th style={{ textAlign: 'left' }}>Note</th>
                  <th style={{ textAlign: 'left' }}>Views</th>
                  <th style={{ textAlign: 'left' }}>Date Added</th>
                  <th></th> {/* Button column */}
                </tr>
              </thead>
              <tbody>
                {filteredWords.map((w) => {
                  const cat = categories[w.category_id];
                  const shortNote =
                    w.notes?.length > 50
                      ? w.notes.slice(0, 50) + '...'
                      : w.notes;
                  const isVerb = cat?.name?.toLowerCase()==='verbe';
                  const dateCreated = w.created_at ? w.created_at.substring(0,10): ''

                  return (
                    <tr
                      key={w.id}
                      ref={(el) => (rowRefs.current[w.id] = el)}
                      style={{
                        backgroundColor: highlightedId === w.id ? '#e5e5e5ff' : 'transparent',
                        transition: 'background-color 0.3s',
                        margin: '4px 0',
                      }}
                      onClick={() => setHighlightedId(null)}
                    >
                      <td style={{ textAlign: 'left' ,width : "15%"}}>
                        <Text
                          component="span"
                          c="blue"
                          underline
                          sx={{ cursor: 'pointer' }}
                          onClick={() => goToWordReference(w)}
                        >
                          {w.word}
                        </Text>
                      </td>
                      <td style={{ textAlign: 'left' ,width : "5%"}}>
                        <Text
                          component="span"
                          c={isVerb ? 'green' : 'dimmed'}
                          underline={isVerb}
                          sx={{ cursor: isVerb ? 'pointer' : 'default' }}
                          onClick={() => {
                            if (isVerb) goToConjugation(w.word);
                          }}
                        >
                          {cat?.abbreviation || ''}
                        </Text>
                      </td>
                      <td style={{ textAlign: 'left', cursor: 'pointer' , width : "55%", padding: '8px 16px'}} onClick={() => toggleRow(w.id)}>
                        {expandedRows.has(w.id) ? w.notes : shortNote}
                      </td>
                      <td style={{ textAlign: 'left' ,width : "5%"}}>{w.view_count}</td>
                      <td style={{ textAlign: 'left', width: "10%"}}>
                        {dateCreated}
                        </td>
                      <td style={{width : "10%"}}>
                        <Group justify="flex-end" gap="0.5rem">
                          <Tooltip label="Edit">
                          <ActionIcon
                          variant="light"
                          onClick={() => setSelectedWord(w)}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete">
                          <ActionIcon
                          variant="light"
                          onClick={() => deleteWord(w)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                          </Tooltip>
                          </Group >
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
