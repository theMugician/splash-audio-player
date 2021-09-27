class SplashAudioPlayer {
    constructor(player) {
        this.audioPlayer = typeof player === 'string' ? document.querySelector(player) : player

        const audioElement = this.audioPlayer.innerHTML
        this.audioPlayer.classList.add('splash-audio-player')
        this.audioPlayer.innerHTML = SplashAudioPlayer.getTemplate() + audioElement
    
        /** Implementation of the presentation of the audio player */
        //const audioPlayer = document.getElementById(selector)
        //const audioPlayerPlayerContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__player-container')[0]
        this.seekSlider = this.audioPlayer.getElementsByClassName('splash-audio-player__seek-slider')[0]
        this.playIconContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__play-icon')[0]
        this.volumeSlider = this.audioPlayer.getElementsByClassName('splash-audio-player__volume-slider')[0]
        this.muteIconContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__mute-icon')[0]
        
        //this.audio = this.audioPlayer.getElementsByClassName('splash-audio-player__audio')[0]
        this.durationContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__duration')[0]
        this.currentTimeContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__current-time')[0]
        this.outputContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__volume-output')[0]
        
        this.playState = 'play'
        this.muteState = 'unmute'
        this.raf = null

        this.init
    }

    emitEvents() {
        this.playIconContainer.addEventListener('click', () => {
            if(playState === 'play') {
                audioElement.play()
                requestAnimationFrame(whilePlaying)
                playState = 'pause'
            } else {
                audioElement.pause()
                cancelAnimationFrame(raf)
                playState = 'play'
            }
        })

        this.muteIconContainer.addEventListener('click', () => {
            if(muteState === 'unmute') {
                audioElement.muted = true
                muteState = 'mute'
            } else {
                audioElement.muted = false
                muteState = 'unmute'
            }
        })

        this.seekSlider.addEventListener('input', (e) => {
            showRangeProgress(e.target)
        })
        this.volumeSlider.addEventListener('input', (e) => {
            showRangeProgress(e.target)
        })

        this.seekSlider.addEventListener('input', () => {
            currentTimeContainer.textContent = calculateTime(seekSlider.value)
            if(!audioElement.paused) {
                cancelAnimationFrame(raf)
            }
        })
    
        this.seekSlider.addEventListener('change', () => {
            audioElement.currentTime = seekSlider.value
            if(!audioElement.paused) {
                requestAnimationFrame(whilePlaying)
            }
        })
    
        this.volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value
    
            outputContainer.textContent = value
            audioElement.volume = value / 100
        })
    }
    
    /** Implementation of the functionality of the audio player */

    showRangeProgress = (rangeInput) => {
        if(rangeInput === seekSlider) audioPlayerPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%')
        else audioPlayerPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%')
    }

    calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60)
        const seconds = Math.floor(secs % 60)
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${minutes}:${returnedSeconds}`
    }

    displayDuration = () => {
        durationContainer.textContent = calculateTime(audioElement.duration)
    }

    setSliderMax = () => {
        seekSlider.max = Math.floor(audioElement.duration)
    }

    whilePlaying = () => {
        seekSlider.value = Math.floor(audioElement.currentTime)
        currentTimeContainer.textContent = calculateTime(seekSlider.value)
        audioPlayerPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`)
        raf = requestAnimationFrame(whilePlaying)
    }

    init() {
        emitEvents()
        if (this.audioElement.readyState > 0) {
            displayDuration()
            setSliderMax()
        } else {
            audioElement.addEventListener('loadedmetadata', () => {
                displayDuration()
                setSliderMax()
            })
        }  
    }

}
