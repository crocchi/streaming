 const showMeMovie=(url)=>{

  let frame=document.getElementById('frame')
    document.getElementById('frame').src=url;
/*
    // Aggiungere un listener per l'evento di caricamento
frame.addEventListener('load', function() {
  console.log('Il frame è stato caricato correttamente!');
  // Puoi eseguire ulteriori azioni qui se necessario
});

// Aggiungere un listener per l'evento di errore (nel caso il caricamento fallisca)
frame.addEventListener('error', function(error) {
  console.error('Errore durante il caricamento del frame:', error);
  // Puoi gestire l'errore qui se necessario
});
*/
  }

const checkMeMovie=(url)=>{

    let frame = document.createElement('iframe');
   
      frame.src=url;

      frame.style='width:2px;height:2px';
   //  await sleep(5000)
  
      // Aggiungere un listener per l'evento di caricamento
  frame.addEventListener('load', function(event) {
    console.log('Il frame è stato caricato correttamente!');
    console.log(event);
    // Puoi eseguire ulteriori azioni qui se necessario
  });
  
  // Aggiungere un listener per l'evento di errore (nel caso il caricamento fallisca)
  frame.addEventListener('error', function(error) {
    console.error('Errore durante il caricamento del frame:', error);
    // Puoi gestire l'errore qui se necessario
  });

  document.body.appendChild(frame);
    }


  //INIZIALIZZA LA PAGINA
  let filmInfo="<form id='formSearch'><button id='btnSearch'>SEARCH: </button><textarea placeholder='@act Will Smith | @serietv | @gen azione' id='textArea' name='testo' rows='1' cols='44'></textarea></form><p id='infoFilm'> Film:</p>";
  document.write("<br><br><iframe id='frame' sandbox='allow-scripts' allowfullscreen></iframe><button id='nextEp'>NEXT EP</button><div class='barra'><button style='display:none' id='btnStop'>STOP SCAN</button><button id='btnStart'>START SCAN</button>"+filmInfo+"</div>");

  //<form><label for='testo'>Inser:</label><textarea id='testo' name='testo' rows='1' cols='44' onchange='eseguiFunzione(this.value)'></textarea>
  let cont=1;
  let createThumb=0;
  let maxThumb=50;
  let url=`https://streamingcommunity.cz/iframe/${cont}`
  let dataBH=[];
  optionApi={
    method: 'GET',
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiN2Q1YjkzYjk5MDZiOTA2MTI2YjlmZDJmMDMzNTk0OCIsInN1YiI6IjY1OGM4ZmYwMjIxYmE2N2ZiNmRiNGNjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DYgbqqt_fP4bLS0ocTljfGGGPzsG0Av3vqDyLLgddJ4',
      'Accept': 'application/json'
    }
  }
 
//CONTROLLA SE CE DB SU LOCALSTORAGE..ALTRIMENTI INIZIA IL CONTATORE DA 1...
/*
if(localStorage['CONT']){

    //databaseDB.openDatabase();
    cont=localStorage.getItem('CONT');
    url=`https://streamingcommunity.cz/iframe/${cont}`
    for (var i = 0; i < localStorage.length; i++){
        //se trova un array su localstorage nn suo,..lo skippa
        if(localStorage.getItem(localStorage.key(i)).length <= 40 ){continue}
        let xxx=JSON.parse(localStorage.getItem(localStorage.key(i)));
        //createMovie(xxx.film,xxx.linkHost);
        createMovieThumb(xxx.film,xxx.linkHost,xxx.poster_path,xxx.overview,xxx.genre_ids,xxx.id,xxx.release_date,xxx.cast,xxx.type, xxx.trailer );
        //inserisci in un array locale
        dataBH.push(xxx)
        //+databaseDB.insertDataShh(xxx);
    }

}else{ localStorage.setItem(`CONT`, cont);}
*/  

let timerInterval; //= setInterval(updateTimer, 10000);

const timer =(onnoff,timer=10000)=>{//true ,false
    
    if(onnoff){
        timerInterval = setInterval(updateTimer, 10000);
        btnStart.style='display:none';
        btnStop.style='';
        loggerStatus('Scansione Avviata...')
      } else{
         clearInterval(updateTimer, timer);
         clearInterval(timerInterval);
         btnStop.style='display:none';
         btnStart.style='';
         loggerStatus('Scansione Fermata...')
        }
      
}


const initPage = () => {
    let btnStart=document.getElementById('btnStart');
    let btnStop=document.getElementById('btnStop');
    let btnSearch=document.getElementById('btnSearch');
    let frmSearch=document.getElementById('formSearch');
    let textArea=document.getElementById('textArea');
    let nextEp=document.getElementById('nextEp');
    
    
    btnSearch.addEventListener('click', function(){
        searchMovieLocal();
      })

    nextEp.addEventListener('click', function(){
        nextShow();
      })

    textArea.addEventListener('input', function(){
        searchMovie(this.value);
      });

    textArea.addEventListener('change', function(){
        searchMovie(this.value);
      })

    frmSearch.addEventListener('submit', function(event){
        event.preventDefault();
      });

    btnStart.addEventListener('click', function(){
      timer(true);
    });

    btnStop.addEventListener('click', function(){
    timer(false)
    });

    window.addEventListener('scroll', function() {
        // Altezza dello scroll del client
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      
        // Altezza area Client total
        var clientHeight = document.documentElement.clientHeight;
      
        // Verifica se l'utente è sceso fino in fondo
        if (scrollTop + 930 >= clientHeight && scrollTop > 500  && dataBH.length > maxThumb+15) {
          console.log('Sei arrivato in fondo alla pagina!');
          loggerStatus('sto caricando altri film...');
          movieShowSize(10);
          // Puoi eseguire azioni specifiche qui quando l'utente è arrivato in fondo
        }
      });

  }

const updateTimer =async ()=> {
  //debugger
    cont=await dataDB.search('CONT');
    cont=cont.id
    url=`https://streamingcommunity.cz/iframe/${cont}`

    console.log(`provo con il seguente link [${url}]`);
    loggerStatus(`provo con il seguente link:[${url}] cont:[${cont}]`);
   
    boom(url)
    
    cont++
    dataDB.updateData({ film: "CONT" , id:cont })
    //localStorage.setItem(`CONT`, cont);
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
      let movideInfo=await getMovieInfo(titleValue,urlHack);
      //console.log(movideInfo)

      //funzione per trovare il link della serie tv
      /*
      url=https://streamingcommunity.cz/iframe/5301
      
fetch https://streamingcommunity.cz/iframe/5301
id:19092
fetch https://streamingcommunity.cz/watch/5301
<iframe src="https://streamingcommunity.cz/iframe/5301?episode_id=33658&amp;next_episode=1"></iframe>

https://streamingcommunity.cz/iframe/5301?episode_id=33658 ...33659..33660
 
      */

      let typeShow=movideInfo.type;
      let linkShowUrl;
      if(typeShow ==='tv'){
        typeShow='Serie Tv trovata';
        
        urlHack=await getLinkTvShow(cont);
        //await sleep(5000)
       
        }else{ 
            typeShow='Film trovato';
        }


      console.log(`${typeShow}: [${titleValue}]`);
      loggerStatus(`${typeShow}:[${titleValue}] TOT:[${dataDB.totalMovie}]`);
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
            10759:'Azione/avventura',
            10762:"Bambini",
            10763:"News",
            10764:"Reality",
            10765:"Sci-Fi & Fantasy",
            10766:"Soap",
            10767:"Talk",
            10768:"War & Politics",
            37: 'Western',
            10770: 'Tv Movie',
            11:'-'

        }];

      let genreMovie=[];
    for (var i = 0; i < movideInfo.genre_ids.length; i++){
        genreMovie.push(genre[0][movideInfo.genre_ids[i]] )
            
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
      "cast": movideInfo.cast ||=null,
      "type": movideInfo.type,
      "trailer":movideInfo.trailer

      }
      dataBH.push(movieObj);
    //createMovie(titleValue,urlHack);
    dataDB.createMovieThumb(movieObj)
    //INSERISCI DB LOCALSTORAGE
    dataDB.insertData(movieObj)
    dataDB.totMovieDb++;
    //localStorage.setItem(`[${cont}]-[${titleValue}]`, JSON.stringify(movieObj));
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
const getMovieInfo = async (nameMovie,url)=>{
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

fetch https://streamingcommunity.cz/iframe/5301
id:19092
fetch https://streamingcommunity.cz/watch/5301
<iframe src="https://streamingcommunity.cz/iframe/5301?episode_id=33658&amp;next_episode=1"></iframe>

https://streamingcommunity.cz/iframe/5301?episode_id=33658 ...33659..33660
  
fetch('https://api.themoviedb.org/3/movie/12445/credits?language=en-US', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
    */

  //fix**   RIMUOVI I TAG [SUB-ITA] 
  // ALTRIMENTI NON TROVA LE INFO DEI FILM...VIR NU POC..

  nameMovie= nameMovie.replace(/\[SUB-ITA\]/g, " ");
  nameMovie= nameMovie.replace(/\[SUB-ENG\]/g, " ");
  nameMovie= nameMovie.replace('SUB-ITA', " ");
  nameMovie= nameMovie.replace('SUB-ENG', " ");

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
const response = await fetch(urlWithParams,optionApi);
 
const movies = await response.json();

if(movies.results.length === 0){
    console.log("NO INFO RIGUARDO IL FILM...["+nameMovie+"]");
    console.log("CERCO DB SERIE TV...");
    //prova a cercare nelle serie tv
    let resultt=await getTvShowInfo(nameMovie);
    resultt.cast=await getCastByid(resultt.id,'tv');
    resultt.trailer= await getTrailer(resultt.id,'tv');
    resultt.type='tv';
    console.log(resultt)

    return resultt

}
//CONTROLLARE SE è EFFETTIVAMENTE IL TITOLO GIUSTO NELL API
//  nameMOvie
console.log(movies.results)//results[0]
if(movies.results.length > 0 ){ //cè più di 1 risultato
  for (var i = 0; i <movies.results.length; i++){
    //se il nome del film trovato === results api title
    if(movies.results[i].title===nameMovie){
      movies.results[0]=movies.results[i];
    }
  }

}
//let testing=await checkMeMovie(url);

movies.results[0].cast =await getCastByid(movies.results[0].id);
movies.results[0].trailer = await getTrailer(movies.results[0].id);
movies.results[0].type='movie';

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
const getCastByid = async (id,type='movie')=>{// type=tv(serie tv),movie(film)
//debugger
    //CAST API PER MOVIE
    let urlCast= `https://api.themoviedb.org/3/${type}/${id}/credits?language=it-IT`;

    /*  CAST API FOR SERIE TV
fetch('https://api.themoviedb.org/3/tv/ID MOVIE/credits', options)
.then(response => response.json())
.then(response => console.log(response))
.catch(err => console.error(err));
*/

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

const getTrailer = async (id,type='movie')=>{

    let urlCast=`https://api.themoviedb.org/3/${type}/${id}/videos?language=it-IT`;

      let response = await fetch(urlCast,optionApi);

      let trailer = await response.json();
      console.log(trailer)

      if(trailer.results.length === 0){ 
        //debugger
        console.log('NON TROVATO TRAILER ITA');
        urlCast=`https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`;
        response = await fetch(urlCast,optionApi);
        trailer = await response.json();
        console.dir(trailer);
        //se nn trova neanke trailer eng...
        if(trailer.results.length === 0){return false }
        }
        
      let youtubeKey=trailer.results[0].key ||= '';
      console.log(`https://www.youtube.com/watch?v=${youtubeKey}`);
      return `https://www.youtube.com/watch?v=${youtubeKey}` 


}

  

const cssInject = ()=>{

    var linkElement = document.createElement('link');

    // Imposta gli attributi dell'elemento link
    linkElement.rel = 'stylesheet';
     //hai rotto il cazzo cache!!!
    linkElement.href = 'https://latitanti.altervista.org/css.css?'+ new Date().getTime(); // Sostituisci con il percorso effettivo del tuo file CSS
   
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

    //if(movie.length < 2){ return undefined  }
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
    //debugger
    let tmp=[]
    let textSearchArea=document.querySelector("#textArea").value ;
  

    movie=textSearchArea.toLocaleUpperCase();
    //ricerca by actors
    if(movie.includes("@ACT")){
       let actor= movie.replace("@ACT ", "");
       searchMovieLocalByActor(actor);
       return
    }

     //ricerca by serie
     if(movie.includes("@SERIETV")){ //serie:
        //let actor= movie.replace("ACTORS:", "");
        searchMovieLocalByType('TV');
        return
     }

          //ricerca by genere
          if(movie.includes("@GEN")){ //serie:
            let gen= movie.replace("@GEN ", "");
            searchMovieLocalByGenre(gen);
            return
         }

    console.log('ricerca...'+textSearchArea)

   
      if(movie.length < 3){ return undefined  }
    for (var i = maxThumb; i < dataBH.length; i++){
       if( dataBH[i].film.toLocaleUpperCase().includes(movie) ) { tmp.push(dataBH[i]) }
    }
    console.log(tmp);
    maxThumb=maxThumb + tmp.length;
    tmp.forEach( (el,index)=>{ 
        //console.log(index)
        createMovieThumb(el.film,el.linkHost,el.poster_path,el.overview,el.genre_ids ,el.id ,el.release_date, el.cast, el.type, el.trailer)
    } )
}

const searchMovieLocalByActor=(actor)=>{
    //debugger
    let tmp=[]
//    let actors= actor.toLocaleUpperCase();
    for (var i = maxThumb; i < dataBH.length; i++){
        for (var z = 0; z < dataBH[i].cast.length; z++){
        if(dataBH[i].cast[z].toLocaleUpperCase().includes(actor)){ tmp.push(dataBH[i]); continue}
    }
        }

     maxThumb=maxThumb + tmp.length;
     tmp.forEach( (el)=>{ 
        
         createMovieThumb(el.film,el.linkHost,el.poster_path,el.overview,el.genre_ids ,el.id ,el.release_date, el.cast, el.type, el.trailer)
     } )
    
}

const searchMovieLocalByType=(type)=>{
    //debugger
    let tmp=[]
//    let actors= actor.toLocaleUpperCase();
    for (var i = maxThumb; i < dataBH.length; i++){       
            if(dataBH[i].type.toLocaleUpperCase().includes(type)){ tmp.push(dataBH[i]); continue}
        }
    
     maxThumb=maxThumb + tmp.length;
     tmp.forEach(async (el)=>{ 
        await sleep(400);
         createMovieThumb(el.film,el.linkHost,el.poster_path,el.overview,el.genre_ids ,el.id ,el.release_date, el.cast, el.type, el.trailer)
     } )
    
}

const searchMovieLocalByGenre=(genre)=>{
    //debugger
    let tmp=[]
//    let actors= actor.toLocaleUpperCase();
    for (var i = maxThumb; i < dataBH.length; i++){      
        for (var z = 0; z < dataBH[i].genre_ids.length; z++){

            if(dataBH[i].genre_ids[z].toLocaleUpperCase().includes(genre)){ tmp.push(dataBH[i]); continue}
        } 
    }
    
     maxThumb=maxThumb + tmp.length;
     tmp.forEach(async (el)=>{ 
        await sleep(400);
         createMovieThumb(el.film,el.linkHost,el.poster_path,el.overview,el.genre_ids ,el.id ,el.release_date, el.cast, el.type, el.trailer)
     } )
    
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

  const movieShowSize = (qnt=50)=>{
    //maxThumb=50;
    //debugger
    loggerStatus("Aggiunti ["+qnt+"] film. Tot Load Film:["+maxThumb+"] Tot Film DB:["+dataBH.length+"] ")
    let maxThumbBefore=maxThumb;
    maxThumb=maxThumb+qnt;//100
    for (var i = maxThumbBefore; i < maxThumb; i++){
        
        createMovieThumb(dataBH[i].film,dataBH[i].linkHost,dataBH[i].poster_path,dataBH[i].overview,dataBH[i].genre_ids, dataBH[i].id, dataBH[i].release_date, dataBH[i].cast, dataBH[i].type, dataBH[i].trailer)

    }
  }


const getLinkTvShow=async (iframeID)=>{

    let urlCast=`https://streamingcommunity.cz/watch/${iframeID-1}`;
    
    let iframe=document.createElement('iframe');
    iframe.src=urlCast;
    iframe.id=`${iframeID}`;
    iframe.style='width:2px;height:2px';
    document.body.appendChild(iframe);
    await sleep(5000)
    

  
        let srcCodeE=document.querySelectorAll("iframe")[1].contentDocument.querySelector('iframe').src;
        //console.log(srcCodeE);
        console.log(getParameterByName('episode_id',srcCodeE));
        iframe.remove();
        try{ var iframe2=document.getElementById(`${iframeID}`);

        var parentElement = iframe2.parentNode;
        parentElement.removeChild(iframe2);
        }catch (err){console.log(err)}finally{}
       
        //let urlShorLink=
        return srcCodeE 
    
    //https://streamingcommunity.cz/iframe/5301?episode_id=33658&next_episode=1
    //https://streamingcommunity.cz/iframe/5301?episode_id=33658&next_episode=1
   
}
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const nextShow = () => {
    //debugger
    let el=document.getElementById('frame').src;
    let episodeId= parseInt(getParameterByName('episode_id',el));
    //episodeId= 1+ episodeId;
   let stringTmpp= el.replace("https://streamingcommunity.cz/iframe/", "");
    let stringtmp=`?episode_id=${episodeId}&next_episode=1`;
    stringTmpp=stringTmpp.replace(stringtmp, "");
    let urlCast=`https://streamingcommunity.cz/iframe/${stringTmpp}?episode_id=${episodeId+1}&next_episode=1`;
    document.getElementById('frame').src=urlCast;
}

//CREAZIONE P2P CONNESSIONE ....P2P DATABASE BLOCHCHAIN .. ;;;)
let peer;
const p2p =async(id_P2p)=>{

    //INJECT PEERJS LIBRARY
    let element = document.createElement('script');
    element.src = 'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js';
    document.body.appendChild(element);

    peer=new Peer();

    //x tutti i client che si collegano al mio peer
    peer.on('connection', function(conn) {
        console.log(conn) 
        console.log('si è collegato un client al mio Peer id..'+conn.connectionId)
    
        // Receive messages
	    peer.on('data', function(data) {
            console.log('Received', data);
        });

    });

    //quando apro un peer nuovo
        peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);

      });

      //send msg
      //peer.send('help!')
      //var conn = peer.connect('dest-peer-id');

}


/*
const databaseManager = new IndexDB("CroFlix", "FIlm&Serie");
databaseManager.openDatabase()
  .then(() => {
    const data = { id: 1, name: "Prodotto A", price: 19.99 };

    for (var i = 0; i < 10; i++){
        if(localStorage.getItem(localStorage.key(i)).length <= 40 ){continue}
        let xxx=JSON.parse(localStorage.getItem(localStorage.key(i)));
        databaseManager.insertData(data);
    }

    //return databaseManager.insertData(data);
  })
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.error(error);
  });
*/
// crea new db con tutti i film dell'array dataDB 
//databaseManager.refillIndexDB(multipleData);
/*
   // Utilizzo della classe
const databaseManager = new IndexDB("CroFlix", "Film&Serie");

const newData = { id: 4, name: "Prodotto D", price: 49.99 };

databaseManager.openDatabase()
  .then(() => {
    return databaseManager.insertData(newData);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
*/


//  const databaseManager = new IndexDB("CroFlix", "Film&Serie");
  
  //databaseManager.refillIndexDB(multipleData);
  

class Scrappy {
    response
    body
    constructor(url,movie){
        this.movie=movie
        this.fetchiamo(url)
       }

    set fullname(name){
        if (name.includes(' ')) this._fullName=name;
        else alert(`${name} is not a full Name!!`);
    }

    get fullName(){
        return this._fullName;
    }

    get page(){
        return this.virutalDom
    }
    async fetchiamo(url){
        this.response =await fetch(url)
        this.body = await this.response.text();
        this.domParse= new DOMParser();
        this.virutalDom= this.domParse.parseFromString(this.body,"text/html");
        return this.virutalDom
    }
}
    /*
const newProductsPagePromise = fetch('https://some-website.com/new-products');
const recommendedProductsPagePromise = fetch('https://some-website.com/recommended-products');

// Returns a promise that resolves to a list of the results
Promise.all([newProductsPagePromise, recommendedProductsPagePromise]); 
Conclusion */

class INDEX_DB {
    constructor(dbName =  "CroFlix", storeName = "Film&Serie", version = 1) {
      this.dbName = dbName;
      this.storeName = storeName;
      this.version = version;
      this.db = null;
      this.errorLOg = null;
      this.transaction = null;
      this.objectStore = null;
      //this.openDatabase()
      this._CONT=null;
      this.createdThumb=0;

    }

    openDatabase(callback=undefined) {

        const request = indexedDB.open(this.dbName, this.version);

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('database aperto con successo!')
            if (callback) { callback(); }
        };

        request.onerror = (event) => { throw new Error(`Errore nell'apertura del database: ${event.target.error}`);};

        //prima volta o upgrade versione db
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
    
            if (!db.objectStoreNames.contains(this.storeName)) {
              db.createObjectStore(this.storeName, { keyPath: "film" });//keyPath: "id"  -  autoIncrement: true
              
            }
          };
    }

    initDB() {
     return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('database aperto con successo!')
            resolve()
        };

        request.onerror = (event) => { reject(event.target.error); };

        //prima volta o upgrade versione db
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
    
            if (!db.objectStoreNames.contains(this.storeName)) {
              db.createObjectStore(this.storeName, { keyPath: "film" });//keyPath: "id"  -  autoIncrement: true
              
            }
            resolve()
          };
     })
    }
// return new Promise((resolve, reject) => {
    startTransaction(mode='readwrite'){
        this.transaction = this.db.transaction([this.storeName], mode);
        this.objectStore = this.transaction.objectStore(this.storeName);
    }

    insertData(data){ // data = {...}  o meglio [{}]
        this.startTransaction()

        const addRequest = this.objectStore.add(data);

        addRequest.onsuccess = () => {
            console.log("Dati aggiunti con successo");
          };
  
          addRequest.onerror = (event) => {
            console.log(`Errore nell'aggiunta dei dati: ${event.target.error}`);
          };
    }

    searchDataPromise(key) { // cerca by nome film key
    
        return new Promise((resolve, reject) => {
            this.startTransaction('readonly');
            const getRequest = this.objectStore.get(key);

            getRequest.onsuccess = function() {
                const oggettoTrovato = getRequest.result;
          
                if (oggettoTrovato) {
                  console.log('Oggetto trovato nel database:', oggettoTrovato);
                    resolve(oggettoTrovato)
              
                } else {
                  console.log('Oggetto non trovato nel database.');
                    reject(undefined)
 
                  }
                }
              });

        }

    searchData(key,callback=undefined) { // cerca by nome film key

        this.startTransaction('readonly')

          const getRequest = this.objectStore.get(key);
    
        
    getRequest.onsuccess = function() {
        const oggettoTrovato = getRequest.result;
  
        if (oggettoTrovato) {
          console.log('Oggetto trovato nel database:', oggettoTrovato);
          if (callback) { callback(oggettoTrovato); }
          return oggettoTrovato
        } else {
          console.log('Oggetto non trovato nel database.');
          if (callback) {
            callback(null);
            return undefined
          }
        }
      };
  
      getRequest.onerror = function() {
        console.error('Errore durante la ricerca dell\'oggetto:', getRequest.error);
        if (callback) {
          callback(null);
        }
      };
    };

    search(key) { // cerca by nome film key

    return new Promise((resolve, reject) => {
        this.startTransaction('readonly')

          const getRequest = this.objectStore.get(key);
    
        
    getRequest.onsuccess = function() {
        let oggettoTrovato = getRequest.result;
        if (oggettoTrovato) {
          console.log('Oggetto trovato nel database:', oggettoTrovato);
          resolve(oggettoTrovato)
        } else {
          console.log('Oggetto non trovato nel database.');
            resolve(false)
          }
        }
    
      
  
      getRequest.onerror = function() {
        console.error('Errore durante la ricerca dell\'oggetto:', getRequest.error);
        reject(false)
        }
    })
};


conf(key) { // cerca by nome film key

  return new Promise((resolve, reject) => {
      this.startTransaction('readonly')

        const getRequest = this.objectStore.get(key);
  
      
  getRequest.onsuccess = function() {
      let oggettoTrovato = getRequest.result;
      if (oggettoTrovato) {
        console.log('Oggetto trovato nel database:', oggettoTrovato);
        this._CONT=oggettoTrovato.id;
        resolve(oggettoTrovato.id)
      } else {
        console.log('Oggetto non trovato nel database.');
          resolve(false)
        }
      }
  
    

    getRequest.onerror = function() {
      console.error('Errore durante la ricerca dell\'oggetto:', getRequest.error);
      reject(false)
      }
  })
};

      async isKeyExists(key) {
    
            this.startTransaction()
    
          const getRequest = this.objectStore.get(key.film);
    
            getRequest.onsuccess = (event) => {
                const existingObject = event.target.result;

                if (!existingObject) {
                    this.startTransaction()
                    // L'oggetto non esiste ancora, puoi procedere con l'inserimento
                    const addRequest = this.objectStore.add(key);

                    addRequest.onsuccess = () => {
                      console.log('Oggetto inserito con successo nel database.');
                    };
            
                    addRequest.onerror = () => {
                      console.error('Errore durante l\'inserimento dell\'oggetto:', addRequest.error, key.film);
                    };
                }else {console.log('oggetto già esistente..'+existingObject)}

                //console.log(getRequest.result)
                //if(getRequest.result === undefined) return false // NN CI SN COPIE
              //return true
            };
    
            getRequest.onerror = (event) => {
                console.log(getRequest)
              console.log(`Errore nel recupero della chiave: ${event.target.error}`);
                
            };

      }
    
    async refillIndexDB(dataArray) { 
            for(let i=0;i < dataArray.length; i++){
                this.isKeyExists(dataArray[i])
                //if(!tmp){ continue }else {await this.insertData(dataArray[i])}
            }

          //await this.insertDataArray(dataArray); // Inserisci i dati multipli in un'unica transazione
          console.log('Inserimento dati da localStorage in IndexedDB completato!');
        
      }


    getFirst50Entries(callback) {
        const transaction = this.startTransaction('readonly');
        this.transaction = transaction;
    
        const objectStore = this.objectStore;
    
        const cursorRequest = objectStore.openCursor();
        let count = 0;
    
        cursorRequest.onsuccess = function (event) {
          const cursor = event.target.result;
          if (cursor && count < 50) {
            // Puoi gestire ogni voce del cursore qui
            console.log('Voce:', cursor.value);
            count++;
            cursor.continue();
          } else {
            // Tutte le voci sono state elaborate o raggiunto il limite di 50
            if (callback) {
              callback();
            }
          }
        };
    }

    getEntriesAndPrint(qnt=50,callback) {
        this.startTransaction('readonly');
    
        const cursorRequest = this.objectStore.openCursor();
        let count = 0;
    
        cursorRequest.onsuccess = function (event) {
          const cursor = event.target.result;
         
          //if(qnt>cursor.length){qnt=cursor.length}
          if (cursor && count < qnt) {
            // Puoi gestire ogni voce del cursore qui
            console.log('Voce:', cursor.value);
            if(cursor.value.film==="CONT"){ cursor.continue(); 
            }else{
              count++;
              console.log(event)
              dataDB.createMovieThumb(cursor.value);
              cursor.continue();
            }
            
          } else {
            // Tutte le voci sono state elaborate o raggiunto il limite di 50
            if (callback) {
              callback();
            }
          }
        };
    }

    createMovieThumb({film,linkHost,poster_path,overview,genre_ids,id,release_date,cast,type,trailer }){
       this.createdThumb++;
      try{
            let div=`<div class='postcard'><img src='${poster_path}' alt='Movie Poster'></img>`;
            let serieTvHtml= type==='tv' ? `<a class="seriefilm">SerieTv</a>` : ``;
            let postCard=`${serieTvHtml}<div class='postcard-content'><div class='title'>${film}</div><div class='description'>${overview}</div>`;
            let trailerHtml=trailer ? `<a href="${trailer}" target="new_blank" class="trailer">Trailer</a>` : ``; 
            let genere=`${trailerHtml}<div style='overflow-x:clip;' class='genre'>${genre_ids.join(',')}</div> <div style='font-size:x-small;color:burlywood'>Cast:${cast.join(',')}</div> <div class='genre'>${release_date}</div>`
            //let functionTVSHOW=
            let button=`<a id='${id}' href='#' class='button'>Guarda ora</a></div></div>`
        
            
            //creo variabili con codice html completo del div postcard
            let htmlVar=div+postCard+genere+button;
            //creo un nuovo object document con html della variabile
            let domPars= new DOMParser();
            let doc=domPars.parseFromString(htmlVar,'text/html');
            //estraggo elemento postcard dal doc
            let tmpPostcard=doc.querySelector('.postcard');
        
            //appendi elemento postcard al body...senza riscrivere di nuovo tutto gli el della pagina
            document.body.appendChild(tmpPostcard); 
        
            //let elTmp=document.getElementById('myspace')
           // document.querySelector("body").innerHTML+=div+postCard+genere+button;
          }catch(err){
            console.log(err)
          }finally{
            (document.getElementById(id)).addEventListener('click', function handleClick() {
        
                showMeMovie(linkHost);
              });
          }
    }
    updateData(updatedData) {
      this.startTransaction();
      // Aggiorna i dati nell'object store
      
      const updateRequest = this.objectStore.put(updatedData);
    }
    getLength(){
      return new Promise((resolve, reject) => {
      this.startTransaction();
      let conterL=this.objectStore.count()


      conterL.onsuccess = (event) => {
        const count = event.target.result;
        console.log(`Il numero totale di voci nel database è: ${count}`);
        this.totMovieDb=count;
        resolve(count);
      }
      conterL.onerror = (event) => {
        console.log(getRequest)
      console.log(`Errore : ${event.target.error}`);
        reject(false)
    };
     

  })
    }
    
//END CLASS KITEBIV
}



class Init extends INDEX_DB{
    
    _maxThumbPage=50
    totalMovie=0
    _dataBH=[]
    optionApi={
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiN2Q1YjkzYjk5MDZiOTA2MTI2YjlmZDJmMDMzNTk0OCIsInN1YiI6IjY1OGM4ZmYwMjIxYmE2N2ZiNmRiNGNjMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.DYgbqqt_fP4bLS0ocTljfGGGPzsG0Av3vqDyLLgddJ4',
        'Accept': 'application/json'
      }
    }

    constructor(CONT) {
      
      super()
      this.contatore=CONT;
    
    //createdThumb=this.createdThumb;
      
    this._url=`https://streamingcommunity.cz/iframe/${CONT}`;
    }

    start(qnt){
        super.getEntriesAndPrint(qnt)
    }// createMovieThumb(xxx.film,xxx.linkHost,xxx.poster_path,  xxx.overview,xxx.genre_ids,   xxx.id,    xxx.release_date,   xxx.cast,xxx.type, xxx.trailer );
    info(){
        console.log(this._url)
        if(this.contatore){

        }else {this.contatore=1}
    }
}
/*

    cro.searchDataPromise('CONT').then((objj) => {cro._CONT=objj.id;})
    .catch((err) => {
      console.log('CONTATORE NON AVVIATO o INIZA...',err);
      cro._CONT=1;
    })
*/

/*
let cro;
  function init() {
    debugger
    console.log('Inizio');
    cro=new INDEX_DB();
    cro.openDatabase(function a(){
        cro.searchData('CONT',function setCont(findObj){
            cro._CONT= findObj.id || 0;
            //qui abbiamo tutto quello che ci serve
            if(cro._CONT){

            }else cro._CONT=1
        })


    })
    console.log(cro)


    console.log('Fine');
  }*/

  let dataDB,user;
  const initApp =async ()=> {
    //debugger
    dataDB=new INDEX_DB();
    let f=await dataDB.initDB();
    await sleep(500)
    dataDB._CONT=await dataDB.conf('CONT');
    //se il db è nuovo
    if(!dataDB._CONT){
      dataDB.insertData({film:'CONT', id:1})
      dataDB.totMovieDb=0
      dataDB._CONT=1;
    }else { 
      //qnt film c sn..
      let cont=await dataDB.getLength();
      dataDB.totMovieDb=cont;
      //se sn più di 50..stampa a skermo sl 50
      if(cont>51){ dataDB.getEntriesAndPrint(50) }
      if(cont>5){ dataDB.getEntriesAndPrint(cont-1) }
     }
    user=new Init(dataDB._CONT);
   // user.info();
  //user.createdThumb=dataDB.createdThumb


  /*  if(dataDB._CONT){
        if(user.contatore>user._maxThumbPage){
            user.start(user._maxThumbPage)
        }else{dataDB.getEntriesAndPrint(user.contatore)}

    }else{dataDB._CONT=1;}
    */
    console.log(user,dataDB)
    console.log(dataDB.createdThumb)
  }




initPage();
initApp()
