import Icon from '../common/Icon'

function TopBar() {
  return <header className="topbar">
    <div className="topbar-mobile-brand"><span className="brand-mark"><Icon name="cloud" size={18} /></span><span>MariCloud</span></div>
    <label className="search" title="Search is not available yet"><Icon name="search" size={19} /><input type="text" placeholder="Search files and folders" disabled aria-label="Search files and folders (not available yet)" /></label>
    <div className="profile" aria-label="MariCloud profile">M</div>
  </header>
}

export default TopBar
