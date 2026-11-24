import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import config from '../config/showcase.config.js'
import { useScene } from './SceneContext.js'
import DeviceScreen from './DeviceScreen.jsx'

function buildProceduralPhone(deviceConfig) {
  const group = new THREE.Group()
  const { width, height, depth, cornerRadius, frameColor, backColor, glassColor } = deviceConfig

  const frameMaterial = new THREE.MeshStandardMaterial({
    color: frameColor,
    metalness: 0.86,
    roughness: 0.27
  })
  const backMaterial = new THREE.MeshPhysicalMaterial({
    color: backColor,
    metalness: 0.18,
    roughness: 0.32,
    clearcoat: 0.85,
    clearcoatRoughness: 0.22
  })
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: glassColor,
    metalness: 0.35,
    roughness: 0.12
  })
  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x07090c,
    metalness: 0.65,
    roughness: 0.08,
    clearcoat: 1,
    clearcoatRoughness: 0.05
  })
  const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xc8ccd2,
    metalness: 0.95,
    roughness: 0.18
  })

  const body = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 6, cornerRadius), frameMaterial)
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  const back = new THREE.Mesh(new RoundedBoxGeometry(width - 0.045, height - 0.045, 0.012, 4, cornerRadius * 0.9), backMaterial)
  back.position.z = -depth / 2 - 0.002
  back.castShadow = true
  group.add(back)

  const front = new THREE.Mesh(new RoundedBoxGeometry(width - 0.035, height - 0.035, 0.01, 4, cornerRadius * 0.9), darkMaterial)
  front.position.z = depth / 2 + 0.003
  group.add(front)

  const cameraPlate = new THREE.Mesh(new RoundedBoxGeometry(0.66, 0.66, 0.05, 5, 0.15), frameMaterial)
  cameraPlate.position.set(-width / 2 + 0.42, height / 2 - 0.46, -depth / 2 - 0.035)
  cameraPlate.castShadow = true
  group.add(cameraPlate)

  const lensPositions = [
    [-0.16, 0.16],
    [0.16, -0.16],
    [-0.16, -0.16]
  ]
  lensPositions.forEach(([x, y]) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.123, 0.028, 12, 32), ringMaterial)
    ring.position.set(cameraPlate.position.x + x, cameraPlate.position.y + y, cameraPlate.position.z - 0.035)
    group.add(ring)
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.026, 32), lensMaterial)
    lens.rotation.x = Math.PI / 2
    lens.position.set(ring.position.x, ring.position.y, ring.position.z - 0.004)
    group.add(lens)
    const glint = new THREE.Mesh(
      new THREE.CircleGeometry(0.036, 24),
      new THREE.MeshBasicMaterial({ color: 0x4a5462, transparent: true, opacity: 0.6 })
    )
    glint.position.set(ring.position.x - 0.035, ring.position.y + 0.035, lens.position.z - 0.016)
    group.add(glint)
  })

  const flash = new THREE.Mesh(new THREE.CircleGeometry(0.045, 20), new THREE.MeshBasicMaterial({ color: 0xffe9c4 }))
  flash.position.set(cameraPlate.position.x + 0.17, cameraPlate.position.y + 0.17, cameraPlate.position.z - 0.028)
  group.add(flash)

  const volume = new THREE.Mesh(new RoundedBoxGeometry(0.035, 0.42, 0.1, 3, 0.016), frameMaterial)
  volume.position.set(-width / 2 - 0.005, 0.52, 0)
  group.add(volume)
  const volumeLower = volume.clone()
  volumeLower.position.y = 0.02
  group.add(volumeLower)
  const power = new THREE.Mesh(new RoundedBoxGeometry(0.035, 0.64, 0.1, 3, 0.016), frameMaterial)
  power.position.set(width / 2 + 0.005, 0.45, 0)
  group.add(power)

  return group
}

export default function Smartphone3D({ id, textures, registry }) {
  const { scene } = useScene()
  const keys = config.device.devices[id] || ['feed']

  const world = useMemo(() => {
    const group = new THREE.Group()
    group.name = id
    const content = config.device.glbUrl ? new THREE.Group() : buildProceduralPhone(config.device)
    group.add(content)
    group.visible = true
    registry.current.devices[id] = {
      id,
      group,
      content,
      screens: {},
      screenMeshes: {},
      scanLine: null,
      scanMaterial: null
    }
    return { group, content }
  }, [id])

  useEffect(() => {
    scene.add(world.group)
    return () => {
      scene.remove(world.group)
      world.group.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) object.material.dispose()
      })
      delete registry.current.devices[id]
    }
  }, [world, id])

  useEffect(() => {
    if (!config.device.glbUrl) return undefined
    let cancelled = false
    const loader = new GLTFLoader()
    loader.load(config.device.glbUrl, (gltf) => {
      if (cancelled) return
      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      box.getSize(size)
      const scale = config.device.height / size.y
      model.scale.setScalar(scale)
      const center = new THREE.Vector3()
      box.getCenter(center)
      model.position.set(-center.x * scale, -center.y * scale, -center.z * scale)
      world.content.clear()
      world.content.add(model)
      model.traverse((child) => {
        if (!child.isMesh) return
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) child.material.envMapIntensity = 0.8
        if (child.name.toLowerCase().includes(config.device.glbScreenName)) child.visible = false
      })
    })
    return () => {
      cancelled = true
    }
  }, [world])

  return <DeviceScreen id={id} parent={world.content} keys={keys} textures={textures} registry={registry} />
}
