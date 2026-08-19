function ErrorState({ error, onRetry }) {
  return <div className="status-card error-state"><strong>Unable to load MariCloud</strong><span>{error}</span><button className="secondary-button" onClick={onRetry}>Try again</button></div>
}

export default ErrorState
