var playListFromSpoty;
var playlistCustom = [];

//INICIO DE LA CONFIGUACIÓN DE LA API SPOTY

let codeVerifier = localStorage.getItem('code_verifier');

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');
let body = new URLSearchParams({
  grant_type: 'authorization_code',
  code: code,
  redirect_uri:'http://127.0.0.1:5500/PlaylistProyect/playlistspoty.html',
  client_id: '323198295d694b31b520e108125846a8',
  code_verifier: codeVerifier
});

async function updateToken(){
const response = fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: body
})
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP status ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log("token:", data);
    localStorage.setItem('access_token', data.access_token);
    getProfile()
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

  async function getProfile() {
    let accessToken = localStorage.getItem('access_token');

    const response = await fetch('https://api.spotify.com/v1/playlists/5zRswLsU0DkrCJrUAKwJF4', {
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    });
    const data = await response.json();
    playListFromSpoty = data
    showTable()
    //showCards()
  }
  updateToken()
  console.log(playListFromSpoty);
                      ///////////////// FIN  DE  configuracion de api de Spoty
function showTable(){
  document.getElementById('playListTitulo').textContent = playListFromSpoty.name

  playListFromSpoty.tracks.items.forEach((cancion, index) => {
    const tr = document.createElement('tr')
    const tdImage = document.createElement('td')
    const image = document.createElement('img')
    const tdCancion = document.createElement('td')
    const tdArtis = document.createElement('td')
    const tdAlbum = document.createElement('td')
    const addButton = document.createElement('button')
    const player = document.createElement('audio')

    image.setAttribute('src', `${cancion.track.album.images[0].url}`)
    image.setAttribute('class', 'imageSize')

    tdCancion.textContent = cancion.track.name
    cancion.track.artists.forEach(artista =>{
      tdArtis.textContent = artista.name
  })

  tdAlbum.textContent = cancion.track.album.name

  addButton.setAttribute('onclick', `addSong(${index})`)
  addButton.textContent = "Add"
  addButton.setAttribute('class', 'clorButon')

  player.setAttribute('src', `${cancion.track.preview_url}`)
  player.setAttribute('controls','controls')

  tdImage.appendChild(image)

  tr.appendChild(tdImage)
  tr.appendChild(tdCancion)
  tr.appendChild(tdArtis)
  tr.appendChild(tdAlbum)
  tr.appendChild(addButton)
  tr.appendChild(player)


  document.getElementById('playlist-content').appendChild(tr)

  });
}

//FUNCIÓN QUE RELLENARA LA LISTA DE CANCIONES 
function addSong(indice){
  const newSong = playListFromSpoty.tracks.items[indice]
  if (existSong(newSong)){
    alert("La canción" + newSong.track.name + "ya existe")
  } else {
    playlistCustom.push(newSong)
    showplaylistCustom()
  }
}

function showplaylistCustom(){
  document.getElementById('playlist-content-fav').innerHTML = ''
  playlistCustom.forEach((cancion, index) =>{

    const tr = document.createElement('tr')
    const tdCancion = document.createElement('td')
    const tdAlbum = document.createElement('td')
    const tdArtis = document.createElement('td')
    const deleteButton = document.createElement('button')

    tdCancion.textContent = cancion.track.name
    cancion.track.artists.forEach(artista =>{
     tdArtis.textContent = artista.name
    })

    tdAlbum.textContent = cancion.track.album.name

    deleteButton.setAttribute('onclick', `deleteSong(${index})`)
    deleteButton.textContent = "Delete"
    deleteButton.setAttribute('class', 'colorButon')

    tr.appendChild(tdCancion)
    tr.appendChild(tdArtis)
    tr.appendChild(tdAlbum)
    tr.appendChild(deleteButton)

    document.getElementById('playlist-content-fav').appendChild(tr)

  })
}

function deleteSong(index){
  playlistCustom.splice(index,1)
  showplaylistCustom()
}

function existSong(song){
return playlistCustom.includes(song);
}