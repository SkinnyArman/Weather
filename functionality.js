


let weatherApiKey="c6d1edf6d82c3c6d89ece6bc4b3d88dc";
let weatherBaseEndpoint="https://api.openweathermap.org/data/2.5/weather?units=metric&appid="+weatherApiKey;
let foreCastBaseEndpoint="https://api.openweathermap.org/data/2.5/forecast?units=metric&appid="+weatherApiKey;



let getCityByName = async (city) => {
    splitCity=city.split(",");
    let correctedCity;

    if (splitCity.length>2){
        splitCity[1]=splitCity[2];
        splitCity.pop();
        correctedCity =splitCity.join(",");
        ;}
    else{
        correctedCity=splitCity[0];
    }

        let EndPoint= weatherBaseEndpoint+"&q="+correctedCity;
        let response= await fetch(EndPoint);
        if ( response.status !==200){
            alert('City not found!')
        }
        let theresult=await response.json();
        desc= theresult.weather[0].description.split(" ");

        return (theresult)
}
let getForecastById = async (id) => {
        let EndPoint = foreCastBaseEndpoint +"&id=" + id;
        let result = await fetch(EndPoint);
        let forecast= await result.json();
        let forecastList=forecast.list;
        let daily=[];
        for (let i=0;i<forecastList.length;i+=8) {
            daily.push(forecastList[i])
        }
        daily.shift();
        return (daily)
}


let city=document.querySelector(".city");
let day=document.querySelector(".day");
let humidity=document.querySelector(".humidity");
let direction=document.querySelector(".direction");
let ap=document.querySelector(".airPressure");
let temp=document.querySelector(".rigtText");
let searcher=document.querySelector(".searchBar");
let cards=document.querySelectorAll(".articlearticle");
let temps=document.querySelectorAll(".articlearticle span")
let icons=document.querySelectorAll(".imeg");
let daysHeader=document.querySelectorAll(".weather__forecast__day");
let mainpicture=document.querySelector(".mainpic img");
let smallDevicestemp=document.querySelector(".tempSmallDevices")
let cityBaseEndpoint ="https://api.teleport.org/api/cities/?search=";
let forecastDays=[];

let thunderstorm=[200,201,202,210,211,212,221,230,231,232]
let scattered=[802]
let shower=[520,521,522,531,310,312,313,314,321]
let rain=[500,501,502,503,504,511,300,301,302]
let snow=[600,601,602,611,612,613,615,616,620,621,622]
let clear=[800]
let brokenclouds=[803, 804]
let fewclouds=[801]
let mist=[701,711,721,731,741,751,761,762,771,781]

let weatherForCity = async (city) =>{
    let arman= await getCityByName(city);
    forecastDays=[];
    cityID=arman.id;
    let roxana= await getForecastById(cityID);
    cityUpdater(arman);
    forecastUpdater(roxana);
}

let init = (inp) => {
    weatherForCity("Tehran, Tehrān, Iran").then(()=>{document.body.style.filter="blur(0)"})
}
init();

searcher.addEventListener("keydown",async(e)=>{
    if (e.keyCode===13){
        weatherForCity(searcher.value);
        }
        })
       

    


let cityUpdater = (data) => {
    city.textContent= data.name +', '+data.sys.country;
    desc=data.weather[0].description.split(" ");
    let datanNumber=data.weather[0].id;
    

    if (thunderstorm.indexOf(datanNumber) > -1 ){
        mainpicture.src="thunderstorm.png"
    } else if (scattered.indexOf(datanNumber) > -1 ){
        mainpicture.src="scattered-clouds.png"
    } else if (shower.indexOf(datanNumber) > -1 ){
        mainpicture.src="shower-rain.png"
    } else if (rain.indexOf(datanNumber) > -1 ) {
        mainpicture.src="rain.png"
    }  else if (clear.indexOf(datanNumber) > -1 ) {
        mainpicture.src="clear.png"
    }
    else if (snow.indexOf(datanNumber) > -1 ) {
        mainpicture.src="snow.png"
    }
    else if (mist.indexOf(datanNumber) > -1 ) {
        mainpicture.src="mist.png"
    }else if (brokenclouds.indexOf(datanNumber) > -1 ) {
        mainpicture.src="broken-clouds.png"
    } else if (fewclouds.indexOf(datanNumber) > -1 ) {
        mainpicture.src="few-clouds.png"
    } 


    humidity.innerHTML='<i class="fas fa-tint"></i> '+data.main.humidity+'%';
    let thetemp;
    if (data.main.temp>=0){
        thetemp="+"+Math.round(data.main.temp);
    } else {
        thetemp=Math.round(data.main.temp);
    }
    temp.textContent=thetemp+'C';
    smallDevicestemp.innerHTML='<i class="fas fa-thermometer-three-quarters"></i> ' +thetemp +' C';
    ap.innerHTML='<i class="fas fa-fan"></i> '+data.main.pressure+' hPa';
    theWeekday=new Date().toLocaleDateString('en-EN',{'weekday':'long'});
    
    day.textContent=theWeekday;
    windSpeed=data.wind.speed;
    windDeg=data.wind.deg;
    let windDirection;
    if (windDeg>45 && windDeg <= 135){
        windDirection='East';
    } else  if (windDeg>135 && windDeg <=225 ){
        windDirection='South';
    } else if (windDeg> 225 && windDeg <= 315){
        windDirection='North';
    } else{
        windDirection='West';}
    direction.innerHTML='<i class="fas fa-wind"></i> '+windDirection+', '+windSpeed;
    }

    searcher.addEventListener('input', async() => {
        let endpoint = cityBaseEndpoint + searcher.value;
        let result = await ((await fetch(endpoint)).json());
        let cities = result._embedded['city:search-results'];
        document.getElementById("suggestions").innerHTML='';
        if (cities.length > 5){
            for (i=0;i<5;i++){
                let suggestedCities = cities[i].matching_full_name;
                let option= document.createElement("option");
                option.value=suggestedCities;
                document.getElementById("suggestions").appendChild(option);
            }
        }
    });
    
let forecastUpdater= (forecast) => {
    
    for (let i=0;i<forecast.length;i++){
        temps[i].innerHTML=Math.floor(forecast[i].main.temp);
        icons[i].setAttribute("src",'http://openweathermap.org/img/wn/'+forecast[i].weather[0].icon+'@2x.png');
    }
    forecast.forEach((item) =>{
        forecastDays.push (new Date(item.dt*1000).toLocaleDateString('en-EN',{'weekday':'long'}));

    });
    for (j=0;j<forecast.length;j++){
        daysHeader[j].textContent=forecastDays[j];
    }
}