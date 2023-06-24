"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

// script para retirar la pantalla de carga
window.addEventListener("load",()=>{
    let loadScreen = qs(".load-screen")
    loadScreen.classList.add("fadeout")
    setTimeout(()=>{
        loadScreen.classList.replace("fadeout","done")
        document.querySelector(".text-loading").classList.remove("text-loading")
    },1500)
})

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
const back = qs(".header-back") // fondo parallax
function parallax(){
    back.style.transform = `translateY(${document.documentElement.scrollTop/2}px)`
}
if(document.documentElement.scrollTop<window.innerHeight){
    parallax()
}
const firstParallax = new IntersectionObserver((entries)=>{ // creamos un observador
    // usamos este observador para solo escuchar los eventos cuando sea necesario
    entries.forEach((entrie)=>{
        if(entrie.isIntersecting){
            document.addEventListener("scroll",parallax)
        }
        else{
            document.removeEventListener("scroll",parallax)
        }
    })
})
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
    window.location.assign("./#highlights")
})