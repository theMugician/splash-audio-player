class SplashAudioPlayer {
    /**
     * Create an instance of SplashAudioPlayer
     * @param {string} player 
     */
    constructor(player) {
        this.audioPlayer = typeof player === 'string' ? document.querySelector(player) : player

        /**
         * Get inner HTML of audio player
         */      
        this.audioTrackHTML = this.audioPlayer.innerHTML
        
        /**
         * Access DOM element <audio> tag
         */        
        this.audioTrack = this.audioPlayer.getElementsByTagName('audio')[0]

        /**
         * Add class 'splash-audio-player' to audio player
         * @see audioPlayer
         */   
        this.audioPlayer.classList.add('splash-audio-player')

        /**
         * Create HTML template of audio player
         * @see getTemplate
         */
        this.audioPlayer.innerHTML = SplashAudioPlayer.getTemplate() + this.audioTrackHTML

        /**
         * Get DOM elements from audio player
         * @see audioPlayer
         */
        this.seekSlider = this.audioPlayer.getElementsByClassName('splash-audio-player__seek-slider')[0]
        this.playPauseButton = this.audioPlayer.getElementsByClassName('splash-audio-player__play-pause-button')[0]
        this.playPauseButtonIcon = this.audioPlayer.getElementsByClassName('play-pause-button__icon')[0]
        this.volumeSlider = this.audioPlayer.getElementsByClassName('splash-audio-player__volume-slider')[0]
        this.muteButton = this.audioPlayer.getElementsByClassName('splash-audio-player__mute-button')[0]
        this.muteButtonIcon = this.audioPlayer.getElementsByClassName('mute-button__icon')[0]
        this.durationContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__duration')[0]
        this.currentTimeContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__current-time')[0]
        this.outputContainer = this.audioPlayer.getElementsByClassName('splash-audio-player__volume-output')[0]

        /**
         * Local State
         */       
        this.playState = 'pause'
        this.muteState = 'unmute'
        this.raf = null

        /**
         * Initiate an instance of the audio player plugin
         * @see init
         */
        this.init()
    }
    

    emitEvents() {

        this.playPauseButton.addEventListener('click', () => {
            this.playHandler()
        })

        this.muteButton.addEventListener('click', () => {
            this.muteHandler()
        })

        this.seekSlider.addEventListener('input', (e) => {
            this.showRangeProgress(e.target)
        })
        this.volumeSlider.addEventListener('input', (e) => {
            this.showRangeProgress(e.target)
        })

        this.seekSlider.addEventListener('input', () => {
            this.currentTimeContainer.textContent = this.calculateTime(this.seekSlider.value)
            if(!this.audioTrack.paused) {
                cancelAnimationFrame(this.raf)
            }
        })
    
        this.seekSlider.addEventListener('change', () => {
            this.audioTrack.currentTime = this.seekSlider.value
            if(!this.audioTrack.paused) {
                requestAnimationFrame(this.whilePlaying)
            }
        })
    
        this.volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value
            this.audioTrack.volume = value / 100
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

    playHandler = () => {
        this.playState = this.playState === 'pause' ? 'play' : 'pause'
        if(this.playState === 'play') {
            this.audioTrack.play()
            requestAnimationFrame(this.whilePlaying)
            this.playPauseButtonIcon.attributes.d.value = 'M0 0h6v24H0zM12 0h6v24h-6z'
        } else {
            this.audioTrack.pause()
            cancelAnimationFrame(this.raf)
            this.playPauseButtonIcon.attributes.d.value = 'M18 12L0 24V0'
        }
    }

    muteHandler = () => {
        this.muteState = this.muteState === 'unmute' ? 'mute' : 'unmute'
        if(this.muteState === 'mute') {
            this.audioTrack.muted = true
            this.muteButtonIcon.attributes.d.value = 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667'
        } else {
            this.audioTrack.muted = false
            this.muteButtonIcon.attributes.d.value = 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z'
        }
    }    

    /**
     * @param {number} rangeInput
     * @return {null}
     */
    showRangeProgress = (rangeInput) => {
        if(rangeInput === this.seekSlider) this.audioPlayer.style.setProperty('--seek-slider-before__width', rangeInput.value / rangeInput.max * 100 + '%')
        else this.audioPlayer.style.setProperty('--volume-slider-before__width', rangeInput.value / rangeInput.max * 100 + '%')
    }

    /**
     * @param {number} secs
     * @return {string} 00:00
     */
    calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60)
        const seconds = Math.floor(secs % 60)
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
        return `${minutes}:${returnedSeconds}`
    }

    /**
     * Display the length/duration of the audio track
     */
    displayDuration = () => {
        this.durationContainer.textContent = this.calculateTime(this.audioTrack.duration)
    }

    /**
     * Set the max length of the seek slider based on the duration of the audio track
     */
    setSliderMax = () => {
        this.seekSlider.max = Math.floor(this.audioTrack.duration)
    }

    /**
     * Update the time of the track and the position of the seek slider while playing
     * @see playHandler
     */
    whilePlaying = () => {
        this.seekSlider.value = Math.floor(this.audioTrack.currentTime)
        this.currentTimeContainer.textContent = this.calculateTime(this.seekSlider.value)
        this.audioPlayer.style.setProperty('--seek-slider-before__width', `${this.seekSlider.value / this.seekSlider.max * 100}%`)
        this.raf = requestAnimationFrame(this.whilePlaying)
    }

    init() {
        this.emitEvents()
        if (this.audioTrack.readyState > 0) {
            this.displayDuration()
            this.setSliderMax()
        } else {
            this.audioTrack.addEventListener('loadedmetadata', () => {
                this.displayDuration()
                this.setSliderMax()
            })
        }  
    }

}
