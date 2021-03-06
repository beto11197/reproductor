const video_player = document.querySelector("#video_player"),
    mainVideo = video_player.querySelector("#main-video"),
    progressAreaTime = video_player.querySelector(".progressAreaTime"),
    controls = video_player.querySelector(".controls"),
    progressArea = video_player.querySelector(".progress-area"),
    progress_Bar = video_player.querySelector(".progress-bar"),
    fast_rewind = video_player.querySelector(".fast-rewind"),
    play_pause = video_player.querySelector(".play_pause"),
    fast_forward = video_player.querySelector(".fast-forward"),
    volume = video_player.querySelector(".volume"),
    volume_range = video_player.querySelector(".volume_range"),
    current = video_player.querySelector(".current"),
    totalDuration = video_player.querySelector(".duration"),
    // auto_play = video_player.querySelector(".auto-play"),
    settingsBtn = video_player.querySelector(".settingsBtn"),
    captionsBtn = video_player.querySelector(".captionsBtn"),
    picture_in_picutre = video_player.querySelector(".picture_in_picutre"),
    fullscreen = video_player.querySelector(".fullscreen"),
    settings = video_player.querySelector("#settings"),
    captions = video_player.querySelector("#captions"),
    caption_labels = video_player.querySelector("#captions ul"),
    playback = video_player.querySelectorAll(".playback li"),
    tracks = video_player.querySelectorAll("track"),
    loader = video_player.querySelector(".loader");

var isplaying=0;
    
let thumbnail = video_player.querySelector(".thumbnail");
if (tracks.length != 0) {
    caption_labels.insertAdjacentHTML(
        "afterbegin",
        `<li data-track="OFF" class="active">OFF</li>`
    );
    for (let i = 0; i < tracks.length; i++) {
        trackLi = `<li data-track="${tracks[i].label}">${tracks[i].label}</li>`;
        caption_labels.insertAdjacentHTML("beforeend", trackLi);
    }
}
const caption = captions.querySelectorAll("ul li");

// Reproducir video
function playVideo() {
    play_pause.innerHTML = "pause";
    play_pause.title = "pause";
    video_player.classList.add("paused");
    mainVideo.play();
    isplaying=1;
}

// Pausar video
function pauseVideo() {
    play_pause.innerHTML = "play_arrow";
    play_pause.title = "play";
    video_player.classList.remove("paused");
    mainVideo.pause();
    isplaying=0;
}

play_pause.addEventListener("click", () => {
    const isVideoPaused = video_player.classList.contains("paused");
    isVideoPaused ? pauseVideo() : playVideo();
});

mainVideo.addEventListener("click", () => {
    if (isplaying) {
        pauseVideo();
    }else{
        playVideo()
    }
});

mainVideo.addEventListener('dblclick', ()=> {
    if (!video_player.classList.contains("openFullScreen")) {
        video_player.classList.add("openFullScreen");
        fullscreen.innerHTML = "fullscreen_exit";
        video_player.requestFullscreen();
    } else {
        video_player.classList.remove("openFullScreen");
        fullscreen.innerHTML = "fullscreen";
        document.exitFullscreen();
    }
});

mainVideo.addEventListener("play", () => {
    playVideo();
});

mainVideo.addEventListener("pause", () => {
    pauseVideo();
});

// Bot??n regresar 10s
fast_rewind.addEventListener("click", () => {
    mainVideo.currentTime -= 10;
});

// Bot??n adelantar 10s
fast_forward.addEventListener("click", () => {
    mainVideo.currentTime += 10;
});

// Duraci??n del video
mainVideo.addEventListener("loadeddata", (e) => {
    let videoDuration = e.target.duration;
    let totalMin = Math.floor(videoDuration / 60);
    let totalSec = Math.floor(videoDuration % 60);

    // if seconds are less then 10 then add 0 at the begning
    totalSec < 10 ? (totalSec = "0" + totalSec) : totalSec;
    totalDuration.innerHTML = `${totalMin} : ${totalSec}`;
});

// Actual duraci??n del video
mainVideo.addEventListener("timeupdate", (e) => {
    let currentVideoTime = e.target.currentTime;
    let currentMin = Math.floor(currentVideoTime / 60);
    let currentSec = Math.floor(currentVideoTime % 60);
    // if seconds are less then 10 then add 0 at the begning
    currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
    current.innerHTML = `${currentMin} : ${currentSec}`;

    let videoDuration = e.target.duration;
    // progressBar width change
    let progressWidth = (currentVideoTime / videoDuration) * 100 + 0.5;
    progress_Bar.style.width = `${progressWidth}%`;
});


// Actualizar la barra de progreso a la duraci??n del video
progressArea.addEventListener("click", (e) => {
    let videoDuration = mainVideo.duration;
    let progressWidthval = progressArea.clientWidth + 2;
    let ClickOffsetX = e.offsetX;
    mainVideo.currentTime = (ClickOffsetX / progressWidthval) * videoDuration;

    let progressWidth = (mainVideo.currentTime / videoDuration) * 100 + 0.5;
    progress_Bar.style.width = `${progressWidth}%`;

    let currentVideoTime = mainVideo.currentTime;
    let currentMin = Math.floor(currentVideoTime / 60);
    let currentSec = Math.floor(currentVideoTime % 60);
    // Si los segundos son menor a 10, comienza desde el inicio
    currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
    current.innerHTML = `${currentMin} : ${currentSec}`;
});

mainVideo.addEventListener('waiting', () => {
    loader.style.display = "block";
})

mainVideo.addEventListener('canplay', () => {
    loader.style.display = "none";
})

// Controles de volumen
function changeVolume() {
    mainVideo.volume = volume_range.value / 100;
    if (volume_range.value == 0) {
        volume.innerHTML = "volume_off";
    } else if (volume_range.value < 40) {
        volume.innerHTML = "volume_down";
    } else {
        volume.innerHTML = "volume_up";
    }
}

function muteVolume() {
    if (volume_range.value == 0) {
        volume_range.value = 80;
        mainVideo.volume = 0.8;
        volume.innerHTML = "volume_up";
    } else {
        volume_range.value = 0;
        mainVideo.volume = 0;
        volume.innerHTML = "volume_off";
    }
}

volume_range.addEventListener("change", () => {
    changeVolume();
});

volume.addEventListener("click", () => {
    muteVolume();
});

// Actualizar progreso con el mouse
progressArea.addEventListener("mousemove", (e) => {
    let progressWidthval = progressArea.clientWidth + 2;
    let x = e.offsetX;
    let videoDuration = mainVideo.duration;
    let progressTime = Math.floor((x / progressWidthval) * videoDuration);
    let currentMin = Math.floor(progressTime / 60);
    let currentSec = Math.floor(progressTime % 60);
    progressAreaTime.style.setProperty("--x", `${x}px`);
    progressAreaTime.style.display = "block";
    if (x >= progressWidthval - 80) {
        x = progressWidthval - 80;
    } else if (x <= 75) {
        x = 75;
    } else {
        x = e.offsetX;
    }

    // Si los segundos son menores a 10, comienza desde el inicio
    currentSec < 10 ? (currentSec = "0" + currentSec) : currentSec;
    progressAreaTime.innerHTML = `${currentMin} : ${currentSec}`;
    thumbnail.style.setProperty("--x", `${x}px`);
    thumbnail.style.display = "block";

    for (var item of thumbnails) {
        //
        var data = item.sec.find(x1 => x1.index === Math.floor(progressTime));

        // thumbnail found
        if (data) {
            if (item.data != undefined) {
                thumbnail.setAttribute("style", `background-image: url(${item.data});background-position-x: ${data.backgroundPositionX}px;background-position-y: ${data.backgroundPositionY}px;--x: ${x}px;display: block;`)

                // exit
                return;
            }
        }
    }
});

progressArea.addEventListener("mouseleave", () => {
    thumbnail.style.display = "none";
    progressAreaTime.style.display = "none";
});

// Auto play
// auto_play.addEventListener("click", () => {
//     auto_play.classList.toggle("active");
//     if (auto_play.classList.contains("active")) {
//         auto_play.title = "Autoplay activo";
//     } else {
//         auto_play.title = "Autoplay desactivado";
//     }
// });

mainVideo.addEventListener("ended", () => {
    if (auto_play.classList.contains("active")) {
        playVideo();
    } else {
        play_pause.innerHTML = "replay";
        play_pause.title = "Replay";
    }
});

// Picture in picture
picture_in_picutre.addEventListener("click", () => {
    mainVideo.requestPictureInPicture();
});

// Pantalla completa
fullscreen.addEventListener("click", () => {
    if (!video_player.classList.contains("openFullScreen")) {
        video_player.classList.add("openFullScreen");
        fullscreen.innerHTML = "fullscreen_exit";
        video_player.requestFullscreen();
    } else {
        video_player.classList.remove("openFullScreen");
        fullscreen.innerHTML = "fullscreen";
        document.exitFullscreen();
    }
});

// Abrir configuraci??n
settingsBtn.addEventListener("click", () => {
    settings.classList.toggle("active");
    settingsBtn.classList.toggle("active");
    if (
        captionsBtn.classList.contains("active") ||
        captions.classList.contains("active")
    ) {
        captions.classList.remove("active");
        captionsBtn.classList.remove("active");
    }
});


// Mostrar controles
captionsBtn.addEventListener("click", () => {
    captions.classList.toggle("active");
    captionsBtn.classList.toggle("active");
    if (
        settingsBtn.classList.contains("active") ||
        settings.classList.contains("active")
    ) {
        settings.classList.remove("active");
        settingsBtn.classList.remove("active");
    }
});

// Controlador de velocidad

playback.forEach((event) => {
    event.addEventListener("click", () => {
        removeActiveClasses(playback);
        event.classList.add("active");
        let speed = event.getAttribute("data-speed");
        mainVideo.playbackRate = speed;
    });
});

caption.forEach((event) => {
    event.addEventListener("click", () => {
        removeActiveClasses(caption);
        event.classList.add("active");
        changeCaption(event);
        caption_text.innerHTML = "";
    });
});

let track = mainVideo.textTracks;

function changeCaption(lable) {
    let trackLable = lable.getAttribute("data-track");
    for (let i = 0; i < track.length; i++) {
        track[i].mode = "disabled";
        if (track[i].label == trackLable) {
            track[i].mode = "showing";
        }
    }
}

function removeActiveClasses(e) {
    e.forEach((event) => {
        event.classList.remove("active");
    });
}

let caption_text = video_player.querySelector(".caption_text");
for (let i = 0; i < track.length; i++) {
    track[i].addEventListener("cuechange", () => {
        if (track[i].mode === "showing") {
            if (track[i].activeCues[0]) {
                let span = `<span><mark>${track[i].activeCues[0].text}</mark></span>`;
                caption_text.innerHTML = span;
            } else {
                caption_text.innerHTML = "";
            }
        }
    });
}

//  blob url
let mainVideoSources = mainVideo.querySelectorAll("source");
for (let i = 0; i < mainVideoSources.length; i++) {
    let videoUrl = mainVideoSources[i].src;
    blobUrl(mainVideoSources[i], videoUrl);
}
function blobUrl(video, videoUrl) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", videoUrl);
    xhr.responseType = "arraybuffer";
    xhr.onload = (e) => {
        let blob = new Blob([xhr.response]);
        let url = URL.createObjectURL(blob);
        video.src = url;
    };
    xhr.send();
}

mainVideo.addEventListener("contextmenu", (e) => {
    e.preventDefault();
});

// Control con mouse
video_player.addEventListener("mouseenter", () => {
    controls.classList.add("active");
    if (tracks.length != 0) {
        caption_text.classList.remove("active");
    }
});

video_player.addEventListener("mouseleave", () => {
    if (video_player.classList.contains("paused")) {
        if (
            settingsBtn.classList.contains("active") ||
            captionsBtn.classList.contains("active")
        ) {
            controls.classList.add("active");
        } else {
            controls.classList.remove("active");
            if (tracks.length != 0) {
                caption_text.classList.add("active");
            }
        }
    } else {
        controls.classList.add("active");
    }
});

if (video_player.classList.contains("paused")) {
    if (
        settingsBtn.classList.contains("active") ||
        captionsBtn.classList.contains("active")
    ) {
        controls.classList.add("active");
    } else {
        controls.classList.remove("active");
        if (tracks.length != 0) {
            caption_text.classList.add("active");
        }
    }
} else {
    controls.classList.add("active");
}

// Controles touch en mobile
video_player.addEventListener(
    "touchstart",
    () => {
        controls.classList.add("active");
        setTimeout(() => {
            controls.classList.remove("active");
            if (tracks.length != 0) {
                caption_text.classList.add("active");
            }
        }, 8000);
    },
    { passive: true }
);

video_player.addEventListener(
    "touchmove",
    () => {
        if (video_player.classList.contains("paused")) {
            controls.classList.remove("active");
            if (tracks.length != 0) {
                caption_text.classList.add("active");
            }
        } else {
            controls.classList.add("active");
        }
    },
    { passive: true }
);

if (tracks.length == 0) {
    caption_labels.remove();
    captions.remove();
    captionsBtn.parentNode.remove();
}

//  Preview del video
var thumbnails = [];

var thumbnailWidth = 158;
var thumbnailHeight = 90;
var horizontalItemCount = 5;
var verticalItemCount = 5;

let preview_video = document.createElement('video')
preview_video.preload = "metadata";
preview_video.width = "500";
preview_video.height = "300"
preview_video.controls = true;
preview_video.src = mainVideo.querySelector("source").src;

preview_video.addEventListener("loadeddata", async function () {
    //
    preview_video.pause();

    //
    var count = 1;

    //
    var id = 1;

    //
    var x = 0,
        y = 0;

    //
    var array = [];

    //
    var duration = parseInt(preview_video.duration);
    //
    for (var i = 1; i <= duration; i++) {
        array.push(i);
    }

    //
    var canvas;

    //
    var i, j;

    for (i = 0, j = array.length; i < j; i += horizontalItemCount) {
        //
        for (var startIndex of array.slice(i, i + horizontalItemCount)) {
            //
            var backgroundPositionX = x * thumbnailWidth;

            //
            var backgroundPositionY = y * thumbnailHeight;

            //
            var item = thumbnails.find((x) => x.id === id);

            if (!item) {
                //

                //
                canvas = document.createElement("canvas");

                //
                canvas.width = thumbnailWidth * horizontalItemCount;
                canvas.height = thumbnailHeight * verticalItemCount;

                //
                thumbnails.push({
                    id: id,
                    canvas: canvas,
                    sec: [
                        {
                            index: startIndex,
                            backgroundPositionX: -backgroundPositionX,
                            backgroundPositionY: -backgroundPositionY,
                        },
                    ],
                });
            } else {
                //

                //
                canvas = item.canvas;

                //
                item.sec.push({
                    index: startIndex,
                    backgroundPositionX: -backgroundPositionX,
                    backgroundPositionY: -backgroundPositionY,
                });
            }

            //
            var context = canvas.getContext("2d");

            //
            preview_video.currentTime = startIndex;

            //
            await new Promise(function (resolve) {
                var event = function () {
                    //
                    context.drawImage(
                        preview_video,
                        backgroundPositionX,
                        backgroundPositionY,
                        thumbnailWidth,
                        thumbnailHeight
                    );

                    //
                    x++;

                    // removing duplicate events
                    preview_video.removeEventListener("canplay", event);

                    //
                    resolve();
                };

                //
                preview_video.addEventListener("canplay", event);
            });

            // 1 thumbnail is generated completely
            count++;
        }

        // reset x coordinate
        x = 0;

        // increase y coordinate
        y++;

        // checking for overflow
        if (count > horizontalItemCount * verticalItemCount) {
            //
            count = 1;

            //
            x = 0;

            //
            y = 0;

            //
            id++;
        }
    }
    // looping through thumbnail list to update thumbnail
    thumbnails.forEach(function (item) {
        // converting canvas to blob to get short url
        item.canvas.toBlob(
            (blob) => (item.data = URL.createObjectURL(blob)),
            "image/jpeg"
        );

        // deleting unused property
        delete item.canvas;
    });
    console.log("done...");
});


var lastVideoSelected = 1;


function setVideo(valVideo){
    const itemListVideoPass = document.querySelector("#listVideo"+lastVideoSelected);
    const itemListVideo = document.querySelector("#listVideo"+valVideo);
    itemListVideoPass.classList.remove("list-active");
    itemListVideo.classList.add("list-active");
    lastVideoSelected = valVideo

    if (isplaying) {
        pauseVideo();
    }

    switch (valVideo) {
        case 1:
            mainVideo.poster = "https://appenmonterrey.com/rabbeat/app/media/perfecta_img.png"
            mainVideo.src = "https://appenmonterrey.com/rabbeat/app/media/perfecta.mp4"
            break;
        case 2:
            mainVideo.poster = "https://appenmonterrey.com/rabbeat/app/media/baker.png"
            mainVideo.src = "https://appenmonterrey.com/rabbeat/app/media/boney.mp4"
            break;
        case 3:
            mainVideo.poster = "https://appenmonterrey.com/rabbeat/app/media/gimme.png"
            mainVideo.src = "https://appenmonterrey.com/rabbeat/app/media/gimme.mp4"
            break;
        case 4:
            mainVideo.poster = "https://appenmonterrey.com/rabbeat/app/media/rasputin.png"
            mainVideo.src = "https://appenmonterrey.com/rabbeat/app/media/rasputin.mp4"
            break;
        case 5:
            mainVideo.poster = "https://appenmonterrey.com/rabbeat/app/media/rivers.png"
            mainVideo.src = "https://appenmonterrey.com/rabbeat/app/media/rivers.mp4"
            break;
    
        default:
            break;
    }


}
