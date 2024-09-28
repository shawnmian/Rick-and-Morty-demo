import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Assuming your basic styling is in App.css
import { Select, MenuItem, FormControl, Switch } from '@mui/material'; // Import Material UI components
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DarkModeIcon from '@mui/icons-material/DarkMode'; // Import the Dark Mode Icon
import CharacterCard from './components/CharacterCard'; // Import the CharacterCard component

function App() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('All');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ? true : false;
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://rickandmortyapi.com/api/character');
        setCharacters(response.data.results);
        setFilteredCharacters(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to load characters');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combine sorting and filtering logic
  useEffect(() => {
    let filteredData = [...characters];

    // Filter by status, unless "All" is selected
    if (filterByStatus && filterByStatus !== "All") {
      filteredData = filteredData.filter((char) => char.status === filterByStatus);
    }

    // Apply sorting after filtering
    if (sortBy === 'name') {
      filteredData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'created') {
      filteredData.sort((a, b) => new Date(a.created) - new Date(b.created));
    }

    setFilteredCharacters(filteredData);
  }, [filterByStatus, sortBy, characters]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Updated Header Section */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Rick and Morty Characters</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <DarkModeIcon /> {/* Dark Mode Icon */}
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="default"
            />
          </div>
        </header>

        <div className="dropdown-container"> {/* Flexbox container with space between dropdowns */}
          {/* Sorting Dropdown (Material UI) */}
          <FormControl className="custom-dropdown">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select a sorting option</MenuItem>
              <MenuItem value="name">Name (A-Z)</MenuItem>
              <MenuItem value="created">Date Created (Newest)</MenuItem>
            </Select>
          </FormControl>

          {/* Filtering Dropdown (Material UI) */}
          <FormControl className="custom-dropdown">
            <Select
              value={filterByStatus}
              onChange={(e) => setFilterByStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value="All">All</MenuItem> {/* Include the "All" option */}
              <MenuItem value="Alive">Alive</MenuItem>
              <MenuItem value="Dead">Dead</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Display the Character Cards */}
        <div className="character-grid">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map((char) => (
              <CharacterCard key={char.id} character={char} /> // Use the CharacterCard component
            ))
          ) : (
            <p>No characters found</p>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
