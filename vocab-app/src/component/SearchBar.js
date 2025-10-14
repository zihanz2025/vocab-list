import { useState } from 'react';
import { Autocomplete,TextInput, Box, ScrollArea, Paper, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function WordSearch({ words, onLocateWord }) {
  const [value, setValue] = useState('');

  // Compute filtered suggestions
  const filteredWords = words
    .filter((w) => w.word.toLowerCase().includes(value.toLowerCase()))
    .map((w) => w.word);

  const hasExactMatch = words.some(
    (w) => w.word.toLowerCase() === value.toLowerCase()
  );

  // Add search option if not an exact match
  const data =
    value.trim() === ''
      ? []
      : hasExactMatch
      ? filteredWords
      : [...filteredWords, `🔍 Search “${value}” on WordReference`];

  const handleSearch = () => {
    const match = words.find(
      (w) => w.word.toLowerCase() === value.toLowerCase()
    );
    if (match) {
      onLocateWord(match.word);
    } else if (value.trim() !== '') {
      window.open(
        `https://www.wordreference.com/fren/${encodeURIComponent(value)}`,
        '_blank'
      );
    }
  };

  return (
    <Autocomplete
      placeholder="Search for a word"
      icon={<IconSearch size={16} />}
      value={value}
      onChange={setValue}
      data={data}
      limit={6}
      withinPortal
      nothingFound="No matches"
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleSearch();
      }}
      onOptionSubmit={(option) => {
        if (option.startsWith('🔍')) {
          window.open(
            `https://www.wordreference.com/fren/${encodeURIComponent(value)}`,
            '_blank'
          );
        } else {
          const match = words.find((w) => w.word === option);
          if (match) onLocateWord(match.word);
        }
      }}
      styles={{
        input: {
          borderRadius: '12px',
          fontSize: '1rem',
          backgroundColor: 'white',
        },
        dropdown: { borderRadius: '12px', overflow: 'hidden' },
        option: { padding: '8px 12px', cursor: 'pointer' },
      }}
    />
  );
}
