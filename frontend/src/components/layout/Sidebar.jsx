import Icon from '../common/Icon'
import StorageCard from '../storage/StorageCard'

function Sidebar({ onCreateFolder, onGoHome, storage, usedPercent, formatBytes }) {
  return <aside className="sidebar" aria-label="Main navigation">
    <div className="brand"><span className="brand-mark"><Icon name="cloud" size={22} strokeWidth={2.2} /></span><span>MariCloud</span></div>
    <button className="new-button" onClick={onCreateFolder}><Icon name="plus" size={18} strokeWidth={2.3} />New folder</button>
    <nav className="navigation">
      <button className="nav-item active" onClick={onGoHome} aria-current="page"><Icon name="files" /><span>My files</span></button>
      <button className="nav-item" disabled title="Coming soon"><Icon name="clock" /><span>Recent</span></button>
      <button className="nav-item" disabled title="Coming soon"><Icon name="star" /><span>Starred</span></button>
      <button className="nav-item" disabled title="Coming soon"><Icon name="trash" /><span>Trash</span></button>
    </nav>
    <StorageCard storage={storage} usedPercent={usedPercent} formatBytes={formatBytes} />
  </aside>
}

export default Sidebar
