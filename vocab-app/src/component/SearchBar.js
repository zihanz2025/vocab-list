import { useState } from 'react';
import { Autocomplete } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function WordSearch({ words, allWords, onLocateWord }) {
  const [value, setValue] = useState('');

  // Compute filtered suggestions
  const filteredWords = words
    .filter((w) => w.word.toLowerCase().includes(value.toLowerCase()))
    .map((w) => w.word);

  const hasExactMatchInCurrent = words.some(
    (w) => w.word.toLowerCase() === value.toLowerCase()
  );

  const existsInAll = allWords.some(
    (w) => w.word.toLowerCase() === value.toLowerCase()
  );

  // Build dropdown data
  const data =
    value.trim() === ''
      ? []
      : hasExactMatchInCurrent
      ? filteredWords
      : existsInAll
      ? [...filteredWords, `→ Locate "${value}" in all words`]
      : [...filteredWords, `→ Search "${value}" on WordReference`];

  const handleSearch = () => {
    const match = words.find((w) => w.word.toLowerCase() === value.toLowerCase());
    if (match) {
      onLocateWord(match.word);
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
        if (option.startsWith('→ Locate')) {
          // locate in allWords (full list)
          const match = allWords.find(
            (w) => w.word.toLowerCase() === value.toLowerCase()
          );
          if (match) onLocateWord(match.word, { overrideFilter: true });
        } else if (option.startsWith('→ Search')) {
          // fallback to WordReference
          window.open(
            `https://www.wordreference.com/fren/${encodeURIComponent(value)}`,
            '_blank'
          );
        } else {
          const match = words.find((w) => w.word === option);
          if (match) onLocateWord(match.word,{ overrideFilter: false });
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
