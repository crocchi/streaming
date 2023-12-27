

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
  document.write("<div style='display:grid;height:60vh;overflow-y:auto;margin-bottom:5vh;' id='myspace'></div><iframe style='height: 35vh;width:80vw;max-width:500px;margin:2vw;' id='frame' sandbox='allow-scripts' allowfullscreen></iframe><button onclick='clearInterval(timerInterval)'>STOP</button>")

  let cont=1;
  let url=`https://streamingcommunity.cz/iframe/${cont}`
  let dataBH=[];
 

if(localStorage['CONT']){
    cont=localStorage.getItem('CONT');
    url=`https://streamingcommunity.cz/iframe/${cont}`
    for (var i = 0; i < localStorage.length; i++){
        //se trova un array su localstorage nn suo,..lo skippa
        if(localStorage.getItem(localStorage.key(i)).length <= 40 ){continue}
        let xxx=JSON.parse(localStorage.getItem(localStorage.key(i)));
        createMovie(xxx.film,xxx.linkHost,)
    }

}else{ localStorage.setItem(`CONT`, cont);}
  

var timerInterval = setInterval(updateTimer, 7000);

function updateTimer() {
    
    console.log(`provo con il seguente link [${url}]`);
    url=`https://streamingcommunity.cz/iframe/${cont}`
    boom(url)
    cont++;
    localStorage.setItem(`CONT`, cont);
  }

const boom =(url)=>{
    //window.location.href = url;
    fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore nella richiesta');
      }
      //console.log(response)

      return response.text();
    })
    .then(data => {
      // Manipola i dati come necessario
      //console.log(data);
      //debugger
      let domPars= new DOMParser();
      let doc=domPars.parseFromString(data,'text/html')
     //console.log(doc.all[7].src)
      let urlHack=doc.all[7].src;

      /*
      //debugger
      try{
      fetch(urlHack, { method: 'HEAD' }).then(resp => {
          if (!resp.ok) {
            console.log('Link Host RImosso')
       // throw new Error('Link Host RImosso');
        //return null
      }
      console.dir('LInk HOst OK')
      console.log(resp.status)
      })
    } catch (err){
        console.log('errore:'+err)
        console.log('status:'+resp.status)
    }
    http://www.omdbapi.com/?t=prova+a+prendermi&apikey=f9fe2473
    */
      
      var titleValue = getParameterByName("title", urlHack);
      let movideInfo=getMovideInfo(titleValue);

      console.log(`Film Trovato: [${titleValue}]`);
      let movieObj={ 'film': titleValue ,
      'linkHost': urlHack,
      'linkWeb': url
      }
      dataBH.push(movieObj);
    createMovie(titleValue,urlHack);
    //INSERISCI DB LOCALSTORAGE
    localStorage.setItem(`[${cont}]-[${titleValue}]`, JSON.stringify(movieObj));
    })
    .catch(error => {
      console.error('Errore:', error);
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

const getMovideInfo =(nameMovie)=>{
    var apiKey = 'f9fe2473';
    let name=nameMovie.replace(/ /g, '+');
    var apiUrl = `https://www.omdbapi.com/?t=${name}&apikey=${apiKey}`;

    fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore nella richiesta');
      }
      //console.log(response)

      return response.text();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Errore:', error);
      });

}
  
  // add the text node to the newly created div

  // add the newly created element and its content into the DOM
