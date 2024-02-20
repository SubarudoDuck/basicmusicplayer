const MIN = 0;
const MAX = 100;

let playCount = document.querySelector(".play-count");
let coverPic = document.querySelector(".cover-pic");
let songName = document.querySelector(".song-name");
let artistName = document.querySelector(".artist-name");

let playpauseBtn = document.querySelector(".playpause-btn");
let nextBtn = document.querySelector(".next-btn");
let prevBtn = document.querySelector(".prev-btn");

let seekSlider = document.querySelector(".seek_slider");
let volumeSlider = document.querySelector(".volume_slider");
let currTime = document.querySelector(".current-time");
let totalDur = document.querySelector(".total-duration");

let songIndex = 0;
let isPlaying = false;
let updateTimer;

let songList = [
    {
        name: "Aegleseeker",
        artist: "Frums",
        image: "../resources/Songs/Aegleseeker/bg.jpg",
        path: "../resources/Songs/Aegleseeker/track.mp3",
    },
    {
        name: "Latent Kingdom",
        artist: "Laur",
        image: "../resources/Songs/Latent Kingdom/bg.jpg",
        path: "../resources/Songs/Latent Kingdom/track.mp3",
    },
    {
        name: "PUPA",
        artist: "モリモリあつし",
        image: "../resources/Songs/PUPA/bg.jpg",
        path: "../resources/Songs/PUPA/track.mp3",
    },
];

let currSong = document.createElement('audio');

function loadSong() {
    // clean data of old song
    clearInterval(updateTimer);
    resetValues();

    // loading a new song
    currSong.src = songList[songIndex].path;
    currSong.load();

    // update details of curr song
    coverPic.style.backgroundImage = "url('" + songList[songIndex].image + "')";
    songName.textContent = songList[songIndex].name;
    artistName.textContent = songList[songIndex].artist;
    playCount.textContent = "TRACK " + (songIndex + 1) + " OF " + songList.length;

    // update seek slider every second
    updateTimer = setInterval(updateSeekSlider, 1000);

    // when a song ends
    currSong.addEventListener("ended", nextSong);
}

function resetValues() {
    currTime.textContent = "00:00";
    totalDur.textContent = "00:00";
    seekSlider.value = 0;
}

/*--- Buttons area ---*/
// currently constantly on loop
function prevSong() {
    if (songIndex > 0) {
        songIndex -= 1;
    }
    // loop back
    else {
        songIndex = songList.length - 1;
    }
    // load song
    loadSong(songIndex);
    playSong();
}

function nextSong() {
    if (songIndex < songList.length - 1) {
        songIndex += 1;
    } else {
        songIndex = 0;
    }
    // load song
    loadSong(songIndex);
    playSong();
}

/* Play-pause */
function playPauseSong() {
    if (!isPlaying) {playSong();}
    else {pauseSong();}
}

function playSong() {
    currSong.play();
    isPlaying = true;
    playpauseBtn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseSong() {
    currSong.pause();
    isPlaying = false;
    playpauseBtn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

/*--- Slider area ---*/

// seek
function seek() {
    // calculate which second to jump to using the slider value
    if (!isNaN(currSong.duration)) {
        currSong.currentTime = currSong.duration * (seekSlider.value / 100);
    } else {
        seekSlider.value = INITIAL_POSITION;
    }
}
// volume
function changeVolume() {
    currSong.volume = volumeSlider.value / 100;
}
function volumeDown() {
    if (Math.floor(volumeSlider.value) >= 5) {
        volumeSlider.value -= 5;
        currSong.volume = volumeSlider.value / 100
    }
}
function volumeUp() {
    if (Math.floor(volumeSlider.value) <= MAX - 5) {
        volumeSlider.value += 5;
        currSong.volume = volumeSlider.value / 100
    }
}

function updateSeekSlider() {
    let currPosition = 0;
    if (!isNaN(currSong.duration)) {
        // change thumb position
        currPosition = currSong.currentTime * (100 / currSong.duration);
        seekSlider.value = currPosition;
        // display total duration of the song
        let endMinute = Math.floor(currSong.duration / 60);
        let endSecond = Math.floor(currSong.duration % 60);
        endMinute = (endMinute < 10) ? ("0" + endMinute) : endMinute;
        endSecond = (endSecond < 10) ? ("0" + endSecond) : endSecond;
        totalDur.textContent = endMinute + ":" + endSecond;
        // to project onto the seek slider
        let currMinute = Math.floor(currSong.currentTime / 60);
        let currSecond = Math.floor(currSong.currentTime % 60);
        currMinute = (currMinute < 10) ? ("0" + currMinute) : currMinute;
        currSecond = (currSecond < 10) ? ("0" + currSecond) : currSecond;
        currTime.textContent = currMinute + ":" + currSecond;
    }
    else {
        totalDur.textContent = "NaN";
        currTime.textContent = "NaN";
    }
}

// Load the first track in the tracklist
loadSong(songIndex);
