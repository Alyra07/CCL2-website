import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="flex flex-col sm:flex-row content-center justify-center mb-6">
      <input
        type="text"
        placeholder="Search place..."
        className=""
        value={searchValue}
        onChange={handleSearchChange}
      />
      <button className="ml-4">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
