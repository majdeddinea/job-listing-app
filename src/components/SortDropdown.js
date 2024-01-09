import React, { useState, useEffect } from "react";

const SortDropdown = ({ sortOption, setSortOption, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="w-full px-4 py-2 border rounded-md bg-white"
        disabled={disabled}
      >
        <option value="dateDesc">Date (Newest First)</option>
        <option value="dateAsc">Date (Oldest First)</option>
        <option value="nameAsc">Name (A-Z)</option>
        <option value="nameDesc">Name (Z-A)</option>
        <option value="categoryAsc">Category (A-Z)</option>
        <option value="categoryDesc">Category (Z-A)</option>
      </select>
      {disabled && isHovered && (
        <div className="absolute z-10 w-full p-2 mt-1 text-sm text-black bg-gray-300 rounded-md shadow-lg top-full">
          To use SortDropdown, please clear filters first.
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
