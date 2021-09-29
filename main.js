class SplashAudioPlayer {
    constructor(player) {
        this.audioPlayer = typeof player === 'string' ? document.querySelector(player) : player

        this.audioElementHTML = this.audioPlayer.innerHTML
        this.audioElement = this.audioPlayer.getElementsByTagName('audio')[0]
        //console.log(typeof auEl)
        console.log(typeof this.audioElement)
        this.audioPlayer.classList.add('splash-audio-player')
        this.audioPlayer.innerHTML = SplashAudioPlayer.getTemplate() + this.audioElementHTML
    
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

        this.init()
    }

    emitEvents() {
        this.playIconContainer.addEventListener('click', () => {
            if(this.playState === 'play') {
                this.audioElement.play()
                requestAnimationFrame(this.whilePlaying)
                this.playState = 'pause'
            } else {
                this.audioElement.pause()
                cancelAnimationFrame(this.raf)
                this.playState = 'play'
            }
        })

        this.muteIconContainer.addEventListener('click', () => {
            if(muteState === 'unmute') {
                this.audioElement.muted = true
                this.muteState = 'mute'
            } else {
                this.audioElement.muted = false
                this.muteState = 'unmute'
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
    
            //this.outputContainer.textContent = value
            this.audioElement.volume = value / 100
        })
    }
    
    static getTemplate() {
        return `
            <div class="splash-audio-player__play-icon"></div>
            <input type="range" class="splash-audio-player__range-slider splash-audio-player__seek-slider" max="100" value="0">
            <span class="splash-audio-player__current-time splash-audio-player__time">0:00</span>
            <span class="splash-audio-player__time">&nbsp;/&nbsp;</span>
            <span class="splash-audio-player__duration splash-audio-player__time">0:00</span>
            <div class="splash-audio-player__mute-icon"></div>
            <input type="range" class="splash-audio-player__volume-slider splash-audio-player__range-slider" max="100" value="100">
        `
    }

    /** Implementation of the functionality of the audio player */

    showRangeProgress = (rangeInput) => {
        if(rangeInput === this.seekSlider) this.audioPlayer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%')
        else this.audioPlayer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%')
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
        this.audioPlayer.style.setProperty('--seek-before-width', `${this.seekSlider.value / this.seekSlider.max * 100}%`)
        this.raf = requestAnimationFrame(this.whilePlaying)
    }

    init() {
        this.emitEvents()
        console.log(this.audioElement)
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
