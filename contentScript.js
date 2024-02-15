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
  const advancedPlayback = document.querySelector(
    '.ytp-advanced-playback-button'
  )
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
          textContent: '',
          style: '',
          title: msg.replace('currentStatusTemp', 'disabled'),
        })
        boost.classList.replace('ytp-settings-button', 'ytp-boost-button')

        const svg = document.createElementNS(svgns, 'svg')
        svg.setAttribute('height', '100%')
        svg.setAttribute('width', '100%')
        svg.setAttribute('viewBox', '0 0 42 42')

        // const text = document.createElementNS(svgns, 'text')
        // text.setAttribute('x', '50%')
        // text.setAttribute('y', '50%')
        // text.setAttribute('dominant-baseline', 'middle')
        // text.setAttribute('text-anchor', 'middle')
        // text.setAttribute('font-size', '14px')
        // text.textContent = res.boost + 'x'

        // svg.appendChild(text)

        // Create image element
        const image = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'image'
        )
        image.setAttribute(
          'href',
          'https://img.icons8.com/pastel-glyph/64/loudspeaker--v2.png'
        )
        image.classList.add('volumeBooster')
        image.setAttribute('width', '24')
        image.setAttribute('height', '24')
        image.setAttribute('x', '9')
        image.setAttribute('y', '9')
        image.classList.add('colorizedImg')

        // Append image to SVG
        svg.appendChild(image)

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
                  'Insert the new boosting level (2, 3, 4, 5 or 6)',
                  res.boost
                )?.trim()

                if (
                  val === '2' ||
                  val === '3' ||
                  val === '4' ||
                  val === '5' ||
                  val === '6'
                ) {
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
                boost.title = msg.replace('currentStatusTemp', 'disabled')
              }
            )
          } else {
            chrome.runtime.sendMessage(
              {
                method: 'apply_boost',
              },
              (r) => {
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
  if (settings && !advancedPlayback) {
    const msg = `Advanced Playback Speed Changer`

    const advancedPlayback = Object.assign(settings.cloneNode(true), {
      textContent: '',
      // style: '',
      title: msg.replace('currentStatusTemp', 'disabled'),
    })
    advancedPlayback.classList.replace(
      'ytp-settings-button',
      'ytp-advanced-playback-button'
    )

    const svg = document.createElementNS(svgns, 'svg')
    svg.setAttribute('height', '100%')
    svg.setAttribute('width', '100%')
    svg.setAttribute('viewBox', '0 0 42 42')

    // Create image element
    const image = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'image'
    )
    image.setAttribute(
      'href',
      'https://img.icons8.com/ios/50/000000/speed--v1.png'
    )
    image.classList.add('advancedPlaybackIcon')
    image.setAttribute('width', '24')
    image.setAttribute('height', '24')
    image.setAttribute('x', '9')
    image.setAttribute('y', '9')

    // Append image to SVG
    svg.appendChild(image)

    advancedPlayback.appendChild(svg)

    settings.parentNode.insertBefore(advancedPlayback, settings)

    // Modal code
    const modalHTML = `
    <div id="modal"">
      <div class="modal-content">
      <input type="range" min="0.1" max="10" step="0.1" id="advancedPlaybackSlider" value = "1.0">
      <p id="sliderValue">1x</p>
      <button id="applyButton">Apply</button>
      <p id="close">x</p>
      </div>
    </div>`

    player.appendChild(
      document.createRange().createContextualFragment(modalHTML)
    )

    const modal = document.getElementById('modal')
    const slider = document.getElementById('advancedPlaybackSlider')
    const modalText = document.getElementById('sliderValue')
    const closeBtn = document.getElementById('close')
    const applyBtn = document.getElementById('applyButton')

    advancedPlayback.addEventListener('click', (e) => {
      if (modal.style.display === 'block') {
        modal.style.display = 'none'
      } else {
        modal.style.display = 'block'
      }
    })

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none'
    })

    slider.addEventListener('input', () => {
      const val = slider.value
      modalText.textContent = val + 'x'
    })

    applyBtn.addEventListener('click', () => {
      const val = slider.value
      console.log('Selected value:', val)
      const video = document.querySelector('video') //I directly used the video element you can also do with 'const player'
      if (video) {
        video.playbackRate = slider.value
      }
      modal.style.display = 'none'
    })
  }
}

addEventListener('yt-navigate-finish', observe)
addEventListener('play', observe, true)
