import { useState } from 'react';
import { Autocomplete, CloseButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

function normalizeString(str) {
  if (typeof str !== 'string') return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function WordSearch({ words, allWords, onLocateWord, onFilterBySearch }) {
  const [value, setValue] = useState('');

  const safeWords = Array.isArray(words) ? words : [];
  const safeAllWords = Array.isArray(allWords) ? allWords : [];

  const normalizedValue = normalizeString(value);

  const filteredWords = safeWords
    .filter((w) => normalizeString(w.word).includes(normalizedValue))
    .map((w) => w.word);

  const hasExactMatchInCurrent = safeWords.some(
    (w) => normalizeString(w.word) === normalizedValue
  );

  const existsInAll = safeAllWords.some(
    (w) => normalizeString(w.word) === normalizedValue
  );

  const data = value.trim() === '' ? [] : (() => {
    const suggestions = filteredWords.slice(0, 6);
    if (hasExactMatchInCurrent) {
      return suggestions;
    }
    if (existsInAll) {
      return [...suggestions, `→ Locate "${value}" in all words`];
    }
    return [...suggestions, `→ Search "${value}" on WordReference`];
  })();

  const handleSearch = () => {
    const match = safeWords.find((w) => normalizeString(w.word) === normalizedValue);
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
      filter={({ options, search, limit }) => {
        const normalizedSearch = normalizeString(search);
        return options
          .filter((option) => {
            const val = option?.label || option?.value || '';
            return normalizeString(val).includes(normalizedSearch);
          })
          .slice(0, limit);
      }}
      limit={6}
      nothingFound="Press Enter to filter"
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
            (w) => normalizeString(w.word) === normalizedValue
          );
          if (match) onLocateWord(match.word, { overrideFilter: true });
        } else if (option.startsWith('→ Search')) {
          window.open(
            `https://www.wordreference.com/fren/${encodeURIComponent(value)}`,
            '_blank'
          );
        } else {
          const match = safeWords.find((w) => normalizeString(w.word) === normalizeString(option));
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
