import React from 'react'

export default function FeatureSection({ scene, registerRef }) {
  return (
    <section
      className={`copy copy--${scene.align}`}
      data-scene={scene.id}
      ref={(element) => registerRef(scene.id, element)}
    >
      <div className="copy__kicker anim">
        <span className="copy__rule" />
        <span>{scene.kicker}</span>
      </div>
      <h2 className="copy__title anim">
        {scene.title.split('\n').map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
      <p className="copy__body anim">{scene.body}</p>
      <div className="copy__index anim">
        <span>{String(scenesIndex(scene.id) + 1).padStart(2, '0')}</span>
        <span className="copy__index-line" />
        <span>09</span>
      </div>
    </section>
  )
}

function scenesIndex(id) {
  const order = ['intro', 'connect', 'create', 'organize', 'design', 'effortless', 'together']
  return order.indexOf(id)
}
