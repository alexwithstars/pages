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
const objectListeners=qsa(".inp")
const clip=gti("clipboard")
const slider=gti("slider")
const tabsButton=gti("tabs")
const dropModal = gti("dropModal")
const dropzone = gti("dropzone")
const load = gti("load")
const modalText = gti("modalText")
const percent = gti("percent")
const charge = gti("charge")
const specialCharacters=/["'\\]/g
const htmlg=/>/g
const htmll=/</g
const toSnippet=/^.*$/gm
localStorage.getItem("tabs") ?? localStorage.setItem("tabs",4)
let tabulations=localStorage.getItem("tabs");
let tabs
let resultSnippet
let resultUserSnippet

// first update tabs
if(tabulations==2){
    slider.classList.remove("slide")
}
else{
    slider.classList.add("slide")
}
tabs=new RegExp(`\t| {${tabulations}}`,"g")
document.body.style.tabSize=tabulations

let sessionData = sessionStorage.getItem("sessionData") ?? null
if(sessionData){
    sessionData=JSON.parse(sessionData)
    sname.value=sessionData.sname
    prefix.value=sessionData.prefix
    description.value=sessionData.description
    code.value=sessionData.code
}

snippet()

function updateTabs(){
    if(tabulations==2){
        tabulations=4
        slider.classList.add("slide")
    }
    else{
        tabulations=2
        slider.classList.remove("slide")
    }
    localStorage.setItem("tabs",tabulations)
    tabs=new RegExp(`\t| {${tabulations}}`,"g")
    document.body.style.tabSize=tabulations
    snippet()
}

function tabfix(e){
    if(e.key=="Tab"){
        e.preventDefault()
        let string = e.target.value
        let start = e.target.selectionStart
        let end = e.target.selectionEnd
        e.target.value  = string.substring(0,start)+'\t'+string.substring(start)
        e.target.selectionStart=start+1
        e.target.selectionEnd=end+1
    }
}
function snippet(){
    sessionData={
        sname:sname.value,
        prefix:prefix.value,
        description:description.value,
        code:code.value
    }
    sessionStorage.setItem("sessionData",JSON.stringify(sessionData))
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
    console.warn(e)
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
code.addEventListener("keydown",tabfix)
clip.addEventListener("click",copy)
tabsButton.addEventListener("click",updateTabs)
addEventListener("dragenter",(e)=>{
    dropModal.classList.remove("hide")
})
dropzone.addEventListener("dragover",(e)=>{
    e.preventDefault()
})
dropzone.addEventListener("dragleave",(e)=>{
    dropModal.classList.add("hide")
})
let textTest=/text/
let extensions = [".cpp$",".h$",".txt$",
".c$",".py$",".ts$",".cs$",".html$",
".css$",".js$",".xml$",".json$"]
async function getFile(e){
    e.preventDefault()
    try{
        todo:do{
            let type = e.dataTransfer.files[0].type
            if(textTest.test(type) ){
                break todo
            }
            let name = e.dataTransfer.files[0].name
            for(let i of extensions){
                if(RegExp(i).test(name)){
                    break todo
                }
            }
            if(type!=""){
                alert(`tipo archivo no soportado: ${type}`)
                dropModal.classList.add("hide")
                return
            }
            if(confirm("tipo de archivo desconocido, continuar?")){
                break todo
            }
            else{
                dropModal.classList.add("hide")
                return
            }
        }while(false)
    }catch(err){
        alert("algo salio mal con la transferencia de archivos: ver consola")
        console.warn(err)
        dropModal.classList.add("hide")
        return
    }
    let reader = new FileReader
    reader.readAsText(e.dataTransfer.files[0])
    let codeFile = await new Promise((resolve,reject)=>{
        modalText.classList.add("hide")
        charge.classList.remove("hide")
        reader.addEventListener("progress",(e)=>{
            let prog = Math.floor(e.loaded/e.total*100)
            percent.textContent = `${prog}%`
            load.style.width= `${prog}%`
        })
        reader.addEventListener("load",(e)=>{
            dropModal.classList.add("hide")
            modalText.classList.remove("hide")
            charge.classList.add("hide")
            resolve(e.target.result)
        })
    })
    code.value=codeFile
    snippet()
}
dropzone.addEventListener("drop",getFile)