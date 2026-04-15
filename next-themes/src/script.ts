export const script = (
  attribute,
  storageKey,
  defaultTheme,
  forcedTheme,
  themes,
  value,
  enableSystem,
  enableColorScheme,
  styleAttribute,
  styleStorageKey,
  defaultStyle,
  forcedStyle,
  styles,
  styleValue
) => {
  const el = document.documentElement
  const systemThemes = ['light', 'dark']

  function updateDOM(theme: string) {
    const attributes = Array.isArray(attribute) ? attribute : [attribute]

    attributes.forEach(attr => {
      const isClass = attr === 'class'
      const classes = isClass && value ? themes.map(t => value[t] || t) : themes
      if (isClass) {
        el.classList.remove(...classes)
        el.classList.add(value && value[theme] ? value[theme] : theme)
      } else {
        el.setAttribute(attr, theme)
      }
    })

    setColorScheme(theme)
  }

  function updateStyleDOM(style: string) {
    if (!styles?.length) return
    const attributes = Array.isArray(styleAttribute) ? styleAttribute : [styleAttribute]

    attributes.forEach(attr => {
      const isClass = attr === 'class'
      const classes = isClass && styleValue ? styles.map(s => styleValue[s] || s) : styles
      if (isClass) {
        el.classList.remove(...classes)
        if (style) el.classList.add(styleValue && styleValue[style] ? styleValue[style] : style)
      } else {
        if (style) {
          el.setAttribute(attr, styleValue && styleValue[style] ? styleValue[style] : style)
        } else {
          el.removeAttribute(attr)
        }
      }
    })
  }

  function setColorScheme(theme: string) {
    if (enableColorScheme && systemThemes.includes(theme)) {
      el.style.colorScheme = theme
    }
  }

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  if (forcedTheme) {
    updateDOM(forcedTheme)
  } else {
    try {
      const themeName = localStorage.getItem(storageKey) || defaultTheme
      const isSystem = enableSystem && themeName === 'system'
      const theme = isSystem ? getSystemTheme() : themeName
      updateDOM(theme)
    } catch (e) {
      //
    }
  }

  if (styles?.length) {
    if (forcedStyle) {
      updateStyleDOM(forcedStyle)
    } else {
      try {
        const styleName = localStorage.getItem(styleStorageKey) || defaultStyle
        if (styleName) updateStyleDOM(styleName)
      } catch (e) {
        //
      }
    }
  }
}
