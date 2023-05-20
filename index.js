let btns = document.querySelector(".buttonses")
let cards = document.querySelector(".NoOfCards")
let searchElement = document.querySelector(".inputsearch")

let pageNumberCounts = 1;


let catogories = []
let filtercategory = []

window.addEventListener("DOMContentLoaded",()=>{
    fetch(`http://localhost:3000/projects`)
    .then(res => res.json())
    .then(data => {

        for(let i=0;i<data.length;i++){
            catogories.push(data[i].category)
            if(data[i].is_starred == true){
                if(filtercategory.indexOf("Starred") == -1){
                    filtercategory.push("Starred")
                }
            }
        }
        for(let k=0;k<catogories.length;k++){
            if(filtercategory.indexOf(catogories[k]) == -1){
                filtercategory.push(catogories[k])
            }
        }
        for(let j=0;j<filtercategory.length;j++){
            let createBtn = document.createElement("button")
            createBtn.innerText = filtercategory[j]
            createBtn.setAttribute("class",`Btn_${filtercategory[j]}`)
            createBtn.setAttribute("id","filterBtn")
            btns.append(createBtn)
        }

        let shareWithMeBtn = document.querySelectorAll("#filterBtn")
        shareWithMeBtn.forEach(btnselement => {

            btnselement.addEventListener("click",(e)=>{
                activeBtns(e.target,shareWithMeBtn)
                let className = e.target.classList[0]
                let filterClassName = className.slice(4,className.length)
                createElements(filterClassName)
            })

        }); 

        // let selectT = document.querySelector(".selectTag")
        // selectT.value = 2
        // selectT.addEventListener("click",()=>{
        //     let values = selectT.value
        //     paginationFunc(data,values)
        // })
        // paginationFunc(data,2)

    })
})


function activeBtns(targetE,allBtns){
    for(let k=0;k<allBtns.length;k++){
        allBtns[k].classList.remove("activeBtn")
    }
    targetE.classList.add("activeBtn")
}

function createElements(getClass){

    let passedLink = getClass != "Starred" ? `http://localhost:3000/projects?category=${getClass}` : `http://localhost:3000/projects?is_starred=true`;

    fetch(passedLink)
    .then(res => res.json())
    .then(data => {

        paginationFunc(data,2)

        let lists = document.querySelectorAll(".Usertitle")
        searchElement.addEventListener("keyup",()=>{
            let searchValue = searchElement.value
            searchFunction(searchValue)
        })


        let deleteBtn = document.querySelectorAll(".delete")
        deleteBtn.forEach(delBtns => {
           delBtns.addEventListener("click",(e)=>{
                let targetId = e.target.id
                deleteFunction(targetId)
           })
        });

        let starBtn = document.querySelectorAll(".star")
        starBtn.forEach(starBtns =>{
            starBtns.addEventListener("click",(e)=>{
                e.preventDefault()
                let tarGetId = e.target
                e.target.classList.toggle("fa-solid")
                starFunction(tarGetId)
                return false;
            })
        })

    })

}

let nxtsBtn = document.querySelector("#nextBtn")
let previousBtn = document.querySelector("#previousBtn")
let ulLists = document.querySelector(".countsListsUL")



function paginationFunc(data,getPageCnts){

    let noOfPageNo = getPageCnts;
    let rpPage = 0;
    
    if(data.length < noOfPageNo){
        rpPage = data.length
    }
    else{
        rpPage = noOfPageNo
    }

    let recordPerPage = rpPage
    let initialValue = recordPerPage - rpPage

    let dataLength = Math.ceil(data.length / recordPerPage)
    createNextPreBtnsFunc(dataLength,data,rpPage)

    noOfCad(recordPerPage,initialValue,data)

    pageNumberActiveFc(pageNumberCounts)

    nxtsBtn.addEventListener("click",()=>{
        pageNumberCounts++

        if(pageNumberCounts > 7){
            pageNumberCounts = 7
        }

        pageNumberActiveFc(pageNumberCounts)

        let btn = "next"

        recordPerPage = recordPerPage + rpPage
        initialValue = recordPerPage - rpPage

        if(recordPerPage % rpPage == 0){
            if(recordPerPage > data.length){
                recordPerPage = data.length
            }
        }

        else{
            recordPerPage = data.length
            initialValue = recordPerPage - recordPerPage % rpPage
        }

        noOfCad(recordPerPage,initialValue,data,btn)

    })

    previousBtn.addEventListener("click",()=>{
        pageNumberCounts--

        if(pageNumberCounts < 1){
            pageNumberCounts = 1
        }

        pageNumberActiveFc(pageNumberCounts)

        let btn = "previous"

        recordPerPage = recordPerPage - rpPage
        initialValue = recordPerPage + rpPage

        if(recordPerPage % rpPage == 0){
            if(recordPerPage < rpPage){
                recordPerPage = rpPage
                initialValue = 0
            }
        }
        else{
            recordPerPage = data.length - recordPerPage % rpPage
            initialValue = recordPerPage 
        }

        noOfCad(recordPerPage,initialValue,data,btn)

        
    })
}


function noOfCad(RP,getInintialVAlue,data,btns){


    let dataArray = []

    if(btns == "previous"){
        for(let i=getInintialVAlue-1;i>=RP;i--){
            dataArray.push(data[i])
            createHtmlElementFunciton(dataArray)
        }
    }

    for(let i=getInintialVAlue;i<RP;i++){
        dataArray.push(data[i])
        createHtmlElementFunciton(dataArray)
    }
    
}

function createNextPreBtnsFunc(btnLnth,getDataFromDb,getNoOfPage){

    let htmlEle = ""

    for(let i=0;i<btnLnth;i++){
        htmlEle += `<li class = "pageNumbers">${i+1}</li>`
    }

    ulLists.innerHTML = htmlEle
    let pageNumbersLi = document.querySelectorAll(".pageNumbers")
    
    pageNumbersLi.forEach((pageBtn) =>{
        pageBtn.addEventListener("click",(e)=>{
            
            for(let i=0;i<pageNumbersLi.length;i++){
                pageNumbersLi[i].classList.remove("pageActive")
            }
            e.target.classList.add("pageActive")


            let rpValues = 0;
            let initialValues = 0;
            let dataLength = getDataFromDb.length
           
           let targetPageNumber = e.target.innerText
           let numberTargetPageNumber = parseInt(targetPageNumber)

           pageNumberCounts = numberTargetPageNumber

           if(numberTargetPageNumber != pageNumbersLi.length){
                rpValues =  numberTargetPageNumber * getNoOfPage
                initialValues = rpValues - getNoOfPage
           }
           else{
                rpValues = getDataFromDb.length
                initialValues = rpValues - getNoOfPage % dataLength
           }

           noOfCad(rpValues,initialValues,getDataFromDb,pageNumbersLi)
        })
    })
}


function pageNumberActiveFc(getpageCounts){
    let pageNumbersLi = document.querySelectorAll(".pageNumbers")
    for(let i=0;i<pageNumbersLi.length;i++){
        for(let k=0;k<pageNumbersLi.length;k++){
            if(pageNumbersLi[k].classList.contains("pageActive")){
                pageNumbersLi[k].classList.remove("pageActive")
            }
        }
    }
    pageNumbersLi[getpageCounts-1].classList.add("pageActive")
}


function deleteFunction(getTargetId){
    fetch(`http://localhost:3000/projects/${getTargetId}`, {
        method: "DELETE",
        headers:{'Content-type':'application/json'}
    })
}

function starFunction(getTarId){

    let values = getTarId.classList.contains("fa-solid") ? true : false;

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

let elementArraySearch = []

function searchFunction(ListNames){
    
    fetch(`http://localhost:3000/projects`)
    .then(res => res.json())
    .then(data => {

        data.forEach(element => {
            if(element.project_name.toUpperCase().indexOf(ListNames.toUpperCase()) != -1){
                elementArraySearch.push(element)
                createHtmlElementFunciton(elementArraySearch)
            }
        })

    })

}

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
}

