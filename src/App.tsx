import { useState } from 'react';
import './App.css';
import { Counter } from './shared/ui/counter';
import { SearchForm } from './shared/ui/search-form';
import { GenreSelect } from './shared/ui/genre-select';

const GENRES = ['All', 'Documentary', 'Comedy', 'Horror', 'Crime'];

function App() {
  const [selected, setSelected] = useState('All');

  return (
    <div className="vstack">
      <Counter initialValue={0} />
      <SearchForm
        initialQuery="Matrix"
        onSearch={(query) => {
          console.log(`Search Query: ${query}`);
        }}
      />
      <GenreSelect
        genres={GENRES}
        selected={selected}
        onSelect={(genre) => {
          console.log(`Selected Genre: ${genre}`);
          setSelected(genre);
        }}
      />
    </div>
  );
}

export default App;
