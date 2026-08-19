function SelectionToolbar({ selectedCount, onClear }) {
  if (selectedCount === 0) return null
  return <div className="selection-toolbar" role="status"><span>{selectedCount} item{selectedCount === 1 ? '' : 's'} selected</span><button type="button" onClick={onClear}>Clear selection</button></div>
}

export default SelectionToolbar
