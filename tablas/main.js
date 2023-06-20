"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

const cal = gti("cal")
const res = qs(".res")
const cont = qs(".results")
const dead = qs(".error")
let s,ti,el,d
let regex = /^-?[0-9]+$/

const tbl = ()=>{
    cont.innerHTML = ""
    d=document.createDocumentFragment()
    dead.classList.remove("show")
    if(regex.test(cal.value) && cal.value > 0){
        if(cal.value <= 250){
            for(let i=1;i<=cal.value;i++){
                s=`<span>X = ${i}<br></span>`
                el = document.createElement("div")
                el.classList.add("res")
                for(let j=1;j<10;j++){
                    s=s+`${i} x ${j} = ${i*j} <br>`
                }
                s=s+`${i} x ${10}= ${i*10} <br>`
                el.innerHTML = s
                d.appendChild(el)
            }
            cont.appendChild(d)
            return
        }
        dead.classList.add("show")
        console.warn(`${cal.value}: Is too much tables (denied for security)`)
        
    }
    el = document.createElement("div")
    el.classList.add("res")
    s="<span>X = 0<br></span>"
    for(let i=1;i<10;i++){
        s=s+`${0} x ${i} = ${0*i} <br>`
    }
    s=s+`0 x ${10}= ${0*10} <br>`
    el.innerHTML = s
    d.appendChild(el)
    cont.appendChild(d)
}

tbl()
cal.addEventListener("keyup",tbl)