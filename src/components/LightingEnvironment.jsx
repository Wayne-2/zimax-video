import { useEffect } from 'react'
import * as THREE from 'three'
import config from '../config/showcase.config.js'
import { useScene } from './SceneContext.js'

function radialShadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 126)
  gradient.addColorStop(0, 'rgba(30,32,38,0.42)')
  gradient.addColorStop(0.45, 'rgba(30,32,38,0.16)')
  gradient.addColorStop(1, 'rgba(30,32,38,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export default function LightingEnvironment({ registry }) {
  const { scene } = useScene()

  useEffect(() => {
    const group = new THREE.Group()
    scene.add(group)

    const hemi = new THREE.HemisphereLight(0xffffff, 0xd6d8de, 2.1)
    group.add(hemi)

    const ambient = new THREE.AmbientLight(0xffffff, 0.35)
    group.add(ambient)

    const key = new THREE.DirectionalLight(0xffffff, 2.6)
    key.position.set(-4.5, 8, 7)
    key.castShadow = true
    key.shadow.mapSize.set(config.render.shadowMapSize, config.render.shadowMapSize)
    key.shadow.camera.near = 1
    key.shadow.camera.far = 30
    key.shadow.camera.left = -9
    key.shadow.camera.right = 9
    key.shadow.camera.top = 9
    key.shadow.camera.bottom = -9
    key.shadow.bias = -0.0004
    key.shadow.normalBias = 0.02
    key.shadow.radius = 4
    group.add(key)

    const fill = new THREE.DirectionalLight(0xeef2ff, 1.1)
    fill.position.set(6, 2.5, 5)
    group.add(fill)

    const rim = new THREE.DirectionalLight(0xffffff, 1.3)
    rim.position.set(1.5, 5, -7)
    group.add(rim)

    const shadowCatcher = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ color: 0x2b2e35, opacity: 0.045, transparent: true })
    )
    shadowCatcher.rotation.x = -Math.PI / 2
    shadowCatcher.position.y = -2.379
    shadowCatcher.receiveShadow = true
    group.add(shadowCatcher)

    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 2.4),
      new THREE.MeshBasicMaterial({
        map: radialShadowTexture(),
        transparent: true,
        opacity: 0.5,
        depthWrite: false
      })
    )
    contact.rotation.x = -Math.PI / 2
    contact.position.set(0.4, -2.36, 0)
    group.add(contact)

    const accentMaterial = new THREE.MeshBasicMaterial({
      color: 0x2f3238,
      transparent: true,
      opacity: 0,
      depthWrite: false
    })
    const accent = new THREE.Mesh(new THREE.RingGeometry(1.28, 1.305, 128), accentMaterial)
    accent.rotation.x = -Math.PI / 2
    accent.scale.set(1.45, 0.46, 1)
    accent.position.set(0.4, -2.345, 0)
    group.add(accent)

    const accentInnerMaterial = accentMaterial.clone()
    const accentInner = new THREE.Mesh(new THREE.RingGeometry(1.04, 1.05, 128), accentInnerMaterial)
    accentInner.rotation.x = -Math.PI / 2
    accentInner.scale.set(1.45, 0.46, 1)
    accentInner.position.set(0.4, -2.344, 0)
    group.add(accentInner)

    registry.current.environment = { accent, accentMaterial, accentInner, accentInnerMaterial, contact, shadowCatcher, key }
    return () => {
      scene.remove(group)
      group.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (object.material.map) object.material.map.dispose()
          object.material.dispose()
        }
      })
      registry.current.environment = {}
    }
  }, [])

  return null
}
