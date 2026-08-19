import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

function ContextMenu({ label, children }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return <div className="context-menu" ref={menuRef}>
    <button className="icon-button" type="button" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((isOpen) => !isOpen)}><Icon name="more" size={18} /></button>
    {open && <div className="context-menu__panel" role="menu" onClick={() => setOpen(false)}>{children}</div>}
  </div>
}

export default ContextMenu
