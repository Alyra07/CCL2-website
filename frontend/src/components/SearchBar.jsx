import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="sm:flex-row content-center justify-center">
      <input
        type="text"
        placeholder="Search place..."
        className=""
        value={searchValue}
        onChange={handleSearchChange}
      />
      <button className="ml-2 p-2">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
