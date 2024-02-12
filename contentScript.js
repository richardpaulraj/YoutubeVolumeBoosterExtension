'use strict'
const observe = () => {
  if (location.href.includes('/watch?') === false) {
    return
  }
  const player = document.querySelector('.html5-video-player')
  if (!player) {
    return
  }
  if (observe.busy) {
    return
  }

  const svgns = 'http://www.w3.org/2000/svg'
  const settings = document.querySelector('.ytp-settings-button')
  const boost = document.querySelector('ytp-boost-button')

  if (settings && !boost) {
    observe.busy = true //observe.busy
    chrome.storage.local.get(
      {
        boost: 2, //If boost is not present it will use the default value 2
      },
      (res) => {
        const msg = `Boost volume ${res.boost}x (curretStatusTemp)

Shift + Click to adjust boosting level`
        const boost = Object.assign(settings.cloneNode(true), {
          //This line creates a deep clone of the settings element. It duplicates the settings element along with all of its descendants.
          textContent: '',
          style: '',
          title: msg.replace('curretStatusTemp', 'disabled'),
        })
        boost.classList.replace('ytp-settings-button', 'ytp-boost-button')
        /*This scalability is a key advantage of SVG elements
        When the SVG container is rendered on larger screens or viewports, the text element inside it will also scale accordingly, maintaining its relative size and position within the SVG canvas.
        Thats why we are using SVG just as a Wrapper
        */
        const svg = document.createAttributeNS(svgns, 'svg')
        svg.setAttribute('height', '100%')
        svg.setAttribute('version', '1.0')
        svg.setAttribute('viewbox', '0 0 42 42')

        // The 'text' element is used to display text within an SVG graphic.
        const text = document.createAttributeNS(svgns, 'text')
        text.setAttribute('x', '21')
        text.setAttribute('y', '21')

        //the dominant-baseline means how the text is vertically aligned Setting it to 'middle' aligns the text vertically centered.
        text.setAttribute('dominant-baseline', 'middle')
        //text-anchor means how the text is horizontally aligned Setting it to middle' centers the text horizontally
        text.setAttribute('text-anchor', 'middle')
        text.setAttribute('font-size', '14px')

        text.textContent = res.boost + 'x'

        svg.appendChild(text)
        boost.appendChild(svg)

        settings.parentNode.insertBefore(boost, settings)
        observe.busy = false //observe.busy
      }
    )
  }
}

addEventListener('yt-navigate-finish', observe)
addEventListener('play', observe, true)
