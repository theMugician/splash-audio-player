class SplashAudioPlayer {
    constructor(player) {
        this.audioPlayer = typeof player === 'string' ? document.querySelector(player) : player

        this.audioElementHTML = this.audioPlayer.innerHTML
        this.audioElement = this.audioPlayer.getElementsByTagName('audio')[0]
        this.audioPlayer.classList.add('splash-audio-player')
        this.audioPlayer.innerHTML = SplashAudioPlayer.getTemplate() + this.audioElementHTML

        this.seekSlider = this.audioPlayer.getElementsByClassName('splash-audio-player__seek-slider')[0]
        this.playPauseButton = this.audioPlayer.getElementsByClassName('splash-audio-player__play-pause-button')[0]
        this.playPauseButtonIcon = this.audioPlayer.getElementsByClassName('play-pause-button__icon')[0]
        this.volumeSlider = this.audioPlayer.getElementsByClassName('splash-audio-player__volume-slider')[0]
        this.muteButton = this.audioPlayer.getElementsByClassName('splash-audio-player__mute-button')[0]
        this.muteButtonIcon = this.audioPlayer.getElementsByClassName('mute-button__icon')[0]

        this.durationContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__duration')[0]
        this.currentTimeContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__current-time')[0]
        this.outputContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__volume-output')[0]
        
        this.playState = 'play'
        this.muteState = 'unmute'
        this.raf = null

        this.init()
    }

    emitEvents() {
        this.playPauseButton.addEventListener('click', () => {
            if(this.playState === 'play') {
                this.audioElement.play()
                requestAnimationFrame(this.whilePlaying)
                this.playState = 'pause'
                this.playPauseButtonIcon.attributes.d.value = 'M0 0h6v24H0zM12 0h6v24h-6z'
            } else {
                this.audioElement.pause()
                cancelAnimationFrame(this.raf)
                this.playState = 'play'
                this.playPauseButtonIcon.attributes.d.value = 'M18 12L0 24V0'
            }
        })

        this.muteButton.addEventListener('click', () => {
            if(this.muteState === 'unmute') {
                this.audioElement.muted = true
                this.muteState = 'mute'
                this.muteButtonIcon.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667'
            } else {
                this.audioElement.muted = false
                this.muteState = 'unmute'
                this.muteButtonIcon.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z'
            }
        })

        this.seekSlider.addEventListener('input', (e) => {
            this.showRangeProgress(e.target)
        })
        this.volumeSlider.addEventListener('input', (e) => {
            this.showRangeProgress(e.target)
        })

        this.seekSlider.addEventListener('input', () => {
            this.currentTimeContainer.textContent = this.calculateTime(this.seekSlider.value)
            if(!this.audioElement.paused) {
                cancelAnimationFrame(this.raf)
            }
        })
    
        this.seekSlider.addEventListener('change', () => {
            this.audioElement.currentTime = this.seekSlider.value
            if(!this.audioElement.paused) {
                requestAnimationFrame(this.whilePlaying)
            }
        })
    
        this.volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value
            this.audioElement.volume = value / 100
        })
    }
    
    static getTemplate() {
        return `
            <svg class="splash-audio-player__play-pause-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 24">
                <path fill="#fff" fill-rule="evenodd" d="M18 12L0 24V0" class="play-pause-button__icon"/>
            </svg>
            <input type="range" class="splash-audio-player__range-slider splash-audio-player__seek-slider" max="100" value="0">
            <span class="splash-audio-player__current-time splash-audio-player__time">0:00</span>
            <span class="splash-audio-player__time">&nbsp;/&nbsp;</span>
            <span class="splash-audio-player__duration splash-audio-player__time">0:00</span>
            <svg class="splash-audio-player__mute-button" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path class="mute-button__icon" fill="#fff" fill-rule="evenodd" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z"/>
            </svg>
            <input type="range" class="splash-audio-player__volume-slider splash-audio-player__range-slider" max="100" value="100">
        `
    }

    /** Implementation of the functionality of the audio player */

    showRangeProgress = (rangeInput) => {
        if(rangeInput === this.seekSlider) this.audioPlayer.style.setProperty('--seek-slider-before__width', rangeInput.value / rangeInput.max * 100 + '%')
        else this.audioPlayer.style.setProperty('--volume-slider-before__width', rangeInput.value / rangeInput.max * 100 + '%')
    }

    calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60)
        const seconds = Math.floor(secs % 60)
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${minutes}:${returnedSeconds}`
    }

    displayDuration = () => {
        this.durationContainer.textContent = this.calculateTime(this.audioElement.duration)
    }

    setSliderMax = () => {
        this.seekSlider.max = Math.floor(this.audioElement.duration)
    }

    whilePlaying = () => {
        this.seekSlider.value = Math.floor(this.audioElement.currentTime)
        this.currentTimeContainer.textContent = this.calculateTime(this.seekSlider.value)
        this.audioPlayer.style.setProperty('--seek-slider-before__width', `${this.seekSlider.value / this.seekSlider.max * 100}%`)
        this.raf = requestAnimationFrame(this.whilePlaying)
    }

    init() {
        this.emitEvents()
        if (this.audioElement.readyState > 0) {
            this.displayDuration()
            this.setSliderMax()
        } else {
            this.audioElement.addEventListener('loadedmetadata', () => {
                this.displayDuration()
                this.setSliderMax()
            })
        }  
    }

}
