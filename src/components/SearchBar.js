import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search jobs by name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
    />
  );
};

export default SearchBar;
