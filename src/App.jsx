import { useCallback, useEffect, useRef, useState } from 'react'
import config from './config/showcase.config.js'
import { createScreenTextures } from './utils/screenTextures.js'
import SceneManager from './components/SceneManager.jsx'
import LightingEnvironment from './components/LightingEnvironment.jsx'
import CameraController from './components/CameraController.jsx'
import Smartphone3D from './components/Smartphone3D.jsx'
import TypographyOverlay from './components/TypographyOverlay.jsx'
import PlaybackControls from './components/PlaybackControls.jsx'
import { buildMasterTimeline } from './timeline/MasterTimeline.js'

export default function App() {
  const registry = useRef({ devices: {}, overlay: {}, environment: {} })
  const shellRef = useRef(null)
  const stageRef = useRef(null)
  const timelineRef = useRef(null)
  const lastUpdate = useRef(0)

  const [textures, setTextures] = useState(null)
  const [sceneReady, setSceneReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    let active = true
    createScreenTextures(config.screens)
      .then((result) => {
        if (active) setTextures(result)
      })
      .catch((error) => console.error(error))
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!sceneReady || !textures) return undefined
    const timeline = buildMasterTimeline({
      registry,
      onUpdate: () => {
        const time = timeline.time()
        if (Math.abs(time - lastUpdate.current) > 0.08) {
          lastUpdate.current = time
          setCurrentTime(time)
        }
      },
      onComplete: () => setPlaying(false)
    })
    timelineRef.current = timeline
    const requestedTime = Number(new URLSearchParams(window.location.search).get('t'))
    if (Number.isFinite(requestedTime) && requestedTime > 0) {
      const bounded = Math.min(requestedTime, config.timing.duration)
      timeline.pause(bounded)
      lastUpdate.current = bounded
      setCurrentTime(bounded)
      setPlaying(false)
    } else {
      timeline.play(0)
      setPlaying(true)
    }
    return () => {
      timeline.kill()
      timelineRef.current = null
    }
  }, [sceneReady, textures])

  useEffect(() => {
    const stage = stageRef.current
    const updateScale = () => {
      stage.style.setProperty('--stage-scale', String(stage.clientWidth / config.render.width))
    }
    const observer = new ResizeObserver(updateScale)
    observer.observe(stage)
    updateScale()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const restart = useCallback(() => {
    const timeline = timelineRef.current
    if (!timeline) return
    timeline.restart()
    lastUpdate.current = 0
    setCurrentTime(0)
    setPlaying(true)
  }, [])

  const togglePlay = useCallback(() => {
    const timeline = timelineRef.current
    if (!timeline) return
    if (timeline.progress() >= 0.999) {
      restart()
      return
    }
    if (timeline.paused()) {
      timeline.play()
      setPlaying(true)
    } else {
      timeline.pause()
      setPlaying(false)
    }
  }, [restart])

  const seek = useCallback((time) => {
    const timeline = timelineRef.current
    if (!timeline) return
    const clamped = Math.max(0, Math.min(config.timing.duration, time))
    timeline.pause(clamped)
    lastUpdate.current = clamped
    setCurrentTime(clamped)
    setPlaying(false)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      shellRef.current?.requestFullscreen?.()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLInputElement) return
      if (event.code === 'Space') {
        event.preventDefault()
        togglePlay()
      } else if (event.key === 'r' || event.key === 'R') {
        restart()
      } else if (event.key === 'f' || event.key === 'F') {
        toggleFullscreen()
      } else if (event.key === 'ArrowRight') {
        seek((timelineRef.current?.time() || 0) + 0.5)
      } else if (event.key === 'ArrowLeft') {
        seek((timelineRef.current?.time() || 0) - 0.5)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [togglePlay, restart, seek, toggleFullscreen])

  return (
    <div className="app-shell" ref={shellRef}>
      <div className="presentation">
        <div className="stage-outer" ref={stageRef}>
          <div className="composition">
            <SceneManager registry={registry} onReady={() => setSceneReady(true)}>
              <LightingEnvironment registry={registry} />
              <CameraController />
              {textures &&
                Object.keys(config.device.devices).map((id) => (
                  <Smartphone3D key={id} id={id} textures={textures} registry={registry} />
                ))}
            </SceneManager>
            <TypographyOverlay registry={registry} />
            {!textures && (
              <div className="loading">
                <span className="loading__mark">{config.brand.wordmark}</span>
                <span className="loading__bar" />
              </div>
            )}
          </div>
        </div>

        <div className="presentation__meta">
          <span>{config.brand.name} — MOTION STUDY</span>
          <span>1280 × 720 · 37.4s</span>
        </div>

        <PlaybackControls
          playing={playing}
          currentTime={currentTime}
          duration={config.timing.duration}
          onToggle={togglePlay}
          onRestart={restart}
          onSeek={seek}
          onFullscreen={toggleFullscreen}
          fullscreen={fullscreen}
        />
      </div>
    </div>
  )
}
