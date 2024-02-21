// 'use strict'
const observe = () => {
  if (location.href.includes('/watch?') === false) {
    return
  }
  const player = document.querySelector('.html5-video-player')
  if (!player) {
    return
  }

  const svgns = 'http://www.w3.org/2000/svg'
  const settings = document.querySelector('.ytp-settings-button')
  const boost = document.querySelector('.ytp-boost-button')
  const advancedPlayback = document.querySelector(
    '.ytp-advanced-playback-button'
  )
  if (settings && !boost) {
    const boost = Object.assign(settings.cloneNode(true), {
      textContent: '',
      style: '',
      title: '',
    })
    boost.classList.replace('ytp-settings-button', 'ytp-boost-button')

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

    // Modal code
    const modalHTML = `<div id="modalVolumeBooster">
  <div id="modal-header">
    <p>Volume Booster</p>
    <div id="closeNEW"><span>X</span></div>
  </div>
  <div id="singleLine"></div>
  <div class="rangeContainerNEW">
    Boost :
    <input
      type="range"
      min="1"
      max="6"
      step="1"
      id="advancedPlaybackSliderNEW"
      value="1"
    />
    <div id="sliderValueNEW">1x</div>
  </div>
  <div id="defaultButtonCont">
    <button id="defaultButtonNEW">Set to Default</button>
  </div>
</div>`

    const modalHTMLVolumeBoosterToggle = `
    <div id='volumeBoosterToggle'>Volume Booster</div>
    `

    const player = [...document.querySelectorAll('.html5-video-player')]
      .sort((a, b) => {
        return b.offsetHeight - a.offsetHeight
      })
      .shift() //Actually there are multiple html5 video player but we a picking the largest one using shift()

    player.appendChild(
      document.createRange().createContextualFragment(modalHTML)
    )

    player.appendChild(
      document
        .createRange()
        .createContextualFragment(modalHTMLVolumeBoosterToggle)
    )

    const volumeBoosterToggle = document.getElementById('volumeBoosterToggle')

    if (boost && volumeBoosterToggle) {
      boost.addEventListener('mouseenter', () => {
        volumeBoosterToggle.style.display = 'block'
      })
      boost.addEventListener('mouseleave', () => {
        volumeBoosterToggle.style.display = 'none'
      })
    }

    // Only if the wants to change the value
    let boostButtonClicked = false

    boost.addEventListener('click', (e) => {
      //hiding the other one
      if (document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none'
      }

      const modal = document.getElementById('modalVolumeBooster')

      if (modal.style.display === 'block') {
        modal.style.display = 'none'
      } else {
        modal.style.display = 'block'
      }

      if (boostButtonClicked) {
        return
      }

      boostButtonClicked = true

      const video = player.querySelector('video')

      if (!video) {
        console.error('No video element found.')
        return
      }

      if (!video.booster) {
        const context = new AudioContext()
        const source = context.createMediaElementSource(video)
        const preamp = context.createGain()

        preamp.gain.value = 1 // Set initial volume boost

        source.connect(preamp)
        preamp.connect(context.destination)

        video.booster = {
          context: context,
          source: source,
          preamp: preamp,
        }
      }

      const slider = document.getElementById('advancedPlaybackSliderNEW')
      const modalText = document.getElementById('sliderValueNEW')
      const closeBtn = document.getElementById('closeNEW')
      const defaultButton = document.getElementById('defaultButtonNEW')

      if (modal.style.display === 'block') {
        modal.style.display = 'none'
      } else {
        modal.style.display = 'block'
      }

      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none'
      })

      slider.addEventListener('mousemove', (e) => {
        modalText.textContent = slider.value + 'x'
      })

      defaultButton.addEventListener('click', () => {
        slider.value = 1
        modalText.textContent = slider.value + 'x'

        const video = document.querySelector('video')

        if (video && video.booster) {
          video.booster.preamp.gain.value = 1 // Reset volume booster to 1
        }
      })

      slider.addEventListener('input', () => {
        const video = player.querySelector('video')

        if (video && video.booster) {
          video.booster.preamp.gain.value = slider.value // Set volume booster gain to slider value
        }
      })
      //TEst
    })
  }

  if (settings && !advancedPlayback) {
    const advancedPlayback = Object.assign(settings.cloneNode(true), {
      textContent: '',
      style: '',
      title: '',
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
<div id="modal">
  <div id="modal-header">
    <p>Playback Speed</p>
    <div id="closePlaybackSpeed"><span>X</span></div>
  </div>
  <div id="singleLine"></div>
  <div class="rangeContainer">
    Speed :
    <input
      type="range"
      min="0.1"
      max="6"
      step="0.1"
      id="advancedPlaybackSlider"
      value="1.0"
    />
    <div id="sliderValue">1x</div>
  </div>
  <div id="defaultButtonCont">
    <button id="defaultButton">Set to Default</button>
  </div>
</div>

    `

    const modalHTMLPlaybackSpeedToggle = `
    <div id='playbackSpeedToggle'>Playback Speed</div>
    `

    player.appendChild(
      document.createRange().createContextualFragment(modalHTML)
    )
    player.appendChild(
      document
        .createRange()
        .createContextualFragment(modalHTMLPlaybackSpeedToggle)
    )

    const playbackSpeedToggle = document.getElementById('playbackSpeedToggle')

    if (advancedPlayback && playbackSpeedToggle) {
      advancedPlayback.addEventListener('mouseenter', () => {
        playbackSpeedToggle.style.display = 'block'
      })
      advancedPlayback.addEventListener('mouseleave', () => {
        playbackSpeedToggle.style.display = 'none'
      })
    }
    const modal = document.getElementById('modal')
    const slider = document.getElementById('advancedPlaybackSlider')
    const modalText = document.getElementById('sliderValue')
    const closeBtn = document.getElementById('closePlaybackSpeed')
    const defaultButton = document.getElementById('defaultButton')

    advancedPlayback.addEventListener('click', (e) => {
      //Hiding the other one

      if (document.getElementById('modalVolumeBooster')) {
        document.getElementById('modalVolumeBooster').style.display = 'none'
      }

      if (modal.style.display === 'block') {
        modal.style.display = 'none'
      } else {
        modal.style.display = 'block'
      }
    })

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none'
    })

    slider.addEventListener('mousemove', (e) => {
      modalText.textContent = slider.value + 'x'
    })

    defaultButton.addEventListener('click', () => {
      slider.value = 1
      modalText.textContent = slider.value + 'x'

      const video = document.querySelector('video') //I directly used the video element you can also do with 'const player'
      if (video) {
        video.playbackRate = slider.value
      }
    })

    slider.addEventListener('input', () => {
      const video = document.querySelector('video') //I directly used the video element you can also do with 'const player'
      if (video) {
        video.playbackRate = slider.value
      }
    })
  }
}

addEventListener('yt-navigate-finish', observe)
addEventListener('play', observe, true)
