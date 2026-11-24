import config from '../config/showcase.config.js'
import FeatureSection from './FeatureSection.jsx'

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.4 12.9c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8s-1.8-.8-2.9-.8c-1.5 0-2.9.9-3.6 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.9.7 1.9-1.1 2.6-2.2c.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.1-.8-2.1-3.5zM14.5 5.7c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
    </svg>
  )
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 3.2v17.6c0 .8.9 1.3 1.6.9l13.2-8.8c.6-.4.6-1.4 0-1.8L5.6 2.3c-.7-.4-1.6.1-1.6.9z" />
      <path className="badge__glyph-inner" d="M4 3.5 13.6 12 4 20.5z" />
    </svg>
  )
}

export default function TypographyOverlay({ registry }) {
  const registerRef = (key, element) => {
    registry.current.overlay[key] = element
  }

  return (
    <div className="typography-layer" aria-hidden="true">
      <div className="brand-mark" ref={(element) => registerRef('brand', element)}>
        {config.brand.wordmark}
      </div>

      {config.scenes.map((scene) => (
        <FeatureSection key={scene.id} scene={scene} registerRef={registerRef} />
      ))}

      <div className="closing" ref={(element) => registerRef('closing', element)}>
        <div className="closing__eyebrow anim">{config.closing.eyebrow}</div>
        <div className="closing__logo anim">{config.brand.wordmark}</div>
        <div className="closing__tagline anim">
          {config.closing.tagline.split('\n').map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div className="closing__site anim">{config.closing.website}</div>
        <div className="closing__badges anim">
          {config.brand.badges.map((badge) => (
            <div className="badge" key={badge.id}>
              <span className="badge__glyph">
                {badge.glyph === 'apple' ? <AppleGlyph /> : <PlayGlyph />}
              </span>
              <span className="badge__text">
                <span>{badge.top}</span>
                <strong>{badge.bottom}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="scene-label" ref={(element) => registerRef('sceneLabel', element)}>
        <span className="scene-label__line" />
        <span className="scene-label__text">ZIMAX MOTION STUDY</span>
      </div>
    </div>
  )
}
