import gsap from 'gsap'
import config from '../config/showcase.config.js'

const E = config.motion

export function buildMasterTimeline({ registry, onUpdate, onComplete }) {
  const { devices, overlay, environment, rig } = registry.current
  const duration = config.timing.duration
  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: E.easeOut },
    onUpdate,
    onComplete
  })

  const keeper = { progress: 0 }
  timeline.to(keeper, { progress: 1, duration, ease: 'none' }, 0)

  const device = (id) => devices[id]
  const element = (id) => overlay[id]
  const vec = (v) => ({ x: v[0], y: v[1], z: v[2] })

  const initialPoses = {
    phoneA: { p: [0, -6.4, 0], r: [0.1, -0.5, -1.4], s: 0.92 },
    phoneB: { p: [-9, -4.5, -2], r: [0.1, 0.3, 0.25], s: 0.9 },
    phoneC: { p: [9, -5, -2], r: [0, -0.4, -0.3], s: 0.86 },
    phoneD: { p: [-10, -5, 1], r: [0, 0.2, 0.2], s: 0.8 },
    phoneE: { p: [10, -5, 1], r: [0, -0.2, -0.2], s: 0.8 }
  }

  Object.entries(initialPoses).forEach(([id, pose]) => {
    const group = device(id)?.group
    if (!group) return
    timeline.set(group.position, vec(pose.p), 0)
    timeline.set(group.rotation, vec(pose.r), 0)
    timeline.set(group.scale, { x: pose.s, y: pose.s, z: pose.s }, 0)
  })

  let cameraState = { ...config.camera.home, pz: 15 }
  timeline.set(rig, cameraState, 0)

  function camera(at, values, length = 1.5, ease = E.easeInOut) {
    const from = { ...cameraState }
    const to = { ...from, ...values }
    timeline.fromTo(rig, from, { ...to, duration: length, ease, immediateRender: false }, at)
    cameraState = to
  }

  function pose(id, at, from, to, length = 1.3, ease = E.easeInOut) {
    const group = device(id)?.group
    if (!group) return
    const scaleFrom = from.s ?? 1
    const scaleTo = to.s ?? 1
    timeline.fromTo(group.position, vec(from.p), { ...vec(to.p), duration: length, ease, immediateRender: false }, at)
    timeline.fromTo(group.rotation, vec(from.r), { ...vec(to.r), duration: length, ease, immediateRender: false }, at)
    timeline.fromTo(
      group.scale,
      { x: scaleFrom, y: scaleFrom, z: scaleFrom },
      { x: scaleTo, y: scaleTo, z: scaleTo, duration: length, ease, immediateRender: false },
      at
    )
  }

  const screenState = {}
  Object.entries(devices).forEach(([id, entry]) => {
    screenState[id] = Object.fromEntries(Object.entries(entry.screens || {}).map(([key, material]) => [key, material.opacity]))
  })

  function screen(id, key, at, length = 0.6) {
    const entry = device(id)
    if (!entry?.screens?.[key]) return
    const state = screenState[id]
    Object.keys(entry.screens).forEach((name) => {
      const material = entry.screens[name]
      const from = state[name] ?? 0
      const to = name === key ? 1 : 0
      timeline.fromTo(material, { opacity: from }, { opacity: to, duration: length, ease: 'sine.inOut', immediateRender: false }, at)
      state[name] = to
      const video = material?.userData?.video
      if (video) {
        if (to === 1) {
          video.currentTime = 0
          const playback = video.play()
          if (playback && playback.catch) playback.catch(() => {})
        } else {
          video.pause()
        }
      }
    })
  }

  function showCopy(id, at, stagger = 0.09) {
    const node = element(id)
    if (!node) return
    const parts = node.querySelectorAll('.anim')
    timeline.fromTo(node, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, at)
    timeline.fromTo(
      parts,
      { y: 38, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, stagger, ease: E.easeOut, immediateRender: false },
      at + 0.03
    )
  }

  function hideCopy(id, at) {
    const node = element(id)
    if (!node) return
    const parts = node.querySelectorAll('.anim')
    timeline.fromTo(
      parts,
      { y: 0, opacity: 1 },
      { y: -22, opacity: 0, duration: 0.45, stagger: 0.035, ease: 'power2.in', immediateRender: false },
      at
    )
    timeline.fromTo(node, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01, immediateRender: false }, at + 0.52)
  }

  const accent = environment.accent
  const accentInner = environment.accentInner
  const accentState = { x: 0.4, opacity: 0, inner: 0 }

  function accentTo(at, values, length = 1.2) {
    if (!accent) return
    const from = { ...accentState }
    const to = { ...from, ...values }
    if (accent) {
      timeline.fromTo(accent.position, { x: from.x }, { x: to.x, duration: length, ease: E.easeInOut, immediateRender: false }, at)
      timeline.fromTo(accent.material, { opacity: from.opacity }, { opacity: to.opacity, duration: length, ease: E.easeInOut, immediateRender: false }, at)
    }
    if (accentInner) {
      timeline.fromTo(accentInner.position, { x: from.x }, { x: to.x, duration: length, ease: E.easeInOut, immediateRender: false }, at)
      timeline.fromTo(accentInner.material, { opacity: from.inner }, { opacity: to.inner, duration: length, ease: E.easeInOut, immediateRender: false }, at)
    }
    Object.assign(accentState, to)
  }

  const A = initialPoses.phoneA
  const B = initialPoses.phoneB
  const C = initialPoses.phoneC
  const D = initialPoses.phoneD
  const EPhone = initialPoses.phoneE

  const introPose = { p: [0, -0.85, 0.6], r: [0.05, -0.28, -0.16], s: 1 }
  const connectPose = { p: [2.75, -0.05, 0.5], r: [0.04, -0.3, -0.36], s: 1 }
  const createPose = { p: [2.6, 0, 0.4], r: [0.08, -0.1, -0.27], s: 1.03 }
  const createPoseLate = { p: [2.55, 0.02, 0.4], r: [0.06, 0.02, -0.24], s: 1.03 }
  const exitAPose = { p: [-15, -2.5, -5], r: [0.1, 1.42, -0.5], s: 0.9 }
  const organizePose = { p: [-2.5, 0.05, 0.8], r: [0.03, 0.24, 0.3], s: 0.96 }
  const craftBackPose = { p: [1.35, 0.25, -1.2], r: [0.04, -0.18, 0.14], s: 1.28 }
  const craftFrontPose = { p: [2.5, -0.1, 1.4], r: [0.05, 0.18, -0.22], s: 1 }
  const exitBPose = { p: [15, -2.5, -6], r: [0, 0.3, 0.4], s: 1 }
  const formPose = { p: [1.7, -0.05, 1], r: [0.02, 0.08, -0.2], s: 0.98 }
  const lineup = {
    phoneA: { p: [-4.2, -0.35, 0], r: [0, 0.12, 0.16], s: 0.72 },
    phoneB: { p: [-2.1, -0.28, 0.35], r: [0, -0.06, 0.06], s: 0.78 },
    phoneC: { p: [0, -0.18, 0.6], r: [0, 0.02, -0.02], s: 0.84 },
    phoneD: { p: [2.1, -0.28, 0.35], r: [0, 0.06, -0.06], s: 0.78 },
    phoneE: { p: [4.2, -0.35, 0], r: [0, -0.12, -0.16], s: 0.72 }
  }
  const finalLineup = {
    phoneA: { p: [-3.9, 0.95, -0.4], r: [0, 0.1, 0.13], s: 0.6 },
    phoneB: { p: [-1.95, 1, -0.1], r: [0, -0.05, 0.05], s: 0.66 },
    phoneC: { p: [0, 1.1, 0.2], r: [0, 0.02, -0.02], s: 0.72 },
    phoneD: { p: [1.95, 1, -0.1], r: [0, 0.05, -0.05], s: 0.66 },
    phoneE: { p: [3.9, 0.95, -0.4], r: [0, -0.1, -0.13], s: 0.6 }
  }

  const shadowCatcher = environment.shadowCatcher
  const contactShadow = environment.contact
  if (shadowCatcher) {
    timeline.set(shadowCatcher.material, { opacity: 0 }, 0)
    timeline.fromTo(shadowCatcher.material, { opacity: 0 }, { opacity: 0.045, duration: 1.1, immediateRender: false }, 1.55)
  }
  if (contactShadow) {
    timeline.set(contactShadow.material, { opacity: 0 }, 0)
    timeline.fromTo(contactShadow.material, { opacity: 0 }, { opacity: 0.5, duration: 1.1, immediateRender: false }, 1.55)
  }

  timeline.fromTo(element('sceneLabel'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, immediateRender: false }, 0.2)
  timeline.fromTo(element('brand'), { autoAlpha: 0, y: -12 }, { autoAlpha: 0.9, y: 0, duration: 1, immediateRender: false }, 1.1)

  camera(0.25, { pz: 13.6 }, 3.1, 'power2.out')
  pose('phoneA', 0.25, A, introPose, 2.4, 'power3.out')
  accentTo(1.15, { x: 0.4, opacity: 0.52, inner: 0.24 }, 1.3)
  showCopy('intro', 0.7, 0.1)
  hideCopy('intro', 3.85)

  screen('phoneA', 'home', 4.72, 0.7)
  pose('phoneA', 4.9, introPose, connectPose, 1.7)
  camera(4.85, { px: 0.2, tx: 0.35 }, 1.6)
  accentTo(4.9, { opacity: 0.14, inner: 0.06 }, 1.1)
  showCopy('connect', 5.15)
  hideCopy('connect', 8.45)

  camera(8.65, { px: 1.55, py: 0.1, pz: 9.2, tx: 2.35, ty: 0.05, fov: 28 }, 1.9)
  screen('phoneA', 'space', 8.6, 0.6)
  pose('phoneA', 8.9, connectPose, createPose, 2.1, 'power2.inOut')
  pose('phoneA', 11.5, createPose, createPoseLate, 2.2, E.easeSoft)
  showCopy('create', 9.2)
  hideCopy('create', 13.35)
  accentTo(9.2, { opacity: 0, inner: 0 }, 1.1)

  pose('phoneA', 13.8, createPoseLate, exitAPose, 1.55, 'power2.inOut')
  pose('phoneB', 14.25, B, organizePose, 1.85, 'power3.out')
  camera(13.95, { px: -0.35, pz: 13.2, tx: -1.15, fov: 30 }, 1.8)
  accentTo(14.7, { x: -2.2, opacity: 0.42, inner: 0.18 }, 1.3)
  showCopy('organize', 14.65)
  hideCopy('organize', 19.15)

  pose('phoneB', 19.55, organizePose, craftBackPose, 1.6)
  pose('phoneC', 19.85, C, craftFrontPose, 1.7, 'power3.out')
  camera(19.75, { px: 0.2, py: 0.16, pz: 9.7, tx: 1.1, ty: 0.08 }, 2.1)
  camera(21.7, { px: 0.85, py: 0.04, pz: 8.7, tx: 1.45, ty: 0.08 }, 2.1, E.easeSoft)
  accentTo(19.9, { x: 1.5, opacity: 0.36, inner: 0.14 }, 1.4)
  showCopy('design', 20.25)
  hideCopy('design', 23.35)

  screen('phoneC', 'welcomeKeyboard', 23.65, 0.65)
  pose('phoneC', 23.8, craftFrontPose, formPose, 1.45)
  pose('phoneB', 23.6, craftBackPose, exitBPose, 1.5, 'power2.in')
  camera(23.75, { px: 0.05, pz: 11.2, tx: 1.15 }, 1.5)
  accentTo(23.9, { opacity: 0, inner: 0 }, 1)
  showCopy('effortless', 24.15)
  hideCopy('effortless', 26.35)

  screen('phoneA', 'home', 31.45, 0.55)
  screen('phoneC', 'welcomeKeyboard', 31.45, 0.55)
  camera(31.35, { px: 0, py: 0.1, pz: 12.8, tx: 0, ty: 0.15, fov: 30 }, 1.75)
  pose('phoneA', 31.55, exitAPose, lineup.phoneA, 1.5, 'power3.out')
  pose('phoneB', 31.7, exitBPose, lineup.phoneB, 1.5, 'power3.out')
  pose('phoneC', 31.85, formPose, lineup.phoneC, 1.5, 'power3.out')
  pose('phoneD', 32, D, lineup.phoneD, 1.5, 'power3.out')
  pose('phoneE', 32.15, EPhone, lineup.phoneE, 1.5, 'power3.out')
  accentTo(31.6, { opacity: 0, inner: 0 }, 0.9)
  showCopy('together', 32.35)
  hideCopy('together', 34.45)

  Object.entries(finalLineup).forEach(([id, target]) => {
    const from = lineup[id]
    pose(id, 34.8, from, target, 1.35, 'power2.inOut')
  })
  camera(34.8, { px: 0, py: 0.05, pz: 14.1, tx: 0, ty: 0.28 }, 1.6)
  timeline.fromTo(element('brand'), { autoAlpha: 0.9 }, { autoAlpha: 0, duration: 0.6, immediateRender: false }, 34.9)
  timeline.fromTo(element('sceneLabel'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.6, immediateRender: false }, 34.9)
  showClosing(35.1)
  camera(36.25, { pz: 13.8, ty: 0.2 }, 1.05, E.easeSoft)

  function showClosing(at) {
    const node = element('closing')
    if (!node) return
    const parts = node.querySelectorAll('.anim')
    timeline.fromTo(node, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, at)
    timeline.fromTo(
      parts,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.11, ease: E.easeOut, immediateRender: false },
      at + 0.03
    )
  }

  timeline.pause(0)
  return timeline
}

export default buildMasterTimeline
