// ─── v-tooltip directive ──────────────────────────────────────────────────────
//
// Usage:
//   v-tooltip="'Some text'"              → tooltip above the element
//   v-tooltip="{ text: 'Hi', position: 'bottom' }"  → tooltip below
//
// Supported positions: 'top' (default), 'bottom', 'left', 'right'
// ─────────────────────────────────────────────────────────────────────────────

// Inject the tooltip CSS into <head> once, the first time the directive is used
function injectStyles() {
    if (document.getElementById('v-tooltip-styles')) return

    const style = document.createElement('style')
    style.id = 'v-tooltip-styles'
    style.textContent = `
        .v-tooltip-box {
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 6px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            color: #f1f5f9;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.2px;
            max-width: 200px;
            opacity: 0;
            padding: 6px 10px;
            pointer-events: none;
            position: absolute;
            text-align: center;
            transition: opacity 0.15s ease, transform 0.15s ease;
            white-space: nowrap;
            z-index: 9999;
        }

        .v-tooltip-box.visible {
            opacity: 1;
        }

        /* Arrow using a pseudo-element */
        .v-tooltip-box::after {
            border: 5px solid transparent;
            content: '';
            position: absolute;
        }

        .v-tooltip-box.pos-top::after {
            border-top-color: #334155;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
        }

        .v-tooltip-box.pos-bottom::after {
            border-bottom-color: #334155;
            left: 50%;
            top: -10px;
            transform: translateX(-50%);
        }

        .v-tooltip-box.pos-left::after {
            border-left-color: #334155;
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
        }

        .v-tooltip-box.pos-right::after {
            border-right-color: #334155;
            left: -10px;
            top: 50%;
            transform: translateY(-50%);
        }
    `
    document.head.appendChild(style)
}

// Parse v-tooltip binding value — accepts a plain string or { text, position }
function parseBinding(value) {
    if (typeof value === 'string') return { text: value, position: 'top' }
    return {
        text: value.text || '',
        position: value.position || 'top'
    }
}

// Calculate tooltip (x, y) position based on the target element and position preference
function getPosition(el, tooltipEl, position) {
    const rect = el.getBoundingClientRect()
    const gap = 10  // gap between element and tooltip in px
    const scrollX = window.scrollX
    const scrollY = window.scrollY
    const ttW = tooltipEl.offsetWidth
    const ttH = tooltipEl.offsetHeight

    switch (position) {
        case 'bottom':
            return {
                left: rect.left + scrollX + rect.width / 2 - ttW / 2,
                top: rect.bottom + scrollY + gap
            }
        case 'left':
            return {
                left: rect.left + scrollX - ttW - gap,
                top: rect.top + scrollY + rect.height / 2 - ttH / 2
            }
        case 'right':
            return {
                left: rect.right + scrollX + gap,
                top: rect.top + scrollY + rect.height / 2 - ttH / 2
            }
        case 'top':
        default:
            return {
                left: rect.left + scrollX + rect.width / 2 - ttW / 2,
                top: rect.top + scrollY - ttH - gap
            }
    }
}

const tooltip = {
    // inserted: called when el is added to the DOM — safe to read layout
    inserted(el, binding) {
        injectStyles()

        const { text, position } = parseBinding(binding.value)

        // Create the tooltip DOM element and append to <body>
        const tooltipEl = document.createElement('div')
        tooltipEl.className = `v-tooltip-box pos-${position}`
        tooltipEl.textContent = text
        document.body.appendChild(tooltipEl)

        // Store references on the element so we can access them in update/unbind
        el._tooltipEl = tooltipEl
        el._tooltipPosition = position

        // Show handler — reads position AFTER the tooltip is visible (so offsetWidth is correct)
        el._showTooltip = function () {
            if (!el._tooltipEl.textContent) return
            const { left, top } = getPosition(el, tooltipEl, el._tooltipPosition)
            tooltipEl.style.left = left + 'px'
            tooltipEl.style.top = top + 'px'
            tooltipEl.classList.add('visible')
        }

        el._hideTooltip = function () {
            tooltipEl.classList.remove('visible')
        }

        el.addEventListener('mouseenter', el._showTooltip)
        el.addEventListener('mouseleave', el._hideTooltip)
        el.addEventListener('focus', el._showTooltip)
        el.addEventListener('blur', el._hideTooltip)
    },

    // update: called when the component re-renders — update text/position if changed
    update(el, binding) {
        if (!el._tooltipEl) return
        const { text, position } = parseBinding(binding.value)
        el._tooltipEl.textContent = text
        el._tooltipEl.className = `v-tooltip-box pos-${position}`
        el._tooltipPosition = position
    },

    // unbind: called when element is removed — CRITICAL to clean up or you leak memory
    unbind(el) {
        el.removeEventListener('mouseenter', el._showTooltip)
        el.removeEventListener('mouseleave', el._hideTooltip)
        el.removeEventListener('focus', el._showTooltip)
        el.removeEventListener('blur', el._hideTooltip)

        if (el._tooltipEl && document.body.contains(el._tooltipEl)) {
            document.body.removeChild(el._tooltipEl)
        }

        // Nullify stored references — avoids memory leaks
        el._tooltipEl = null
        el._showTooltip = null
        el._hideTooltip = null
    }
}

export default tooltip
