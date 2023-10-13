"use strict";
const qs = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const gti = sel => document.getElementById(sel)
const gtg = sel => document.getElementsByTagName(sel)


// Horario de prueba, a posteriori se usara una bd
const schedule={
	1:{
		0:{class:"Ingles V",teacher:"Muro"},
		1:{class:"Ingles V",teacher:"Muro"},
		2:"null",
		4:{class:"mod IV | sub II",teacher:"Suchiapa"},
		5:{class:"Calculo Integral",teacher:"Abel"},
		6:{class:"Calculo Integral",teacher:"Abel"},
		7:{class:"CTSyV",teacher:"Eliseo"},
		8:{class:"CTSyV",teacher:"Eliseo"},
		9:"null"
	},
	2:{
		0:{class:"mod IV | sub I",teacher:"Suchiapa"},
		1:{class:"CTSyV",teacher:"Eliseo"},
		2:{class:"Calculo Integral",teacher:"Abel"},
		4:{class:"Calculo Integral",teacher:"Abel"},
		5:{class:"mod IV | sub II",teacher:"Suchiapa"},
		6:{class:"DHI",teacher:"Antonio"},
		7:{class:"Ingles V",teacher:"Muro"},
		8:"null",
		9:"null"
	},
	3:{
		0:{class:"CTSyV",teacher:"Eliseo"},
		1:{class:"Fisica II",teacher:"Raul"},
		2:{class:"Fisica II",teacher:"Raul"},
		4:{class:"mod IV | sub I",teacher:"Suchiapa"},
		5:{class:"Calculo Integral",teacher:"Abel"},
		6:{class:"mod IV | sub II",teacher:"Suchiapa"},
		7:"null",
		8:"null",
		9:"null"
	},
	4:{
		0:{class:"mod IV | sub II",teacher:"Suchiapa"},
		1:{class:"mod IV | sub I",teacher:"Suchiapa"},
		2:{class:"Fisica II",teacher:"Raul"},
		4:{class:"Fisica II",teacher:"Raul"},
		5:"null",
		6:{class:"mod IV | sub II",teacher:"Suchiapa"},
		7:{class:"mod IV | sub I",teacher:"Suchiapa"},
		8:{class:"mod IV | sub I",teacher:"Suchiapa"},
		9:"null"
	},
	5:{
		0:{class:"Ingles V",teacher:"Muro"},
		1:{class:"Ingles V",teacher:"Muro"},
		2:{class:"mod IV | sub I",teacher:"Suchiapa"},
		4:{class:"mod IV | sub II",teacher:"Suchiapa"},
		5:"null",
		6:"null",
		7:"null",
		8:"null",
		9:"null"
	},
}

// horas de clase
const ctimes = [
    {from: 450, to: 500},
    {from: 500, to: 550},
    {from: 550, to: 600},
	{from: 600, to: 630},
    {from: 630, to: 680},
    {from: 680, to: 730},
    {from: 730, to: 780},
    {from: 780, to: 830},
    {from: 830, to: 880},
    {from: 880, to: 930}
]
const randMs=[
	"A comer",
	"Diviertete",
	"Bonito dia",
	"Hora de comer",
	"Descansooo"
]

function random(min,max){
	[min,max]=[parseInt(min),parseInt(max)]
	if(min>max){[min,max]=[max,min]}
	max++
	return Math.floor(Math.random()*(max-min)+min)
}

for(let i in schedule){
	schedule[i][3]={class:"Recreo",teacher:`¡${randMs[random(0,randMs.length-1)]}!`}
}

// animacion del boton de menu
const menu=gti("menu")
const b1=gti("b1")
const b2=gti("b2")
const groups=gti("groups")
let gOpen=false
menu.addEventListener("click",()=>{
	gOpen=!gOpen
	if(gOpen){
		b1.style.animation="x 0.3s forwards ease-in-out"
		b2.style.animation="y 0.3s forwards ease-in-out"
		groups.style.translate="0"
	}
	else{
		b1.style.animation="y 0.3s reverse ease-in-out"
		b2.style.animation="x 0.3s reverse ease-in-out"
		groups.style.translate="-100%"
		
	}
})


// generador de las clases del dia
const nowTitle=gti("now-title").cloneNode(true)
const commingTitle=gti("comming-title").cloneNode(true)
const allTitle=gti("all-title").cloneNode(true)
const nyans=gti("nyans").cloneNode(true)
const dayEnded=gti("dayEnded").cloneNode(true)
const assets=gti("assets")
document.body.removeChild(assets)
const curSchedule=gti("schedule")
const ntt=n=>n<10?`0${n}`:n // number to time
const ttm=(h,m)=>h*60+m // time to minutes
const mtt=(n)=>[Math.floor(n/60),n%60] // minutes to time
const time=new Date()
function genClass(curD,times,...classes){
	let el = document.createElement("div")
	el.classList.add("day-class")
	classes.forEach(entrie=>el.classList.add(entrie))
	const parts=["f","t","l","te","cl"]
	let infoElements={}
	parts.forEach(entrie=>{
		infoElements[entrie]=document.createElement("div")
		infoElements[entrie].classList.add(entrie)
	})
	let curF=mtt(times.from)
	let curT=mtt(times.to)
	infoElements.f.textContent=`${ntt(curF[0])}:${ntt(curF[1])}`
	infoElements.t.textContent=`${ntt(curT[0])}:${ntt(curT[1])}`
	infoElements.cl.textContent=curD.class
	infoElements.te.textContent=curD.teacher
	parts.forEach(entrie=>el.appendChild(infoElements[entrie]))
	return el
}
function createClasses(day){
	time=new Date()
	curSchedule.innerHTML=""
	let frag = document.createDocumentFragment()
	let dayEnd=9
	let dayStart=0
	let curT=ttm(time.getHours(),time.getMinutes())
	// curT=ttm(7,40)
	while(day[dayEnd]=="null") dayEnd--
	while(dayStart<day.length && day[dayStart]=="null") dayStart++
	while(dayStart<ctimes.length && curT>=ctimes[dayStart].to) dayStart++
	if(curT>=ctimes[dayEnd].to){
		curSchedule.appendChild(dayEnded)
		return
	}
	let prep=false,pprep=false
	for(let i=dayStart;i<=dayEnd;i++){
		let curD=day[i]
		let classes=[]
		let cont=document.createElement("div")
		cont.classList.add("class-container")
		if(pprep){
			pprep=false
			cont.appendChild(allTitle)
		}
		if(prep){
			cont.appendChild(commingTitle)
			classes.push("comming")
			prep=false
			pprep=true
		}
		if(i==dayStart){
			if(curT>=ctimes[dayStart].from){
				cont.appendChild(nowTitle)
				classes.push("now")
				if(dayStart<=dayEnd){
					prep=true
				}
			}
		}
		if(i==3){
			classes.push("midTime")
		}
		if(curD=="null"){
			curD={class:"Clase Libre",teacher:"¡Disfruta!"}
			classes.push("free")
		}
		cont.appendChild(genClass(curD,ctimes[i],...classes))
		frag.appendChild(cont)
	}
	let line=document.createElement("div")
	line.classList.add("endline")
	frag.appendChild(line)
	frag.appendChild(nyans)
	curSchedule.appendChild(frag)
}

function getTodaySchedule(){
	if(time.getDay()==0 || time.getDay()==6){
		return
	}
	createClasses(schedule[time.getDay()])
}

getTodaySchedule()
let update=setInterval(getTodaySchedule,30000)


// animacion del dia actual
const titleDay=gti("titleDay")
const drop=gti("drop")
const groupSplash=gti("groupSplash")
const observer = new IntersectionObserver((entries)=>{
	entries.forEach((entrie)=>{
		if(entrie.isIntersecting){
			drop.style.scale=1
			groupSplash.style.opacity=1
			titleDay.scrollIntoView({behavior:"smooth"})
		}
		else{
			groupSplash.style.opacity=0
			drop.style.scale=0
		}
	})
},{rootMargin:`0px 0px -${window.visualViewport.height-1}px 0px`,root:null})
observer.observe(titleDay)