import { useEffect } from 'react'
import * as THREE from 'three'
import config from '../config/showcase.config.js'
import { createRoundedPlaneGeometry } from '../utils/screenTextures.js'

export default function DeviceScreen({ id, parent, keys, textures, registry }) {
  useEffect(() => {
    if (!parent || !textures) return undefined
    const deviceConfig = config.device
    const geometry = createRoundedPlaneGeometry(
      deviceConfig.screenWidth,
      deviceConfig.screenHeight,
      deviceConfig.cornerRadius * 0.85
    )
    const materials = {}
    const meshes = {}

    keys.forEach((key, index) => {
      const material = new THREE.MeshBasicMaterial({
        map: textures[key],
        transparent: true,
        opacity: index === 0 ? 1 : 0,
        depthWrite: false,
        toneMapped: false
      })
      if (textures[key] && textures[key].isVideoTexture) {
        material.userData.video = textures[key].video
      }
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = deviceConfig.screenOffsetZ + index * 0.0012
      mesh.renderOrder = 20 + index
      parent.add(mesh)
      materials[key] = material
      meshes[key] = mesh
    })

    const scanMaterial = new THREE.MeshBasicMaterial({
      color: 0x8fd8ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    })
    const scanGeometry = new THREE.PlaneGeometry(deviceConfig.screenWidth * 0.96, (26 / 1560) * deviceConfig.screenHeight)
    const scanLine = new THREE.Mesh(scanGeometry, scanMaterial)
    scanLine.position.set(0, -deviceConfig.screenHeight / 2, deviceConfig.screenOffsetZ + 0.01)
    scanLine.renderOrder = 40
    scanLine.visible = false
    parent.add(scanLine)

    const device = registry.current.devices[id]
    if (device) {
      device.screens = materials
      device.screenMeshes = meshes
      device.scanLine = scanLine
      device.scanMaterial = scanMaterial
    }

    return () => {
      parent.remove(scanLine)
      scanGeometry.dispose()
      scanMaterial.dispose()
      Object.values(meshes).forEach((mesh) => parent.remove(mesh))
      geometry.dispose()
      Object.values(materials).forEach((material) => material.dispose())
      if (device) {
        device.screens = {}
        device.screenMeshes = {}
        device.scanLine = null
        device.scanMaterial = null
      }
    }
  }, [id, parent, keys, textures, registry])

  return null
}
