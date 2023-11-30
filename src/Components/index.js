import React, { useState, useEffect } from 'react';
import {
 Card,
 CardContent,
 CardMedia,
 Typography,
 Select,
 MenuItem,
 Grid,
 Modal,
 Box,
 IconButton,
} from '@mui/material';
import './style.css';

const PokeAPIComponent = () => {
 const [pokemonList, setPokemonList] = useState([]);
 const [category, setCategory] = useState('fire');
 const [quantity, setQuantity] = useState(50);
 const categories = [
    'normal',
    'fire',
    'water',
    'grass',
    'electric',
    'rock',
    'steel',
    'flying',
    'fighting',
    'poison',
    'ground',
    'ice',
    'psychic',
    'bug',
    'ghost',
    'dragon',
    'dark',
    'fairy',
 ];
 const quantityOptions = [50, 100, 300, 1000, 'all'];
 const [selectedPokemon, setSelectedPokemon] = useState(null);
 const [modalOpen, setModalOpen] = useState(false);

 useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/type/${category}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        let pokemonData = data.pokemon;
        if (quantity !== 'all') {
          pokemonData = pokemonData.slice(0, quantity);
        }
        const pokemonList = await Promise.all(
          pokemonData.map(async (pokemon) => {
            const pokemonDetails = await fetch(pokemon.pokemon.url);
            const details = await pokemonDetails.json();
            const pokemonId = details.id;
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
            const types = details.types.map(
              (type) => type.type.name
            );

            return {
              name: details.name,
              image: imageUrl,
              attack: details.stats[4].base_stat,
              defense: details.stats[3].base_stat,
            };
          })
        );
        setPokemonList(pokemonList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchPokemon();
 }, [category, quantity]);

 const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
 };

 const handleQuantityChange = (selectedQuantity) => {
    setQuantity(selectedQuantity);
 };

 const handleCardClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    setModalOpen(true);
 };

 const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPokemon(null);
 };

 return (
    <div>
      <div>
        {categories.map((cat) => (
          <button key={cat} onClick={() => handleCategoryChange(cat)}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div>
        <Select value={quantity} onChange={(e) => handleQuantityChange(parseInt(e.target.value))}>
          {quantityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option === 'all' ? 'All' : option}
            </MenuItem>
          ))}
        </Select>
        <h2>{category.toUpperCase()} Pokémon:</h2>
        <Grid container spacing={2}>
          {pokemonList.map((pokemon, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
              <Card onClick={() => handleCardClick(pokemon)}>
                <CardMedia component="img" height="100%" image={pokemon.image} alt={pokemon.name} />
                <CardContent>
                 <Typography variant="h6" component="div">
                    {pokemon.name}
                 </Typography>
                 <Typography variant="body2" color="textSecondary">
                    Attack: {pokemon.attack}
                 </Typography>
                 <Typography variant="body2" color="textSecondary">
                    Defense: {pokemon.defense}
                 </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <Modal open={modalOpen} onClose={handleCloseModal} className={modalOpen ? 'modal-open' : ''}>
        <div className='box'>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 5, right: 5, }}
          >
            fechar
          </IconButton>
          <div className='divtopmodal' />
          {selectedPokemon && (
            <>
              <div className='divimg'>
                <img src={selectedPokemon.image} className='img' />
              </div>
              <Typography variant="h4" gutterBottom
                textAlign={'center'}
              >
                {selectedPokemon.name}
              </Typography>
              <Typography variant="body1">Name: {selectedPokemon.name}</Typography>
              <Typography variant="body1">Ataque: {selectedPokemon.attack}</Typography>
              <Typography variant="body1">Defesa: {selectedPokemon.defense}</Typography>
              {/* Adicione outros detalhes se desejar */}
            </>
          )}
        </div>
      </Modal>
    </div>
 );
};

export default PokeAPIComponent;