//Сценарій сайту
"use strict";
/*------------------general variable for control document html--------------------------------*/
const getFullscreen = document.querySelector('.fullscreen');
//song display control
const getMainAudio = document.querySelector('#main__audio');
const getNowPlaying = document.querySelector('.header__title');
const getSongPicture = document.querySelector('.song__picture');
const getSongTitle = document.querySelector('.song__title');
const getSongArtist = document.querySelector('.song__artist');
//song timer&volume contol
const getTimerSlider = document.querySelector('.timer__slider');
const getTimerCurrent = document.querySelector('.timer__current_start');
const getTimerEnd = document.querySelector('.timer__current_end');
const getVolumeSlider = document.querySelector('.volume__slider');
const btnVolumeMute = document.querySelector('.volume__current_mute');
const btnVolumeMax = document.querySelector('.volume__current_volume');
//music player button controllers
const btnShuffle = document.querySelector('.controllers__item_shuffle');
const btnPrev = document.querySelector('.controllers__item_prev');
const btnPlay = document.querySelector('.controllers__item_play');
const btnNext = document.querySelector('.controllers__item_next');
const btnReload = document.querySelector('.controllers__item_reloadlist');
//play list (music list)
const btnPlayList = document.querySelector('.header__playlist_text');
const btnAddSong = document.querySelector('.header__playlist_add');
const getWindowPlaylist = document.querySelector('.musicplayer__playlist');
//variable for parsing
const jsMediaTags = window.jsmediatags;
//Arrays whis song
let uploadSongArray = [];
let playlistArray = [];
let songIndex = 0;
/*-------------------------------------------------------------------------------------------*/
//give all button new cursor style
btnShuffle.style.cursor = "pointer";
btnPrev.style.cursor = "pointer";
btnPlay.style.cursor = "pointer";
btnNext.style.cursor = "pointer";
btnReload.style.cursor = "pointer";
btnPlayList.style.cursor = "pointer";
btnAddSong.style.cursor = "pointer";
getTimerSlider.style.cursor = "pointer";
getVolumeSlider.style.cursor = "pointer";
btnVolumeMax.style.cursor = "pointer";
btnVolumeMute.style.cursor = "pointer";
/*-------------------------------------------------------------------------------------------*/
//random background color main page
function setRandomBackgroundColor() {
  function getPopulate(temp) {
    let x = Math.round(Math.random() * 256);
    let y = Math.round(Math.random() * 256);
    let c = Math.round(Math.random() * 256);
    if (temp === 0.8) return 'rgba(' + x + ',' + y + ',' + c + ',' + '0.8)';
    else if (temp === '%') return 'rgba(' + x + ',' + y + ',' + c + ')' + '70.71%';
  }
  let gradient = 'linear-gradient(' + '217deg' + ',' + getPopulate(0.8) + ',' + getPopulate('%') + ')' + ',' +
    'linear-gradient(' + '127deg' + ',' + getPopulate(0.8) + ',' + getPopulate('%') + ')' + ',' +
    'linear-gradient(' + '336deg' + ',' + getPopulate(0.8) + ',' + getPopulate('%') + ')';

  getFullscreen.style.background = gradient;
}
//call function for change background color
setRandomBackgroundColor();
/*--------------------------------------------------------------------------------------------*/
//copied the downloaded songs to a new array
function setNewPlaylist(playArray) {
  playlistArray = playArray;
}
function drawPlayList() {
  let list = new String;
  for (let i = 0; i < playlistArray.length; i++) {
    list +=
      `<div class="playlist__row" id="${i}">
				<div class="playlist__column">
					<div class="playlist__title">${playlistArray[i].title}</div>
					<div class="playlist__artist">${playlistArray[i].artist}</div>
				</div>
					<div class="playlist__column">
					<div class="playlist__status">#${i + 1}</div>
				</div>
			</div>
    `;
  }
  const getPlaylistBody = document.querySelector('.playlist__body');
  getPlaylistBody.innerHTML = list;
  // getWindowPlaylist.innerHTML = list;
  const allSongNum = document.querySelectorAll('.playlist__row');
  for (let i = 0; i < allSongNum.length; i++) {
    allSongNum[i].setAttribute('onclick', 'cliked(this)');
    allSongNum[i].style.cursor = "pointer";
  }
}
function cliked(target) {
  let getSongStatus = document.querySelectorAll('.playlist__status');
  getSongStatus[songIndex].style.textAlign = "right";
  getSongStatus[songIndex].textContent = `#${songIndex + 1}`;
  songIndex = +target.id;
  loadSong(playlistArray[songIndex]);
  getWindowPlaylist.classList.toggle('_active');
  playMusic();
}
//parse the MP3 file
document.querySelector('#input').addEventListener("change", function (event) {
  for (let x = 0; x < event.target.files.length; x++) {
    jsMediaTags.read(event.target.files[x], {
      onSuccess: function (tag) {
        const data = tag.tags.picture.data;
        const format = tag.tags.picture.format;
        let base64String = "";
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }
        let songObject = {};
        uploadSongArray.push(songObject);
        songObject.picture = `url(data:${format};base64,${window.btoa(base64String)})`;
        songObject.title = tag.tags.title;
        songObject.artist = tag.tags.artist;
        songObject.src = URL.createObjectURL(event.target.files[x]);
        drawPlayList();
        loadSong(uploadSongArray[0]);
      }
    })
  };
  setNewPlaylist(uploadSongArray);
})
/*--------------------------------------------------------------------------------------------*/
//load song function
function loadSong(index) {
  getNowPlaying.textContent = `Playing song ${songIndex + 1} of ${playlistArray.length}`
  getSongPicture.style.backgroundImage = index.picture;
  getSongTitle.textContent = index.title;
  getSongArtist.textContent = index.artist;
  getMainAudio.setAttribute("src", index.src);
  let getSongStatus = document.querySelectorAll('.playlist__status');
  getSongStatus[songIndex].style.textAlign = "center";
  getSongStatus[songIndex].textContent = "Playing now";
}
/*--------------------------------------------------------------------------------------------*/
//function for mute song
function muteMusic() {
  getVolumeSlider.value = 0;
  getMainAudio.volume = 0;
}
//function for max song volume 
function maxVolumeMusic() {
  getVolumeSlider.value = 100;
  getMainAudio.volume = 100 / 100;
}
/*--------------------------------------------------------------------------------------------*/
//play music function
function playMusic() {
  //call function for change background color
  setRandomBackgroundColor();
  getSongPicture.classList.add('_active');
  btnPlay.classList.add("_pause");
  getMainAudio.play();
}
//pause music function 
function pauseMusic() {
  getSongPicture.classList.remove('_active');
  btnPlay.classList.remove("_pause");
  getMainAudio.pause();
}
//function for suffle array
function getShuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
//function for botton shuffle. Song suffle function 
function shuffleMusic() {
  let newShuffleArray = uploadSongArray.slice(0);
  newShuffleArray = getShuffleArray(newShuffleArray);
  setNewPlaylist(newShuffleArray);
  let getSongStatus = document.querySelectorAll('.playlist__status');
  getSongStatus[songIndex].style.textAlign = "right";
  getSongStatus[songIndex].textContent = `#${songIndex + 1}`;
  songIndex = 0;
  drawPlayList();
  loadSong(playlistArray[songIndex]);
  playMusic();
}
//next song function 
function nextMusic() {
  let getSongStatus = document.querySelectorAll('.playlist__status');
  getSongStatus[songIndex].style.textAlign = "right";
  getSongStatus[songIndex].textContent = `#${songIndex + 1}`;
  songIndex++;
  songIndex == playlistArray.length ? songIndex = 0 : songIndex = songIndex;
  loadSong(playlistArray[songIndex]);
  playMusic();
}
//prev song function 
function prevMusic() {
  let getSongStatus = document.querySelectorAll('.playlist__status');
  getSongStatus[songIndex].style.textAlign = "right";
  getSongStatus[songIndex].textContent = `#${songIndex + 1}`;
  songIndex--;
  songIndex < 0 ? songIndex = playlistArray.length - 1 : songIndex = songIndex;
  loadSong(playlistArray[songIndex]);
  playMusic();
}
/*--------------------------------------------------------------------------------------------*/
//script for drop playlist
// function for open window with song list
function openMusicList() {
  getWindowPlaylist.classList.toggle('_active');
}
/*--------------------------------------------------------------------------------------------*/
//button for open play list window
btnPlayList.addEventListener('click', openMusicList);
//output duration and current time of song
getMainAudio.addEventListener('timeupdate', function (e) {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressLine = (currentTime / duration) * 100;
  getTimerSlider.value = progressLine;
  getTimerSlider.addEventListener('click', function (e) {
    getMainAudio.currentTime = getMainAudio.duration / 100 * getTimerSlider.value;
  });
  //update song duration
  getMainAudio.addEventListener("loadeddata", function () {
    let mainDuration = getMainAudio.duration;
    let totalMin = Math.floor(mainDuration / 60);
    let totalSec = Math.floor(mainDuration % 60);
    totalSec < 10 ? totalSec = `0${totalSec}` : totalSec = `${totalSec}`;
    getTimerEnd.textContent = `${totalMin}: ${totalSec}`;
  });
  //update current song time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  currentSec < 10 ? currentSec = `0${currentSec}` : currentSec = `${currentSec}`;
  getTimerCurrent.textContent = `${currentMin}: ${currentSec}`;
});
getTimerSlider.addEventListener('input', function (e) {
  getMainAudio.currentTime = getMainAudio.duration / 100 * getTimerSlider.value;
});
//button mute song 
getVolumeSlider.addEventListener('input', function () {
  getMainAudio.volume = getVolumeSlider.value / 100;
});
//button max volume song 
btnVolumeMax.addEventListener('click', maxVolumeMusic);
//button mute song 
btnVolumeMute.addEventListener('click', muteMusic);
//button shuffle song 
btnShuffle.addEventListener('click', function () {
  const isShuffleActive = btnShuffle.classList.contains("_active");
  if (isShuffleActive) {
    setNewPlaylist(uploadSongArray);
    let getSongStatus = document.querySelectorAll('.playlist__status');
    getSongStatus[songIndex].style.textAlign = "right";
    getSongStatus[songIndex].textContent = `#${songIndex + 1}`;
    songIndex = 0;
    drawPlayList();
    loadSong(playlistArray[songIndex]);
    btnShuffle.classList.remove('_active');
    playMusic();
  } else {
    shuffleMusic();
    btnShuffle.classList.add('_active');
  }
});
//button prev song 
btnPrev.addEventListener('click', prevMusic);
//button next song 
btnNext.addEventListener('click', nextMusic);
//play & pause button
btnPlay.addEventListener('click', function () {
  const isMusicPaused = btnPlay.classList.contains("_pause");
  isMusicPaused ? pauseMusic() : playMusic();
});
//reload list & reload song button
btnReload.addEventListener('click', function () {
  const isReloadListActive = btnReload.classList.contains("_active");
  const isReloadSongActive = btnReload.classList.contains("_reloadsong");
  if (!isReloadListActive && !isReloadSongActive) {
    btnReload.classList.add("_active");
  } else if (isReloadListActive) {
    btnReload.classList.remove("_active");
    btnReload.classList.add("_reloadsong");
  } else if (isReloadSongActive) {
    btnReload.classList.remove("_reloadsong");
  }
});
getMainAudio.addEventListener('ended', function () {
  const isReloadListActive = btnReload.classList.contains("_active");
  const isReloadSongActive = btnReload.classList.contains("_reloadsong");
  pauseMusic();
  if (isReloadListActive) {
    nextMusic();
  } else if (isReloadSongActive) {
    getMainAudio.currentTime = 35;
    loadSong(playlistArray[songIndex]);
    playMusic();
  }
});