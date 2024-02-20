'use strict'

chrome.runtime.onMessage.addListener((request, sender, response) => {
  const options = {
    target: {
      tabId: sender.tab.id,
      frameIds: [sender.frameId],
    },
    world: 'MAIN',
  }

  if (request.method === 'apply_boost') {
    chrome.storage.local.get(
      {
        boost: 2,
      },
      (res) => {
        chrome.scripting
          .executeScript({
            ...options,
            func: (val) => {
              try {
                const player = [
                  ...document.querySelectorAll('.html5-video-player'),
                ]
                  .sort((a, b) => {
                    return b.offsetHeight - a.offsetHeight
                  })
                  .shift() //Actually there are multiple html5 video player but we a picking the largest one using shift()

                const video = player.querySelector('video')
                // You need to create an AudioContext before you do anything else, as everything happens inside a context. It's recommended to create one AudioContext and reuse it instead of initializing a new one each time

                /*The order is (refer docs)
                1) Create AudioContext
                2) Create createMediaElementSource
                3) Create gainNode
                4) Connect source to gainNode
                5) Connect the gainNode to destination
                */
                let context
                let source

                if (video.booster) {
                  context = video.booster.context
                  source = video.booster
                } else {
                  context = new AudioContext()
                  source = context.createMediaElementSource(video)
                }

                const preamp = context.createGain()
                preamp.gain.value = val
                source.connect(preamp)
                preamp.connect(context.destination)

                video.booster = source // Just storing it for the if statement above
                video.preamp = preamp

                return true
              } catch (e) {
                console.error(e)
                return e.message
              }
            },
            args: [res.boost], // It uses this value in the chrome.storage.local.get(boost) from contentScript
          })
          .then((a) => response(a[0].result)) // It gives the either true or error msg. See in the apply_boost part of content script
      }
    )
    return true
  } else if (request.method === 'revoke_boost') {
    chrome.scripting
      .executeScript({
        ...options,
        func: () => {
          try {
            const player = [...document.querySelectorAll('.html5-video-player')]
              .sort((a, b) => {
                return b.offsetHeight - a.offsetHeight
              })
              .shift()

            const video = player.querySelector('video')
            const { booster } = video
            booster.disconnect()
            booster.connect(booster.context.destination) //This action doesn't actually revoke the boost; instead, it just resets the audio flow to its original state

            return true
          } catch (e) {
            console.error(e)
            return e.message
          }
        },
      })
      .then((a) => response(a[0].result))

    return true
  } else if (request.method === 'adjust_boost') {
    chrome.scripting.executeScript({
      ...options,
      func: (val) => {
        //val parameter represents the new boost level received from the content script.
        try {
          const player = [...document.querySelectorAll('.html5-video-player')]
            .sort((a, b) => {
              return b.offsetHeight - a.offsetHeight
            })
            .shift()
          const video = player.querySelector('video')

          if (video.preamp) {
            video.preamp.gain.value = val //Logic
          }
        } catch (e) {}
      },
      args: [request.boost], //this is the value received from the content script and used to adjust the boost level.
    })
  }
})
