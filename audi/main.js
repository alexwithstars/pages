"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

async function registerServiceWorker(){
    await navigator.serviceWorker.register("serviceWorker.js")
}
registerServiceWorker()

const back = qs(".header-back") // primer fondo

// script para retirar la pantalla de carga
async function removeLoad(){
    await new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },1000)
        let img = new Image()
        img.src='assets/images/media/background/headlights.webp'
        img.addEventListener("load",()=>{
            back.style.backgroundImage=`linear-gradient(90deg,#111,transparent,#111), url(${img.src})`
            resolve()
        })
    })
    let loadScreen = qs(".load-screen")
    loadScreen.classList.add("fadeout")
    setTimeout(()=>{
        loadScreen.classList.replace("fadeout","done")
        document.querySelector(".text-loading").classList.remove("text-loading")
    },1000)
}
removeLoad()


// script para obtener el tema de la pagina
const color = window.matchMedia('(prefers-color-scheme:dark)')
document.body.classList.add((color.matches ? "dark-mode" : "bright-mode"))

//script para cambiar la opacidad de la barra de navegacion
const navbar = qs(".navbar") // barra de navegacion
const ref = qs(".first-glance") // Elemento que tomaremos como referencia
function navbarToggleListener(){ // comprobacion
    navbar.classList.toggle("navbar-top",document.documentElement.scrollTop<50)
}
navbarToggleListener() // llamamos la funcion para comprobar que el scroll esta arriba
const navbarToggle = new IntersectionObserver((entries)=>{ // creamos un observador
    // usamos este observador para solo escuchar los eventos cuando sea necesario
    entries.forEach((entrie)=>{
        if(entrie.isIntersecting){
            document.addEventListener("scroll",navbarToggleListener)
        }
        else{
            document.removeEventListener("scroll",navbarToggleListener)
        }
    })
},{threshold:0.7})
navbarToggle.observe(ref) // observamos el elemento de referencia para optimizar

// script para crear un efecto parallax 

function parallax(){back.style.transform = `translateY(${document.documentElement.scrollTop/2}px)`}

function parallaxEntrie(entrie){
    if(entrie.isIntersecting){
        document.addEventListener("scroll",parallax,{passive:true})
    }
    else{
        document.removeEventListener("scroll",parallax)
    }
}

function parallaxObserver(entries){entries.forEach(parallaxEntrie)}

if(document.documentElement.scrollTop<window.innerHeight){parallax()}

const firstParallax = new IntersectionObserver(parallaxObserver)

firstParallax.observe(ref)


// script para ir a la direccion del index
const index = qsa(".index")
index.forEach(entrie => {
    entrie.addEventListener("click",()=>{
        window.location.assign("./")
    })
})

// script para hacer scroll a los links
const list = qsa(".navbar-links-item")
list.forEach(entrie=>{
    entrie.addEventListener("click",(e)=>{
        scroll(0,gti(e.target.attributes.data.value).offsetTop-navbar.clientHeight)
        // window.location.assign(`./#${e.target.attributes.data.value}`)
        // gti(e.target.attributes.data.value).scrollIntoView()
    })
})
const down = qs(".down-img")
down.addEventListener("click",()=>{
    scroll(0,gti("highlights").offsetTop-navbar.clientHeight)
    // window.location.assign("./#highlights")
})

// script para cambiar entre imagenes
const left = gti("left-arrow")
const right = gti("right-arrow")
const imgCont = qs(".design-imgs")
function imgScroll(e){
    if(e.target == right){
        imgCont.scroll({
            left: imgCont.scrollLeft + imgCont.clientWidth,
            behavior:"smooth"
        })
    }
    else{
        imgCont.scroll({
            left: imgCont.scrollLeft - imgCont.clientWidth,
            behavior:"smooth"
        })
    }
}
left.addEventListener("click",imgScroll)
right.addEventListener("click",imgScroll)

// script para mostrar los botones
const buts = qsa(".design-button")
let timeout
function show(entrie){
    if(!entrie.classList.contains("hide")){
        entrie.classList.add("show")
    }
}
function realHide(entrie){
    entrie.classList.remove("show")
}
function hide(){
    buts.forEach(realHide)  
}
function buttonHide(){
    clearTimeout(timeout)
    buts.forEach(show)
    timeout = setTimeout(hide,800)
}
imgCont.addEventListener("mousemove",buttonHide)

const progressBar = gti("progressBar")
const imgConts = qsa(".design-imgs > picture").length
function updateScroll(){
    let fullSize = imgCont.clientWidth*(imgConts-1)
    if(imgCont.scrollLeft<=0){
        left.classList.add("hide")
    }
    else{
        left.classList.remove("hide")
    }
    if(imgCont.scrollLeft>=fullSize){
        right.classList.add("hide")
    }
    else{
        right.classList.remove("hide")
    }
    progressBar.style.width = `${imgCont.clientWidth/imgConts*(imgCont.scrollLeft/imgCont.clientWidth+1)}px`
}
updateScroll()
imgCont.addEventListener("scroll",updateScroll)