export const showcaseConfig = {
  brand: {
    name: 'ZIMAX',
    wordmark: 'zimax',
    product: 'Zimax',
    version: '2.0',
    tagline: 'The way we connect, reimagined.',
    website: 'zimax.app',
    introSubtitle: 'Connect. Create. Community.',
    badges: [
      { id: 'apple', top: 'Download on the', bottom: 'App Store', glyph: 'apple' },
      { id: 'google', top: 'GET IT ON', bottom: 'Google Play', glyph: 'play' }
    ]
  },

  timing: {
    duration: 37.4
  },

  render: {
    width: 1280,
    height: 720,
    dprCap: 2,
    antialias: true,
    shadowMapSize: 2048,
    background: '#f5f5f7',
    floor: '#f5f5f7'
  },

  camera: {
    fov: 30,
    near: 0.1,
    far: 100,
    home: { px: 0, py: 0, pz: 13.6, tx: 0, ty: 0, tz: 0, fov: 30 }
  },

  device: {
    glbUrl: null,
    glbScreenName: 'screen',
    width: 1.55,
    height: 3.2,
    depth: 0.17,
    cornerRadius: 0.2,
    frameColor: '#b8bcc4',
    backColor: '#e9eaee',
    glassColor: '#101216',
    screenWidth: 1.4,
    screenHeight: 2.92,
    screenOffsetZ: 0.104,
    devices: {
      phoneA: ['splash', 'home', 'space', 'hero', 'chat'],
      phoneB: ['template4', 'template2'],
      phoneC: ['template3', 'template1'],
      phoneD: ['template3'],
      phoneE: ['template4']
    }
  },

  screens: {
    splash: { url: '/screens/launch_page.jpg' },
    home: { url: '/screens/hero_page.jpg' },
    feed: { url: '/screens/feed.png' },
    post: { url: '/screens/post.jpg' },
    chat: { url: '/screens/chat.png' },
    space: { url: '/screens/template2.png' },
    welcome: { url: '/screens/welcome.png', crop: [18, 16, 364, 792] },
    welcomeKeyboard: { url: '/screens/welcome.png', crop: [18, 16, 364, 792], generate: 'keyboard' },
    template1: { url: '/screens/template1.png' },
    template2: { url: '/screens/template2.png' },
    template3: { url: '/screens/template3.png' },
    template4: { url: '/screens/template4.png' },
    hero: { url: '/screens/hero_page.jpg' }
  },

  scenes: [
    {
      id: 'intro',
      start: 0,
      end: 5,
      kicker: 'ZIMAX 2.0',
      title: 'A better way\nto belong.',
      body: 'One beautifully considered space for everything that matters.',
      align: 'center'
    },
    {
      id: 'connect',
      start: 5,
      end: 9,
      kicker: '01  /  CONNECT',
      title: 'Your world,\nall in one place.',
      body: 'The people, conversations and communities you care about — thoughtfully brought together.',
      align: 'left'
    },
    {
      id: 'create',
      start: 9,
      end: 14,
      kicker: '02  /  CREATE',
      title: 'Share what\nmoves you.',
      body: 'Write, post and publish in a few effortless gestures. Every detail, designed for expression.',
      align: 'left'
    },
    {
      id: 'organize',
      start: 14,
      end: 20,
      kicker: '03  /  ORGANIZE',
      title: 'Every space,\nperfectly kept.',
      body: 'Keep track of the groups, spaces and conversations that shape your day.',
      align: 'right'
    },
    {
      id: 'design',
      start: 20,
      end: 24,
      kicker: '04  /  CRAFT',
      title: 'Beauty in\nevery detail.',
      body: 'A refined silhouette. A brilliant display. Hardware made to disappear into the moment.',
      align: 'left'
    },
    {
      id: 'effortless',
      start: 24,
      end: 27,
      kicker: '05  /  EFFORTLESS',
      title: 'Simple from\nthe very start.',
      body: 'A calm, familiar experience that gets out of the way and lets you get right to it.',
      align: 'left'
    },
    {
      id: 'together',
      start: 32,
      end: 35,
      kicker: '07  /  TOGETHER',
      title: 'One experience.\nEvery screen.',
      body: 'A single, seamless world — wherever you are.',
      align: 'center'
    }
  ],

  closing: {
    start: 35,
    end: 37.4,
    eyebrow: 'INTRODUCING ZIMAX 2.0',
    tagline: 'The way we connect,\nreimagined.',
    website: 'zimax.app'
  },

  motion: {
    easeOut: 'power3.out',
    easeInOut: 'power2.inOut',
    easeSoft: 'sine.inOut'
  }
}

export default showcaseConfig
