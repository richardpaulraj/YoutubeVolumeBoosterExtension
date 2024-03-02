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
    image.classList.add('icon')
    image.setAttribute('width', '24')
    image.setAttribute('height', '24')
    image.setAttribute('x', '9')
    image.setAttribute('y', '9')
    image.classList.add('colorizedImg')

    // Append image to SVG
    svg.appendChild(image)

    boost.appendChild(svg)

    settings.parentNode.insertBefore(boost, settings)

    const modalHTML = createModalHTML('Boost')
    player.appendChild(
      document.createRange().createContextualFragment(modalHTML)
    )

    tooltipText('Boost')
    toggleTooltip('Boost', boost)

    boost.addEventListener('click', (e) => {
      if (document.getElementById('modalSpeed')) {
        closeModal('Speed') //If the Other Modal is Open then it will close it
      }

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
      const modal = document.getElementById('modalBoost')
      const slider = document.getElementById('sliderBoost')
      const closeBtn = document.getElementById('closeBoost')
      const defaultButton = document.getElementById('defaultBoostButton')

      if (modal.style.display === 'block') {
        closeModal('Boost')
      } else {
        openModal('Boost')
      }

      closeBtn.addEventListener('click', () => {
        closeModal('Boost')
      })

      updateModalText('Boost')

      defaultButton.addEventListener('click', () => {
        defaultButtonLogic('Boost')
      })

      slider.addEventListener('input', boostLogic)
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
    image.classList.add('icon')
    image.setAttribute('width', '24')
    image.setAttribute('height', '24')
    image.setAttribute('x', '9')
    image.setAttribute('y', '9')

    // Append image to SVG
    svg.appendChild(image)

    advancedPlayback.appendChild(svg)

    settings.parentNode.insertBefore(advancedPlayback, settings)

    const modalHTML = createModalHTML('Speed') //Created a Function below
    player.appendChild(
      document.createRange().createContextualFragment(modalHTML)
    )

    tooltipText('Speed')

    toggleTooltip('Speed', advancedPlayback)

    const modal = document.getElementById('modalSpeed')
    const slider = document.getElementById('sliderSpeed')
    const closeBtn = document.getElementById('closeSpeed')
    const defaultButton = document.getElementById('defaultSpeedButton')

    advancedPlayback.addEventListener('click', (e) => {
      if (document.getElementById('modalBoost')) {
        closeModal('Boost') //If the Other Modal is Open then it will close it
      }

      if (modal.style.display === 'block') {
        closeModal('Speed')
      } else {
        openModal('Speed')
      }
    })

    closeBtn.addEventListener('click', () => {
      closeModal('Speed')
    })

    updateModalText('Speed')

    defaultButton.addEventListener('click', () => {
      defaultButtonLogic('Speed')
    })

    slider.addEventListener('input', speedLogic)
  }
}

function toggleTooltip(name, icon) {
  const toggle = document.getElementById(`tooltipText${name}`)

  if (icon && toggle) {
    icon.addEventListener('mouseenter', () => {
      toggle.style.display = 'block'
    })
    icon.addEventListener('mouseleave', () => {
      toggle.style.display = 'none'
    })
  }
}

function updateModalText(name) {
  const slider = document.getElementById(`slider${name}`)
  const modalText = document.getElementById(`slider${name}Value`)

  slider.addEventListener('mousemove', () => {
    modalText.textContent = slider.value + 'x'
  })
  slider.addEventListener('change', () => {
    modalText.textContent = slider.value + 'x'
  })
}

function closeModal(name) {
  const modal = document.getElementById(`modal${name}`)
  modal.style.display = 'none'
}
function openModal(name) {
  const modal = document.getElementById(`modal${name}`)
  modal.style.display = 'block'
}

function defaultButtonLogic(name) {
  const slider = document.getElementById(`slider${name}`)
  const modalText = document.getElementById(`slider${name}Value`)
  const video = document.querySelector('video')

  slider.value = 1
  modalText.textContent = slider.value + 'x'

  if (video && video.booster && name === 'Boost') {
    video.booster.preamp.gain.value = 1 // Reset volume booster to 1
  } else if (video && name === 'Speed') {
    video.playbackRate = slider.value
  }
}

function speedLogic() {
  const video = document.querySelector('video')
  const slider = document.getElementById('sliderSpeed')

  if (video) {
    video.playbackRate = slider.value
  }
}

function boostLogic() {
  const video = document.querySelector('video')
  const slider = document.getElementById('sliderBoost')

  if (video && video.booster) {
    video.booster.preamp.gain.value = slider.value // Set volume booster gain to slider value
  }
}

function tooltipText(name) {
  let displayName = name === 'Speed' ? 'Playback Speed' : 'Volume Booster'

  const tooltipDisplayText = `
    <div id='tooltipText${name}'>${displayName}</div>
    `
  const player = document.querySelector('.html5-video-player')

  player.appendChild(
    document.createRange().createContextualFragment(tooltipDisplayText)
  )
}

function createModalHTML(name) {
  let fullName = name === 'Boost' ? 'Volume Booster' : 'Playback Speed'
  let stepValue = name === 'Boost' ? '1' : '0.1'
  let minValue = name === 'Boost' ? '1' : '0.1'
  return `
    <div id="modal${name}">

      <div class="modal-header">
        <p>${fullName}</p>
        <div id="close${name}"><span>X</span></div>
      </div>

      <div class="singleLine"></div>

      <div class="rangeContainer">

        ${name} :
        <input
          type="range"
          min= ${minValue}
          max="6"
          step= ${stepValue}
          id="slider${name}"
          value="1"
        />

        <div id="slider${name}Value">1x</div>

      </div>

      <div class="defaultButtonCont">
        <button id="default${name}Button">Set to Default</button>
      </div>

    </div>`
}

addEventListener('yt-navigate-finish', observe)
addEventListener('play', observe, true)
