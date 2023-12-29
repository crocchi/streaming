
/*
const createMovie =(nameMovie,url)=>{

    //create el p con nome film
    let element = document.createElement('script');
    let newContent = document.createTextNode(nameMovie);
    element.appendChild(newContent);
    //element.onclick="clickMe('"+url+"')";
    element.addEventListener('click', function handleClick() {
        document.getElementById('frame').src=url;
      });

    let elTmp=document.getElementById('myspace')
    elTmp.appendChild(element);

     let element = document.createElement('script');
    element.src = 'https://latitanti.altervista.org/service-worker.js';
    document.body.appendChild(element);

  }
  */

  const showMeMovie=(url)=>{
    document.getElementById('frame').src=url;
  }

  const createMovieThumb = async (nameMovie,url,posterUrl,movieOverview,genre,id,year)=>{

    if (createThumb >= maxThumb){ return }
    createThumb++
    let div=`<div id='${id}' class='postcard'><img src='${posterUrl}' alt='Movie Poster'></img>`;
    let postCard=`<div class='postcard-content'><div class='title'>${nameMovie}</div><div class='description'>${movieOverview}</div>`;
    let genere=`<div class='genre'>${genre.join(',')}</div> <div class='genre'>${year}</div>`
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
        createMovieThumb(xxx.film,xxx.linkHost,xxx.poster_path,xxx.overview,xxx.genre_ids,xxx.id,xxx.release_date);
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
      console.log(movideInfo)

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
      'release_date': movideInfo.release_date ||= null,
      'genre_ids':genreMovie ||= null,
      'original_title':movideInfo.original_title ||= titleValue,
      'poster_path': posterUrl ,
      "overview":movideInfo.overview ||= null,
      "popularity":movideInfo.popularity ||= null,
      "id":movideInfo.id ||= null

      }
      dataBH.push(movieObj);
    //createMovie(titleValue,urlHack);
    createMovieThumb(titleValue,urlHack,posterUrl,movideInfo.overview,genreMovie,movideInfo.id,movideInfo.release_date)
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

console.log(movies.results[0])//results[0]

return movies.results[0]

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

const searchMovieLocal=(movie)=>{
    let tmp=[]
    let textSearchArea=document.querySelector("#textArea").value ;

    console.log('ricerca...'+textSearchArea)
    movie=textSearchArea.toLocaleUpperCase();
    if(movie.length < 5){ return undefined  }
    for (var i = maxThumb; i < dataBH.length; i++){
       if( dataBH[i].film.toLocaleUpperCase().includes(movie) ) { tmp.push(dataBH[i]) }
    }
    console.log(tmp);
    maxThumb=maxThumb + tmp.length;
    tmp.forEach( (el,index)=>{ 
        //console.log(index)
        createMovieThumb(el.film,el.linkHost,el.poster_path,el.overview,el.genre_ids ,el.id ,el.release_date)
    } )
    //createMovieThumb(titleValue,urlHack,posterUrl,movideInfo.overview,genreMovie,movideInfo.id,movideInfo.release_date)
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
        
        createMovieThumb(dataBH[i].film,dataBH[i].linkHost,dataBH[i].poster_path,dataBH[i].overview,dataBH[i].genre_ids, dataBH[i].id, dataBH[i].release_date)

    }
  }



/* object movie

  film:"Sausage Party - Vita segreta di una salsiccia"
genre_ids: (4) ['Avventura', 'Animazione', 'Commedia', 'Fantasia']
id:223702
linkHost: "https://vixcloud.co/embed/37931?token=cb470f6ea74cef8fb27201638479ad0e&title=Sausage+Party+-+Vita+segreta+di+una+salsiccia&referer=1&expires=1708968114"
linkWeb: "https://streamingcommunity.cz/iframe/268"
original_title
: "Sausage Party"
overview: "Frank, una salsiccia innamorata del panino Brenda, è convinto che dopo essere stato acquistato dallo scaffale del supermercato in cui è in bella mostra lo attenda un futuro paradisiaco. Scoprirà che la realtà è ben diversa, imbarcandosi in una missione per scoprire cosa lo attende effettivamente."
popularity: 47.319
poster_path: "https://image.tmdb.org/t/p/w200/9OxYTjICTAXspQXI3pAqFAGEmLN.jpg"

https://www.youtube.com/results?search_query=trailer+kung+fu+panda+4

*/
