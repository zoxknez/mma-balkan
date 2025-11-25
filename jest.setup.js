import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props = {}) => {
    const { alt = '', ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...rest} />;
  },
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    section: 'section',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    ul: 'ul',
    li: 'li',
    nav: 'nav',
    main: 'main',
    footer: 'footer',
    article: 'article',
    header: 'header',
    aside: 'aside',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
    select: 'select',
    option: 'option',
    label: 'label',
    fieldset: 'fieldset',
    legend: 'legend',
    table: 'table',
    thead: 'thead',
    tbody: 'tbody',
    tr: 'tr',
    td: 'td',
    th: 'th',
    tfoot: 'tfoot',
    caption: 'caption',
    colgroup: 'colgroup',
    col: 'col',
    figure: 'figure',
    figcaption: 'figcaption',
    blockquote: 'blockquote',
    cite: 'cite',
    q: 'q',
    abbr: 'abbr',
    address: 'address',
    code: 'code',
    pre: 'pre',
    kbd: 'kbd',
    samp: 'samp',
    var: 'var',
    dfn: 'dfn',
    em: 'em',
    strong: 'strong',
    small: 'small',
    mark: 'mark',
    del: 'del',
    ins: 'ins',
    sub: 'sub',
    sup: 'sup',
    time: 'time',
    data: 'data',
    meter: 'meter',
    progress: 'progress',
    details: 'details',
    summary: 'summary',
    dialog: 'dialog',
    menu: 'menu',
    menuitem: 'menuitem',
    command: 'command',
    output: 'output',
    canvas: 'canvas',
    svg: 'svg',
    path: 'path',
    rect: 'rect',
    circle: 'circle',
    ellipse: 'ellipse',
    line: 'line',
    polyline: 'polyline',
    polygon: 'polygon',
    text: 'text',
    tspan: 'tspan',
    textPath: 'textPath',
    g: 'g',
    defs: 'defs',
    clipPath: 'clipPath',
    mask: 'mask',
    pattern: 'pattern',
    linearGradient: 'linearGradient',
    radialGradient: 'radialGradient',
    stop: 'stop',
    image: 'image',
    use: 'use',
    symbol: 'symbol',
    marker: 'marker',
    view: 'view',
    foreignObject: 'foreignObject',
    switch: 'switch',
    animate: 'animate',
    animateMotion: 'animateMotion',
    animateTransform: 'animateTransform',
    set: 'set',
    mpath: 'mpath',
    feBlend: 'feBlend',
    feColorMatrix: 'feColorMatrix',
    feComponentTransfer: 'feComponentTransfer',
    feComposite: 'feComposite',
    feConvolveMatrix: 'feConvolveMatrix',
    feDiffuseLighting: 'feDiffuseLighting',
    feDisplacementMap: 'feDisplacementMap',
    feDistantLight: 'feDistantLight',
    feDropShadow: 'feDropShadow',
    feFlood: 'feFlood',
    feFuncA: 'feFuncA',
    feFuncB: 'feFuncB',
    feFuncG: 'feFuncG',
    feFuncR: 'feFuncR',
    feGaussianBlur: 'feGaussianBlur',
    feImage: 'feImage',
    feMerge: 'feMerge',
    feMergeNode: 'feMergeNode',
    feMorphology: 'feMorphology',
    feOffset: 'feOffset',
    fePointLight: 'fePointLight',
    feSpecularLighting: 'feSpecularLighting',
    feSpotLight: 'feSpotLight',
    feTile: 'feTile',
    feTurbulence: 'feTurbulence',
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useMotionValue: (value) => ({ get: () => value, set: jest.fn() }),
  useTransform: (value) => value,
  useSpring: (value) => value,
  useScroll: () => ({
    scrollX: { get: () => 0 },
    scrollY: { get: () => 0 },
    scrollXProgress: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  }),
  useViewportScroll: () => ({
    scrollX: { get: () => 0 },
    scrollY: { get: () => 0 },
    scrollXProgress: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  }),
  useDragControls: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
  useAnimationControls: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  usePresence: () => [true, jest.fn()],
  useReducedMotion: () => false,
  useElementSize: () => ({ width: 0, height: 0 }),
  useMotionValueEvent: jest.fn(),
  useInView: () => ({ ref: jest.fn(), inView: true }),
  useIsPresent: () => true,
  useLayoutEffect: jest.fn(),
  useCycle: (values) => [values[0], jest.fn()],
  useMotionTemplate: (template) => template,
  useMotionValue: (value) => ({ get: () => value, set: jest.fn() }),
  useTransform: (value) => value,
  useSpring: (value) => value,
  useScroll: () => ({
    scrollX: { get: () => 0 },
    scrollY: { get: () => 0 },
    scrollXProgress: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  }),
  useViewportScroll: () => ({
    scrollX: { get: () => 0 },
    scrollY: { get: () => 0 },
    scrollXProgress: { get: () => 0 },
    scrollYProgress: { get: () => 0 },
  }),
  useDragControls: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
  useAnimationControls: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  usePresence: () => [true, jest.fn()],
  useReducedMotion: () => false,
  useElementSize: () => ({ width: 0, height: 0 }),
  useMotionValueEvent: jest.fn(),
  useInView: () => ({ ref: jest.fn(), inView: true }),
  useIsPresent: () => true,
  useLayoutEffect: jest.fn(),
  useCycle: (values) => [values[0], jest.fn()],
  useMotionTemplate: (template) => template,
}));

// Mock SWR
jest.mock('swr', () => ({
  default: () => ({
    data: undefined,
    error: undefined,
    isLoading: true,
    mutate: jest.fn(),
  }),
}));

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3003';

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

// Mock console methods in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
