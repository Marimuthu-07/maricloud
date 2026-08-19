import ContextMenu from '../common/ContextMenu'

function FileActions({ file, onUnavailableAction }) {
  return <ContextMenu label={`Actions for ${file.fileName}`}>
    <a className="context-menu__item" role="menuitem" href={`/api/files/${file.id}/download`}>Download</a>
    <button className="context-menu__item" type="button" role="menuitem" onClick={() => onUnavailableAction('Rename files')}>Rename</button>
    <button className="context-menu__item" type="button" role="menuitem" onClick={() => onUnavailableAction('Star files')}>Star</button>
    <button className="context-menu__item danger" type="button" role="menuitem" onClick={() => onUnavailableAction('Delete files')}>Delete</button>
  </ContextMenu>
}

export default FileActions
