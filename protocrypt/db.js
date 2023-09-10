"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)

const dbRequest=indexedDB.open("encryptDB")
const db=await new Promise((resolve,reject)=>{
	dbRequest.addEventListener("upgradeneeded",()=>{
		dbRequest.result.createObjectStore("users")
		dbRequest.result.createObjectStore("acounts")
	})
	dbRequest.addEventListener("success",()=>{
		resolve(dbRequest.result)
	})
	dbRequest.addEventListener("error",(e)=>{
		reject(e)
	})
}).catch(e=>console.warn(e))

function getTransaction(objStore,mode){
	let trans=db.transaction(objStore,mode)
	return trans.objectStore(objStore)
}

export function setAcount(user,encryptedUser,encryptedPassword){
	let acountsBase=getTransaction("acounts","readwrite")
	acountsBase.add(encryptedPassword,encryptedUser)
	let usersBase=getTransaction("users","readwrite")
	usersBase.add(true,user)
}
export function requestUser(user){
	let usersBase=getTransaction("users","readonly")
	let request = usersBase.get(user)
	return new Promise((resolve,reject)=>{
		request.addEventListener("error",(e)=>{
			reject(e)
		})
		request.addEventListener("success",()=>{
			resolve(request.result)
		})
	})
}

export function getAcount(encryptedUser){
	let acountBase = getTransaction("acounts","readonly")
	let request = acountBase.get(encryptedUser)
	return new Promise((resolve,reject)=>{
		request.addEventListener("error",(e)=>{
			reject(e)
		})
		request.addEventListener("success",()=>{
			resolve(request.result)
		})
	})
}