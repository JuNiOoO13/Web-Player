// script.js



const pauseButton = document.getElementById('pause-button');
const audioPlayer = document.getElementById('audioPlayer');


const progressButton = document.getElementById('pointer');
const progressBar = document.getElementById('progress-bar');
const TotalProgressBar = document.getElementById('progress-bar-container');

const pointerVolume = document.getElementById('pointerVolume');
const progressBarVolume = document.getElementById('progress-barVolume');
const TotalProgressBarVolume = document.getElementById('total-ProgressBarVolume');
const volumeSymbol = document.getElementById('volumeSymbol');
const atualTime = document.getElementById('atualTime');

const musicName = document.getElementById('musicName');
const search = document.getElementById('searchBar');

var totalSizeVolume;
var atualSizeVolume = TotalProgressBarVolume.getBoundingClientRect().width;
var totalSizeReprodutionBar;
var atualSizeReprodutionBar;

progressBarVolume.style.width = `${100}%`;
pointerVolume.style.marginLeft = `${100}%`;
audioPlayer.volume = 1.0;


function StopAndPlay() {
    const playButton = document.getElementById('play-button');
    if (audioPlayer.paused) {
        audioPlayer.play();
        playButton.className = "fa-solid fa-pause";
    }
    else {
        audioPlayer.pause();
        playButton.className = "fa-solid fa-play";
    }
}

function searchClick(element) {
    const atualMusic = document.getElementById('atualMusic');
    const atualMusicImg = document.getElementById('musicImg');
    const atualMusicName = document.getElementById('musicName');
    const atualMusicAuthor = document.getElementById('singerName');
    debugger
    $.ajax({
        url: 'PlayMusic/' + element.value,
        type: 'GET',
        success: function (data) {
            atualMusic.src = '.' + data.dir;
            atualMusicImg.src = data.thumbnail;
            atualMusicAuthor.textContent = data.author;
            atualMusicName.textContent = data.nome;
            audioPlayer.load();
            audioPlayer.play();
            document.getElementById('play-button').className = "fa-solid fa-pause";
            document.getElementById('playerBar').style.display = "block";


        },
        error: function (error) {
            alert('Erro na requisição.');
        }
    });
}

search.addEventListener('keydown', function (event) {
    const bodyContent = document.getElementById('BodyContent');
    if (event.key === "Enter") {
        $.ajax({
            url: 'SearchResult/' + search.value,
            type: 'GET',
            success: function (data) {
                const newState = { page: 'page1' };
                const newTitle = 'Nova Página';
                const newUrl = "SearchResult="+ search.value;

                window.history.pushState(newState, newTitle, newUrl);
               bodyContent.innerHTML = data;
            },
            error: function (error) {
                alert('Erro na requisição.');
            }
        });
    }

});

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
    progressButton.style.marginLeft = `${progress}%`;
    const minutos = Math.floor(audioPlayer.currentTime / 60);
    const segundos = audioPlayer.currentTime % 60;
    atualTime.textContent = `${minutos}:${Math.trunc(segundos).toString().padStart(2,'0')}`;
});


TotalProgressBar.addEventListener('click', () => {
    const progress = (atualSizeReprodutionBar * 100) / totalSizeReprodutionBar;
    progressBar.style.width = `${progress}%`;
    progressButton.style.marginLeft = `${progress}%`;
    audioPlayer.currentTime = (audioPlayer.duration * progress) / 100
});

// Adiciona um ouvinte de evento para o movimento do mouse no container
TotalProgressBar.addEventListener('mousemove', (event) => {
    const boundingRect = TotalProgressBar.getBoundingClientRect();
    atualSizeReprodutionBar = event.clientX - boundingRect.left;
    totalSizeReprodutionBar = TotalProgressBar.getBoundingClientRect().width
});

TotalProgressBarVolume.addEventListener('mousemove', (event) => {
    const boundingRect = TotalProgressBarVolume.getBoundingClientRect();
    atualSizeVolume = event.clientX - boundingRect.left;
    totalSizeVolume = TotalProgressBarVolume.getBoundingClientRect().width
});

TotalProgressBarVolume.addEventListener('click', () => {
    const progress = (atualSizeVolume * 100) / totalSizeVolume;
    progressBarVolume.style.width = `${progress}%`;
    pointerVolume.style.marginLeft = `${progress}%`;
    audioPlayer.volume = progress / 100;
    if (audioPlayer.volume < 0.07) {
        volumeSymbol.className = 'fa-solid fa-volume-xmark';
        audioPlayer.volume = 0;

    } else if (audioPlayer.volume <= 0.7) {
        volumeSymbol.className = 'fa-solid fa-volume-low'
    } else
        volumeSymbol.className = 'fa-solid fa-volume-high'
    

});

audioPlayer.addEventListener("ended", () => {
    let channelName = document.getElementById("authorName").textContent;
    const atualMusic = document.getElementById('atualMusic');
    const atualMusicImg = document.getElementById('musicImg');
    const atualMusicName = document.getElementById('musicName');
    const atualMusicAuthor = document.getElementById('singerName');
    $.ajax({
        url: '/Home/AutoPlay', // Certifique-se de que o caminho esteja correto
        type: 'GET',
        data: { channel: channelName },
        success: function (data) {
            atualMusic.src = '.' + data.dir;
            atualMusicImg.src = data.thumbnail;
            atualMusicAuthor.textContent = data.author;
            atualMusicName.textContent = data.nome;
            audioPlayer.load();
            audioPlayer.play();
            document.getElementById('play-button').className = "fa-solid fa-pause";
        },
        error: function () {
            console.log('Erro ao buscar detalhes do produto.');
        }
    });
})

window.addEventListener('popstate', (event) => {
    const bodyContent = document.getElementById('BodyContent');
    let url = window.location.pathname;
    if (url === "/") {
        url = "Main";
    }
    $.ajax({
        url: url,
        type: 'GET',
        success: function (data) {

            bodyContent.innerHTML = data;
        },
        error: function (error) {
            alert('Server Error.');
        }
    });


});

function GoToHome() {
    const bodyContent = document.getElementById('BodyContent');
    $.ajax({
        url: "Main" ,
        type: 'GET',
        success: function (data) {
            const newState = { page: 'Home' };
            const newTitle = 'Home';
            const newUrl = "/";
            window.history.pushState(newState, newTitle, newUrl);
            bodyContent.innerHTML = data;
        },
        error: function (error) {
            alert('Server Error.');
        }
    });
}


