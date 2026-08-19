import { useEffect, useRef } from 'react'
import Icon from './Icon'

function Modal({ title, children, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current?.focus()
    const closeOnEscape = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex="-1" ref={dialogRef} onMouseDown={(event) => event.stopPropagation()}>
      <div className="modal__header"><h2 id="modal-title">{title}</h2><button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}><Icon name="close" size={18} /></button></div>
      {children}
    </div>
  </div>
}

export default Modal
