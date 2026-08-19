function StorageCard({ storage, usedPercent, formatBytes }) {
  return <div className="storage-card">
    <div className="storage-card__top"><span>Storage</span>{storage && <span>{Math.round(usedPercent)}%</span>}</div>
    <div className="storage-bar" aria-label={storage ? `${Math.round(usedPercent)}% storage used` : 'Loading storage'}><div className="storage-progress" style={{ width: `${usedPercent}%` }} /></div>
    <div className="storage-text">{storage ? <>{formatBytes(storage.usedBytes)} of {formatBytes(storage.limitBytes)} used</> : 'Calculating storage…'}</div>
  </div>
}

export default StorageCard
