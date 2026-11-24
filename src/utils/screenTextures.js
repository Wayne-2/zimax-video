import * as THREE from 'three'

export const SCREEN_W = 720
export const SCREEN_H = 1560
const RADIUS = 54

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h)
  ctx.lineTo(x + rr, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr)
  ctx.lineTo(x, y + rr)
  ctx.quadraticCurveTo(x, y, x + rr, y)
  ctx.closePath()
}

function cover(ctx, img, dx, dy, dw, dh, crop) {
  const sw = crop ? crop[2] : img.naturalWidth || img.width
  const sh = crop ? crop[3] : img.naturalHeight || img.height
  const sx = crop ? crop[0] : 0
  const sy = crop ? crop[1] : 0
  const scale = Math.max(dw / sw, dh / sh)
  const w = sw * scale
  const h = sh * scale
  ctx.drawImage(img, sx, sy, sw, sh, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h)
}

function text(ctx, value, x, y, size, weight, color, align = 'left') {
  ctx.font = `${weight} ${size}px -apple-system, "Helvetica Neue", Arial, sans-serif`
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(value, x, y)
}

function drawStatusBar(ctx, dark = false) {
  const c = dark ? '#ffffff' : '#111318'
  text(ctx, '9:41', 46, 62, 30, 600, c, 'left')
  ctx.fillStyle = dark ? '#ffffff' : '#111318'
  roundRect(ctx, 270, 28, 180, 50, 26)
  ctx.fill()
  ctx.fillStyle = '#e08a2a'
  ctx.beginPath()
  ctx.arc(360, 53, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = c
  for (let i = 0; i < 4; i++) ctx.fillRect(490 + i * 13, 46 - i * 5, 8, 12 + i * 5)
  ctx.beginPath()
  ctx.arc(556, 42, 17, Math.PI * 1.15, Math.PI * 1.85)
  ctx.lineWidth = 5
  ctx.strokeStyle = c
  ctx.stroke()
  roundRect(ctx, 598, 30, 70, 36, 10)
  ctx.stroke()
  ctx.fill()
  ctx.fillStyle = dark ? '#0b0d12' : '#ffffff'
  roundRect(ctx, 601, 33, 44, 30, 7)
  ctx.fill()
}

function drawSplash(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 720, 1560)
  grad.addColorStop(0, '#0a0c11')
  grad.addColorStop(0.55, '#141925')
  grad.addColorStop(1, '#090b10')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)

  ctx.save()
  ctx.translate(360, 690)
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(0, 0, 150 + i * 78, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(255,255,255,${0.14 - i * 0.023})`
    ctx.lineWidth = 2
    ctx.stroke()
  }
  const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 260)
  glow.addColorStop(0, 'rgba(232,140,45,0.32)')
  glow.addColorStop(1, 'rgba(232,140,45,0)')
  ctx.fillStyle = glow
  ctx.fillRect(-280, -280, 560, 560)
  ctx.fillStyle = '#f0a04b'
  ctx.beginPath()
  ctx.arc(0, 0, 12, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = '#05060a'
  roundRect(ctx, 270, 28, 180, 50, 26)
  ctx.fill()
  ctx.fillStyle = '#e08a2a'
  ctx.beginPath()
  ctx.arc(360, 53, 7, 0, Math.PI * 2)
  ctx.fill()

  text(ctx, 'zimax', 360, 900, 104, 700, '#ffffff', 'center')
  text(ctx, '2.0', 360, 968, 30, 500, 'rgba(255,255,255,0.5)', 'center')
  text(ctx, 'CONNECT  ·  CREATE  ·  COMMUNITY', 360, 1370, 22, 500, 'rgba(255,255,255,0.42)', 'center')

  ctx.fillStyle = '#f0a04b'
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.arc(332 + i * 28, 1430, i === 1 ? 7 : 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawKeyboard(ctx) {
  const top = 1140
  ctx.fillStyle = '#d3d6dd'
  ctx.fillRect(0, top, SCREEN_W, SCREEN_H - top)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, top, SCREEN_W, 3)

  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete'],
    ['123', 'emoji', 'space', 'return']
  ]
  const keyTop = top + 34
  const keyH = 80
  const gap = 10
  const pad = 12

  rows.forEach((row, ri) => {
    const y = keyTop + ri * (keyH + gap)
    if (ri === 3) {
      const widths = [92, 92, 320, 158]
      let x = pad
      row.forEach((key, i) => {
        const w = widths[i]
        ctx.fillStyle = key === 'return' ? '#1b1d22' : '#ffffff'
        roundRect(ctx, x, y, w, keyH, 16)
        ctx.fill()
        ctx.shadowColor = 'rgba(0,0,0,0.12)'
        ctx.shadowBlur = 0
        const label = key === 'space' ? 'space' : key === 'return' ? 'return' : key === 'emoji' ? '☺' : key
        text(ctx, label, x + w / 2, y + 51, key === 'space' ? 26 : 25, 500, key === 'return' ? '#ffffff' : '#1b1d22', 'center')
        x += w + gap
      })
      return
    }
    const available = SCREEN_W - pad * 2
    const w = (available - gap * (row.length - 1)) / row.length
    row.forEach((key, i) => {
      const x = pad + i * (w + gap)
      const wide = key === 'shift' || key === 'delete'
      ctx.fillStyle = wide ? '#adb2bc' : '#ffffff'
      roundRect(ctx, x, y, w, keyH, 16)
      ctx.fill()
      const label = key === 'shift' ? '⇧' : key === 'delete' ? '⌫' : key
      text(ctx, label, x + w / 2, y + 52, 30, 500, '#1b1d22', 'center')
    })
  })

  ctx.fillStyle = '#ffffff'
  roundRect(ctx, 296, top + 34 + 4 * (keyH + gap) - 6, 128, 8, 4)
  ctx.fill()
}

function drawVerify(ctx) {
  ctx.fillStyle = '#fbfbfd'
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
  drawStatusBar(ctx)

  text(ctx, 'zimax', 52, 172, 46, 700, '#111318')
  ctx.fillStyle = '#111318'
  roundRect(ctx, 600, 132, 68, 52, 14)
  ctx.fill()
  text(ctx, '✓', 634, 170, 34, 700, '#ffffff', 'center')

  text(ctx, 'Verify your', 52, 282, 56, 700, '#111318')
  text(ctx, 'identity', 52, 344, 56, 700, '#111318')
  text(ctx, 'A quick scan keeps your community safe.', 52, 400, 26, 400, '#7c8190')

  const cx = 360
  const cy = 790
  const r = 226
  ctx.fillStyle = '#eceef3'
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#d9dce4'
  ctx.lineWidth = 3
  ctx.setLineDash([10, 14])
  ctx.beginPath()
  ctx.arc(cx, cy, r - 22, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = '#c8cdd7'
  ctx.beginPath()
  ctx.ellipse(cx, cy - 56, 78, 96, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx, cy + 150, 142, 96, 0, Math.PI, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#111318'
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  const b = r + 18
  const len = 62
  ;[
    [cx - b, cy - b, 1, 1],
    [cx + b, cy - b, -1, 1],
    [cx - b, cy + b, 1, -1],
    [cx + b, cy + b, -1, -1]
  ].forEach(([x, y, sx, sy]) => {
    ctx.beginPath()
    ctx.moveTo(x, y + sy * len)
    ctx.lineTo(x, y)
    ctx.lineTo(x + sx * len, y)
    ctx.stroke()
  })

  ctx.fillStyle = '#e6e8ee'
  roundRect(ctx, 60, 1110, 600, 12, 6)
  ctx.fill()
  ctx.fillStyle = '#111318'
  roundRect(ctx, 60, 1110, 390, 12, 6)
  ctx.fill()

  text(ctx, 'Scanning face…', 360, 1205, 36, 700, '#111318', 'center')
  text(ctx, 'Hold still and look at the screen', 360, 1250, 26, 400, '#7c8190', 'center')

  ctx.fillStyle = '#111318'
  roundRect(ctx, 60, 1320, 600, 106, 30)
  ctx.fill()
  text(ctx, 'Continue', 360, 1388, 36, 600, '#ffffff', 'center')
}

function makeCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = SCREEN_W
  canvas.height = SCREEN_H
  return canvas
}

function finish(canvas) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load screen: ${url}`))
    img.src = url
  })
}

function prepare(ctx, painter) {
  ctx.clearRect(0, 0, SCREEN_W, SCREEN_H)
  ctx.save()
  roundRect(ctx, 0, 0, SCREEN_W, SCREEN_H, RADIUS)
  ctx.clip()
  painter()
  ctx.restore()
}

export async function createScreenTextures(screens) {
  const entries = await Promise.all(
    Object.entries(screens).map(async ([key, def]) => {
      if (def.video) {
        const video = document.createElement('video')
        video.src = def.url
        video.loop = true
        video.muted = true
        video.playsInline = true
        video.crossOrigin = 'anonymous'
        video.preload = 'auto'
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => resolve()
          video.onerror = () => reject(new Error(`Failed to load video screen: ${def.url}`))
          video.load()
        })
        const texture = new THREE.VideoTexture(video)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 8
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.needsUpdate = true
        return [key, texture]
      }

      const canvas = makeCanvas()
      const ctx = canvas.getContext('2d')
      let img = null
      if (def.url) {
        try {
          img = await loadImage(def.url)
        } catch (error) {
          console.warn(error)
        }
      }

      if (def.generate === 'splash' || !img) {
        prepare(ctx, () => drawSplash(ctx))
      } else if (def.generate === 'keyboard') {
        prepare(ctx, () => {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
          cover(ctx, img, 0, -90, SCREEN_W, 1290, def.crop)
          drawKeyboard(ctx)
        })
      } else {
        prepare(ctx, () => {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, SCREEN_W, SCREEN_H)
          cover(ctx, img, 0, 0, SCREEN_W, SCREEN_H, def.crop)
        })
      }
      return [key, finish(canvas)]
    })
  )
  return Object.fromEntries(entries)
}

export function createRoundedPlaneGeometry(width, height, radius) {
  const shape = new THREE.Shape()
  const r = radius
  shape.moveTo(-width / 2 + r, -height / 2)
  shape.lineTo(width / 2 - r, -height / 2)
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + r)
  shape.lineTo(width / 2, height / 2 - r)
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - r, height / 2)
  shape.lineTo(-width / 2 + r, height / 2)
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - r)
  shape.lineTo(-width / 2, -height / 2 + r)
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + r, -height / 2)
  const geometry = new THREE.ShapeGeometry(shape, 12)
  const uv = geometry.attributes.uv
  const pos = geometry.attributes.position
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (pos.getX(i) + width / 2) / width, (pos.getY(i) + height / 2) / height)
  }
  uv.needsUpdate = true
  return geometry
}
