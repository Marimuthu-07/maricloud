import Icon from '../common/Icon'
import FileThumbnail from './FileThumbnail'
import FileActions from './FileActions'

function FileList({ files, formatBytes, selectedIds, onToggleSelection, onUnavailableAction }) {
  return <div className="file-list"><div className="file-list__header"><span>Name</span><span>Size</span><span className="file-list__action-label">Actions</span></div>{files.map((file) => {
    const isSelected = selectedIds.has(file.id)
    return <div className={`file-row${isSelected ? ' selected' : ''}`} key={file.id} onClick={() => onToggleSelection(file.id)}>
      <div className="file-info"><input className="selection-checkbox" type="checkbox" checked={isSelected} aria-label={`Select ${file.fileName}`} onClick={(event) => event.stopPropagation()} onChange={() => onToggleSelection(file.id)} /><FileThumbnail file={file} /><span className="file-name-group"><span className="file-name">{file.fileName}</span><span className="file-size mobile-file-size">{formatBytes(file.size)}</span></span></div>
      <span className="file-size desktop-file-size">{formatBytes(file.size)}</span><div className="file-row__actions" onClick={(event) => event.stopPropagation()}><a className="download" href={`/api/files/${file.id}/download`} aria-label={`Download ${file.fileName}`}><Icon name="download" size={17} /><span>Download</span></a><FileActions file={file} onUnavailableAction={onUnavailableAction} /></div>
    </div>
  })}</div>
}

export default FileList
