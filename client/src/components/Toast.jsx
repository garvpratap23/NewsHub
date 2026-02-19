export default function Toast({ message, visible }) {
  return (
    <div className={`toast${visible ? ' show' : ''}`}>
      <div className="toast-icon">
        <i className="fas fa-check"></i>
      </div>
      <div className="toast-content">
        <h4>Success!</h4>
        <p>{message || 'Article saved to your bookmarks'}</p>
      </div>
    </div>
  )
}
