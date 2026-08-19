import Icon from '../common/Icon'
import FolderActions from './FolderActions'

function FolderGrid({ folders, onOpenFolder, selectedIds, onToggleSelection, onUnavailableAction }) {
  return <div className="folder-grid">{folders.map((folder) => {
    const isSelected = selectedIds.has(folder.id)
    return <div className={`folder-card${isSelected ? ' selected' : ''}`} key={folder.id} onDoubleClick={() => onOpenFolder(folder)}>
      <div className="folder-card__top"><input className="selection-checkbox" type="checkbox" checked={isSelected} aria-label={`Select ${folder.name}`} onChange={() => onToggleSelection(folder.id)} /><FolderActions folder={folder} onOpenFolder={onOpenFolder} onUnavailableAction={onUnavailableAction} /></div>
      <button className="folder-card__open" type="button" onClick={() => onOpenFolder(folder)}><span className="folder-card__icon"><Icon name="folder" size={27} strokeWidth={1.7} /></span><span className="folder-card__name">{folder.name}</span><span className="folder-card__meta">Open folder <Icon name="chevronRight" size={15} /></span></button>
    </div>
  })}</div>
}

export default FolderGrid
