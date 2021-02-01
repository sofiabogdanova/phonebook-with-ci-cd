import React from 'react'

const SearchFilter = ({ filteredValue, filteredValueChange }) => {
  return (
    <div>
        filter shown with: <input value={filteredValue} onChange={filteredValueChange} />
    </div>
  )
}

export default SearchFilter