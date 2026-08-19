import { useEffect, useState } from 'react'
import './App.css'

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const paths = {
    cloud: <path d="M6.5 18.5h10.7a4.3 4.3 0 0 0 .5-8.6A6.2 6.2 0 0 0 6 8.3a5.1 5.1 0 0 0 .5 10.2Z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    files: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H10l2 2.5h5.5A2.5 2.5 0 0 1 20 8v8.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-11Z" /><path d="M4 9h16" /></>,
    clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3.5 2" /></>,
    star: <path d="m12 3 2.75 5.58 6.16.9-4.46 4.35 1.05 6.14L12 17.08l-5.5 2.89 1.05-6.14L3.1 9.48l6.15-.9L12 3Z" />,
    trash: <><path d="M4.5 7h15M9.5 3h5l1 4h-7l1-4ZM7 7l.8 13h8.4L17 7" /><path d="M10 11v5M14 11v5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="5.8" /><path d="m15.2 15.2 4 4" /></>,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    upload: <><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5" /><path d="M5 14v4a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-4" /></>,
    download: <><path d="M12 3v12M7.5 10.5 12 15l4.5-4.5" /><path d="M5 20h14" /></>,
    folder: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2.5h6.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />,
    file: <><path d="M6 3h7l5 5v13H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M13 3v5h5" /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m4 17 5-5 3.5 3.5 2.5-2.5 5 4" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
  }

  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

const isImageFile = (file) => /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(file.fileName || '')

function App() {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [storage, setStorage] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [folderTrail, setFolderTrail] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        setError('')
        const folderUrl = currentFolder ? `/api/folders?parentId=${currentFolder.id}` : '/api/folders'
        const [folderResponse, fileResponse, storageResponse] = await Promise.all([
          fetch(folderUrl),
          fetch('/api/files'),
          fetch('/api/files/storage'),
        ])

        if (!folderResponse.ok || !fileResponse.ok || !storageResponse.ok) {
          throw new Error('Could not load your files. Please try again.')
        }

        const [folderData, fileData, storageData] = await Promise.all([
          folderResponse.json(), fileResponse.json(), storageResponse.json(),
        ])

        if (!cancelled) {
          setFolders(folderData)
          setFiles(fileData)
          setStorage(storageData)
        }
      } catch (fetchError) {
        console.error('Failed to load MariCloud data:', fetchError)
        if (!cancelled) setError('Could not load your files. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchData()
    return () => { cancelled = true }
  }, [currentFolder, refreshKey])

  const refreshData = () => {
    setLoading(true)
    setRefreshKey((key) => key + 1)
  }

  const createFolder = async () => {
    const name = window.prompt('Name your new folder')
    if (!name || !name.trim()) return

    try {
      const folderUrl = currentFolder
        ? `/api/folders?name=${encodeURIComponent(name.trim())}&parentId=${currentFolder.id}`
        : `/api/folders?name=${encodeURIComponent(name.trim())}`
      const response = await fetch(folderUrl, { method: 'POST' })

      if (!response.ok) {
        let message = 'Failed to create folder'
        try { message = (await response.json()).message || message } catch { /* Ignore invalid error body */ }
        window.alert(message)
        return
      }
      refreshData()
    } catch (requestError) {
      console.error('Failed to create folder:', requestError)
      window.alert('Failed to create folder')
    }
  }

  const uploadFile = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)
      const folderQuery = currentFolder ? `?folderId=${currentFolder.id}` : ''
      const response = await fetch(`/api/files/upload${folderQuery}`, { method: 'POST', body: formData })

      if (!response.ok) {
        let message = 'Upload failed'
        try { message = (await response.json()).message || message } catch { /* Ignore invalid error body */ }
        window.alert(message)
        return
      }
      refreshData()
    } catch (requestError) {
      console.error('Upload failed:', requestError)
      window.alert('Upload failed')
    } finally {
      event.target.value = ''
    }
  }

  const openFolder = (folder) => {
    setLoading(true)
    setFolderTrail((trail) => [...trail, currentFolder])
    setCurrentFolder(folder)
  }

  const goBack = () => {
    const previousFolder = folderTrail[folderTrail.length - 1] ?? null
    setLoading(true)
    setFolderTrail((trail) => trail.slice(0, -1))
    setCurrentFolder(previousFolder)
  }

  const goHome = () => {
    if (!currentFolder) return
    setLoading(true)
    setCurrentFolder(null)
    setFolderTrail([])
  }

  const visibleFiles = files.filter((file) => (currentFolder?.id ?? null) === (file.folderId ?? null))
  const usedPercent = storage ? Math.min(Math.max(storage.usagePercent, 0), 100) : 0

  const formatBytes = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand"><span className="brand-mark"><Icon name="cloud" size={22} strokeWidth={2.2} /></span><span>MariCloud</span></div>
        <button className="new-button" onClick={createFolder}><Icon name="plus" size={18} strokeWidth={2.3} />New folder</button>
        <nav className="navigation">
          <button className="nav-item active" onClick={goHome} aria-current="page"><Icon name="files" /><span>My files</span></button>
          <button className="nav-item" disabled title="Coming soon"><Icon name="clock" /><span>Recent</span></button>
          <button className="nav-item" disabled title="Coming soon"><Icon name="star" /><span>Starred</span></button>
          <button className="nav-item" disabled title="Coming soon"><Icon name="trash" /><span>Trash</span></button>
        </nav>
        <div className="storage-card">
          <div className="storage-card__top"><span>Storage</span>{storage && <span>{Math.round(usedPercent)}%</span>}</div>
          <div className="storage-bar" aria-label={storage ? `${Math.round(usedPercent)}% storage used` : 'Loading storage'}><div className="storage-progress" style={{ width: `${usedPercent}%` }} /></div>
          <div className="storage-text">{storage ? <>{formatBytes(storage.usedBytes)} of {formatBytes(storage.limitBytes)} used</> : 'Calculating storage…'}</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-mobile-brand"><span className="brand-mark"><Icon name="cloud" size={18} /></span><span>MariCloud</span></div>
          <label className="search" title="Search is not available yet"><Icon name="search" size={19} /><input type="text" placeholder="Search files and folders" disabled aria-label="Search files and folders (not available yet)" /></label>
          <div className="profile" aria-label="MariCloud profile">M</div>
        </header>

        <section className="content" aria-live="polite">
          <div className="content-header">
            <div>
              <div className="breadcrumb"><button onClick={goHome}>My files</button>{folderTrail.filter(Boolean).map((folder) => <span key={folder.id} className="breadcrumb-item"><Icon name="chevronRight" size={14} /><span>{folder.name}</span></span>)}{currentFolder && <span className="breadcrumb-item current"><Icon name="chevronRight" size={14} /><span>{currentFolder.name}</span></span>}</div>
              <h1>{currentFolder ? currentFolder.name : 'My files'}</h1>
              <p className="content-subtitle">{loading ? 'Syncing your files…' : `${folders.length} folder${folders.length === 1 ? '' : 's'} · ${visibleFiles.length} file${visibleFiles.length === 1 ? '' : 's'}`}</p>
            </div>
            <div className="actions">
              {currentFolder && <button className="secondary-button" onClick={goBack}><Icon name="chevronLeft" size={17} />Back</button>}
              <button className="secondary-button" onClick={createFolder}><Icon name="plus" size={17} />Folder</button>
              <label className="upload-button"><Icon name="upload" size={17} />Upload<input type="file" hidden onChange={uploadFile} /></label>
            </div>
          </div>

          {error ? <div className="status-card error-state"><strong>Unable to load MariCloud</strong><span>{error}</span><button className="secondary-button" onClick={refreshData}>Try again</button></div> : loading ? <div className="loading-grid" aria-label="Loading files"><div className="loading-line heading" /><div className="folder-skeletons">{[1, 2, 3, 4].map((item) => <div className="folder-skeleton" key={item} />)}</div><div className="list-skeleton">{[1, 2, 3].map((item) => <div className="loading-line" key={item} />)}</div></div> : <>
            <div className="section-heading"><h2>Folders</h2><span>{folders.length}</span></div>
            {folders.length > 0 ? <div className="folder-grid">{folders.map((folder) => <button className="folder-card" key={folder.id} onClick={() => openFolder(folder)}><span className="folder-card__icon"><Icon name="folder" size={27} strokeWidth={1.7} /></span><span className="folder-card__name">{folder.name}</span><span className="folder-card__meta">Open folder <Icon name="chevronRight" size={15} /></span></button>)}</div> : <div className="empty-state"><span className="empty-state__icon"><Icon name="folder" size={27} /></span><strong>No folders here yet</strong><span>Create a folder to keep your files organized.</span></div>}

            <div className="section-heading files-heading"><h2>Files</h2><span>{visibleFiles.length}</span></div>
            {visibleFiles.length > 0 ? <div className="file-list"><div className="file-list__header"><span>Name</span><span>Size</span><span className="file-list__action-label">Actions</span></div>{visibleFiles.map((file) => <div className="file-row" key={file.id}><div className="file-info"><span className={`file-icon${isImageFile(file) ? ' image-file' : ''}`}><Icon name={isImageFile(file) ? 'image' : 'file'} size={21} />{isImageFile(file) && <img src={`/api/files/${file.id}/download`} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = 'none' }} />}</span><span className="file-name-group"><span className="file-name">{file.fileName}</span><span className="file-size mobile-file-size">{formatBytes(file.size)}</span></span></div><span className="file-size desktop-file-size">{formatBytes(file.size)}</span><a className="download" href={`/api/files/${file.id}/download`} aria-label={`Download ${file.fileName}`}><Icon name="download" size={17} /><span>Download</span></a></div>)}</div> : <div className="empty-state"><span className="empty-state__icon"><Icon name="file" size={27} /></span><strong>No files here yet</strong><span>Upload a file to get started.</span></div>}
          </>}
        </section>
      </main>
    </div>
  )
}

export default App
