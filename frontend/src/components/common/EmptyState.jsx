import Icon from './Icon'

function EmptyState({ icon, title, children }) {
  return <div className="empty-state"><span className="empty-state__icon"><Icon name={icon} size={27} /></span><strong>{title}</strong><span>{children}</span></div>
}

export default EmptyState
