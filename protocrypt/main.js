"use strict";
import {getDictionary} from "./encrypt.js"
import { requestUser,getAcount,setAcount } from "./db.js";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

const chr = n=>String.fromCodePoint(n)
const ord = n=>n.codePointAt(0)

const user = gti("user")
const password = gti("key")
const show = gti("show")
const finish = gti("finish")
const mode = gti("mode")
const text = gti("text")
const title = gti("title")

function delay(time){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{
			resolve()
		},time)
	})
}
async function tagInfo(tx,error){
	let element = document.createElement("div")
	element.textContent=tx
	element.classList.add(error?"error":"done")
	document.body.appendChild(element)
	await delay(50)
	element.classList.add("showin")
	setTimeout(async ()=>{
		element.classList.remove("showin")
		await delay(500)
		document.body.removeChild(element)
	},2000)
}

function encryptUser(username,pass){
	let arr = getDictionary(username+pass)
	let usercrypt=""
	let passcrypt=""
	for(let i of username){
		usercrypt+=chr(arr[ord(i)-32])
	}
	for(let i of pass){
		passcrypt+=chr(arr[ord(i)-32])
	}
	return {user:usercrypt,pass:passcrypt}
}

function charVerify(e){
	let target=e.target==password?e.target.parentElement:e.target
	for(let i of e.target.value){
		if(ord(i)>127 || ord(i)<32){
			target.classList.add("invalid")
			tagInfo(`caracteres no validos (${i})`,true)
			return
		}
	}
	target.classList.remove("invalid")
}
user.addEventListener("keyup",charVerify)
password.addEventListener("keyup",charVerify)

show.addEventListener("change",(e)=>{
	document.startViewTransition(()=>{
		if(show.checked){
			password.type="text"
			return
		}
		password.type = "password"
	})
})
let lr=false
mode.addEventListener("click",()=>{
	lr=!lr
	document.startViewTransition(()=>{
		title.textContent=lr?"Register":"Login"
		text.textContent=lr?"Ya tienes una cuenta?":"Aun no estas registrado?"
		finish.innerHTML=`<span>${title.textContent}</span>`
	})
})

async function bdAction(e){
	if(lr){
		if(user.value.length<5){
			tagInfo("Usuario demasiado corto (al menos 5 caracteres)",true)
			return
		}
		if(password.value.length<8){
			tagInfo("Contraseña demasiado corta (al menos 8 caracteres)",true)
			return
		}
	}
	let encryptedAcount = encryptUser(user.value,password.value)
	if(lr){
		if(await requestUser(user.value)){
			tagInfo("Usuario existente",true)
			return
		}
		setAcount(user.value,encryptedAcount.user,encryptedAcount.pass)
		tagInfo("Usuario registrado",false)
	}
	else{
		if(encryptedAcount.pass==await getAcount(encryptedAcount.user)){
			tagInfo("acceso correcto",false)
		}
		else{
			tagInfo("Usuario o contraseña no validos",true)
		}
	}
}
finish.addEventListener("click",bdAction)
user.addEventListener("keydown",(e)=>{
	if(e.key=="Enter"){
		password.focus()
	}
})
password.addEventListener("keydown",(e)=>{
	if(e.key=="Enter"){
		bdAction(e)
	}
})