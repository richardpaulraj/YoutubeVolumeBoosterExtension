// 'use strict'
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
  const boost = document.querySelector('.ytp-boost-button')
  if (settings && !boost) {
    observe.busy = true //observe.busy
    chrome.storage.local.get(
      {
        boost: 2, //If boost is not present it will use the default value 2 and It will look for this arg ( args: [res.boost] ) which sends the boost value from the background
      },
      (res) => {
        const msg = `Boost volume (currentStatusTemp)

Shift + Click to adjust boosting level`

        const boost = Object.assign(settings.cloneNode(true), {
          //This line creates a deep clone of the settings element. It duplicates the settings element along with all of its descendants.
          textContent: '',
          style: '',
          title: msg.replace('currentStatusTemp', 'disabled'),
        })
        boost.classList.replace('ytp-settings-button', 'ytp-boost-button')
        /*This scalability is a key advantage of SVG elements
        When the SVG container is rendered on larger screens or viewports, the text element inside it will also scale accordingly, maintaining its relative size and position within the SVG canvas.
        Thats why we are using SVG just as a Wrapper
        */
        const svg = document.createElementNS(svgns, 'svg')
        svg.setAttribute('height', '100%')
        svg.setAttribute('width', '100%')
        svg.setAttribute('viewBox', '0 0 42 42')

        // The 'text' element is used to display text within an SVG graphic.
        const text = document.createElementNS(svgns, 'text')
        text.setAttribute('x', '50%')
        text.setAttribute('y', '50%')

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

        //Only if the wants to change the value
        boost.addEventListener('click', (e) => {
          if (e.shiftKey) {
            chrome.storage.local.get(
              {
                boost: 2,
              },
              (res) => {
                const val = prompt(
                  'Insert the new boosting level (2, 3, or 4)',
                  res.boost //The default value of the text input field is set to res.boost,
                )?.trim() //This is optional chaining (?.) followed by the trim() method if the user clicks on cancel the trim will not work and the val will be null

                if (val === '2' || val === '3' || val === '4') {
                  text.textContent = val + 'x'
                  chrome.storage.local.set({
                    boost: parseInt(val),
                  })
                  chrome.runtime.sendMessage({
                    method: 'adjust_boost',
                    boost: parseInt(val),
                  })
                }
              }
            )
            return
          }

          if (boost.classList.contains('boosting')) {
            chrome.runtime.sendMessage(
              {
                method: 'revoke_boost',
              },
              () => {
                boost.classList.remove('boosting')
                boost.title = msg.replace('currentStatusTemp', 'disabled') //refer the above code I have declared the title refer that
              }
            )
          } else {
            chrome.runtime.sendMessage(
              {
                method: 'apply_boost',
              },
              (r) => {
                // This callback function handles the response received from the background script.
                if (r === true || r === 'true') {
                  boost.classList.add('boosting')
                  boost.title = msg.replace('currentStatusTemp', 'enabled')
                } else {
                  alert('Cannot boost this video: ' + r)
                }
              }
            )
          }
        })
      }
    )
  }
}

addEventListener('yt-navigate-finish', observe)
addEventListener('play', observe, true)
