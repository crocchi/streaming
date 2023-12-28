
/*
const createMovie =(nameMovie,url)=>{

    //create el p con nome film
    let element = document.createElement('a');
    let newContent = document.createTextNode(nameMovie);
    element.appendChild(newContent);
    //element.onclick="clickMe('"+url+"')";
    element.addEventListener('click', function handleClick() {
        document.getElementById('frame').src=url;
      });

    let elTmp=document.getElementById('myspace')
    elTmp.appendChild(element);

  }
  */

  const showMeMovie=(url)=>{
    document.getElementById('frame').src=url;
  }

  const createMovieThumb =(nameMovie,url,posterUrl,movieOverview,genre)=>{

    let div=`<div class='postcard'><img src='${posterUrl}' alt='Movie Poster'></img>`;
    let postCard=`<div class='postcard-content'><div class='title'>${nameMovie}</div><div class='description'>${movieOverview}</div>`;
    let genere=`<div class="genre">${genre.join(",")}</div>`
    let button=`<a onclick="showMeMovie('${url}')" href='#' class='button'>Guarda ora</a></div></div>`
    //create el p con nome film
    //let element = document.createElement('div');
    //element.innerHTML=div+postCard+button;

    //let elTmp=document.getElementById('myspace')
    document.querySelector("body").innerHTML+=div+postCard+genere+button;

  }

  //INIZIALIZZA LA PAGINA
  document.write("<div style='display:grid;' id='myspace'></div><iframe id='frame' sandbox='allow-scripts' allowfullscreen></iframe><button onclick='clearInterval(timerInterval)'>STOP</button><button onclick='setInterval(updateTimer, 7000)'>START</button>");

  let cont=1;
  let url=`https://streamingcommunity.cz/iframe/${cont}`
  let dataBH=[];
 
//CONTROLLA SE CE DB SU LOCALSTORAGE..ALTRIMENTI INIZIA IL CONTATORE DA 1...
if(localStorage['CONT']){
    
    cont=localStorage.getItem('CONT');
    url=`https://streamingcommunity.cz/iframe/${cont}`
    for (var i = 0; i < localStorage.length; i++){
        //se trova un array su localstorage nn suo,..lo skippa
        if(localStorage.getItem(localStorage.key(i)).length <= 40 ){continue}
        let xxx=JSON.parse(localStorage.getItem(localStorage.key(i)));
        //createMovie(xxx.film,xxx.linkHost);
        createMovieThumb(xxx.film,xxx.linkHost,xxx.poster_path,xxx.overview,xxx.genre_ids)
    }

}else{ localStorage.setItem(`CONT`, cont);}
  

let timerInterval = setInterval(updateTimer, 7000);

function updateTimer() {
    
    console.log(`provo con il seguente link [${url}]`);
    url=`https://streamingcommunity.cz/iframe/${cont}`
    boom(url)
    
    cont++;
    localStorage.setItem(`CONT`, cont);
  }

const boom =async (url)=>{
    //window.location.href = url;
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore nella richiesta');
      }
      //console.log(response)

       return response.text();
    })
    .then(async data => {
      // Manipola i dati come necessario
      //console.log(data);
      //RICEVE UN JSON CON HTML--PARSE JSON PAGE HTML IN DOC
      let domPars= new DOMParser();
      let doc=domPars.parseFromString(data,'text/html')
     //console.log(doc.all[7].src)
      let urlHack=doc.all[7].src;

      
      var titleValue = getParameterByName("title", urlHack);
      let movideInfo=await getMovieInfo(titleValue);
      console.log(movideInfo)

      console.log(`Film Trovato: [${titleValue}]`);
      //console.log(`Film originale: [${movideInfo.original_title ||='DatiNonTrovati'}]`);
      
      //SE MANCA IMG POSTER ...METTE UNA DEFAULT
      movideInfo.poster_path ||= null;
      let posterUrl;
      if(!movideInfo.poster_path ){ posterUrl= `https://fcdn.ingenuitylite.com/themebuilder-assets/placeholders/image.jpeg`; }else{
                    posterUrl= `https://image.tmdb.org/t/p/w200${movideInfo.poster_path}`
      }

      //CONFIGURAZIONE GENERE
      let genre=[
        {
            28: 'Azione',
            12: 'Avventura',
            16: 'Animazione',
            35: 'Commedia',
            80: 'Crime',
            99: 'Doc',
            10751: 'Family',
            18: 'Dramma',
            14:'Fantasia',
            27:'Horror',
            36:'Storia',
            10402: 'Musica',
            9648: 'Mistero',
            10749: 'Romantico',
            878: 'Scienza',
            53: 'Thriller',
            10752: 'Guerra',
            37: 'Western',
            10770: 'Tv Movie',
            11:'-'

        }]
      let genreMovie=[];
    for (var i = 0; i < movideInfo.genre_ids.length; i++){
        genreMovie.push(genre[0][movideInfo.genre_ids[i]])
            
    }


      let movieObj={ 'film': titleValue ,
      'linkHost': urlHack,
      'linkWeb': url,
      'genre_ids':genreMovie ||= null,
      'original_title':movideInfo.original_title ||= titleValue,
      'poster_path': posterUrl ,
      "overview":movideInfo.overview ||= null,
      "popularity":movideInfo.popularity ||= null,
      "id":movideInfo.id ||= null

      }
      dataBH.push(movieObj);
    //createMovie(titleValue,urlHack);
    createMovieThumb(titleValue,urlHack,posterUrl,movideInfo.overview,genreMovie)
    //INSERISCI DB LOCALSTORAGE
    localStorage.setItem(`[${cont}]-[${titleValue}]`, JSON.stringify(movieObj));
    genreMovie=[];
    })
    .catch(error => {
      console.log('Link non esistente:', error);
      genreMovie=[];
    });
}

function getParameterByName(name, url) {
    name = name.replace(/[[]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }



  const clickMe =(src)=>{
    document.getElementById('frame').src=src;

}

const getMovideInfo = async (nameMovie)=>{
    var apiKey = 'f9fe2473';
    let name=nameMovie.replace(/ /g, '+');
    var apiUrl = `https://www.omdbapi.com/?t=${name}&apikey=${apiKey}`;
const response = await fetch(apiUrl);
const movies = await response.json();

console.log(movies)


return movies

}


const getMovieInfo = async (nameMovie)=>{
    let apiKey = 'B7d5b93b9906b906126b9fd2f0335948';
    let apiUrl = `https://api.themoviedb.org/3/search/movie`;
    //let name=nameMovie.replace(/ /g, '+');

    const queryParameters = {
      query: nameMovie,
      include_adult: false,
      language: 'it-IT',
      page: 1
    }

    // Costruisci l'URL completo con i parametri della query
const urlWithParams = new URL(apiUrl);
        urlWithParams.search = new URLSearchParams({
        ...queryParameters,
        api_key: apiKey
});
const response = await fetch(urlWithParams,{
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiN2Q1YjkzYjk5MDZiOTA2MTI2YjlmZDJmMDMzNTk0OCIsInN1YiI6IjY1OGM4ZmYwMjIxYmE2N2ZiNmRiNGNjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DYgbqqt_fP4bLS0ocTljfGGGPzsG0Av3vqDyLLgddJ4',
      'Accept': 'application/json'
    }
  });
 
const movies = await response.json();

if(movies.results.length === 0){
    console.log("NON TROVATE INFORMAZIONI RIGUARDO IL FILM...");
   let objj={
     film:nameMovie,
    genre_ids:[11],
    id:324552,
    original_title: nameMovie,
    overview:"No Info...",
    poster_path : "https://fcdn.ingenuitylite.com/themebuilder-assets/placeholders/image.jpeg"
   }
   return objj
}

//console.log(movies.results)//results[0]

return movies.results[0]

}
  

const cssInject = ()=>{

    var linkElement = document.createElement('link');

    // Imposta gli attributi dell'elemento link
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://latitanti.altervista.org/xx.css'; // Sostituisci con il percorso effettivo del tuo file CSS
    
    // Aggiungi l'elemento link all'head del documento
    document.head.appendChild(linkElement);
}
cssInject();
