import Icon from '../common/Icon'

function Breadcrumbs({ folderTrail, currentFolder, onGoHome }) {
  return <div className="breadcrumb"><button onClick={onGoHome}>My files</button>{folderTrail.filter(Boolean).map((folder) => <span key={folder.id} className="breadcrumb-item"><Icon name="chevronRight" size={14} /><span>{folder.name}</span></span>)}{currentFolder && <span className="breadcrumb-item current"><Icon name="chevronRight" size={14} /><span>{currentFolder.name}</span></span>}</div>
}

export default Breadcrumbs
