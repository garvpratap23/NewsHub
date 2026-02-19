export default function Loader({ visible }) {
  return (
    <div
      className="loader"
      style={!visible ? { opacity: 0, visibility: 'hidden' } : {}}
    >
      <div className="loader-text">NewsHub</div>
      <div className="loader-bar">
        <div className="loader-progress"></div>
      </div>
    </div>
  )
}
