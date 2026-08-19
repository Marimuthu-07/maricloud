import { useState } from 'react'
import Modal from '../common/Modal'

function FolderNameModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const trimmedName = name.trim()
  const submit = (event) => {
    event.preventDefault()
    if (trimmedName) onCreate(trimmedName)
  }

  return <Modal title="New folder" onClose={onClose}>
    <form className="folder-name-form" onSubmit={submit}>
      <label htmlFor="folder-name">Folder name</label>
      <input id="folder-name" autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Untitled folder" />
      <div className="modal__actions"><button className="secondary-button" type="button" onClick={onClose}>Cancel</button><button className="upload-button" type="submit" disabled={!trimmedName}>Create folder</button></div>
    </form>
  </Modal>
}

export default FolderNameModal
