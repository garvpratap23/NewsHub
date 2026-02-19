export default function Ticker({ visible }) {
  return (
    <div className={`ticker${visible ? ' show' : ''}`}>
      <div className="ticker-content">
        <span className="ticker-item">Breaking: Major tech companies report record earnings in Q4</span>
        <span className="ticker-item">Live: World leaders gather for historic climate summit</span>
        <span className="ticker-item">Update: New discoveries in space exploration announced by NASA</span>
        <span className="ticker-item">Alert: Stock markets reach all-time highs amid economic recovery</span>
        <span className="ticker-item">Breaking: Major tech companies report record earnings in Q4</span>
        <span className="ticker-item">Live: World leaders gather for historic climate summit</span>
        <span className="ticker-item">Update: New discoveries in space exploration announced by NASA</span>
        <span className="ticker-item">Alert: Stock markets reach all-time highs amid economic recovery</span>
      </div>
    </div>
  )
}
