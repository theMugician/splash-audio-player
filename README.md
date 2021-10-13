# Splash Audio Player

A basic HTML audio player built with vanilla javascript and CSS.  

## Set up

Download the audio player javascript and CSS file or clone this repo
```
splash-audio-player.css
splash-audio-player.js
```

## Usage

Add the audio player javascript and CSS file to your project  
```html
<link rel="stylesheet" href="splash-audio-player.css"> 
<script src="splash-audio-player.js"></script>
```

To use the Plugin, create a new instance of `SplashAudioPlayer` when the DOM is ready to transform any HTML5 ```<audio>``` Element into a SplashAudioPlayer Instance.
```js
<script>
    window.addEventListener('load', (event) => {
        new SplashAudioPlayer('.my-custom-audio-player')
    })
</script>
```

Use a unique class name or ID for your HTML ```<div>``` tag that wraps the ```<audio>``` tag.  
```html
<div class="my-custom-audio-player">
    <audio src="https://sevenoceans.agency/khruangbin-pelota.mp3" preload="metadata">
    </audio>
</div>
```

## Customizing styles and extending functionality

Most of the audio player elements are styled with CSS variables that can be easily changed at the top of the `splash-audio-player.css` file.