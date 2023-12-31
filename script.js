
  const showMeMovie=(url)=>{
    document.getElementById('frame').src=url;
  }

  const createMovieThumb = async (nameMovie,url,posterUrl,movieOverview,genre,id,year='',cast=[])=>{

    if (createThumb >= maxThumb){ return }
    createThumb++
    let div=`<div id='${id}' class='postcard'><img src='${posterUrl}' alt='Movie Poster'></img>`;
    let postCard=`<div class='postcard-content'><div class='title'>${nameMovie}</div><div class='description'>${movieOverview}</div>`;
    let genere=`<div style='overflow-x:clip;' class='genre'>${genre.join(',')}</div> <div style='font-size:x-small;color:burlywood'>Cast:${cast.join(',')}</div> <div class='genre'>${year}</div>`
    let button=`<a onclick="showMeMovie('${url}')" href='#' class='button'>Guarda ora</a></div></div>`
    //create el p con nome film
    //let element = document.createElement('div');
    //element.innerHTML=div+postCard+button;

    //let elTmp=document.getElementById('myspace')
    document.querySelector("body").innerHTML+=div+postCard+genere+button;
   
    //timer attesa per nn intalliare la pagina con troppe richieste
    //let timerAttesa= await setTimeout(console.log(), 300);
  }

  //INIZIALIZZA LA PAGINA
  let filmInfo="<button onclick='searchMovieLocal()'>SEARCH: </button><textarea oninput='searchMovie(this.value)' id='textArea'rows='1' cols='25'></textarea><p id='infoFilm'> Film:</p>";
  document.write("<div style='display:grid;' id='myspace'></div><iframe id='frame' sandbox='allow-scripts' allowfullscreen></iframe><div class='barra'>Scan Movie: <button onclick='timer(false)'>STOP</button><button onclick='timer(true)'>START</button>"+filmInfo+"</div>");

  let cont=1;
  let createThumb=0;
  let maxThumb=50;
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
        createMovieThumb(xxx.film,xxx.linkHost,xxx.poster_path,xxx.overview,xxx.genre_ids,xxx.id,xxx.release_date,xxx.cast);
        //inserisci in un array locale
        dataBH.push(xxx)
    }

}else{ localStorage.setItem(`CONT`, cont);}
  

let timerInterval = setInterval(updateTimer, 7000);

const timer =(onnoff,timer=7000)=>{//true ,false
    
    if(onnoff){timerInterval = setInterval(updateTimer, timer);} else{ clearInterval(updateTimer, timer); clearInterval(timerInterval)}
    
}

function updateTimer() {
    
    console.log(`provo con il seguente link [${url}]`);
    loggerStatus(`provo con il seguente link:[${url}] cont:[${cont}]`);
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
      //console.log(movideInfo)

      console.log(`Film Trovato: [${titleValue}]`);
      loggerStatus(`Aggiungo Film:[${titleValue}] TOT:[${dataBH.length}]`);
      //console.log(`Film originale: [${movideInfo.original_title ||='DatiNonTrovati'}]`);
      
      //SE MANCA IMG POSTER ...METTE UNA DEFAULT
      movideInfo.poster_path ||= null;
      let posterUrl;
      if(!movideInfo.poster_path ){ posterUrl= `https://fcdn.ingenuitylite.com/themebuilder-assets/placeholders/image.jpeg`; }else{
                if(movideInfo.poster_path=== "https://fcdn.ingenuitylite.com/themebuilder-assets/placeholders/image.jpeg"){
                    posterUrl=movideInfo.poster_path
                }else{
                posterUrl= `https://image.tmdb.org/t/p/w200${movideInfo.poster_path}`;}
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
      'release_date': movideInfo.release_date ||= '-',
      'genre_ids':genreMovie ||= null,
      'original_title':movideInfo.original_title ||= titleValue,
      'poster_path': posterUrl ,
      "overview":movideInfo.overview ||= null,
      "popularity":movideInfo.popularity ||= null,
      "id":movideInfo.id ||= null,
      "cast": movideInfo.cast ||=null

      }
      dataBH.push(movieObj);
    //createMovie(titleValue,urlHack);
    createMovieThumb(titleValue,urlHack,posterUrl,movideInfo.overview,genreMovie,movideInfo.id, movideInfo.release_date, movideInfo.cast)
    //INSERISCI DB LOCALSTORAGE
    localStorage.setItem(`[${cont}]-[${titleValue}]`, JSON.stringify(movieObj));
    genreMovie=[];
    })
    .catch(error => {
      console.log('Link non esistente:', error);
      genreMovie=[];
    });
}

//https://vixcloud.co/embed/148611?
//&title=Grey%27s+Anatomy&referer=1&expires=1709141439
//&description=S1%3AE1+Quando+il+gioco+si+fa+duro&nextEpisode=1
function getParameterByName(name, url) {
    name = name.replace(/[[]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)" ),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

const checkParameterTvshow= (url)=>{
    tag='description'.replace(/[[]]/g, "\\$&");

    let regex = new RegExp("[?&]" + tag + "(=([^&#]*)|&|#|$)" );
    let results = regex.exec(url);
    console.log(decodeURIComponent(results[2].replace(/\+/g, " ")) );

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

//console.log(movies)


return movies

}


// chiamata api per prendere info film su themoviedv
const getMovieInfo = async (nameMovie)=>{
    let apiKey = 'B7d5b93b9906b906126b9fd2f0335948';
    let apiUrl = `https://api.themoviedb.org/3/search/movie`;
    //let name=nameMovie.replace(/ /g, '+');
    //  https://api.themoviedb.org/3/movie/12445/credits?language=it-IT'   --<<  X PRENDERE CAST TRAMITE ID
    //          api.themoviedb.org/3/search/movie?query=Black+Adam&include_adult=false&language=it-IT&page=1&api_key=B7d5b93b9906b906126b9fd2f0335948
    /*
   
    https://streamingcommunity.cz/watch/3187 
    https://streamingcommunity.cz/watch/1955?e=16962
    e episodio
    s stagione
                                        -5 -->da il nome al titolo della serie nel tab video di 
    https://streamingcommunity.cz/iframe/5?episode_id=156&next_episode=1
    https://streamingcommunity.cz/iframe/5?episode_id=157   <--next episodio

    watch sembra per le serie
    https://streamingcommunity.cz/watch/4323
    <iframe src="https://streamingcommunity.cz/iframe/4323?episode_id=25638  &amp;next_episode=1"></iframe>
    https://streamingcommunity.cz/watch/4323?episode_id=2563

fetch('https://api.themoviedb.org/3/movie/12445/credits?language=en-US', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
    */

  //fix**   RIMUOVI I TAG [SUB-ITA] 
  // ALTRIMENTI NON TROVA LE INFO DEI FILM...VIR NU POC..

  nameMovie= nameMovie.replace(/\[SUB-ITA\]/g, " ");

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
    console.log("NON TROVATE INFORMAZIONI RIGUARDO IL FILM...["+nameMovie)+"]";
    console.log("CERCO DB DELLE SERIE TV...");
    //prova a cercare nelle serie tv
    let resultt=await getTvShowInfo(nameMovie);
    resultt.cast=await getCastByid(resultt.id)
    resultt.trailer= await getTrailer(resultt.id)
    console.log(resultt)

    return resultt
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

console.log(movies.results[0])//results[0]
movies.results[0].cast =await getCastByid(movies.results[0].id);
movies.results[0].trailer = await getTrailer(movies.results[0].id);
return movies.results[0]

}

const getTvShowInfo = async (nameTv)=>{
    let apiKey = 'B7d5b93b9906b906126b9fd2f0335948';
    let apiUrl = `https://api.themoviedb.org/3/search/tv`;
//debugger
    const queryParameters = {
        query: nameTv,
        include_adult: false,
        language: 'it-IT',
        page: 1
    }

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

const tvShow = await response.json();
console.log(tvShow.results[0]);
return tvShow.results[0]

}
//chiamata api per prendere info cast da id
const getCastByid = async (id)=>{

    let urlCast= `https://api.themoviedb.org/3/movie/${id}/credits?language=it-IT`;

    let response = await fetch(urlCast,{
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiN2Q1YjkzYjk5MDZiOTA2MTI2YjlmZDJmMDMzNTk0OCIsInN1YiI6IjY1OGM4ZmYwMjIxYmE2N2ZiNmRiNGNjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DYgbqqt_fP4bLS0ocTljfGGGPzsG0Av3vqDyLLgddJ4',
          'Accept': 'application/json'
        }
      });
      const movieCast = await response.json();
      let arrayCast=[]
      for (var i = 0; i < movieCast.cast.length; i++){
        arrayCast.push(movieCast.cast[i].name)
      }
      if(arrayCast.length >= 5 ){ arrayCast.length=4 }
      if(arrayCast.length == 0 ){ arrayCast=[' '] }
      console.log("Cast:"+arrayCast.join(','));
      return arrayCast

}

const getTrailer = async (id,lang='it-IT',tryMe=0)=>{

    let urlCast=`https://api.themoviedb.org/3/movie/${id}/videos?language=${lang}`;

      let response = await fetch(urlCast,{
        method: 'GET',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiN2Q1YjkzYjk5MDZiOTA2MTI2YjlmZDJmMDMzNTk0OCIsInN1YiI6IjY1OGM4ZmYwMjIxYmE2N2ZiNmRiNGNjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DYgbqqt_fP4bLS0ocTljfGGGPzsG0Av3vqDyLLgddJ4',
          'Accept': 'application/json'
        }
      });

      let trailer = await response.json();
      console.log(trailer)

      if(trailer.results.length === 0 && !tryMe ){ 
        //debugger
        console.log('NON TROVATO TRAILER ITA');
        let youtubeKey= await getTrailer(id,'en-US',1);
        return youtubeKey
        //qui ce un bug.. se nn trova nessun trailer ,neanke eng 
        }
        
      let youtubeKey=trailer.results[0].key ||= '';
      console.log(`https://www.youtube.com/watch?v=${youtubeKey}`);
      return youtubeKey 

/*
{
  "id": 274,
  "results": [
    {
      "iso_639_1": "it",
      "iso_3166_1": "IT",
      "name": "Il Silenzio degli Innocenti - Trailer italiano",
      "key": "4vNGPXphCAo",
      "published_at": "2012-06-10T09:43:36.000Z",
      "site": "YouTube",
      "size": 720,
      "type": "Trailer",
      "official": false,
      "id": "5b2a3e67c3a36855f8005469"
    }
  ]https://www.youtube.com/watch?v=kCpWGT6L3bY
}
*/
}

  

const cssInject = ()=>{

    var linkElement = document.createElement('link');

    // Imposta gli attributi dell'elemento link
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://latitanti.altervista.org/grafica.css'; // Sostituisci con il percorso effettivo del tuo file CSS
    
    // Aggiungi l'elemento link all'head del documento
    document.head.appendChild(linkElement);
}
cssInject();

const loggerStatus = (msg)=>{
    document.getElementById("infoFilm").textContent=msg;
}

const fixLocalJsExt=()=>{

    if(typeof loggerStatus === undefined){ 
    let element = document.createElement('script');
    element.src = 'https://latitanti.altervista.org/service-worker.js';
    document.body.appendChild(element);

    //INJECT THE SCRIPT
    document.write("<html><head></head><body>Aspettare che carichi...<script src='https://latitanti.altervista.org/service-worker.js'></script></body></html>")
    }
}

// cerca film nella pagina 
const searchMovie=(movie)=>{

    //let dataBB=dataBH;
    let data=document.querySelectorAll(".postcard");
    let searchMovie=movie.toLocaleUpperCase();
    for (var i = 0; i < data.length; i++){
        //se nn trovi la stringa ...nascondi elemento
        if(!(document.querySelectorAll(".postcard")[i].textContent).toLocaleUpperCase().includes(searchMovie)){
            document.querySelectorAll(".postcard")[i].style='display:none';
        }else {document.querySelectorAll(".postcard")[i].style='';}
        
    }


}

//cerca movie nell array dataBH
const searchMovieLocal=(movie)=>{
    let tmp=[]
    let textSearchArea=document.querySelector("#textArea").value ;

    console.log('ricerca...'+textSearchArea)
    movie=textSearchArea.toLocaleUpperCase();
    if(movie.length < 3){ return undefined  }
    for (var i = maxThumb; i < dataBH.length; i++){
       if( dataBH[i].film.toLocaleUpperCase().includes(movie) ) { tmp.push(dataBH[i]) }
    }
    console.log(tmp);
    maxThumb=maxThumb + tmp.length;
    tmp.forEach( (el,index)=>{ 
        //console.log(index)
        createMovieThumb(el.film,el.linkHost,el.poster_path,el.overview,el.genre_ids ,el.id ,el.release_date, el.cast)
    } )
    //createMovieThumb(titleValue,urlHack,posterUrl,movideInfo.overview,genreMovie,movideInfo.id,movideInfo.release_date)
}

const searchMovieLocalById=(id)=>{
    let tmp=[]

    console.log('ricerca by id:'+id)
   
    for (var i = 0; i < dataBH.length; i++){
       if( dataBH[i].id === id ) { tmp.push(dataBH[i]) }
    }
    console.log(tmp);
    
}

const searchMovieLocalByName=(movie)=>{
    let tmp=[]
    movie=movie.toLocaleUpperCase();
    console.log('ricerca by id:'+movie)
   
    for (var i = 0; i < dataBH.length; i++){
       if( dataBH[i].film.toLocaleUpperCase().includes(movie) ) { tmp.push(dataBH[i]) }
    }
    console.log(tmp);
    
}


window.addEventListener('scroll', function() {
    // Altezza dello scroll del
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  
    // Altezza area Client total
    var clientHeight = document.documentElement.clientHeight;
  
    // Verifica se l'utente è sceso fino in fondo
    if (scrollTop + 930 >= clientHeight && scrollTop > 500  && dataBH.length > maxThumb+25) {
      console.log('Sei arrivato in fondo alla pagina!');
      movieShowSize(25);
      // Puoi eseguire azioni specifiche qui quando l'utente è arrivato in fondo
    }
  });

  const movieShowSize = (qnt=50)=>{
    //maxThumb=50;
    //debugger
    loggerStatus("Aggiunti ["+qnt+"] film. Tot Load Film:["+maxThumb+"] Tot Film DB:["+dataBH.length+"] ")
    let maxThumbBefore=maxThumb;
    maxThumb=maxThumb+qnt;//100
    for (var i = maxThumbBefore; i < maxThumb; i++){
        
        createMovieThumb(dataBH[i].film,dataBH[i].linkHost,dataBH[i].poster_path,dataBH[i].overview,dataBH[i].genre_ids, dataBH[i].id, dataBH[i].release_date, dataBH[i].cast)

    }
  }

   
