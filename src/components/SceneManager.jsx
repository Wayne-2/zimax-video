import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import config from '../config/showcase.config.js'
import { SceneContext } from './SceneContext.js'

export default function SceneManager({ registry, children, onReady }) {
  const mountRef = useRef(null)

  const world = useMemo(() => {
    const cam = config.camera
    const camera = new THREE.PerspectiveCamera(cam.fov, config.render.width / config.render.height, cam.near, cam.far)
    const rig = { ...cam.home }
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(config.render.background)
    const frameCallbacks = new Set()

    registry.current = {
      ...registry.current,
      scene,
      camera,
      rig,
      frameCallbacks,
      devices: registry.current.devices || {},
      overlay: registry.current.overlay || {},
      environment: registry.current.environment || {}
    }
    return { scene, camera, rig, frameCallbacks }
  }, [])

  useEffect(() => {
    const render = config.render
    const renderer = new THREE.WebGLRenderer({
      antialias: render.antialias,
      alpha: false,
      powerPreference: 'high-performance'
    })
    renderer.setSize(render.width, render.height, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, render.dprCap))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.06
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.className = 'stage-canvas'
    mountRef.current.appendChild(renderer.domElement)
    registry.current.renderer = renderer

    const clock = new THREE.Clock()
    let frame
    const loop = () => {
      frame = requestAnimationFrame(loop)
      const delta = Math.min(clock.getDelta(), 0.05)
      world.frameCallbacks.forEach((callback) => callback(delta))
      renderer.render(world.scene, world.camera)
    }
    loop()

    onReady?.()
    return () => {
      cancelAnimationFrame(frame)
      world.frameCallbacks.clear()
      renderer.dispose()
      if (renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
      delete registry.current.renderer
    }
  }, [])

  return (
    <SceneContext.Provider value={world}>
      <div className="scene-layer" ref={mountRef} />
      {children}
    </SceneContext.Provider>
  )
}
