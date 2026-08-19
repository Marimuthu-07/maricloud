import { useEffect, useState } from 'react'
import EmptyState from './components/common/EmptyState'
import ErrorState from './components/common/ErrorState'
import Icon from './components/common/Icon'
import LoadingSkeleton from './components/common/LoadingSkeleton'
import Breadcrumbs from './components/files/Breadcrumbs'
import FileList from './components/files/FileList'
import FolderNameModal from './components/files/FolderNameModal'
import FolderGrid from './components/files/FolderGrid'
import SelectionToolbar from './components/files/SelectionToolbar'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import Toast from './components/common/Toast'
import './App.css'

function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function App() {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [storage, setStorage] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [folderTrail, setFolderTrail] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState(new Set())
  const [selectedFolders, setSelectedFolders] = useState(new Set())

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        setError('')
        const folderUrl = currentFolder ? `/api/folders?parentId=${currentFolder.id}` : '/api/folders'
        const [folderResponse, fileResponse, storageResponse] = await Promise.all([fetch(folderUrl), fetch('/api/files'), fetch('/api/files/storage')])
        if (!folderResponse.ok || !fileResponse.ok || !storageResponse.ok) throw new Error('Could not load your files. Please try again.')
        const [folderData, fileData, storageData] = await Promise.all([folderResponse.json(), fileResponse.json(), storageResponse.json()])
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

  const refreshData = () => { setLoading(true); setRefreshKey((key) => key + 1) }
  const createFolder = async (name) => {
    if (!name?.trim()) return
    try {
      const folderUrl = currentFolder ? `/api/folders?name=${encodeURIComponent(name.trim())}&parentId=${currentFolder.id}` : `/api/folders?name=${encodeURIComponent(name.trim())}`
      const response = await fetch(folderUrl, { method: 'POST' })
      if (!response.ok) {
        let message = 'Failed to create folder'
        try { message = (await response.json()).message || message } catch { /* Ignore invalid error body */ }
        setToastMessage(message)
        return
      }
      setShowFolderModal(false)
      setToastMessage('Folder created')
      refreshData()
    } catch (requestError) {
      console.error('Failed to create folder:', requestError)
      setToastMessage('Failed to create folder')
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
        setToastMessage(message)
        return
      }
      refreshData()
    } catch (requestError) {
      console.error('Upload failed:', requestError)
      setToastMessage('Upload failed')
    } finally { event.target.value = '' }
  }
  const openFolder = (folder) => { setLoading(true); setFolderTrail((trail) => [...trail, currentFolder]); setCurrentFolder(folder) }
  const goBack = () => { const previousFolder = folderTrail[folderTrail.length - 1] ?? null; setLoading(true); setFolderTrail((trail) => trail.slice(0, -1)); setCurrentFolder(previousFolder) }
  const goHome = () => { if (!currentFolder) return; setLoading(true); setCurrentFolder(null); setFolderTrail([]) }
  const toggleSelectedFile = (id) => setSelectedFiles((selected) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const toggleSelectedFolder = (id) => setSelectedFolders((selected) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })
  const clearSelection = () => { setSelectedFiles(new Set()); setSelectedFolders(new Set()) }
  const showUnavailableAction = (action) => setToastMessage(`${action} requires backend support.`)

  const visibleFiles = files.filter((file) => (currentFolder?.id ?? null) === (file.folderId ?? null))
  const usedPercent = storage ? Math.min(Math.max(storage.usagePercent, 0), 100) : 0
  const itemSummary = `${folders.length} folder${folders.length === 1 ? '' : 's'} · ${visibleFiles.length} file${visibleFiles.length === 1 ? '' : 's'}`

  return <div className="app-shell">
    <Sidebar onCreateFolder={() => setShowFolderModal(true)} onGoHome={goHome} storage={storage} usedPercent={usedPercent} formatBytes={formatBytes} />
    <main className="main"><TopBar />
      <section className="content" aria-live="polite">
        <div className="content-header"><div><Breadcrumbs folderTrail={folderTrail} currentFolder={currentFolder} onGoHome={goHome} /><h1>{currentFolder ? currentFolder.name : 'My files'}</h1><p className="content-subtitle">{loading ? 'Syncing your files…' : itemSummary}</p></div>
          <div className="actions">{currentFolder && <button className="secondary-button" onClick={goBack}><Icon name="chevronLeft" size={17} />Back</button>}<button className="secondary-button" onClick={() => setShowFolderModal(true)}><Icon name="plus" size={17} />Folder</button><label className="upload-button"><Icon name="upload" size={17} />Upload<input type="file" hidden onChange={uploadFile} /></label></div>
        </div>
        {error ? <ErrorState error={error} onRetry={refreshData} /> : loading ? <LoadingSkeleton /> : <>
          <SelectionToolbar selectedCount={selectedFiles.size + selectedFolders.size} onClear={clearSelection} />
          <div className="section-heading"><h2>Folders</h2><span>{folders.length}</span></div>
          {folders.length > 0 ? <FolderGrid folders={folders} onOpenFolder={openFolder} selectedIds={selectedFolders} onToggleSelection={toggleSelectedFolder} onUnavailableAction={showUnavailableAction} /> : <EmptyState icon="folder" title="No folders here yet">Create a folder to keep your files organized.</EmptyState>}
          <div className="section-heading files-heading"><h2>Files</h2><span>{visibleFiles.length}</span></div>
          {visibleFiles.length > 0 ? <FileList files={visibleFiles} formatBytes={formatBytes} selectedIds={selectedFiles} onToggleSelection={toggleSelectedFile} onUnavailableAction={showUnavailableAction} /> : <EmptyState icon="file" title="No files here yet">Upload a file to get started.</EmptyState>}
        </>}
      </section>
    </main>
    {showFolderModal && <FolderNameModal onClose={() => setShowFolderModal(false)} onCreate={createFolder} />}
    <Toast message={toastMessage} onDismiss={() => setToastMessage('')} />
  </div>
}

export default App
