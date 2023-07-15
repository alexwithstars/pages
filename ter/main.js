"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

// Variables globales
const cels = qsa(".celdtext")
const cur=gti("current-card")
const line=gti("line")
const title=gti("winner")
const repl=gti("replay")
const again=gti("again")
const modal=gti("modal")
const card=gti("card")
const textres=gti("reset")
const butres=gti("but-res")
const butControls=gti("but-controls")
const modalControls=gti("controls-modal")
const controls=gti("controls")
const topen=qs(".open")
const tclose=qs(".close")
let copen=false
let turn=false
let realturn=false
let ev
let response
let moves=0
let table = []
const cases={
    TOP:"top",
    BOTTOM:"bottom",
    LEFT:"left",
    RIGHT:"right",
    CENTERH:"centerh",
    CENTERV:"centerv",
    DIAGPOS:"diagpos",
    DIAGNEG:"diagneg"
}
let winner={}
const keys={
    1:6,
    2:7,
    3:8,
    4:3,
    5:4,
    6:5,
    7:0,
    8:1,
    9:2
}

// Funciones
const re=()=>{ev.classList.remove("shake")}
function delay(time){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },time)
    })
}
function equal(a,b,c){
    parseInt(a);parseInt(b);parseInt(c);
    if(table[a] && table[b] && table[c])
        return table[a]==table[b] && table[b]==table[c]
    return false
}
function check(){
    for(let i=0;i<9;i++){
        table[i]=cels[i].textContent
    }
    winner={"top":table[0],
    "bottom":table[6],
    "left":table[0],
    "right":table[2],
    "centerh":table[3],
    "centerv":table[1],
    "diagpos":table[2],
    "diagneg":table[0]}
    if(equal(0,1,2)) return cases.TOP
    if(equal(3,4,5)) return cases.CENTERH
    if(equal(6,7,8)) return cases.BOTTOM
    if(equal(0,3,6)) return cases.LEFT
    if(equal(1,4,7)) return cases.CENTERV
    if(equal(2,5,8)) return cases.RIGHT
    if(equal(6,4,2)) return cases.DIAGPOS
    if(equal(0,4,8)) return cases.DIAGNEG
    return false
}
async function setCel(e){
    if(e.type=="click"){
        if(!e.target.textContent){
            turn=!turn
            e.target.textContent=(turn ? "x" : "o")
            e.target.classList.add("used")
            moves++
        }
        else{
            e.target.classList.add("shake")
            ev=e.target
            setTimeout(re,600)        
        }
    }
    else{
        if(e.key in keys){
            if(!cels[keys[e.key]].textContent){
                turn=!turn
                cels[keys[e.key]].textContent=(turn ? "x" : "o")
                cels[keys[e.key]].classList.add("used")
                moves++
            }
            else{
                cels[keys[e.key]].classList.add("shake")
                ev=cels[keys[e.key]]
                setTimeout(re,600)   
            }
        }
        else{
            return
        }
    }
    response=check()
    if(response || moves>=9){
        butControls.removeEventListener("click",showControls)
        window.removeEventListener("keydown",showControls)
        if(response){
            line.classList.add(response)
            line.classList.add("active")
            title.innerHTML= `<span>${winner[response].toUpperCase()}</span> GANAN`
        }
        else{
            title.textContent= "NADIE GANA"
        }
        for(let i=0;i<cels.length;i++){
            cels[i].classList.add("disabled")
            cels[i].removeEventListener("click",setCel)
        }
        let doc=document.createDocumentFragment()
        for(let i=0;i<3;i++){
            let row = document.createElement("div")
            row.classList.add("rep-row")
            for(let j=0;j<3;j++){
                let celd = document.createElement("div")
                celd.classList.add("rep-celd")
                celd.textContent=table[i*3+j]
                row.appendChild(celd)
            }
            doc.appendChild(row)
        }
        repl.appendChild(doc)
        window.removeEventListener("keydown",setCel)
        cur.classList.add("hide")
        modal.classList.add("preshow")
        await delay(1000)
        modal.classList.add("show")
        await delay(500)
        card.classList.add("show")
    }
    else{
        turn ? cur.classList.add("turn") : cur.classList.remove("turn");
    }
}

// Inicializacion
async function reset(){
    for(let i=0;i<cels.length;i++){
        cels[i].classList.remove("used")
    }
    await delay(300)
    line.classList.remove(response)
    line.classList.remove("active")
    turn=realturn
    realturn=!realturn
    cur.classList.remove("turn")
    card.classList.remove("show")
    turn ? cur.classList.add("turn") : cur.classList.remove("turn");
    await delay(500)
    textres.classList.remove("show")
    modal.classList.remove("show")
    await delay(1000)
    textres.classList.remove("preshow")
    modal.classList.remove("preshow")
    for(let i=0;i<cels.length;i++){
        cels[i].addEventListener("click",setCel)
        cels[i].textContent=""
        cels[i].classList.remove("disabled")
    }
    window.addEventListener("keydown",setCel)
    cur.classList.remove("hide")
    repl.innerHTML=''
    title.innerHTML=''
    butControls.addEventListener("click",showControls)
    window.addEventListener("keydown",showControls)
    butres.addEventListener("click",prereset)
    window.addEventListener("keydown",prereset)
    moves=0
}
async function prereset(e){
    if(e.type=="click" || e.key=="Enter"){
        butControls.removeEventListener("click",showControls)
        window.removeEventListener("keydown",showControls)
        window.addEventListener("keydown",prereset)
        butres.addEventListener("click",prereset)
        cur.classList.add("hide")
        if(modal.classList.length<2){
            window.removeEventListener("keydown",setCel)
            for(let i=0;i<cels.length;i++){
                cels[i].classList.add("disabled")
                cels[i].removeEventListener("click",setCel)
            }
            textres.classList.add("preshow")
            modal.classList.add("preshow")
            await delay(50)
            textres.classList.add("show")
            modal.classList.add("show")
            await delay(1000)
        }
        reset()

    }
}
async function showControls(e){
    if(e.type=="click"){
        if(e.pointerId==-1){
            return
        }
    }
    else{
        if(e.code!="KeyC"){
            return
        }
    }
    butControls.removeEventListener("click",showControls)
    window.removeEventListener("keydown",showControls)
    if(copen){
        window.addEventListener("keydown",setCel)
        window.addEventListener("keydown",prereset)
        controls.classList.remove("show")
        await delay(500)
        topen.classList.remove("hide-text")
        tclose.classList.add("hide-text")
        modalControls.classList.remove("show")
        await delay(1000)
        modalControls.classList.remove("preshow")
    }
    else{
        window.removeEventListener("keydown",setCel)
        window.removeEventListener("keydown",prereset)
        modalControls.classList.add("preshow")
        await delay(50)
        modalControls.classList.add("show")
        await delay(500)
        topen.classList.add("hide-text")
        tclose.classList.remove("hide-text")
        controls.classList.add("show")
    }
    butControls.addEventListener("click",showControls)
    window.addEventListener("keydown",showControls)
    copen=!copen
}
cur.classList.add("hide")
reset()
window.addEventListener("keydown",prereset)
window.addEventListener("keydown",showControls)
butres.addEventListener("click",prereset)
butControls.addEventListener("click",showControls)
again.addEventListener("click",reset)