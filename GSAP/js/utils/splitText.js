export const splitTextLines = (element, options = {}) => {
  if (element === null || element === undefined) {
    return []
  }

  const {
    lineClass = "split-line",
    lineInnerClass = "split-line__inner",
    useMask = true,
  } = options

  const existingHtml = element.dataset.splitTextOriginal
  const originalHtml = existingHtml ?? element.innerHTML
  if (existingHtml) {
    element.innerHTML = existingHtml
  } else {
    element.dataset.splitTextOriginal = originalHtml
  }

  const lines = []
  const parts = originalHtml.split(/<br\s*\/?>/i)
  element.dataset.splitText = "lines"
  element.innerHTML = ""

  parts.forEach((part) => {
    const line = document.createElement("span")
    line.className = lineClass
    line.style.display = "block"
    line.style.overflow = "hidden"

    if (useMask) {
      const inner = document.createElement("span")
      inner.className = lineInnerClass
      inner.style.display = "block"
      inner.style.whiteSpace = "nowrap"
      inner.innerHTML = part.trim() || "&nbsp;"
      line.appendChild(inner)
      element.appendChild(line)
      lines.push(inner)
      return
    }

    line.style.whiteSpace = "nowrap"
    line.innerHTML = part.trim() || "&nbsp;"
    element.appendChild(line)
    lines.push(line)
  })

  return lines
}
