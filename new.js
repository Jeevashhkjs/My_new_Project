//get elements from html file

let btns = document.querySelector(".buttonses")
let cards = document.querySelector(".NoOfCards")
let ulList = document.querySelector(".countsListsUL") 


//next and pre btns
let nextBtn = document.querySelector("#nextBtn")
let previousBtn = document.querySelector("#previousBtn")

//unique value of btns
let headerBtns = []

//storing dynamic buttons
window.addEventListener("DOMContentLoaded",()=>{
    fetch(`http://localhost:3000/projects`)
    .then(res => res.json())
    .then(data => {

        //storing btns with filtered
        data.forEach(getData => {
            if(headerBtns.indexOf(getData.category) == -1){
                headerBtns.push(getData.category)
            }
            if(getData.is_starred == true){
                if(headerBtns.indexOf("Starred") == -1){
                    headerBtns.push("Starred")
                }
            }
        })

        //create dynamic buttons
        headerBtns.forEach(getBtns => {
            let createBtn = document.createElement("button")
            createBtn.innerText = getBtns
            createBtn.setAttribute("class",`Btn_${getBtns}`)
            createBtn.setAttribute("id","filterBtn")
            btns.append(createBtn)
        })

        // Filter btns addevenet listner
        let filterBtns = document.querySelectorAll("#filterBtn")
        filterBtns.forEach(getFilterBtn => {
            getFilterBtn.addEventListener("click",(e)=>{
                let targetElement = e.target
                let className = e.target.classList[0]
                let filterClassName = className.slice(4,className.length)
                createElements(filterClassName)

                // active class and deactive class funciton passing params
                activeDeactiveClass(filterBtns,targetElement)
            })
        })

        // fetch full datas on db
        createHtmlElementFunciton(data)

        //pagination Data passing through
        pageBtnsFnc(data)
    })
})


// active btns and deactive btns function 
function activeDeactiveClass(allBtns,getTargetElement){
    allBtns.forEach(element => {
        if(element.classList.contains("activeBtn")){
            element.classList.remove("activeBtn")
        }
    });
    getTargetElement.classList.add("activeBtn")
}

// fetch elements with filtered
function createElements(getClass){

    let passedLink = getClass != "Starred" ? `http://localhost:3000/projects?category=${getClass}` : `http://localhost:3000/projects?is_starred=true`;

    fetch(passedLink)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        // passing data from dp to web with filter
        createHtmlElementFunciton(data)

        pageBtnsFnc(data)

    })

}


// create no of cards 
function createHtmlElementFunciton(data){

    let HTMLElements = data.map(getData => {

        let initials = getData.project_name.split(" ")
        let initial1 = initials[0][0].toUpperCase()
        let initial2 = initials[1][0].toUpperCase()

        let icons = getData.is_starred ? "fa-solid" : "fa-regular";

    return ElementsFromApi = `
        <div class = "mainParentDiv">
            <div class = "ContentparentDiv">
             <div class = "UserDetails">
                <p class = "Userinitial">${initial1}${initial2}</p>
                <p class = "Usertitle">${getData.project_name}</p>
             </div>
             <div class = "actionBtns">
                <p class = "star"><i class="${icons} fa-star" id = ${getData.id}></i></p>
                <p class = "delete"><i class="fa-sharp fa-solid fa-trash" id = ${getData.id}></i></p>
             </div>
            </div>
        </div>
        `
    }).join("")
    cards.innerHTML = HTMLElements

    // get star butns and its function 
    let starBtns = document.querySelectorAll(".fa-star")
    let deleteBtns = document.querySelectorAll(".fa-trash")

    // passing element throngh the function 
    deleteAndStar(deleteBtns)
    deleteAndStar(starBtns)

}

// get element and delete star function 
function deleteAndStar(getElements){
    getElements.forEach(getStarBtns => {
        getStarBtns.addEventListener("click",(e)=>{
            let getTargetId = e.target
            if(e.target.classList.contains("fa-star")){
                starFunction(getTargetId)
            }
            else{
                deleteFunction(getTargetId.id)
            }
        })
    })
}

//star function 
function starFunction(getTarId){

    let values = getTarId.classList.contains("fa-solid") ? false : true;

    fetch(`http://localhost:3000/projects/${getTarId.id}`)
    .then(res => res.json())
    .then(datum => {

        fetch(`http://localhost:3000/projects/${getTarId.id}`,{
            method:"PUT",
            headers:{'content-type':'application/json'},
            body: JSON.stringify({
                "id": datum.id,
                "project_name": datum.project_name,
                "owner_name": datum.owner_name,
                "is_starred" : values,
                "category": datum.category
            })
        })

    })
}

//delete function 
function deleteFunction(getTargetId){
    fetch(`http://localhost:3000/projects/${getTargetId}`, {
        method: "DELETE",
        headers:{'Content-type':'application/json'}
    })
}


// pagination code here
let pageCount = 1;
let displayedCards = 2;

//btns function
function pageBtnsFnc(getData){

// pagecount length divisible by pagecards
let pageCountLength = Math.ceil(getData.length / displayedCards)

let dataLength = getData.length

// if(dataLength % displayedCards == 0){
//     createPageNumbers(pageCountLength,getData,0)
// }
// else{
//     createPageNumbers(pageCountLength + 1,getData,1)
// }

// get data length

// initial values and length
let loopLength = pageCount * displayedCards
let loopInitialValue = loopLength - displayedCards

//next btn function
    nextBtn.addEventListener("click",()=>{
        pageCount++

            if(pageCount > pageCountLength){
                pageCount = pageCountLength
            }
        
        loopLength = pageCount * displayedCards
        loopInitialValue = loopLength - displayedCards

        if(pageCount == pageCountLength){
            if(dataLength % displayedCards != 0){
                loopLength = dataLength 
                loopInitialValue = dataLength - (dataLength % displayedCards)
            }
        }

        paginationFunc(loopInitialValue,loopLength,getData)
    })

//previous btn function
    previousBtn.addEventListener("click",()=>{

        pageCount--

        if(pageCount < 1){
            pageCount = 1
        }

        loopLength = pageCount * displayedCards
        loopInitialValue = loopLength - displayedCards

        if(pageCount == pageCountLength-1){
            loopLength = dataLength - (dataLength % displayedCards)
            loopInitialValue = loopLength - displayedCards
        }

        paginationFunc(loopInitialValue,loopLength,getData)
    })
    

    paginationFunc(loopInitialValue,loopLength,getData)

}


// page numbers create function
/*
function createPageNumbers(getPageCnts,datum,getStatus){

    let htmlEle = ""
    for(let i=0;i<getPageCnts;i++){
        htmlEle += `<li class = "pageNumbers">${i+1}</li>`
    }
    ulList.innerHTML = htmlEle

    let pageNumbersBtns = document.querySelectorAll(".pageNumbers")
    pageNumbersBtns.forEach(getBtns => {
        getBtns.addEventListener("click",(e)=>{
            let targetId = Number(e.target.innerText)
            let lpLength = targetId * displayedCards
            let initial = lpLength - displayedCards

            if(getStatus){
                if(targetId == getPageCnts){
                    lpLength = datum.length
                    initial = datum.length - (datum.length % displayedCards)
                }
            }

            paginationFunc(initial,lpLength,datum)
        })
    });
}
*/

//pagination data passing through create element function
function paginationFunc(LengthInitailValue,paginationLoopLength,datum){
    console.log(LengthInitailValue,paginationLoopLength)

    let getAllDatum = [];
    
    for(let i=LengthInitailValue;i<paginationLoopLength;i++){
        getAllDatum.push(datum[i])
    }

    createHtmlElementFunciton(getAllDatum)
}