import Icon from './Icon'

function Toast({ message, onDismiss }) {
  if (!message) return null
  return <div className="toast" role="status"><span>{message}</span><button className="icon-button" type="button" aria-label="Dismiss notification" onClick={onDismiss}><Icon name="close" size={16} /></button></div>
}

export default Toast
