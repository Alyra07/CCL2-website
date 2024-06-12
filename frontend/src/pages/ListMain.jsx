  import React, { useState } from 'react';
  import SearchBar from '../components/SearchBar';
  
  const ListMain = () => {
    // search in list
    const [searchTerm, setSearchTerm] = useState('');
    const [list] = useState([]);
  
    const searchResults = list.filter(result => 
      (result.title ? result.title.toLowerCase().includes(searchTerm.toLowerCase()) : false)
    );
  
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-red-500">List Main</h1>
        <SearchBar onSearch={setSearchTerm}/>
      </div>
    );
  }
  
  export default ListMain;