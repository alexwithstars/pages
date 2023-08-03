"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

const sname=gti("name")
const prefix=gti("prefix")
const description=gti("description")
const code=gti("code")
const result=gti("result")
const point=gti("hide")
const objectListeners=qsa(".inp")
const clip=gti("clipboard")
const slider=gti("slider")
const tabsButton=gti("tabs")
const specialCharacters=/["'\\]/g
const htmlg=/>/g
const htmll=/</g
const toSnippet=/^.*$/gm
let tabulations=2
let tabs
let resultSnippet
let resultUserSnippet
updateTabs()
function updateTabs(){
    if(tabulations==2){
        tabulations=4
        slider.classList.add("slide")
    }
    else{
        tabulations=2
        slider.classList.remove("slide")
    }

    tabs=new RegExp(`\t| {${tabulations}}`,"g")
    document.body.style.tabSize=tabulations
    snippet()
}
function snippet(e={target:"",key:""}){
    if(e.key=="Tab" && e.target==point){
        code.focus()
        code.value+="\t"
    }
    let resultCode=code.value
    resultCode=resultCode.replace(specialCharacters,match=>`\\${match}`)
    resultCode=resultCode.replace(tabs,'\\t')
    resultCode=resultCode.replace(toSnippet,match=>`\t\t"${match}",`)
    resultCode=resultCode.slice(0,-1)
    resultUserSnippet=`"${sname.value}":{\n\t"prefix":"${prefix.value}",\n\t"body":[\n${resultCode}\n\t],\n\t"description":"${description.value}"\n}`
    resultCode=resultCode.replace(htmll,'&lt')
    resultCode=resultCode.replace(htmlg,'&gt')
    resultSnippet=`"${sname.value}":{\n\t"prefix":"${prefix.value}",\n\t"body":[\n${resultCode}\n\t],\n\t"description":"${description.value}"\n}`
    result.innerHTML=`<pre>${resultSnippet}\n\n\n\n</pre>`
}
let fail=false;
function ex(e){
    fail=true
    console.log(e)
    alert(`No se pudo copiar al portapapeles: ver consola para mas info`);
}
function delay(time){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve()
        },time)
    })
}
async function copy(){
    await navigator.clipboard.writeText(resultUserSnippet).catch(ex)
    if(fail){
        fail=false;
        return
    }
    let noti=document.createElement("div")
    noti.classList.add("copied")
    noti.textContent="Copiado exitosamente!"
    document.body.appendChild(noti)
    await delay(50)
    noti.classList.add("show")
    await delay(1500)
    noti.classList.remove("show")
    await delay(700)
    document.body.removeChild(noti)
}
objectListeners.forEach(entrie=>entrie.addEventListener("keyup",snippet))
clip.addEventListener("click",copy)
tabsButton.addEventListener("click",updateTabs)