import { useState } from 'react';
import { Autocomplete, CloseButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function WordSearch({ words, allWords, onLocateWord, onFilterBySearch }) {
  const [value, setValue] = useState('');

  const safeWords = words || [];
  const safeAllWords = allWords || [];

  const filteredWords = safeWords
    .filter((w) => w.word.toLowerCase().includes(value.toLowerCase()))
    .map((w) => w.word);

  const hasExactMatchInCurrent = safeWords.some(
    (w) => w.word.toLowerCase() === value.toLowerCase()
  );

  const existsInAll = safeAllWords.some(
    (w) => w.word.toLowerCase() === value.toLowerCase()
  );

  const data =
    value.trim() === ''
      ? []
      : hasExactMatchInCurrent
      ? filteredWords
      : existsInAll
      ? [...filteredWords, `→ Locate "${value}" in all words`]
      : [...filteredWords, `→ Search "${value}" on WordReference`];

  const handleSearch = () => {
    const match = safeWords.find((w) => w.word.toLowerCase() === value.toLowerCase());
    if (match) {
      onLocateWord(match.word, { overrideFilter: false });
    }
  };

  const handleChange = (val) => {
    setValue(val);
    if (!val && onFilterBySearch) {
      onFilterBySearch('');
    }
  };

  const handleClear = () => {
    setValue('');
    if (onFilterBySearch) {
      onFilterBySearch('');
    }
  };

  return (
    <Autocomplete
      placeholder="Search or filter..."
      leftSection={<IconSearch size={16} />}
      value={value}
      onChange={handleChange}
      data={data}
      limit={6}
      nothingFound={value.trim() ? `Press Enter to filter by "${value.trim()}"` : 'No matches'}
      style={{ width: '100%' }}
      rightSection={value ? (
        <CloseButton
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            handleClear();
          }}
          aria-label="Clear search"
        />
      ) : null}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (value.trim() && onFilterBySearch) {
            onFilterBySearch(value.trim());
          } else {
            handleSearch();
          }
          document.activeElement?.blur();
        }
      }}
      onOptionSubmit={(option) => {
        if (option.startsWith('→ Locate')) {
          const match = safeAllWords.find(
            (w) => w.word.toLowerCase() === value.toLowerCase()
          );
          if (match) onLocateWord(match.word, { overrideFilter: true });
        } else if (option.startsWith('→ Search')) {
          window.open(
            `https://www.wordreference.com/fren/${encodeURIComponent(value)}`,
            '_blank'
          );
        } else {
          const match = safeWords.find((w) => w.word === option);
          if (match) onLocateWord(match.word, { overrideFilter: false });
        }
      }}
      styles={{
        input: {
          borderRadius: '2px',
          fontSize: '1rem',
          backgroundColor: 'white',
        },
        dropdown: { borderRadius: '2px', overflow: 'hidden' },
        option: { padding: '8px 12px', cursor: 'pointer'},
      }}
    />
  );
}
