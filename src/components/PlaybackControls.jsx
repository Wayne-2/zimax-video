import React from 'react'

function formatTime(value) {
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  const tenths = Math.floor((value % 1) * 10)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`
}

export default function PlaybackControls({
  playing,
  currentTime,
  duration,
  onToggle,
  onRestart,
  onSeek,
  onFullscreen,
  fullscreen
}) {
  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="controls">
      <button className="controls__button" onClick={onRestart} title="Restart (R)" aria-label="Restart">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" />
        </svg>
      </button>
      <button className="controls__button controls__button--primary" onClick={onToggle} title="Play / Pause (Space)" aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 5h3v14H7zm7 0h3v14h-3z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        )}
      </button>
      <div className="controls__track">
        <input
          type="range"
          min="0"
          max={duration}
          step="0.01"
          value={Math.min(currentTime, duration)}
          onChange={(event) => onSeek(Number(event.target.value))}
          style={{ '--progress': `${progress}%` }}
          aria-label="Timeline position"
        />
      </div>
      <div className="controls__time">
        <span>{formatTime(currentTime)}</span>
        <span className="controls__separator">/</span>
        <span>{formatTime(duration)}</span>
      </div>
      <button className="controls__button" onClick={onFullscreen} title="Fullscreen (F)" aria-label="Fullscreen">
        {fullscreen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 9h2V5h4V3H3v8h2V9zm12-4h2v4h2V3h-8v2h4zM5 15H3v8h8v-2H7v-4H5zm14 0h-2v4h-4v2h8v-8h-2z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 9V3h6v2H5v4H3zm12-6h6v6h-2V5h-4V3zM3 15h2v4h4v2H3v-6zm16 0h2v6h-6v-2h4v-4z" />
          </svg>
        )}
      </button>
    </div>
  )
}
