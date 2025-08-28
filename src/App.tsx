import { useState } from 'react';
import './App.css';
import { Counter } from './shared/ui/counter';
import { SearchForm } from './shared/ui/search-form';
import { GenreSelect } from './shared/ui/genre-select';
import { MovieTile } from './shared/ui/movie-tile';
import { MovieDetails } from './shared/ui/movie-details';
import { SortControl, type SortValue } from './shared/ui/sort-control';

const GENRES = ['All', 'Documentary', 'Comedy', 'Horror', 'Crime'];

function App() {
  const [selected, setSelected] = useState('All');
  const [sort, setSort] = useState<SortValue>('releaseDate');

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
      <MovieTile
        movie={{
          imageUrl: '',
          title: 'Inception',
          year: 2010,
          genres: ['Action', 'Sci-Fi'],
        }}
        onClick={(m) => console.log('Clicked:', m)}
        onEdit={(m) => console.log('Edit:', m)}
        onDelete={(m) => console.log('Delete:', m)}
      />
      <MovieDetails
        details={{
          imageUrl: '',
          title: 'Inception',
          year: 2010,
          rating: 8.8,
          duration: '2h 28m',
          description: 'A thief who steals corporate secrets through dream-sharing technology...',
        }}
      />
      <SortControl
        value={sort}
        onChange={(v) => {
          console.log('sort changed:', v);
          setSort(v);
        }}
      />
    </div>
  );
}

export default App;
