import ContextMenu from '../common/ContextMenu'

function FolderActions({ folder, onOpenFolder, onUnavailableAction }) {
  return <ContextMenu label={`Actions for ${folder.name}`}>
    <button className="context-menu__item" type="button" role="menuitem" onClick={() => onOpenFolder(folder)}>Open</button>
    <button className="context-menu__item" type="button" role="menuitem" onClick={() => onUnavailableAction('Rename folders')}>Rename</button>
    <button className="context-menu__item danger" type="button" role="menuitem" onClick={() => onUnavailableAction('Delete folders')}>Delete</button>
  </ContextMenu>
}

export default FolderActions
