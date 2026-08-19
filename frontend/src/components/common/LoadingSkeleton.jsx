function LoadingSkeleton() {
  return <div className="loading-grid" aria-label="Loading files"><div className="loading-line heading" /><div className="folder-skeletons">{[1, 2, 3, 4].map((item) => <div className="folder-skeleton" key={item} />)}</div><div className="list-skeleton">{[1, 2, 3].map((item) => <div className="loading-line" key={item} />)}</div></div>
}

export default LoadingSkeleton
