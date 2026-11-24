import { useEffect } from 'react'
import { useScene } from './SceneContext.js'

export default function CameraController() {
  const { camera, rig, frameCallbacks } = useScene()

  useEffect(() => {
    const apply = () => {
      camera.position.set(rig.px, rig.py, rig.pz)
      camera.lookAt(rig.tx, rig.ty, rig.tz)
      if (camera.fov !== rig.fov) {
        camera.fov = rig.fov ?? 30
        camera.updateProjectionMatrix()
      }
    }
    apply()
    frameCallbacks.add(apply)
    return () => frameCallbacks.delete(apply)
  }, [camera, rig, frameCallbacks])

  return null
}
