import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [storage, setStorage] = useState(null)
  const [currentFolder, setCurrentFolder] = useState(null)
  const [parentFolder, setParentFolder] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)

      const folderUrl = currentFolder
        ? `/api/folders?parentId=${currentFolder.id}`
        : '/api/folders'

      const [folderResponse, fileResponse, storageResponse] =
        await Promise.all([
          fetch(folderUrl),
          fetch('/api/files'),
          fetch('/api/files/storage'),
        ])

      if (!folderResponse.ok) {
        throw new Error('Failed to load folders')
      }

      if (!fileResponse.ok) {
        throw new Error('Failed to load files')
      }

      if (!storageResponse.ok) {
        throw new Error('Failed to load storage information')
      }

      const folderData = await folderResponse.json()
      const fileData = await fileResponse.json()
      const storageData = await storageResponse.json()

      setFolders(folderData)
      setFiles(fileData)
      setStorage(storageData)
    } catch (error) {
      console.error('Failed to load MariCloud data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentFolder])

  const createFolder = async () => {
    const name = window.prompt('Enter folder name:')

    if (!name || !name.trim()) {
      return
    }

    try {
      const folderUrl = currentFolder
        ? `/api/folders?name=${encodeURIComponent(
            name.trim()
          )}&parentId=${currentFolder.id}`
        : `/api/folders?name=${encodeURIComponent(
            name.trim()
          )}`

      const response = await fetch(folderUrl, {
        method: 'POST',
      })

      if (!response.ok) {
        let message = 'Failed to create folder'

        try {
          const error = await response.json()
          message = error.message || message
        } catch {
          // Ignore JSON parsing error
        }

        alert(message)
        return
      }

      await loadData()
    } catch (error) {
      console.error('Failed to create folder:', error)
      alert('Failed to create folder')
    }
  }

  const uploadFile = async (event) => {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('file', file)

      const folderQuery = currentFolder
        ? `?folderId=${currentFolder.id}`
        : ''

      const response = await fetch(
        `/api/files/upload${folderQuery}`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        let message = 'Upload failed'

        try {
          const error = await response.json()
          message = error.message || message
        } catch {
          // Ignore JSON parsing error
        }

        alert(message)
        return
      }

      await loadData()
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    } finally {
      event.target.value = ''
    }
  }

  const openFolder = (folder) => {
    setParentFolder(currentFolder)
    setCurrentFolder(folder)
  }

  const goBack = () => {
    setCurrentFolder(parentFolder)
    setParentFolder(null)
  }

  const goHome = () => {
    setCurrentFolder(null)
    setParentFolder(null)
  }

  const visibleFiles = files.filter(
    (file) =>
      (currentFolder?.id ?? null) ===
      (file.folderId ?? null)
  )

  const formatBytes = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    return `${(
      bytes /
      (1024 * 1024 * 1024)
    ).toFixed(1)} GB`
  }

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">
            ☁
          </div>

          <span>MariCloud</span>
        </div>

        <button
          className="new-button"
          onClick={createFolder}
        >
          + New
        </button>

        <nav>

          <button
            className="nav-item active"
            onClick={goHome}
          >
            🏠
            <span>My Files</span>
          </button>

          <button className="nav-item">
            🕘
            <span>Recent</span>
          </button>

          <button className="nav-item">
            ⭐
            <span>Starred</span>
          </button>

          <button className="nav-item">
            🗑
            <span>Trash</span>
          </button>

        </nav>

        {/* Storage */}
        <div className="storage-card">

          <div className="storage-title">
            Storage
          </div>

          {storage && (
            <>
              <div className="storage-bar">
                <div
                  className="storage-progress"
                  style={{
                    width: `${Math.min(
                      storage.usagePercent,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="storage-text">
                {formatBytes(storage.usedBytes)}
                {' / '}
                {formatBytes(storage.limitBytes)}
              </div>
            </>
          )}

        </div>

      </aside>

      {/* Main */}
      <main className="main">

        {/* Top bar */}
        <header className="topbar">

          <div className="search">
            🔍

            <input
              type="text"
              placeholder="Search files and folders..."
            />
          </div>

          <div className="profile">
            M
          </div>

        </header>

        {/* Content */}
        <section className="content">

          {/* Header */}
          <div className="content-header">

            <div>

              <h1>
                {currentFolder
                  ? currentFolder.name
                  : 'My Files'}
              </h1>

              <div className="breadcrumb">

                <button onClick={goHome}>
                  My Files
                </button>

                {currentFolder && (
                  <>
                    <span>›</span>

                    <span>
                      {currentFolder.name}
                    </span>
                  </>
                )}

              </div>

            </div>

            <div className="actions">

              {currentFolder && (
                <button
                  className="secondary-button"
                  onClick={goBack}
                >
                  ← Back
                </button>
              )}

              <button
                className="secondary-button"
                onClick={createFolder}
              >
                + Folder
              </button>

              <label className="upload-button">

                ↑ Upload

                <input
                  type="file"
                  hidden
                  onChange={uploadFile}
                />

              </label>

            </div>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="loading">
              Loading MariCloud...
            </div>

          ) : (

            <>

              {/* Folders */}
              <div className="section-title">
                Folders
              </div>

              <div className="folder-grid">

                {folders.map((folder) => (

                  <button
                    className="folder-card"
                    key={folder.id}
                    onDoubleClick={() =>
                      openFolder(folder)
                    }
                  >

                    <div className="folder-icon">
                      📁
                    </div>

                    <div className="folder-name">
                      {folder.name}
                    </div>

                  </button>

                ))}

                {folders.length === 0 && (
                  <div className="empty">
                    No folders here
                  </div>
                )}

              </div>

              {/* Files */}
              <div className="section-title files-title">
                Files
              </div>

              <div className="file-list">

                {visibleFiles.map((file) => (

                  <div
                    className="file-row"
                    key={file.id}
                  >

                    <div className="file-info">

                      <div className="file-icon">
                        📄
                      </div>

                      <div>

                        <div className="file-name">
                          {file.fileName}
                        </div>

                        <div className="file-size">
                          {formatBytes(file.size)}
                        </div>

                      </div>

                    </div>

                    <a
                      className="download"
                      href={`/api/files/${file.id}/download`}
                    >
                      Download
                    </a>

                  </div>

                ))}

                {visibleFiles.length === 0 && (
                  <div className="empty">
                    No files here
                  </div>
                )}

              </div>

            </>

          )}

        </section>

      </main>

    </div>
  )
}

export default App
