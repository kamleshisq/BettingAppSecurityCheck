
const socket = io();
socket.on('disconnect', () => {
    console.log("WebSocket Disconnected");
    // Refresh the page when the WebSocket connection is lost
    
    window.location.reload();
});
let c = 0
socket.on('connect', () => {
    console.log("websocket Connected 45454545")
    let LOGINDATA = {}
    socket.on('loginUser',(data) => {
        const {
            host, hostname, href, origin, pathname, port, protocol, search
        } = window.location
        console.log('WORKING45654', data)
        let loginData
        if(pathname.startsWith('/admin')){
            if($('body header').attr('data-logindata')){
                loginData = JSON.parse($('body header').attr('data-logindata'))
            }
        }else{
            if($('body').attr('data-logindata')){

                loginData = JSON.parse($('body').attr('data-logindata')) 
            }
        }
        console.log('loginData',loginData)
        // if(!loginData){
        // location.reload(true)
        // }
        if(loginData){
            LOGINDATA.LOGINUSER = loginData.User
            LOGINDATA.LOGINTOKEN = loginData.Token
            LOGINDATA.IP = data.socket
        }

        // if(LOGINDATA.LOGINUSER == "" && c == 0){
        //     window.location.reload();
        //     c++
        // }
        //   console.log(pathname)
        //   console.log(host, hostname, href, origin ,port, protocol, search)
        //ollscores.com ollscores.com http://ollscores.com/admin/userManagement http://ollscores.com  http: 

    // console.log(LOGINTOKEN, LOGINUSER)
    // console.log(window.location.href)
    // let query = window.location.href.split('?')[1]
    // let id;
    // let P = 0;
    // if(query){
    //     id = query.split('=')[1]
    // }
    // // console.log(id)
    // if(id){
    //     socket.emit('load', {P:P, id:id})
    // }else{
    //     socket.emit('load', {P:P})
    // }

    
    // function togglePopupMain(idname, id, message){
    //     document.getElementById(idname).classList.toggle("active");
    //     document.getElementById(id).innerText  = message.toUpperCase()
    //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
    // }

    // $(document).on('click', ".close-btn" ,function(){
    //     let parentdiv = this.parentNode
    //     let grandParent = parentdiv.parentNode
    //     let id = grandParent.id
    //     document.getElementById(id).classList.remove("active");
    // })

    console.log(LOGINDATA,"==>cookie")


    
    let popupTimeout; 

    function togglePopupMain(idname, id, message) {
        const popup = document.getElementById(idname);
        const popupContent = document.getElementById(id);
        
        popup.classList.add("active");
        popupContent.innerText = message.toUpperCase();

        clearTimeout(popupTimeout);
        popupTimeout = setTimeout(function() {
            popup.classList.remove("active");
        }, 5000);
    }

    $(document).on('click', ".close-btn", function() {
        const grandParent = $(this).closest('.popup');
        grandParent.removeClass("active");
        clearTimeout(popupTimeout);
    });

    //....................FOR UPDATE ROLE...................//
    const inputElementSearch = document.getElementById('search_field');
    if(inputElementSearch != null){
        inputElementSearch.addEventListener('input', function() {
            if(inputElementSearch.value.length > 3){
                socket.emit("UserSideSEarchLive", inputElementSearch.value);
            }else{
                socket.emit("UserSideSEarchLive", "LessTheN3");
            }
          });
    }

    socket.on("UserSideSEarchLive", async(data) => {
        let html = ""
        for(let i = 0; i < data.length; i++){
            html += `<li><a class="demoname" href="/exchange_inPlay/match?id=${data[i].eventData.eventId}">${data[i].eventData.name}</a></li>`
        }
        document.getElementById("demonames").innerHTML = html
        document.getElementById("demonames1").innerHTML = html
    })


    // $(document).ready(function() {
    //     // Check if there's a stored class in localStorage
    //     var storedClass = localStorage.getItem("new-class");
    //     console.log(storedClass)
    //     if (storedClass) {
    //         // Add the stored class to the corresponding element
    //         $(".nav2menu-item").removeClass("new-class");
    //         $("." + storedClass).addClass("new-class");
    //     }
    
    //     $(document).on("click", ".nav2menu-item", function(e) {
    //         // Remove the "new-class" from all other elements
    //         $(".nav2menu-item").removeClass("new-class");
    
    //         // Add the "new-class" to the clicked element
    //         $(this).addClass("new-class");
    
    //         // Store the added class in localStorage
    //         var addedClass = $(this).attr("class").split(" ").filter(cls => cls !== "nav2menu-item")[0];
    //         localStorage.setItem("new-class", addedClass);
    //     });
    // });
    function balance(){
        socket.emit('userLoginBalance', LOGINDATA)
        setTimeout(()=>{
            balance()
          }, 500)
    }
    balance()
    socket.on('userLoginBalance', async(data) => {
        // console.log(data, "USERDATA")
        let html = `<div class="bet-blns-nav-wrp-amount-num">
        <span> <i class="fa-solid fa-wallet text-white"></i>  Bal : ${data.availableBalance}</span>
      </div>
      <div class="bet-blns-nav-wrp-txt">
        <span class="">Bal : <span> &nbsp; ${data.availableBalance}</span></span>
        <span class="">Exp : <span> &nbsp; ${data.exposure}</span></span>
      </div>`
      if(document.getElementById('userBalance')){
          document.getElementById('userBalance').innerHTML = html
      }
    })



   $(document).on('submit', ".change-pass-model-form1", function(e){
    e.preventDefault()
    let form = $(this)[0];
    let fd = new FormData(form);
    let data = Object.fromEntries(fd.entries());
    socket.emit('UserUpdatePass', {data, LOGINDATA});
   })

   const multiMarketTd = document.querySelectorAll('.multi_market');
   multiMarketTd.forEach((multiMarketTd) => {
    multiMarketTd.addEventListener('click', function (event) {
      event.preventDefault();
      let id = this.id
      if(LOGINDATA.LOGINUSER != ""){
        socket.emit("MULTIPLEMARKET", {id, LOGINDATA})
      }
      
    });
  });

  socket.on("MULTIPLEMARKET", (data) => {
    // for(let i = 0; i < data.id.length; i++){
        // console.log(data.id[i])
        let multiMarketTd = document.querySelectorAll('.multi_market');
        if(data.remove){
            if(pathname === "/exchange/multimarkets"){
                multiMarketTd.forEach((multiMarketTd) => {
                    if(multiMarketTd.id == data.id){
                        function removeParentElementByChildId(childId) {
                            const childElement = document.getElementById(childId);
                            if (childElement) {
                              const parentElement = childElement.closest('.exchange-pg-inn-banner-col2');
                              if (parentElement) {
                                parentElement.parentNode.removeChild(parentElement);
                              }
                            }
                          }
                          const idsToRemove = [data.id];
                          idsToRemove.forEach((id) => {
                            removeParentElementByChildId(id);
                          });
                    }
                })
                let multiMarketTd1 = document.querySelectorAll('.multi_market');
                if(multiMarketTd1.length === 0){
                    document.getElementById('container').innerHTML = `<h3>MultiMarket</h3>
                    <p>There are currently no followed multi markets.</p>`
                }
            }else{
                multiMarketTd.forEach((multiMarketTd) => {
                    if(multiMarketTd.id == data.id){
                        multiMarketTd.innerHTML = `<a ><img src="/assets/img/exchange/Vector.svg" alt=""></a>`
                    }
                })
            }
        }else{
            multiMarketTd.forEach((multiMarketTd) => {
                if(multiMarketTd.id == data.id){
                    multiMarketTd.innerHTML = `<a ><img src="/assets/img/exchange/Vector2.svg" alt=""></a>`
                }
            })
        }
    // }
  })


  $(document).on('click', ".fevoriteHeart", function(e){
    e.preventDefault()
    let id = this.id
    socket.emit("CasinoFevorite", {id, LOGINDATA})
  })

  socket.on('CasinoFevorite', async(data) => {
    console.log(data)
    let heart = document.querySelectorAll('.fevoriteHeart');
    if(data.remove){
        heart.forEach((heart) =>  {
            if(heart.id == data.id){
                if(pathname === "/live_casino"){
                    var gamesFevoriteElement = document.getElementById("gamesFevorite");
                    var elementsToDelete = gamesFevoriteElement.querySelectorAll(".liv-casino-games-cards-dv.col-lg-3.col-md-3.col-6");
                    elementsToDelete.forEach(function(element) {
                        var targetElement = element.querySelector("#" + CSS.escape(heart.id));
                        if (targetElement) {
                          element.remove(); 
                        }
                      });
                    heart.classList.remove("fa-solid", "liked-star");
                }else{
                    heart.classList.remove("fa-solid", "liked-star");

                }
            }
        })
    }else{
        heart.forEach((heart) => {
            if(heart.id == data.id){
                if(pathname === "/live_casino"){
                    var gamesFevoriteElement = document.getElementById("gamesFevorite");
                    var elementsToDelete = gamesFevoriteElement.querySelectorAll(".liv-casino-games-cards-dv.col-lg-3.col-md-3.col-6");
                    let isAvailable = false
                    elementsToDelete.forEach(function(element) {
                        var targetElement = element.querySelector("#" + CSS.escape(heart.id));
                        if (targetElement) {
                            isAvailable = true 
                        }
                      });
                    // // var elementsToDelete = gamesFevoriteElement.querySelectorAll(".liv-casino-games-cards-dv.col-lg-3.col-md-3.col-6");
                    let html = `<div class="liv-casino-games-cards-dv col-lg-3 col-md-3 col-6">
                    <a class="liv-casino-games-cards-a" href="#">
                      <div class="liv-casino-games-cards-imgdv">
                        <img class="img-fluid img-bdr-red15 forIMG" src="${data.gameDetails.url_thumb}" alt="">
                        <div class="liv-casino-games-cards-txt">
                          <div class="liv-casino-games-cards-txtcol">
                            <h6>${data.gameDetails.game_name}</h6>
                                <i id="${data.gameDetails._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart fa-solid liked-star"></i> 
                          </div>
                        </div>
                        <div class="liv-casino-games-cards-txt2">
                                <a class="liv-casino-games-cards-txt2-btn" href="/live_casinoInPlay?gameId=${data.gameDetails._id}">PLAY NOW</a>
                        </div>
                      </div>
                    </a>
                  </div>`
                  if(!isAvailable){
                      gamesFevoriteElement.innerHTML += html
                  }
                    // console.log(data.gameDetails)
                    heart.classList.add("fa-solid", "liked-star");
                }else{
                heart.classList.add("fa-solid", "liked-star");
                }
            }
        })
    }
  })




 
   // JavaScript event delegation using the parent <table> element
   const allTables = document.querySelectorAll('.myTable');
   allTables.forEach((table) => {
    table.addEventListener('click', function (event) {
      const targetElement = event.target;
      if (targetElement.tagName === 'A' || targetElement.tagName === 'SPAN' || targetElement.tagName === 'TD' || targetElement.tagName === 'B' || targetElement.tagName === 'P') {
        // Allow page reload for <a>, <span>, or <td> elements inside the <tr> other than "multi_market"
        const trElement = targetElement.closest('tr');
        const dataHref = trElement.getAttribute('data-href');
        if (dataHref) {
          window.location.href = dataHref;
        }
      }
    });
  });

  socket.on('UserUpdatePass', async(data)=>{
  
    if(data.status === "success"){
    //   function togglePopup(idname, id){
    //     document.getElementById(idname).classList.toggle("active");
    //     document.getElementById(id).innerText  = "password updated".toUpperCase()
    //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
    //   }
      togglePopupMain('popup-1', "redPopUP", "password updated")
        // alert("password updated")
    }else{
    //   function togglePopup1(idname, id){
    //     document.getElementById(idname).classList.toggle("active");
    //     document.getElementById(id).innerText  = data.message.toUpperCase()
    //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
    //   }
      togglePopupMain('popup-2', "redPopUP2", data.message.toUpperCase())
    }
   })

    socket.on("alertMessage", async(data) => {
        console.log(data)
        alert(data)
    })

    $(document).on('click', ".promotionLink", function(){
        let id = $(this).attr('id')
        socket.emit("updatePromotion", id)
    })

    $(document).on("submit", ".set-stake-form", function(e){
        e.preventDefault()
        const input1Elements = document.querySelectorAll('.set-stake-form-input1');
        const input2Elements = document.querySelectorAll('.set-stake-form-input2');

        const input1Values = Array.from(input1Elements).map((element) => element.value);
        const input2Values = Array.from(input2Elements)
        .map((element) => element.value)
        .filter((value) => value.trim() !== "");
                console.log(input2Values)
                socket.emit("STAKELABEL", {input1Values, input2Values, LOGINDATA})
            })

    socket.on("STAKELABEL", data =>{
        if(data === "Updated"){
            // function togglePopup(idname, id){
            //     document.getElementById(idname).classList.toggle("active");
            //     document.getElementById(id).innerText  = "Stakes updated".toUpperCase()
            //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
            //   }
              togglePopupMain('popup-1', "redPopUP", "Stakes updated".toUpperCase())
        }else{
            // function togglePopup1(idname, id){
            //     document.getElementById(idname).classList.toggle("active");
            //     document.getElementById(id).innerText  = data.toUpperCase()
            //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
            //   }
              togglePopupMain('popup-2', "redPopUP2", data.toUpperCase())
        }
    })


    socket.on("voidBet", (data)=>{
        if(data.status === "error"){
            alert("Please try again later")
        }else{
            console.log(data.bet._id)
            const deleteButton = document.getElementById(data.bet._id);
            console.log(deleteButton)
            const row = deleteButton.closest('tr'); 
            if (row) {
                const table = row.parentNode;
                const rowIndex = Array.from(table.rows).indexOf(row);
                row.remove(); 
                const rowsToUpdate = Array.from(table.rows).slice(rowIndex);
                rowsToUpdate.forEach((row, index) => {
                    const srNoCell = row.cells[0]; 
                    srNoCell.textContent = index + rowIndex + 1;
                  });
              }
        }
    })


    socket.on("marketId", (data) => {
        $(document).ready(function() {
      
            $(".0L").each(function() {
                    // console.log(this)
                    let id = this.id
                    const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    // if(data.betLimits[0].max_odd < foundItem.odds[0].layPrice1){
                    //     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
                    //                 <i class="fa-solid fa-lock"></i>
                    //               </span>`
                    // }else 
                    if (foundItem.odds[0].layPrice1 == "-"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                    }else if(foundItem.odds[0].layPrice1=="1,000.00"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        if($(this).find('.tbl-td-bg-pich-spn').text() != foundItem.odds[0].layPrice1){
                            console.log(123)
                            this.innerHTML = `<span class="tbl-td-bg-pich-spn" style="background-color: blanchedalmond;">${foundItem.odds[0].layPrice1}</span>`
                        }
                    }
                });
                
            $(".0B").each(function() {
                
                let id = this.id
                const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                // if(data.betLimits[0].max_odd < foundItem.odds[0].backPrice1){
                //     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                //                     <i class="fa-solid fa-lock"></i>
                //                   </span>`
                // }else 
                if (foundItem.odds[0].backPrice1 == "-"){
                    this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                }else if(foundItem.odds[0].backPrice1=="1,000.00"){
                    this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
                    <i class="fa-solid fa-lock"></i>
                  </span>`
                }else{
                    if($(this).find('.tbl-td-bg-blu-spn').text() != foundItem.odds[0].backPrice1){
                    // if(this.innerHTML !== `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn" style="background-color: blanchedalmond;">${foundItem.odds[0].backPrice1}</span>`
                    }
                }
            });

            $(".1L").each(function() {
                    let id = this.id
                    const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    // if(data.betLimits[0].max_odd < foundItem.odds[1].layPrice1){
                    //     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                    //                 <i class="fa-solid fa-lock"></i>
                    //               </span>`
                    // }else 
                    if (foundItem.odds[1].layPrice1 == "-"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                    }else if(foundItem.odds[1].layPrice1=="1,000.00"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        if($(this).find('.tbl-td-bg-pich-spn').text() != foundItem.odds[1].layPrice1){
                        // if(this.innerHTML !== `<span class="tbl-td-bg-pich-spn">${foundItem.odds[1].layPrice1}</span>`){
                            this.innerHTML = `<span class="tbl-td-bg-pich-spn" style="background-color: blanchedalmond;">${foundItem.odds[1].layPrice1}</span>`
                        }
                    }
            });

            $(".1B").each(function() {
                let id = this.id
                const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                // if(data.betLimits[0].max_odd < foundItem.odds[1].backPrice1){
                //     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                //                     <i class="fa-solid fa-lock"></i>
                //                   </span>`
                // }else 
                if (foundItem.odds[1].backPrice1 == "-"){
                    this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                }else if(foundItem.odds[1].backPrice1=="1,000.00"){
                    this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
                    <i class="fa-solid fa-lock"></i>
                  </span>`
                }else{
                    if($(this).find('.tbl-td-bg-blu-spn').text() != foundItem.odds[1].backPrice1){
                    // if(this.innerHTML !== `<span class="tbl-td-bg-blu-spn">${foundItem.odds[1].backPrice1}</span>`){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn" style="background-color: blanchedalmond;">${foundItem.odds[1].backPrice1}</span>`
                    }
                }
            });

            $(".2B").each(function() {
                    let id = this.id
                    const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                    // if(data.betLimits[0].max_odd < foundItem.odds[2].backPrice1){
                    //     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                    //                 <i class="fa-solid fa-lock"></i>
                    //               </span>`
                    // }else 
                    if (foundItem.odds[2].backPrice1 == "-"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                    }else if(foundItem.odds[2].backPrice1=="1,000.00"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        if($(this).find('.tbl-td-bg-blu-spn').text() != foundItem.odds[2].backPrice1){
                        // if(this.innerHTML !== `<span class="tbl-td-bg-blu-spn">${foundItem.odds[2].backPrice1}</span>`){
                            this.innerHTML = `<span class="tbl-td-bg-blu-spn" style="background-color: blanchedalmond;">${foundItem.odds[2].backPrice1}</span>`
                        }
                    }
            });

            $(".2L").each(function() {
                let id = this.id
                const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
                // if(data.betLimits[0].max_odd < foundItem.odds[2].layPrice1){
                //     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                //                     <i class="fa-solid fa-lock"></i>
                //                   </span>`
                // }else 
                if (foundItem.odds[2].layPrice1 == "-"){
                    this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                }else if(foundItem.odds[2].layPrice1=="1,000.00"){
                    this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
                    <i class="fa-solid fa-lock"></i>
                  </span>`
                }else{
                    if($(this).find('.tbl-td-bg-pich-spn').text() != foundItem.odds[2].layPrice1){
                    // if(this.innerHTML !== `<span class="tbl-td-bg-pich-spn">${foundItem.odds[2].layPrice1}</span>`){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn" style="background-color: blanchedalmond;">${foundItem.odds[2].layPrice1}</span>`
                    }
                }
            });

            const spanElement = document.querySelectorAll('.tbl-td-bg-pich-spn');
                setTimeout(() => {
                    spanElement.forEach(spanElement => {
                        if(spanElement.style){
                            spanElement.style.backgroundColor = '';
                        }// Remove background color
                      });
                    
                },300)

                const spanElement2 = document.querySelectorAll('.tbl-td-bg-blu-spn');
                setTimeout(() => {
                    spanElement2.forEach(spanElement => {
                        if(spanElement.style){
                            spanElement.style.backgroundColor = '';
                        }// Remove background color
                      });
                    
                },300)
        })
    })


    $(document).on("click", ".commission", function(e){
        e.preventDefault()
        socket.emit("claimCommission", {LOGINDATA})
    })

    socket.on("claimCommission", data => {
        if(data == "error"){
            togglePopupMain('popup-2', "redPopUP2", "Please try again later")
        }else{
         let claimButoons = document.getElementsByClassName("commission")
         for(let i = 0; i < claimButoons.length; i++){
            claimButoons[i].innerHTML = `<i class="fa-solid fa-money-check-dollar"></i>  Claim Commission (00)`
         }
        }
    })

    // if(pathname == "/admin/updateRole"){
    //     let x = "121"
    //     // let y = document.getElementById("mySelect").value
    //     function sendData(){
            
    //         if(x != document.getElementById("mySelect").value){
    //             x = document.getElementById("mySelect").value
    //             socket.emit("dataId", (x))
    //             setTimeout(()=>{
    //               sendData()
    //             }, 300)
    //         }else{
    //             setTimeout(()=>{
    //                 sendData()
    //             }, 300)
    //         }
    //       }
    //       sendData()

    //       socket.on("sendData", data => {
    //         // console.log(data)
    //         // console.log(data[1])
    //         let html = ""
    //         if(data[0].role.authorization.includes("createDeleteUser")){
    //             html += `<label for="authorization">create and delete users</label><br>
    //                     <input type="checkbox" name="authorization" value="createDeleteUser" checked><br>`
    //         }else{
    //             html += `<label for="authorization">create and delete users</label><br>
    //                     <input type="checkbox" name="authorization" value="createDeleteUser" ><br>`
    //         }
    //         if(data[0].role.authorization.includes("userStatus")){
    //             html += `<label for="authorization">User Status</label><br>
    //                     <input type="checkbox" name="authorization" value="userStatus" checked><br>`
    //         }else{
    //             html += `<label for="authorization">User Status</label><br>
    //                     <input type="checkbox" name="authorization" value="userStatus" ><br>`
    //         }
    //         if(data[0].role.authorization.includes("userName")){
    //             html += `<label for="authorization">Users Details</label><br>
    //                     <input type="checkbox" name="authorization" value="userName" checked><br>`
    //         }else{
    //             html += `<label for="authorization">Users Details</label><br>
    //                     <input type="checkbox" name="authorization" value="userName" ><br>`
    //         }
    //         if(data[0].role.authorization.includes("betLockAndUnloack")){
    //             html += `<label for="authorization">bet lock and unlock</label><br>
    //                     <input type="checkbox" name="authorization" value="betLockAndUnloack" checked><br>`
    //         }else{
    //             html += `<label for="authorization">bet lock and unlock</label><br>
    //                     <input type="checkbox" name="authorization" value="betLockAndUnloack" ><br>`
    //         }
    //         if(data[0].role.authorization.includes("changeUserPassword")){
    //             html += `<label for="authorization">Password</label><br>
    //                     <input type="checkbox" name="authorization" value="changeUserPassword" checked><br>`
    //         }else{
    //             html += `<label for="authorization">Password</label><br>
    //                     <input type="checkbox" name="authorization" value="changeUserPassword" ><br>`
    //         }
    //         if(data[0].role.authorization.includes("roleController")){
    //             html += `<label for="authorization">Role Controller</label><br>
    //                     <input type="checkbox" name="authorization" value="roleController" checked><br>`
    //         }else{
    //             html += `<label for="authorization">Role Controller</label><br>
    //                     <input type="checkbox" name="authorization" value="roleController" ><br>`
    //         }
    //         if(data[0].role.authorization.includes("accountControl")){
    //             html += `<label for="authorization">Account Controller</label><br>
    //                     <input type="checkbox" name="authorization" value="accountControl" checked><br>`
    //         }else{
    //             html += `<label for="authorization">Account Controller</label><br>
    //                     <input type="checkbox" name="authorization" value="accountControl" ><br>`
    //         }
    //         if(data[0].role.authorization.includes("allUserLogOut")){
    //             html += `<label for="authorization">All User Logout</label><br>
    //                     <input type="checkbox" name="authorization" value="allUserLogOut" checked><br>`
    //         }else{
    //             html += `<label for="authorization">All User Logout</label><br>
    //                     <input type="checkbox" name="authorization" value="allUserLogOut" ><br>`
    //         }
    //         if(data[0].role.authorization.includes("dashboard")){
    //             html += `<label for="authorization">Dashboard</label><br>
    //                     <input type="checkbox" name="authorization" value="dashboard" checked><br>`
    //         }else{
    //             html += `<label for="authorization">Dashboard</label><br>
    //                     <input type="checkbox" name="authorization" value="dashboard" ><br>`
    //         }
            
    //         document.getElementById('user_controller').innerHTML = html
        
    //         for(let i = 0; i < data[1].roles.length; i++){
    //             // console.log(data[0].role.userAuthorization)
    //             // console.log(data[1].roles[i].role_type)
    //             // document.getElementById(data[1].roles[i].role_type).checked = true
    //             // console.log(document.getElementById(data[1].roles[i].role_type))
    //             if(data[0].role.userAuthorization.includes(`${data[1].roles[i].role_type}`)){
    //                 document.getElementById(data[1].roles[i].role_type).checked = true
    //                 // console.log(document.getElementById(data[1].roles[i].role_type), "checked")
    //             }else{
    //                 document.getElementById(data[1].roles[i].role_type).checked = false
    //                 // console.log(data[1].roles[i].role_type)
    //             }
    //         }
        
    //         let html1 = ""
    //         document.getElementById("role_controller").innerHTML = `
    //         <label for="level">Role Level</label>
    //         <input type="number" name="level" placeholder='${data[0].role.role_level}' id='role_level'>`
    //     })
    // }

    $(document).on('click','.updateBetLimit',function(e){
       let firstTd = $(this).closest("tr").find("td:first");
       var innerText = firstTd.attr('id');
       console.log(innerText)
       socket.emit('BetLimitDetails', innerText)
    })


    socket.on('BetLimitDetails', data => {
        console.log(data)
        if(data.status == "notFound"){
            let form = $('#myModal2').find('.form-data')
            form.find('input[name = "min_stake"]').val(0)
            form.find('input[name = "max_stake"]').val(0)
            form.find('input[name = "max_profit"]').val(0)
            form.find('input[name = "max_odd"]').val(0)
            form.find('input[name = "delay"]').val(0)
            form.find('input[name = "max_bet"]').val(0)
            form.find('input[name = "type"]').val(data.type)
        }else if(data.status == "err"){
            alert(data.message)
        }else{
            // console.log(data)
            let form = $('#myModal2').find('.form-data')
            form.find('input[name = "min_stake"]').val(data.details.min_stake)
            form.find('input[name = "max_stake"]').val(data.details.max_stake)
            form.find('input[name = "max_profit"]').val(data.details.max_profit)
            form.find('input[name = "max_odd"]').val(data.details.max_odd)
            form.find('input[name = "delay"]').val(data.details.delay)
            form.find('input[name = "max_bet"]').val(data.details.max_bet)
            form.find('input[name = "type"]').val(data.type)
        }
    })


    $(document).on('submit', ".form-betLimit", function(e){
        e.preventDefault()
        let form = $(this)[0];
        let fd = new FormData(form);
        let data = Object.fromEntries(fd.entries());
        // console.log(data, "BETLIMIT")
        socket.emit('UpdateBetLimit', {data, LOGINDATA})
    })


    socket.on('UpdateBetLimit', data => {
        if(data.status == "err"){
            alert(data.message)
        }else{
            alert("updated!!")
            window.location.reload()
        }
    })

    //..................FOR User Profile Page...........//

    if(pathname == '/admin/profiledetail'){
        $(document).on('submit','.editMyProfile',function(e){
            e.preventDefault();
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            socket.emit('editMyProfile',{data,LOGINDATA})
        })

        socket.on('editMyProfile',async(data)=>{
            alert(data.msg)
            location.reload(true)
        })

        $(document).on('submit','.editMyPassword',function(e){
            e.preventDefault();
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            socket.emit('editMyPassword',{data,LOGINDATA})
        })

        socket.on('editMyPassword',async(data)=>{
            alert(data.msg)
            if(data.status == 'success'){

                location.reload(true)
            }
        })


    }


    //..................FOR user management page...........//




    // console.log(window.location.href)




    if(pathname.startsWith('/admin/userManagement')){
        console.log(LOGINDATA, 45654654)
       

        let num1Input1 = document.getElementById('myShare');
        let num2Input1 = document.getElementById('Share');
        num1Input1.addEventListener('input', () => {
            const num11 = parseFloat(num1Input1.value);
            const num21 = 100 - num11;
            num2Input1.value = num21;
        });

        num2Input1.addEventListener('input', () => {
            const num21 = parseFloat(num2Input1.value);
            const num11 = 100 - num21;
            num1Input1.value = num11;
        });

        $(document).on("click", ".CreaditChange", function(e){
            e.preventDefault()
            var row = this.closest('tr');
            var dataId = row.getAttribute("data-id");
            socket.emit('commissionData', {LOGINDATA, dataId})
        })

        socket.on("commissionData", data => {
            console.log(data)
            if(data.status === "error"){
                alert("Please try again later")
            }else{
                console.log(data)
                let modleName = "#myModal2"
                let form = $(modleName).find('.form-data')
                console.log(data.commissionData[0].matchOdd.percentage)
                form.attr('id', data.id);
                form.find('input[name="matchOdds"]').attr('value', data.commissionData[0].matchOdd.percentage);
                form.find('input[name="Bookmaker"]').attr('value', data.commissionData[0].Bookmaker.percentage);
                form.find('input[name="fency"]').attr('value', data.commissionData[0].fency.percentage);
                let html1 = `<option value="ENTRY" selected>Entry Wise Commission</option>
                <option value="NET_LOSS">Net Losing Commission</option>
                <option value="ENTRY_LOSS_">Entry Wise Losing Commission</option>`
                let html2 = `<option value="ENTRY">Entry Wise Commission</option>
                <option value="NET_LOSS" selected>Net Losing Commission</option>
                <option value="ENTRY_LOSS_">Entry Wise Losing Commission</option>`
                let html3 = `<option value="ENTRY">Entry Wise Commission</option>
                <option value="NET_LOSS">Net Losing Commission</option>
                <option value="ENTRY_LOSS_" selected>Entry Wise Losing Commission</option>`

               let optionhtml= ''
                if(data.commissionData[0].Bookmaker.type == "ENTRY"){
                    form.find('select[name="BookmakerType"]').html(html1)
                    optionhtml += `<option value="0.025">0.025</option>
                    <option value="0.05">0.05</option>
                    <option value="0.075">0.075</option>
                    <option value="0.1">0.1</option>
                    <option value="0.125">0.125</option>
                    <option value="0.15">0.15</option>
                    <option value="0.175">0.175</option>
                    <option value="0.2">0.2</option>
                    `
                }else if(data.commissionData[0].Bookmaker.type == "NET_LOSS") {
                    form.find('select[name="BookmakerType"]').html(html2)
                    optionhtml += ` <option value="0.25">0.25</option>
                      <option value="0.5">0.5</option>
                      <option value="0.75">0.75</option>
                      <option value="1">1</option>
                      <option value="1.25">1.25</option>
                      <option value="1.5">1.5</option>
                      <option value="1.75">1.75</option>
                      <option value="2">2</option>
                      <option value="2.25">2.25</option>
                      <option value="2.50">2.50</option>
                      <option value="2.75">2.75</option>
                      <option value="3">3</option>`
                }else if (data.commissionData[0].Bookmaker.type == "ENTRY_LOSS_"){
                    form.find('select[name="BookmakerType"]').html(html3)
                    optionhtml += `<option value="0.25">0.25</option>
                    <option value="0.5">0.5</option>
                    <option value="0.75">0.75</option>
                    <option value="1">1</option>`
                }
                if(data.commissionData[0].Bookmaker.status){
                    $('[name="BookmakerStatus"]').prop('checked', true);
                }else{
                    $('[name="BookmakerStatus"]').prop('checked', false);
                }

                if(data.commissionData[0].fency.status){
                    $('[name="fencyStatus"]').prop('checked', true);
                }else{
                    $('[name="fencyStatus"]').prop('checked', false);
                }

                if(data.commissionData[0].matchOdd.status){
                    $('[name="matchOddsStatus"]').prop('checked', true);
                }else{
                    $('[name="matchOddsStatus"]').prop('checked', false);
                }
                document.getElementById("bookmakerPer").innerHTML = optionhtml
                form.find('select[name="Bookmaker"]').val(`${data.commissionData[0].Bookmaker.percentage}`)
                form.find('select[name="fency"]').val(`${data.commissionData[0].fency.percentage}`)
                form.find('select[name="matchOdds"]').val(`${data.commissionData[0].matchOdd.percentage}`)
            }
        })


        $(document).on("submit", ".CommissionForm", function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            data.id = this.id
            console.log(data)
            if(data.matchOddsStatus){
                data.matchOddsStatus = true
            }else{
                data.matchOddsStatus = false
            }
            if(data.fencyStatus){
                data.fencyStatus = true
            }else{
                data.fencyStatus = false
            }
            if(data.BookmakerStatus){
                data.BookmakerStatus = true
            }else{
                data.BookmakerStatus = false
            }
            // console.log(data)
            socket.emit("updateCommission", {LOGINDATA, data})
        })

        socket.on("updateCommission", async(data) =>  {
            if(data.status === "error"){
                alert("Please try again later")
            }else{
                alert("Updated!!")
            }
        })

        $(document).on("click", ".UserDetails", function(e) {
            e.preventDefault()
            var row = this.closest("tr");
            // var id = row.id;
            var dataId = row.getAttribute("data-id");
            window.location.href = `/admin/userdetails?id=${dataId}`
        })

        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            }          

        function sanitizeCellValue(value) {
        // Define a character whitelist (allow only printable ASCII and basic punctuation)
        const allowedCharactersRegex = /[\x20-\x7E\u0020-\u007E]/g;
        
        return value.match(allowedCharactersRegex).join(',').trim();
        }
            
        function convertToCSV(table) {
        const rows = table.querySelectorAll('tr');
        
        let csv = '';
        for (const row of rows) {
            const columns = row.querySelectorAll('td, th');
            let rowData = '';
            for (const column of columns) {
            
            const data = sanitizeCellValue(column.innerText);
            rowData += (data.includes(',') ? `"${data}"` : data) + ',';
            }
            csv += rowData.slice(0, -1) + '\n';
        }
        
        return csv;
        }
    
        document.getElementById('downloadBtn').addEventListener('click', function(e) {
            e.preventDefault()
            const table = document.getElementById('table12');             
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                const headers = table.querySelectorAll('thead th:not(:last-child)');
                const csvRows = [];

                // Extract headers
                const headerRow = Array.from(headers).map(header => header.textContent.trim());
                csvRows.push(headerRow.join(','));

                // Extract data from each row except the last column
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td:not(:last-child)');
                    const csvRow = Array.from(cells).slice(0, 13).map(cell => cell.textContent.trim());
                    csvRows.push(csvRow.join(','));
                });

                // Combine rows into a CSV string
                const csvContent = csvRows.join('\n');

                // Create a Blob and initiate download
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'table_data.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });

        $(document).on('click','.Deposite',function(e){
            var row = this.closest("tr");
            var id = row.id;
            var dataId = row.getAttribute("data-id");
            socket.emit("getUserDetaisl", {id, dataId})
        })

        socket.on("getUserDetaisl", data => {
            if(data.status === "error"){
                alert("Please Try again leter")
            }else{
            let modleName = "#myModal"
            let form = $(modleName).find('.form-data')
            let userData = data.user
            let me = data.parent
            let amount = parseFloat(form.find('input[name = "amount"]').val())
            let type = form.find('input[name = "type"]').val()
            if(type == "deposit"){
                form.find('.depositeWD').addClass('active')
                form.find('input[name = "toUser"]').attr('value',userData.userName)
                form.find('input[name = "fuBalance"]').attr('value',(me.availableBalance).toFixed(2))
                form.find('input[name = "tuBalance"]').attr('value',(userData.availableBalance).toFixed(2))
                form.find('input[name = "clintPL"]').attr('value',userData.clientPL)
                form.find('input[name = "fromUser"]').attr('value',me.userName)
                form.attr('id', userData._id)
                form.find('#fuBlanceAfter').text((me.availableBalance - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((userData.availableBalance + amount).toFixed(2))
            }else{
                form.find('.withdrawWD').addClass('active')
                form.find('input[name = "toUser"]').attr('value',me.userName)
                form.find('input[name = "fuBalance"]').attr('value',(userData.availableBalance).toFixed(2))
                form.find('input[name = "tuBalance"]').attr('value',(me.availableBalance).toFixed(2))
                form.find('input[name = "clintPL"]').attr('value',me.clientPL)
                form.find('input[name = "fromUser"]').attr('value',userData.userName)
                form.attr('id', userData._id)
                form.find('#fuBlanceAfter').text((userData.availableBalance - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((me.availableBalance + amount).toFixed(2))

            }
            }
        })

        $(document).on('change keyup','#myModal .form-data input[name="amount"]',function(e){
            let amount = parseFloat($(this).val())
            if($(this).val() == ""){
                amount = 0
            }
            console.log(amount)
            let form = $("#myModal").find('.form-data')
            let fromAmount = parseFloat(form.find('input[name="fuBalance"]').val())
            let toAmount = parseFloat(form.find('input[name="tuBalance"]').val())
            let type = form.find('input[name = "type"]').val()
            if(type == "deposit"){
                form.find('#fuBlanceAfter').text((fromAmount - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((toAmount + amount).toFixed(2))
            }else{
                form.find('#fuBlanceAfter').text((fromAmount + amount).toFixed(2))
                form.find('#tuBalanceAfter').text((toAmount - amount).toFixed(2))
            }


        })

        $(document).on('click','#myModal .acc-form .depositeWD',function(e){
            let modleName = "#myModal"
            let form = $(modleName).find('.form-data')
            let type = form.find('input[name = "type"]').val()
            let amount = parseFloat(form.find('input[name = "amount"]').val())

            if(type == 'deposit'){

            }else{
                form.find('.withdrawWD').removeClass('active')
                form.find('.depositeWD').addClass('active')
                let fromUSer = form.find('input[name = "toUser"]').val()
                let toUser = form.find('input[name = "fromUser"]').val()
                let tuBalance = parseFloat(form.find('input[name = "fuBalance"]').val())
                let fuBalance = parseFloat(form.find('input[name = "tuBalance"]').val())

                form.find('input[name = "type"]').val('deposit')
                form.find('input[name = "toUser"]').attr('value',toUser)
                form.find('input[name = "fuBalance"]').attr('value',fuBalance)
                form.find('input[name = "tuBalance"]').attr('value',tuBalance)
                form.find('input[name = "fromUser"]').attr('value',fromUSer)
                form.find('#fuBlanceAfter').text((fuBalance - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((tuBalance + amount).toFixed(2))

            }

        })
        $(document).on('click','#myModal .acc-form .withdrawWD',function(e){
            let modleName = "#myModal"
            let form = $(modleName).find('.form-data')
            let amount = parseFloat(form.find('input[name = "amount"]').val())
            let type = form.find('input[name = "type"]').val()
            if(type == 'deposit'){
                form.find('.withdrawWD').addClass('active')
                form.find('.depositeWD').removeClass('active')
                let fromUSer = form.find('input[name = "toUser"]').val()
                let toUser = form.find('input[name = "fromUser"]').val()
                let tuBalance = parseFloat(form.find('input[name = "fuBalance"]').val())
                let fuBalance = parseFloat(form.find('input[name = "tuBalance"]').val())

                form.find('input[name = "type"]').val('withdrawl')
                form.find('input[name = "toUser"]').attr('value',toUser)
                form.find('input[name = "fuBalance"]').attr('value',fuBalance)
                form.find('input[name = "tuBalance"]').attr('value',tuBalance)
                form.find('input[name = "fromUser"]').attr('value',fromUSer)
                form.find('#fuBlanceAfter').text((fuBalance - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((tuBalance + amount).toFixed(2))

            }else{

            }

        })

        // $(document).on("change", ".DepositW", function(e){
        //     e.preventDefault()
        //     let type = $(this).val()
        //     var row = this.closest('form');
        //     // console.log(row.id)
        //     var dataId = row.id;
        //     // console.log(dataId)
        //     socket.emit("DepositW", {dataId, type})
        // })

        // socket.on("DepositW", async(data) => {
        //     let modleName = "#myModal"
        //     let form = $(modleName).find('.form-data')
        //     let userData = data.user
        //     let me = data.parent
        //     if(data.type == "withdrawl"){
        //         form.find('input[name = "toUser"]').attr('value',me.userName)
        //         form.find('input[name = "fuBalance"]').attr('value',userData.availableBalance)
        //         form.find('input[name = "tuBalance"]').attr('value',me.availableBalance)
        //         form.find('input[name = "clintPL"]').attr('value',me.clientPL)
        //         form.find('input[name = "fromUser"]').attr('value',userData.userName)
        //         form.attr('id', userData._id); 
        //     }else{
        //         form.find('input[name = "toUser"]').attr('value',userData.userName)
        //         form.find('input[name = "fuBalance"]').attr('value',me.availableBalance)
        //         form.find('input[name = "tuBalance"]').attr('value',userData.availableBalance)
        //         form.find('input[name = "clintPL"]').attr('value',userData.clientPL)
        //         form.find('input[name = "fromUser"]').attr('value',me.userName)
        //         form.attr('id', userData._id);                 
        //     }
        // })


        $(document).on('click','.PasswordChange',function(){
            var row = this.closest("tr");
            var id = row.id;
            var dataId = row.getAttribute("data-id");
            socket.emit("getUserDetaislForPassChange", {id, dataId})
            // let rowId = $(this).parent().parent().attr('id')
            // // console.log(rowId)
            // $('.rowId').attr('data-rowid',rowId)
            // let modleName = $(this).data('bs-target')
            // let form = $(modleName).find('.form-data')
            // let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
            // let me = $('#meDatails').data('me')
            // form.find('input[name = "id"]').attr('value',userData._id)
        });
        socket.on("getUserDetaislForPassChange", data => {
            let modleName = "#myModal3"
            let form = $(modleName).find('.form-data')
            form.attr('id', data.user._id);
        })

        $(document).on('click','.betLockStatus', function(e) {
            var row = this.closest("tr");
            var id = row.id;
            var dataId = row.getAttribute("data-id");
            if(confirm('do you want to change status')){
                socket.emit("BetLockUnlock", {id, dataId})
            }
        })
        socket.on("BetLockUnlock", data => {
            if(data.status === "error"){
                alert("Please Try again leter")
            }else if (data.status){
                alert("Bet Locked Successfully")
                let row = $('#'+data.rowid)
                row.find('.betLockStatus').addClass("Locked")
                // let element = document.getElementsByClassName("betLockStatus")
                // for (var i = 0; i < element.length; i++) {
                //     element[i].classList.add("Locked");
                //   }
            }else if (!data.status){
                alert("Bet Unlocked Successfully")
                let row = $('#'+data.rowid)
                row.find('.betLockStatus').removeClass("Locked")
                // let elements = document.getElementsByClassName("betLockStatus")
                // for (var i = 0; i < elements.length; i++) {
                //     // console.log(element[i].classList)
                //     elements[i].classList.remove("Locked");
                //   }
            }
        })

        $(document).on('click', ".Settlement", function(){
            var row = this.closest("tr");
            var id = row.id;
            var dataId = row.getAttribute("data-id");
            socket.emit("getUserDetaisl111", {id, dataId})
        })

        $(document).on('change keyup','#myModalSE .form-data input[name="amount"]',function(e){
            let amount = parseFloat($(this).val())
            console.log(amount,"==>amount")
            if($(this).val() == ""){
                amount = 0
            }
            let form = $("#myModalSE").find('.form-data')
            let fromAmount = parseFloat(form.find('input[name="fuBalance"]').val())
            let toAmount = parseFloat(form.find('input[name="tuBalance"]').val())
            let type = form.find('input[name = "type"]').val()
            if(type == "deposit"){
                form.find('#fuBlanceAfter').text((fromAmount - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((toAmount + amount).toFixed(2))
            }else{
                form.find('#fuBlanceAfter').text((fromAmount + amount).toFixed(2))
                form.find('#tuBalanceAfter').text((toAmount - amount).toFixed(2))
            }


        })

        $(document).on('click','#myModalSE  .form-data  .deposite',function(e){
            let modleName = "#myModalSE"
            let form = $(modleName).find('.form-data')
            let amount = parseFloat(form.find('input[name="amount"]').val())

            let typeValue = form.find('input[name = "type"]').val()
            console.log(typeValue)

            if(typeValue == 'deposit'){

            }else if(typeValue == 'withdrawl'){
                form.find('.deposite').addClass('active')
                form.find('.withdraw').removeClass('active')
                let fromUSer = form.find('input[name = "toUser"]').val()
                let toUser = form.find('input[name = "fromUser"]').val()
                let tuBalance = parseFloat(form.find('input[name = "fuBalance"]').val())
                let fuBalance = parseFloat(form.find('input[name = "tuBalance"]').val())
                
                form.find('input[name = "type"]').val('deposit')
                form.find('input[name = "toUser"]').attr('value',toUser)
                form.find('input[name = "fuBalance"]').attr('value',fuBalance)
                form.find('input[name = "tuBalance"]').attr('value',tuBalance)
                form.find('input[name = "fromUser"]').attr('value',fromUSer)
                form.find('#fuBlanceAfter').text((fuBalance - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((tuBalance + amount).toFixed(2))

            }
        })

        

        $(document).on('click','#myModalSE  .form-data  .withdraw',function(e){
            let modleName = "#myModalSE"
            let form = $(modleName).find('.form-data')
            let amount = parseFloat(form.find('input[name="amount"]').val())
            let typeValue = form.find('input[name = "type"]').val()
            console.log(typeValue)
            if(typeValue == 'deposit'){
                form.find('.deposite').removeClass('active')
                form.find('.withdraw').addClass('active')
                let fromUSer = form.find('input[name = "toUser"]').val()
                let toUser = form.find('input[name = "fromUser"]').val()
                let tuBalance = parseFloat(form.find('input[name = "fuBalance"]').val())
                let fuBalance = parseFloat(form.find('input[name = "tuBalance"]').val())

                form.find('input[name = "type"]').val('withdrawl')
                form.find('input[name = "toUser"]').attr('value',toUser)
                form.find('input[name = "fuBalance"]').attr('value',fuBalance)
                form.find('input[name = "tuBalance"]').attr('value',tuBalance)
                form.find('input[name = "fromUser"]').attr('value',fromUSer)
                form.find('#fuBlanceAfter').text((fuBalance - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((tuBalance + amount).toFixed(2))
            }else if(typeValue == 'withdrawl'){
                
            }
        })

        socket.on("getUserDetaisl111", data => {
            if(data.status === "error"){
                alert("Please Try again leter")
            }else{
            let modleName = "#myModalSE"
            let form = $(modleName).find('.form-data')
            let userData = data.user
            let me = data.parent
            let type = form.find('select[name = "type"]').val()
            let amount = parseFloat(form.find('input[name = "amount"]').val())

            form.find('.deposite').removeClass('active')
            form.find('.withdraw').removeClass('active')
            if(userData.uplinePL >= 0){
                form.find('.deposite').addClass('active')
                form.find('input[name = "type"]').val("deposit")
                form.find('input[name = "toUser"]').attr('value',userData.userName)
                form.find('input[name = "fuBalance"]').attr('value',(me.availableBalance).toFixed(2))
                form.find('input[name = "tuBalance"]').attr('value',(userData.availableBalance).toFixed(2))
                form.find('input[name = "clintPL"]').attr('value',userData.pointsWL)
                form.find('input[name = "fromUser"]').attr('value',me.userName)
                form.attr('id', userData._id)
                form.find('#fuBlanceAfter').text((me.availableBalance - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((userData.availableBalance + amount).toFixed(2))

            }else{
                form.find('.withdraw').addClass('active')
                form.find('input[name = "type"]').val("withdrawl")
                form.find('input[name = "toUser"]').attr('value',me.userName)
                form.find('input[name = "fuBalance"]').attr('value',(userData.availableBalance).toFixed(2))
                form.find('input[name = "tuBalance"]').attr('value',(me.availableBalance).toFixed(2))
                form.find('input[name = "clintPL"]').attr('value',userData.pointsWL)
                form.find('input[name = "fromUser"]').attr('value',userData.userName)
                form.attr('id', userData._id)
                form.find('#fuBlanceAfter').text((userData.availableBalance - amount).toFixed(2))
                form.find('#tuBalanceAfter').text((me.availableBalance + amount).toFixed(2))

            }
            }
        })

        $(document).on('click','.StatusChange',function(){
            console.log("working")
            var row = this.closest("tr");
            var id = row.id;
            var dataId = row.getAttribute("data-id");
            socket.emit("userStatus", {id, dataId})
            // let rowId = $(this).parent().parent().attr('id')
            // // console.log(rowId)
            // $('.rowId').attr('data-rowid',rowId)
            // let modleName = $(this).data('bs-target')
            // let form = $(modleName).find('.form-data')
            // let userData = $(this).parent('td').siblings('.getOwnChild').data('bs-dismiss')
            // let me = $('#meDatails').data('me')
            // form.find('input[name = "id"]').attr('value',userData._id)
        })

        socket.on("userStatus", data => {
            if(data.status === "error"){
                alert("Please try again later")
            }else{
                let modleName = "#myModal4"
                let form = $(modleName).find('.form-data')
                // console.log(form)
                form.attr('id', data.user._id);
                if(data.user.isActive && data.user.betLock){
                    form.find('select[name = "status"]').val("betLock")
                }else if(data.user.isActive && !data.user.betLock){
                    form.find('select[name = "status"]').val("active")
                }else{
                    form.find('select[name = "status"]').val("suspended")
                }
                // console.log(data.user)
            }
        })
        
        // socket.on('getOwnChild',(data) => {
            // console.log(data)
            // let response = data.response;
            // if(data.status === 'success')
            // {
                
            //     $('table').html("<tr>"+
            //     "<th>S.No</th>"+
            //     "<th>User Name</th>"+
            //     "<th>White lable</th>"+
            //     "<th>Credit Reference</th>"+
            //     "<th>Balance</th>"+
            //     "<th>Available Balance</th>"+
            //     "<th>Downlevel Balance</th>"+
            //     "<th>Client P/L</th>"+
            //     "<th>Upline P/L</th>"+
            //     "<th>Exposure</th>"+
            //     "<th>Exposure limit</th>"+
            //     "<th>Lifetime Credit</th>"+
            // " <th>Lifetime Deposite</th>"+
            //     "<th>Action</th>"+
            // "</tr>")
            // let html ="";
            // for(let i = 0; i < response.length; i++){ 
            //     html +=
            //     `<tr>
            //         <td> ${i+1} </td>
            //         <td class="getOwnChild" data-id='${JSON.stringify(response[i])}'>${response[i].userName}</td>
            //         <td> ${response[i].whiteLabel}</td>
            //         <td> ${response[i].creditReference}</td>
            //         <td> ${response[i].balance}</td>
            //         <td> ${response[i].availableBalance}</td>
            //         <td> ${response[i].downlineBalance}</td>
            //         <td> ${response[i].clientPL}</td>
            //         <td> ${response[i].uplinePL}</td>
            //         <td> ${response[i].exposure}</td>
            //         <td> ${response[i].exposureLimit}</td>
            //         <td> ${response[i].lifeTimeCredit}</td>
            //         <td> ${response[i].lifeTimeDeposit}</td>
            //         <td>`
            //             if(data.currentUser.role.authorization.includes('userStatus')){
            //                 html += `<button class="userStatus" type="userStatus" id="${response[i]._id}" data-myval='${JSON.stringify(response[i])}'>U/S</button>`
            //             }
            //             if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
            //                 html += `<button class="betLockStatus" id="${response[i]._id}" data-myval='${JSON.stringify(response[i])}'>BetLock status</button>`
            //             }
            //             if(data.currentUser.role.authorization.includes('changeUserPassword')){
            //                 html += `<button ><a href="/resetPassword?id=${response[i]._id} ">change password</a></button>`
            //             }
            //             if(data.currentUser.role.authorization.includes('accountControl')){
            //                 html += `<button ><a href="/accountStatement?id=${response[i]._id} ">A/S</a></button>
            //                 <button ><a href="/DebitCredit?id=${response[i]._id}">D/C</a></button>`
            //             }
            //             if(data.currentUser.role.authorization.includes('userName')){
            //                 html += `<button ><a href="/updateUser?id=${response[i]._id} ">Details</a></button>`
            //             }
            //           html += `</td> </tr>`
            // }
            // $('table').append(html)
            //     html = '';
            //     for(let i=0;i<data.Rows;i++){
            //         html += `<a href="#" class="pagination">${i + 1}</a>`
            //     }
            //     $('.pageLink').html(html)
            //     $('#back').attr('data-me',JSON.stringify(data.me));
            // }
        // })
        //   $(document).on('click','.getOwnChild',function(e){
        //         e.preventDefault();
        //         let id = $(this).data('id')._id
        //         if($(this).data('id').role.roleName != 'user'){
        //             // sessionStorage.setItem('grandParentDetails',sessionStorage.getItem('parentDetails'))
        //             // sessionStorage.setItem('parentDetails',JSON.stringify($(this).data('id')))
        //             $('.pageLink').attr('data-page','1')
        //             // console.log(id)
        
        //             getOwnChild(id,0,'getOwnChild')
        
        //         }
        //     })
        
        //     $(document).on('click','#back',function(e){
        //         e.preventDefault();
        //         let parentId;
        //         parentId = JSON.parse(document.querySelector('#back').getAttribute('data-me')).parent_id  
        //         let loginuserparentid = JSON.parse(sessionStorage.getItem('loginUserDetails')).parent_id
        //         // console.log(parentId)
        //         // console.log(loginuserparentid)
        //         if(parentId != loginuserparentid){
        //                 getOwnChild(parentId,0,'getOwnChild')
        //         }
        //     })
            
        //     $(document).on('click','.pagination',function(e){
        //         let page = $(this).text()
        //         $('.pageLink').attr('data-page',page)
        //         let id = JSON.parse(document.querySelector('#back').getAttribute('data-me'))._id;
        //         // console.log(id)
        
        //         getOwnChild(id,page - 1,'getOwnChild')
        
        //     })

        function getOwnChild(id,page,token) {
            socket.emit(token,{
                id,
                page
            })
        
        }
        let count = 11;
        socket.on('getOwnChild',(data) => {
            // console.log(data)
            // console.log('rows',data.result)
            // let headHight = document.getElementsByClassName('HeadRow').height()
            // console.log( "user row height", $('.UserRow').height())
            // loadHight += (data.result * $('.UserRow').height()) 
            let response = data.response;
            if(data.status === 'success')
            {
                let html = ""
                if(data.page == 0){
                    count = 1;
                    if(LOGINDATA.LOGINUSER.roleName == "Admin"){
                        html += `<thead><tr>`+
                        "<th>S.No</th>"+
                        "<th>User Name</th>"+
                        "<th>White lable</th>"+
                        "<th>Type</th>"+
                        "<th>Credit Reference</th>"+
                        "<th>Available Balance</th>"+
                        "<th>Downlevel Balance</th>"+
                        "<th>Points W/L</th>"+
                        "<th>Upline P/L</th>"+
                        "<th>Exposure</th>"+
                        "<th>Action</th>"+
                    "</tr></thead>"
                    }else{
                        html += `<thead><tr>`+
                        "<th>S.No</th>"+
                        "<th>User Name</th>"+
                        "<th>Type</th>"+
                        "<th>Credit Reference</th>"+
                        "<th>Available Balance</th>"+
                        "<th>Downlevel Balance</th>"+
                        "<th>Points W/L</th>"+
                        "<th>Upline P/L</th>"+
                        "<th>Exposure</th>"+
                        "<th>Action</th>"+
                    "</tr></thead>"
                    }
                        
                    html +="<tbody class='new-body'>";
                }
                
                for(let i = 0; i < response.length; i++){ 
                    if((i+1) % 2 != 0){

                        html +=
                        `<tr  class="trtable" id="${count + i}" data-id="${response[i]._id}">`
                    }else{
                        html +=
                        `<tr class="trtable" id="${count + i}" data-id="${response[i]._id}">` 
                    }
                        
                    html += `<td> ${count + i} </td>
                        <td class="getOwnChild" data-bs-dismiss='${JSON.stringify(response[i])}'><div class="user-status-section">`
                        if(response[i].isActive && response[i].betLock){
                            html += `<span class="user-status bet-lock" >BL</span>`
                        }else if(response[i].isActive && !response[i].betLock){ 
                            html += `<span class="user-status active" >A</span>`
                        }else{
                            html += `<span class="user-status suspended" >S</span>`
                        }

                        if(response[i].roleName != 'user'){
                            html+= `<a href='/admin/userManagement?id=${response[i]._id}'>${response[i].userName}</a>`
                        }else{
                            html+= `${response[i].userName}`
                        }
                        html += `</div></td>`

                        html += `<td>  <span class="role-type">
                                    ${response[i].roleName}
                                </span>
                                </td>`

                        if(data.currentUser.roleName == "Admin"){
                            html += `<td> ${response[i].whiteLabel}</td>`
                        }else{

                        }
                        html += `
                        <td> ${response[i].balance}</td>
                        <td> ${response[i].availableBalance}</td>
                        <td> ${response[i].downlineBalance}</td>`
                        if(response[i].pointsWL > 0){

                            html += `<td class="green"> ${response[i].pointsWL}</td>`
                        }else{
                            html += `<td class="red"> ${response[i].pointsWL}</td>`

                        }

                        html += `<td> ${response[i].uplinePL}</td>
                        <td> ${response[i].exposure}</td>
                        <td>
                        <div class="btn-group">
                        `
                            if(data.currentUser.role.authorization.includes('accountControl')){
                                html += `<button data-bs-toggle="modal" data-bs-target="#myModal" class="Deposite" title="Deposit/Withdraw"> D/W </button>`
                            }
                            if(data.currentUser.role.authorization.includes('accountControl')){
                                html += `<button data-bs-toggle="modal" data-bs-target="#myModal2" class="CreaditChange" title="Commission">C</button>`
                            }
                            if(data.currentUser.role.authorization.includes('changeUserPassword')){
                                html += `<button data-bs-toggle="modal" data-bs-target="#myModal3" class="PasswordChange" title="Change Password">P</button>`
                            }
                            html += `<button  data-bs-toggle="modal" data-bs-target="#myModalSE" class="Settlement" title="Settlement">S</button>`
                            // if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
                            //     if(response[i].betLock){
                            //         html += `<button type="button" class="betLockStatus Locked" title="Bet Unlock">B</button>`
                            //     }else{ 
                            //         html += `<button type="button" class="betLockStatus" title="Bet Lock">B</button>`
                            //     } 
                            // }
                            if(data.currentUser.role.authorization.includes('userStatus')){
                                html += `<button data-bs-toggle="modal" data-bs-target="#myModal4" class="StatusChange" title="Change Status">CS</button>
                                `
                            }
                            if(data.currentUser.role.authorization.includes('userName')){
                                html += `<button class="UserDetails" title="View details"><i class="fa-solid fa-database"></i></button>`
                            }
                        html += `</div>
                        </td></td> </tr>`
                }
                count += 10;
                if(data.page == 0){
                    if(response.length == 0){
                        html += `<tr class="empty_table"><td>No record found</td></tr>`
                    }
                    html += `</tbody>`
                    $('#load-more').show()

                    $('table').html(html)
                    if(response.length == 0){
                        $('#load-more').hide()
                    }
                }else{
                    if(response.length == 0){
                        $('#load-more').hide()
                    }
                    $('tbody').append(html)

                }
            
                // html = '';
                // for(let i=0;i<data.Rows;i++){
                //     html += `<a href='/userManagement?id=${data.me_id}&page=${i}' class="pagination">${i + 1}</a>`
                // }
                // $('.pageLink').html(html)
                // $('#meDetails').attr('data-me',JSON.stringify(data.me));
            }
        })


        //.........for search in user management page.............//

        let filterData = {}
        let S = false
        let W = false
        let R = false
        let US = false
        $(document).on('change keyup','#searchUser, #ROLEselect, #WhiteLabelSelect, #userStatusSelect',function(e){
            // console.log($(this).hasClass("searchUser"), 123)
            console.log('check')
            if($(this).hasClass("WhiteLabelSelect")){
                    filterData.whiteLabel = $(this).val()
                    if(filterData.whiteLabel != "" && filterData.whiteLabel != undefined){
                        W = true
                    }else{
                        W = false
                        delete filterData.whiteLabel 
                    }
            }
            if($(this).hasClass("userStatusSelect")){
                    filterData.status = $(this).val()
                    if(filterData.status != "" && filterData.status != undefined){
                        US = true
                    }else{
                        US = false
                        delete filterData.status 
                    }
            }
            if($(this).hasClass("ROLEselect")){
                    filterData.role_type = $(this).val()
                    if(filterData.role_type != "" && filterData.role_type != undefined){
                        R = true
                    }else{
                        R = false
                        delete filterData.role_type 
                    }
            }

            if($(this).hasClass("searchUser")){
                    filterData.userName = $(this).val()
                    if(filterData.userName.length > 0){
                        S = true
                    }else{
                        S = false
                        delete filterData.userName
                    }
            }
        // console.log(W,S,R)
        // if(W || S || R){
               let page =  0;
               let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;
               console.log(filterData)
               socket.emit("search", {filterData,page,id, LOGINDATA })
        // }

    })
    
    $(document).on('click', ".COMMISSIONADMIN", function(e){
        e.preventDefault()
        console.log("working")
        socket.emit("claimCommissionAdmin", {LOGINDATA})
    })

    socket.on('claimCommissionAdmin', data => {
        if(data == "error"){
            alert("Please try again leter")
        }else{
            alert('commission claimed successfully')
            $('.COMMISSIONADMIN').text('Claim Commission (0)')
        }
    })

    $('#load-more').click(function(e){
        let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;

        let page = parseInt($('.rowId').attr('data-rowid'));


        $('.rowId').attr('data-rowid',page + 1)
       
                
        socket.emit("search", {filterData,page,id, LOGINDATA })
        
    })
   
        // socket.on("searchUser", (data)=>{
        //     // console.log(data[1]._id)
        //     console.log(data)
        //     let html = "";
        //     if(data.page == 0){
        //         count = 1;
        //         html = `
        //         <tr>
        //           <th>S.No</th>
        //           <th>User Name</th>
        //           <th>White lable</th>
        //           <th>Credit Reference</th>
        //           <th>Balance</th>
        //           <th>Available Balance</th>
        //           <th>Downlevel Balance</th>
        //           <th>Client P/L</th>
        //           <th>Upline P/L</th>
        //           <th>Exposure</th>
        //           <th>Exposure limit</th>
        //           <th>Lifetime Credit</th>
        //           <th>Lifetime Deposite</th>
        //           <th>Action</th>
        //         </tr>` 
        //         $('table').html(html)  
        //     }
        //     html = ""
        //     for(let i = 0; i < data.user.length; i++){
        //         if(data.user.roleName == 'user'){
        //             html += `<tr>
        //         <td>${i + count}</td>
        //         <td>${data.user[i].userName}</td>
        //         <td>${data.user[i].whiteLabel}</td>
        //         <td>${data.user[i].creditReference}</td>
        //         <td>${data.user[i].balance}</td>
        //         <td>${data.user[i].availableBalance}</td>
        //         <td>${data.user[i].downlineBalance}</td>
        //         <td>${data.user[i].clientPL}</td>
        //         <td>${data.user[i].uplinePL}</td>
        //         <td>${data.user[i].exposure}</td>
        //         <td>${data.user[i].exposureLimit}</td>
        //         <td>${data.user[i].lifeTimeCredit}</td>
        //         <td>${data.user[i].lifeTimeDeposit}</td>
        //         <td>`
        //         }else{
        //             html += `<tr>
        //         <td>${i + count}</td>
        //         <td><a href='/userManagement?id=${data.user[i]._id}'>${data.user[i].userName}</a></td>
        //         <td>${data.user[i].whiteLabel}</td>
        //         <td>${data.user[i].creditReference}</td>
        //         <td>${data.user[i].balance}</td>
        //         <td>${data.user[i].availableBalance}</td>
        //         <td>${data.user[i].downlineBalance}</td>
        //         <td>${data.user[i].clientPL}</td>
        //         <td>${data.user[i].uplinePL}</td>
        //         <td>${data.user[i].exposure}</td>
        //         <td>${data.user[i].exposureLimit}</td>
        //         <td>${data.user[i].lifeTimeCredit}</td>
        //         <td>${data.user[i].lifeTimeDeposit}</td>
        //         <td>`
        //         }
        //         if(data.currentUser.role.authorization.includes('userStatus')){
        //             html += `<button class="userStatus" type="userStatus" id="${data.user[i]._id}" data-myval='${JSON.stringify(data.user[i])}'>U/S</button>`
        //         }
        //         if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
        //             html += `<button class="betLockStatus" id="${data.user[i]._id}" data-myval='${JSON.stringify(data.user[i])}'>BetLock status</button>`
        //         }
        //         if(data.currentUser.role.authorization.includes('changeUserPassword')){
        //             html += `<button ><a href="/resetPassword?id=${data.user[i]._id} ">change password</a></button>`
        //         }
        //         if(data.currentUser.role.authorization.includes('accountControl')){
        //             html += `<button ><a href="/accountStatement?id=${data.user[i]._id} ">A/S</a></button>
        //             <button ><a href="/DebitCredit?id=${data.user[i]._id} ">D/C</a></button>`
        //         }
        //         if(data.currentUser.role.authorization.includes('userName')){
        //             html += `<button ><a href="/updateUser?id=${data.user[i]._id} ">Details</a></button>`
        //         }
        //         html += `</td> </tr> `
        //     }
        //     count += 10;
        //     // html += "</table>"
        //     $('table').append(html)
        //     // document.getElementById("table1").innerHTML = html
        // })

        socket.on('searchErr',(data) => {
            alert(data.message)
        })



        // socket.on('searchUser2', (data) => {
        //     // console.log(data)
        //     let html = `<table style="width:100%">
        //     <tr>
        //       <th>S.No</th>
        //       <th>User Name</th>
        //       <th>White lable</th>
        //       <th>Credit Reference</th>
        //       <th>Balance</th>
        //       <th>Available Balance</th>
        //       <th>Downlevel Balance</th>
        //       <th>Client P/L</th>
        //       <th>Upline P/L</th>
        //       <th>Exposure</th>
        //       <th>Exposure limit</th>
        //       <th>Lifetime Credit</th>
        //       <th>Lifetime Deposite</th>
        //       <th>Action</th>
        //     </tr>
        //     <tr>
        //     <td>1</td>
        //     <td class="getOwnChild" data-id='${JSON.stringify(data.user)}'>${data.user.userName}</td>
        //     <td>${data.user.whiteLabel}</td>
        //     <td>${data.user.creditReference}</td>
        //     <td>${data.user.balance}</td>
        //     <td>${data.user.availableBalance}</td>
        //     <td>${data.user.downlineBalance}</td>
        //     <td>${data.user.clientPL}</td>
        //     <td>${data.user.uplinePL}</td>
        //     <td>${data.user.exposure}</td>
        //     <td>${data.user.exposureLimit}</td>
        //     <td>${data.user.lifeTimeCredit}</td>
        //     <td>${data.user.lifeTimeDeposit}</td>
        //     <td>`
        //     if(data.currentUser.role.authorization.includes('userStatus')){
        //         html += `<button class="userStatus" type="userStatus" id="${data.user._id}" data-myval='${JSON.stringify(data.user)}'>U/S</button>`
        //     }
        //     if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
        //         html += `<button class="betLockStatus" id="${data.user._id}" data-myval='${JSON.stringify(data.user)}'>BetLock status</button>`
        //     }
        //     if(data.currentUser.role.authorization.includes('changeUserPassword')){
        //         html += `<button ><a href="/resetPassword?id=${data.user._id} ">change password</a></button>`
        //     }
        //     if(data.currentUser.role.authorization.includes('accountControl')){
        //         html += `<button ><a href="/accountStatement?id=${data.user._id} ">A/S</a></button>
        //         <button ><a href="/DebitCredit?id=${data.user._id} ">D/C</a></button>`
        //     }
        //     if(data.currentUser.role.authorization.includes('userName')){
        //         html += `<button ><a href="/updateUser?id=${data.user._id} ">Details</a></button>`
        //     }
        //   html += `</td> </tr> </table>`
        // //     <button class="userStatus" type="userStatus" id="${data.user._id }" data-myval="${JSON.stringify(data.user)}">U/S</button>
        // //       <button class="betLockStatus" id="${data.user._id}" data-myval="${JSON.stringify(data.user)}">BetLock status</button>
        // //       <button ><a href="/resetPassword?id=${data.user._id}">change password</a></button>
        // //       <button ><a href="/accountStatement?id=${data.user._id}">A/S</a></button>
        // //       <button ><a href="/updateUser?id=${data.user._id}">Details</a></button>
        // //       <button><a href="/DebitCredit?id=${data.user._id}">D/C</a></button>
        // //     </td>
        // // </tr>
        // // </table>
        //     document.getElementById("table1").innerHTML = html
        // })

        socket.on('load1', (data) => {
            // console.log(data)
        })

    }




    //for inactive users//
    if(pathname == "/admin/inactiveUser"){
        $(document).on('click','.userStatusActive',function(e){
            e.preventDefault();
            let id = $(this).data('id')
            socket.emit('UserActiveStatus', {id, LOGINDATA})
        })
        $(document).on('click','.Delete',function(e){
            e.preventDefault();
            let id = $(this).data('id')
            socket.emit("deleteUser", {id, LOGINDATA});
        })
        socket.on("inActiveUserDATA", (data) => {
            let html = `<table style="width:100%">
            <tr>
              <th>S.No</th>
              <th>User Name</th>
              <th>White lable</th>
              <th>Action</th>
            </tr>`
            for(let i = 0; i < data.length; i++){
                html += `<tr>
                <td>${i + 1}</td>
                <td>${data[i].userName}</td>
                <td>${data[i].whiteLabel}</td>
                <td>
                  <button class="userStatusActive" type="userStatusActive" id="userStatusActive" data-id="${data[i]._id}">User status Active</button>
                  <button class="Delete" type="Delete" id="Delete" data-id="${data[i]._id}">Delete</button>
                </td>
              </tr>`
            }
            html += `</table>`
            // console.log(html)
            document.getElementById('table1_Inactive').innerHTML = html
        })
        socket.on('inActiveUserDATA1', (data) => {
            let html = `<table style="width:100%">
            <tr>
              <th>S.No</th>
              <th>User Name</th>
              <th>White lable</th>
              <th>Action</th>
            </tr>`
            for(let i = 0; i < data.length; i++){
                html += `<tr>
                <td>${i + 1}</td>
                <td>${data[i].userName}</td>
                <td>${data[i].whiteLabel}</td>
                <td>
                  <button class="userStatusActive" type="userStatusActive" id="userStatusActive" data-id="${data[i]._id}">User status Active</button>
                  <button class="Delete" type="Delete" id="Delete" data-id="${data[i]._id}">Delete</button>
                </td>
              </tr>`
            }
            html += `</table>`
            // console.log(html)
            document.getElementById('table1_Inactive').innerHTML = html
        })
    }
    //for online users//
    if(pathname == "/admin/loginUser"){
        // $(document).on('click','.userLogout',function(){
        //     let id = $(this).data('id');
        //     $(this).parent().parent().html('')
        //     socket.emit('logOutUser',{id, LOGINDATA})
        // })
        // socket.on('logOutUser',(data) => {
        //     // console.log(data.users)

        // })
    }




    if(pathname == "/admin/myaccount"){


        function generatePDF(table) {
            const printWindow = window.open('', '_blank');
                    printWindow.document.open();
                    printWindow.document.write(`
                    <html>
                        <head>
                        <title>Account Statement</title>
                        </head>
                        <body>
                        ${table.outerHTML}
                        </body>
                    </html>
                    `);
                    printWindow.document.close();

                    printWindow.print();
                
          }

        document.getElementById('pdfDownload').addEventListener('click', function() {
            console.log("Working")
            const table = document.getElementById('table12');
            
            if (table) {
              generatePDF(table);
            }
          });

        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }          

        function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            const csv = [];
            
            for (const row of rows) {
              const rowData = [];
              const columns = row.querySelectorAll('td, th');
              
              for (const column of columns) {
                rowData.push(column.innerText);
              }
              
              csv.push(rowData.join(','));
            }
            
            return csv.join('\n');
          }


        document.getElementById('downloadBtn').addEventListener('click', function() {
            const table = document.getElementById('table12');             
            if (table) {
              const csvContent = convertToCSV(table);
              downloadCSV(csvContent, 'AccountStatement.csv');
            }
          });

        // console.log($('.searchUser'))
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })
        let model 

        $(document).on('click','.ownAccDetails',function(e){
            let modelId = $(this).attr('id')
            let modelId1 = $(this).attr("data-bs-target")
            model =  $(modelId1)
            socket.emit("ElementID", modelId)
        })

        socket.on('getMyBetDetails',(data)=>{
            // console.log(data)
            let html = ``
            if(data.transactionId){
                html += `<thead>
                <tr >
                  <th>Date</th>
                  <th>Event</th>
                  <th>Market</th>
                  <th>Bet on</th>
                  <th>odds</th>
                  <th>Stake</th>
                  <th>Status</th>
                  <th>Returns</th>
                </tr>
                </thead>`
                html += `<tbody class="new-body" >
                <tr  class="blue"><td>${new Date(data.date)}</td>
                <td>${data.event}</td>`
                if(data.marketName){
                    html += `<td>${data.marketName}</td>`
                }else{
                    html += `<td>-</td>`
                }

                if(data.selectionName){
                    html += `<td>${data.selectionName}</td>`
                }else{
                    html += `<td>-</td>`
                }
                if(data.oddValue){
                    html += `<td>${data.oddValue}</td>`
                }else{
                    html += `<td>-</td>`
                }

                html += `
                <td>${data.Stake}</td>
                <td>${data.status}</td>
                <td>${data.returns}</td></tr></tbody>`
                model.find('table').html(html)
            }else{
                html += `<thead>
                <tr >
                  <th>Date</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>From/To</th>
                  <th>Closing</th>
                  <th>Description</th>
                  <th>Remarks</th>
                </tr>
            </thead>
            <tbody class="new-body" >`
                html += `<tr style="text-align: center;" class="blue"><td>${new Date(data.date)}</td>`
                if(data.creditDebitamount>0){
                    html += `<td>${data.creditDebitamount}</td><td>0</td>`
                    if(data.parent_id){
                        if(data.parent_id.userName == data.user_id.userName){
                            if(data.child_id == null){
                                html += `<td>-/${data.parent_id.userName}</td>`
                            }else{
                                html += `<td>${data.child_id.userName}/${data.parent_id.userName}</td>`
                            }
                        }else{
                            if(data.child_id == null){

                                html += `<td>${data.parent_id.userName}/-</td>`
                            }else{

                                html += `<td>${data.parent_id.userName}/${data.child_id.userName}</td>`
                            }
                        }
                    }else{
                        html += "<td>-</td>"
                    }
                }else{
                    html += `<td>0</td><td>${data.creditDebitamount}</td>`
                    if(data.parent_id){
                        if(data.parent_id.userName == data.user_id.userName){
                            if(data.child_id == null){
                                html += `<td>${data.parent_id.userName}/-</td>`
                            }else{
                                html += `<td>${data.parent_id.userName}/${data.child_id.userName}</td>`
                            }
                        }else{
                            if(data.child_id == null){
                                html += `<td>-/${data.parent_id.userName}</td>`
                            }else{
                                html += `<td>${data.child_id.userName}/${data.parent_id.userName}</td>`
                            }
                        }
                    }else{
                        html += `<td>-</td>`
                    }
                }
                
                        html += `
                        <td>${data.balance}</td>
                        <td>${data.description}</td>
                        <td>-</td></tr></tbody>`
                        // console.log(html)
                        model.find('table').html(html)
                    }
            // console.log(model)
        })
            // let 
            // let data = $(this).parent().parent().data('details')
            // let html = '';
            // if(data.hasOwnProperty('transactionId')){
            //     socket.emit('getMyBetDetails',data.transactionId)
                
            //         // console.log(data)
                   

            // }
            
    
            //     
            // }

        
        
            // console.log(data)


        
        socket.on("ACCSEARCHRES", async(data)=>{
            // console.log(data, 565464)
            $('.wrapper').show()
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        let searchU 
        let SUSER
        let match = false
        // $(".searchUser").on('input', function(e){
        //     var $input = $(this),
        //         val = $input.val();
        //         // console.log(val,1234)
        //         var listItems = document.getElementsByTagName("li");
        //         for (var i = 0; i < listItems.length; i++) {
        //             if (listItems[i].textContent === val) {
        //                 match = ($(this).val() === val);
        //               break; 
        //             }else{
        //                 match = false
        //             }
        //           }
        //         // console.log(match, 123)
        //      if(match) {
        //         searchU = true
        //         let  data = {}
        //         let Fdate = document.getElementById("Fdate").value
        //         let Tdate = document.getElementById("Tdate").value
        //         if(!Fdate){
        //             Fdate = 'undefined'
        //         }
        //         if(!Tdate){
        //             Tdate = 'undefined'
        //         }
        //         data.Fdate = Fdate;
        //         data.Tdate = Tdate;
        //         data.userName = val
        //         SUSER = val
        //         data.Tdate = document.getElementById("Tdate").value
        //         data.page = 0
        //         data.LOGINDATA = LOGINDATA
        //         $('.pageLink').attr('data-page',1)
        //         // console.log(data, 456)
        //          socket.emit( "UserSearchId", data)
        //      }else{
        //         searchU = false
        //      }
        // });

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            searchU = true
                let  data = {}
                let Fdate = document.getElementById("Fdate").value
                let Tdate = document.getElementById("Tdate").value
               
                
                data.Fdate = Fdate;
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                 
                data.id = this.id
                SUSER = this.id
                data.page = 0
                data.LOGINDATA = LOGINDATA
                $('.pageLink').attr('data-page',1)
                $('.wrapper').hide()
                // console.log(data, 456)
                console.log(data)
                socket.emit( "AccountScroll", data)
        })

        $('#Fdate,#Tdate').change(function(){
            
            let page = 0;
            $('.pageLink').attr('data-page',1)           
            Fdate = document.getElementById("Fdate").value
            Tdate = document.getElementById("Tdate").value
            let data = {}
            if(searchU){
                 data.id = SUSER
                 data.page = page
                 data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                 
                data.LOGINDATA = LOGINDATA
            }{
                 data.page = page
                 data.Fdate = Fdate
                 if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                 
                
                data.LOGINDATA = LOGINDATA
            }
            socket.emit('AccountScroll',data)        
        })

        $('#load-more').click(function(e){
            let page = parseInt($('.pageLink').attr('data-page'));
            // console.log(page)
            Fdate = document.getElementById("Fdate").value
            Tdate = document.getElementById("Tdate").value
            $('.pageLink').attr('data-page',page + 1)
            let data = {}
           if(searchU){
                data.id = SUSER
                data.page = page
                data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }
                data.LOGINDATA = LOGINDATA
           }{
                data.page = page
                data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                
                data.LOGINDATA = LOGINDATA
           }
           console.log(data)
            
            socket.emit('AccountScroll',data)
        })
    

         let count1 = 11
         socket.on("Acc", async(data) => {
            console.log(data)
            if(data.json.status == "success"){

                if(data.page == 0){
                    count1 = 1;
                }
                let html = "";
                for(let i = 0; i < data.json.userAcc.length; i++){
                    let date = new Date(data.json.userAcc[i].date);
                    // let abc =date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()
                    // console.log(abc)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue" >
                        <td>${count1 + i}</td>
                        <td class="text-nowrap" >${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td class="text-nowrap" >${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].creditDebitamount > 0){
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>-/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }else{
                                        html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }
                                }else{
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `${data.json.userAcc[i].parent_id.userName}/-`
                                    }else{

                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                    }
                                }
                            }else{
                                html += "<td>-</td>"
                            }
                        }else{
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/-</td>`
                                    }else{

                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                    }
                                }else{
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>-/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }else{

                                        html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }
                                }
                            }else{
                                html += `<td>-</td>`
                            }
                        }
                        html += `<td>${(data.json.userAcc[i].balance - data.json.userAcc[i].creditDebitamount).toFixed(2)}</td>
                        <td>${data.json.userAcc[i].creditDebitamount}</td><td>${data.json.userAcc[i].balance}</td>`
                        if(data.json.userAcc[i].Remark){
                            html += `<td>${data.json.userAcc[i].Remark}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                    }else{
                        html += `<tr style="text-align: center;" >
                        <td>${count1 + i}</td>
                        <td class="text-nowrap" >${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td class="text-nowrap" >${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].creditDebitamount > 0){
                           
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>-/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }else{
                                        html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }
                                }else{
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/-</td>`
                                    }else{
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                    }
                                }
                            }else{
                                html += "<td>-</td>"
                            }
                        }else{
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/-</td>`
                                    }else{
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                    }
                                }else{
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>-/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }else{

                                        html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }
                                }
                            }else{
                                html += `<td>-</td>`
                            }
                        }
                        html += `<td>${(data.json.userAcc[i].balance - data.json.userAcc[i].creditDebitamount).toFixed(2)}</td>
                        <td>${data.json.userAcc[i].creditDebitamount}</td><td>${data.json.userAcc[i].balance}</td>`
                        if(data.json.userAcc[i].Remark){
                            html += `<td>${data.json.userAcc[i].Remark}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                    }
                }
                count1 += 10;
                if(data.page == 0){
                    if(data.json.userAcc.length == 0){
                        html += `<tr class="empty_table"><td>No record found</td></tr>`
                        $('#load-more').hide()
                    }
                    $('tbody').html(html)

                }else {
                    if(data.json.userAcc.length == 0){
                        $('#load-more').hide()
                    }
                    $('tbody').append(html)

                }
            }
         })

     
    }
    if(pathname == "/admin/useraccount"){


        function generatePDF(table) {
            const printWindow = window.open('', '_blank');
                    printWindow.document.open();
                    printWindow.document.write(`
                    <html>
                        <head>
                        <title>Account Statement</title>
                        </head>
                        <body>
                        ${table.outerHTML}
                        </body>
                    </html>
                    `);
                    printWindow.document.close();

                    printWindow.print();
                
          }

        document.getElementById('pdfDownload').addEventListener('click', function() {
            console.log("Working")
            const table = document.getElementById('table12');
            
            if (table) {
              generatePDF(table);
            }
          });

        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }          

        function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            const csv = [];
            
            for (const row of rows) {
              const rowData = [];
              const columns = row.querySelectorAll('td, th');
              
              for (const column of columns) {
                rowData.push(column.innerText);
              }
              
              csv.push(rowData.join(','));
            }
            
            return csv.join('\n');
          }


        document.getElementById('downloadBtn').addEventListener('click', function() {
            const table = document.getElementById('table12');             
            if (table) {
              const csvContent = convertToCSV(table);
              downloadCSV(csvContent, 'AccountStatement.csv');
            }
          });

        // console.log($('.searchUser'))
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })
        let model 

        $(document).on('click','.ownAccDetails',function(e){
            let modelId = $(this).attr('id')
            let modelId1 = $(this).attr("data-bs-target")
            model =  $(modelId1)
            console.log('elementId',modelId)
            socket.emit("ElementID", modelId)
        })

        socket.on('getMyBetDetails',(data)=>{
            console.log(data)
            let html = ``
            if(data.transactionId){
                html += `<thead>
                <tr >
                  <th>Date</th>
                  <th>Event</th>
                  <th>Market</th>
                  <th>Bet on</th>
                  <th>odds</th>
                  <th>Stake</th>
                  <th>Status</th>
                  <th>Returns</th>
                </tr>
                </thead>`
                html += `<tbody class="new-body" >
                <tr  class="blue"><td>${new Date(data.date)}</td>
                <td>${data.event}</td>`
                if(data.marketName){
                    html += `<td>${data.marketName}</td>`
                }else{
                    html += `<td>-</td>`
                }

                if(data.selectionName){
                    html += `<td>${data.selectionName}</td>`
                }else{
                    html += `<td>-</td>`
                }
                if(data.oddValue){
                    html += `<td>${data.oddValue}</td>`
                }else{
                    html += `<td>-</td>`
                }

                html += `
                <td>${data.Stake}</td>
                <td>${data.status}</td>
                <td>${data.returns}</td></tr></tbody>`
                model.find('table').html(html)
            }else{
                html += `<thead>
                <tr >
                  <th>Date</th>
                  <th>Balance Before</th>
                  <th>Balance After</th>
                  <th>Amount</th>
                  <th>Remarks</th>
                </tr>
                </thead>
                <tbody class="new-body" >`
                html += `<tr>`
                html += `<td>${new Date(data.date)}</td>`
                html += `<td>${((data.balance - data.creditDebitamount).toFixed(2))}</td>`
                html += `<td>${(data.balance)}</td>`
                html += `<td>${(data.creditDebitamount)}</td>`
                if(data.Remark){
                    html += `<td>${(data.Remark)}</td>`
                }else{
                    html += `<td>-</td>`
                }
                html += `</tr></tbody>`
                model.find('table').html(html)
            }
            // console.log(model)
        })
            // let 
            // let data = $(this).parent().parent().data('details')
            // let html = '';
            // if(data.hasOwnProperty('transactionId')){
            //     socket.emit('getMyBetDetails',data.transactionId)
                
            //         // console.log(data)
                   

            // }
            
    
            //     
            // }

        
        
            // console.log(data)


        
        socket.on("ACCSEARCHRES", async(data)=>{
            // console.log(data, 565464)
            $('.wrapper').show()
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        let searchU 
        let SUSER
        let match = false
       

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            searchU = true
                let  data = {}
                let Fdate = document.getElementById("Fdate").value
                let Tdate = document.getElementById("Tdate").value
               
                
                data.Fdate = Fdate;
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }  
                data.id = this.id
                SUSER = this.id
                data.page = 0
                data.LOGINDATA = LOGINDATA
                $('.pageLink').attr('data-page',1)
                $('.wrapper').hide()
                // console.log(data, 456)
                console.log(data)
                socket.emit( "AccountScroll2", data)
        })

        $('#Fdate,#Tdate').change(function(){
            
            let page = 0;
            $('.pageLink').attr('data-page',1)           
            Fdate = document.getElementById("Fdate").value
            Tdate = document.getElementById("Tdate").value
            let data = {}
            if(searchU){
                 data.id = SUSER
                 data.page = page
                 data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                 
                data.LOGINDATA = LOGINDATA
            }{
                 data.page = page
                 data.Fdate = Fdate
                 if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                 
                
                data.LOGINDATA = LOGINDATA
            }

            console.log(data)
            socket.emit('AccountScroll2',data)        
        })

        $('#load-more').click(function(e){
            let page = parseInt($('.pageLink').attr('data-page'));
            // console.log(page)
            Fdate = document.getElementById("Fdate").value
            Tdate = document.getElementById("Tdate").value
            $('.pageLink').attr('data-page',page + 1)
            let data = {}
           if(searchU){
                data.id = SUSER
                data.page = page
                data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }
                data.LOGINDATA = LOGINDATA
           }{
                data.page = page
                data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                
                data.LOGINDATA = LOGINDATA
           }
           console.log(data)
            
            socket.emit('AccountScroll2',data)
        })
    

         let count1 = 11
         socket.on("Acc2", async(data) => {
            console.log(data)
            if(data.json.status == "success"){
                let html = "";
                let html1 = "";
                
                if(data.page == 0){
                    count1 = 1;
                    html1 += `
                    <div class="skin-data green">
                        
                        <h5>Credit Reference</h5>
                        <h6> ${data.user.creditReference.toFixed(2)}</h6>
                    </div>
                    <!-- <div class="skin-data green">
                      
                      <h5>Balance</h5>
                        <h6> ${data.user.balance.toFixed(2)}</h6>
                    </div> -->
                    <div class="skin-data green">
                      
                      <h5>Available Balance</h5>
                        <h6> ${data.user.availableBalance.toFixed(2)}</h6>
                    </div>
                    <div class="skin-data green">
                      
                      <h5>Downline Balance</h5>
                        <h6> ${data.user.downlineBalance.toFixed(2)}</h6>
                    </div>`
                    if(data.user.myPL.toFixed(2) > 0){
                    html1 += `<div class="skin-data green">`
                      }else{
                        html1 += `<div class="skin-data red">`
                      }
                        html1 += `<h5>MY P/L</h5>
                          <h6> ${data.user.myPL.toFixed(2)}</h6>
                      </div>`
                      if(data.user.uplinePL.toFixed(2) > 0){
                        html1 += `<div class="skin-data green">`
                      }else{ 
                        html1 += `<div class="skin-data red">`
                      } 
                      
                      html1 += `<h5>Upline P/L</h5>
                        <h6> ${data.user.uplinePL.toFixed(2)}</h6>
                    </div>`
                    if(data.user.lifetimePL.toFixed(2) > 0){
                      html1 += `<div class="skin-data green">`
                    }else{ 
                      html1 += `<div class="skin-data red">`
                    } 
                      
                      html1 += `<h5>Lifetime P/L</h5>
                        <h6> ${data.user.lifetimePL.toFixed(2)}</h6>
                    </div>
                  
                  `
                  $('.welcome-info-btn').html(html1)
                }
                for(let i = 0; i < data.json.userAcc.length; i++){
                    let date = new Date(data.json.userAcc[i].date);
                    // let abc =date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()
                    // console.log(abc)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue" >
                        <td>${count1 + i}</td>
                        <td class="text-nowrap" >${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td class="text-nowrap" >${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].transactionId){
                            if(data.json.userAcc[i].betDetails.length != 0){

                                if(data.json.userAcc[i].betDetails[0].event){
    
                                    html += `<td>${data.json.userAcc[i].betDetails[0].event}</td>`
                                }else{
                                    html += `<td>-}</td>`
    
                                }
                                if(data.json.userAcc[i].betDetails[0].marketName){
    
                                    html += `<td>${data.json.userAcc[i].betDetails[0].marketName}</td>`
                                }else{
    
                                    html += `<td>-</td>`
                                }
                            }else{
                                html += `<td>-</td><td>-</td>`
                            }
                        }else{
                            html += `<td>-</td><td>-</td>`

                        }
                        if(data.json.userAcc[i].creditDebitamount > 0){
                            html += `<td>${data.json.userAcc[i].creditDebitamount}</td>
                            <td>0</td>`
                        }else{
                            html += `<td>0</td><td>${data.json.userAcc[i].creditDebitamount}</td>`
                        }
                        html += `<td>${data.json.userAcc[i].balance}</td>
                        <td><a class="ownAccDetails" id="${data.json.userAcc[i]._id}" style="background-color: transparent;" data-bs-toggle="modal" data-bs-target="#myModal5"> ${data.json.userAcc[i].description}&nbsp;</a></td>`
                        if(data.json.userAcc[i].Remark){
                            html += `<td>${data.json.userAcc[i].Remark}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                    }else{
                        html += `<tr style="text-align: center;" >
                        <td>${count1 + i}</td>
                        <td class="text-nowrap" >${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td class="text-nowrap" >${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].transactionId){
                            if(data.json.userAcc[i].betDetails.length != 0){

                                if(data.json.userAcc[i].betDetails[0].event){
    
                                    html += `<td>${data.json.userAcc[i].betDetails[0].event}</td>`
                                }else{
                                    html += `<td>-}</td>`
    
                                }
                                if(data.json.userAcc[i].betDetails[0].marketName){
    
                                    html += `<td>${data.json.userAcc[i].betDetails[0].marketName}</td>`
                                }else{
    
                                    html += `<td>-</td>`
                                }
                            }else{
                                html += `<td>-</td><td>-</td>`
                            }
                        }else{
                            html += `<td>-</td><td>-</td>`

                        }
                        if(data.json.userAcc[i].creditDebitamount > 0){
                            html += `<td>${data.json.userAcc[i].creditDebitamount}</td>
                            <td>0</td>`
                        }else{
                            html += `<td>0</td><td>${data.json.userAcc[i].creditDebitamount}</td>`
                        }
                       
                        html += `<td>${data.json.userAcc[i].balance}</td>
                        <td><a class="ownAccDetails" id="${data.json.userAcc[i]._id}"  data-bs-toggle="modal" data-bs-target="#myModal5"> ${data.json.userAcc[i].description}&nbsp;</a></td>`
                        if(data.json.userAcc[i].Remark){
                            html += `<td>${data.json.userAcc[i].Remark}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                    }
                }
                count1 += 10;
                if(data.page == 0){
                    if(data.json.userAcc.length == 0){
                        html += `<tr class="empty_table"><td>No record found</td></tr>`
                    }else{
                        $('#load-more').show()

                    }
                    $('tbody').html(html)

                }else {
                    if(data.json.userAcc.length == 0){
                        $('#load-more').hide()
                    }
                    $('tbody').append(html)

                }
            }
         })

     
    }
    if(pathname == "/admin/adminaccount"){


        function generatePDF(table) {
            const printWindow = window.open('', '_blank');
                    printWindow.document.open();
                    printWindow.document.write(`
                    <html>
                        <head>
                        <title>Account Statement</title>
                        </head>
                        <body>
                        ${table.outerHTML}
                        </body>
                    </html>
                    `);
                    printWindow.document.close();

                    printWindow.print();
                
          }

        document.getElementById('pdfDownload').addEventListener('click', function() {
            console.log("Working")
            const table = document.getElementById('table12');
            
            if (table) {
              generatePDF(table);
            }
          });

        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }          

        function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            const csv = [];
            
            for (const row of rows) {
              const rowData = [];
              const columns = row.querySelectorAll('td, th');
              
              for (const column of columns) {
                rowData.push(column.innerText);
              }
              
              csv.push(rowData.join(','));
            }
            
            return csv.join('\n');
          }


        document.getElementById('downloadBtn').addEventListener('click', function() {
            const table = document.getElementById('table12');             
            if (table) {
              const csvContent = convertToCSV(table);
              downloadCSV(csvContent, 'AccountStatement.csv');
            }
          });

        // console.log($('.searchUser'))
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC1", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })
        let model 

        $(document).on('click','.ownAccDetails',function(e){
            let modelId = $(this).attr('id')
            let modelId1 = $(this).attr("data-bs-target")
            model =  $(modelId1)
            socket.emit("ElementID", modelId)
        })

        socket.on('getMyBetDetails',(data)=>{
            // console.log(data)
            let html = ``
            if(data.transactionId){
                html += `<thead>
                <tr >
                  <th>Date</th>
                  <th>Event</th>
                  <th>Market</th>
                  <th>Bet on</th>
                  <th>odds</th>
                  <th>Stake</th>
                  <th>Status</th>
                  <th>Returns</th>
                </tr>
                </thead>`
                html += `<tbody class="new-body" >
                <tr  class="blue"><td>${new Date(data.date)}</td>
                <td>${data.event}</td>`
                if(data.marketName){
                    html += `<td>${data.marketName}</td>`
                }else{
                    html += `<td>-</td>`
                }

                if(data.selectionName){
                    html += `<td>${data.selectionName}</td>`
                }else{
                    html += `<td>-</td>`
                }
                if(data.oddValue){
                    html += `<td>${data.oddValue}</td>`
                }else{
                    html += `<td>-</td>`
                }

                html += `
                <td>${data.Stake}</td>
                <td>${data.status}</td>
                <td>${data.returns}</td></tr></tbody>`
                model.find('table').html(html)
            }else{
                html += `<thead>
                <tr >
                  <th>Date</th>
                  <th>Credit</th>
                  <th>Debit</th>
                  <th>From/To</th>
                  <th>Closing</th>
                  <th>Description</th>
                  <th>Remarks</th>
                </tr>
            </thead>
            <tbody class="new-body" >`
                html += `<tr style="text-align: center;" class="blue"><td>${new Date(data.date)}</td>`
                if(data.creditDebitamount>0){
                    html += `<td>${data.creditDebitamount}</td><td>0</td>`
                    if(data.parent_id){
                        if(data.parent_id.userName == data.user_id.userName){
                            if(data.child_id == null){
                                html += `<td>-/${data.parent_id.userName}</td>`
                            }else{
                                html += `<td>${data.child_id.userName}/${data.parent_id.userName}</td>`
                            }
                        }else{
                            if(data.child_id == null){

                                html += `<td>${data.parent_id.userName}/-</td>`
                            }else{

                                html += `<td>${data.parent_id.userName}/${data.child_id.userName}</td>`
                            }
                        }
                    }else{
                        html += "<td>-</td>"
                    }
                }else{
                    html += `<td>0</td><td>${data.creditDebitamount}</td>`
                    if(data.parent_id){
                        if(data.parent_id.userName == data.user_id.userName){
                            if(data.child_id == null){
                                html += `<td>${data.parent_id.userName}/-</td>`
                            }else{
                                html += `<td>${data.parent_id.userName}/${data.child_id.userName}</td>`
                            }
                        }else{
                            if(data.child_id == null){
                                html += `<td>-/${data.parent_id.userName}</td>`
                            }else{
                                html += `<td>${data.child_id.userName}/${data.parent_id.userName}</td>`
                            }
                        }
                    }else{
                        html += `<td>-</td>`
                    }
                }
                
                        html += `
                        <td>${data.balance}</td>
                        <td>${data.description}</td>
                        <td>-</td></tr></tbody>`
                        // console.log(html)
                        model.find('table').html(html)
                    }
            // console.log(model)
        })
            // let 
            // let data = $(this).parent().parent().data('details')
            // let html = '';
            // if(data.hasOwnProperty('transactionId')){
            //     socket.emit('getMyBetDetails',data.transactionId)
                
            //         // console.log(data)
                   

            // }
            
    
            //     
            // }

        
        
            // console.log(data)


        
        socket.on("ACCSEARCHRES1", async(data)=>{
            // console.log(data, 565464)
            $('.wrapper').show()
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        let searchU 
        let SUSER
        let match = false
        // $(".searchUser").on('input', function(e){
        //     var $input = $(this),
        //         val = $input.val();
        //         // console.log(val,1234)
        //         var listItems = document.getElementsByTagName("li");
        //         for (var i = 0; i < listItems.length; i++) {
        //             if (listItems[i].textContent === val) {
        //                 match = ($(this).val() === val);
        //               break; 
        //             }else{
        //                 match = false
        //             }
        //           }
        //         // console.log(match, 123)
        //      if(match) {
        //         searchU = true
        //         let  data = {}
        //         let Fdate = document.getElementById("Fdate").value
        //         let Tdate = document.getElementById("Tdate").value
        //         if(!Fdate){
        //             Fdate = 'undefined'
        //         }
        //         if(!Tdate){
        //             Tdate = 'undefined'
        //         }
        //         data.Fdate = Fdate;
        //         data.Tdate = Tdate;
        //         data.userName = val
        //         SUSER = val
        //         data.Tdate = document.getElementById("Tdate").value
        //         data.page = 0
        //         data.LOGINDATA = LOGINDATA
        //         $('.pageLink').attr('data-page',1)
        //         // console.log(data, 456)
        //          socket.emit( "UserSearchId", data)
        //      }else{
        //         searchU = false
        //      }
        // });

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            searchU = true
                let  data = {}
                let Fdate = document.getElementById("Fdate").value
                let Tdate = document.getElementById("Tdate").value
               
                
                data.Fdate = Fdate;
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                 
                data.id = this.id
                SUSER = this.id
                data.page = 0
                data.LOGINDATA = LOGINDATA
                $('.pageLink').attr('data-page',1)
                $('.wrapper').hide()
                // console.log(data, 456)
                console.log(data)
                socket.emit( "AccountScroll1", data)
        })

        $('#Fdate,#Tdate').change(function(){
            
            let page = 0;
            $('.pageLink').attr('data-page',1)           
            Fdate = document.getElementById("Fdate").value
            Tdate = document.getElementById("Tdate").value
            let data = {}
            if(searchU){
                 data.id = SUSER
                 data.page = page
                 data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                 
                data.LOGINDATA = LOGINDATA
            }{
                 data.page = page
                 data.Fdate = Fdate
                 if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                 
                
                data.LOGINDATA = LOGINDATA
            }
            socket.emit('AccountScroll1',data)        
        })

        $('#load-more').click(function(e){
            let page = parseInt($('.pageLink').attr('data-page'));
            // console.log(page)
            Fdate = document.getElementById("Fdate").value
            Tdate = document.getElementById("Tdate").value
            $('.pageLink').attr('data-page',page + 1)
            let data = {}
           if(searchU){
                data.id = SUSER
                data.page = page
                data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }
                data.LOGINDATA = LOGINDATA
           }{
                data.page = page
                data.Fdate = Fdate
                if(Tdate != ''){
                    data.Tdate = new Date(new Date(Tdate).getTime() + (1000 * 60 * 60 * 24) - 1)
                }else{
                    data.Tdate = Tdate
                }                
                data.LOGINDATA = LOGINDATA
           }
           console.log(data)
            
            socket.emit('AccountScroll1',data)
        })
    

         let count1 = 11
         socket.on("Acc1", async(data) => {
            console.log(data)
            if(data.json.status == "success"){

                if(data.page == 0){
                    count1 = 1;
                }
                let html = "";
                for(let i = 0; i < data.json.userAcc.length; i++){
                    let date = new Date(data.json.userAcc[i].date);
                    // let abc =date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()
                    // console.log(abc)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue" >
                        <td>${count1 + i}</td>
                        <td class="text-nowrap" >${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td class="text-nowrap" >${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].creditDebitamount > 0){
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>-/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }else{
                                        html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }
                                }else{
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `${data.json.userAcc[i].parent_id.userName}/-`
                                    }else{

                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                    }
                                }
                            }else{
                                html += "<td>-</td>"
                            }
                        }else{
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/-</td>`
                                    }else{

                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                    }
                                }else{
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>-/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }else{

                                        html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }
                                }
                            }else{
                                html += `<td>-</td>`
                            }
                        }
                        html += `<td>${(data.json.userAcc[i].balance - data.json.userAcc[i].creditDebitamount).toFixed(2)}</td>
                        <td>${data.json.userAcc[i].creditDebitamount}</td><td>${data.json.userAcc[i].balance}</td>`
                        if(data.json.userAcc[i].Remark){
                            html += `<td>${data.json.userAcc[i].Remark}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                    }else{
                        html += `<tr style="text-align: center;" >
                        <td>${count1 + i}</td>
                        <td class="text-nowrap" >${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td class="text-nowrap" >${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].creditDebitamount > 0){
                           
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>-/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }else{
                                        html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }
                                }else{
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/-</td>`
                                    }else{
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                    }
                                }
                            }else{
                                html += "<td>-</td>"
                            }
                        }else{
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/-</td>`
                                    }else{
                                        html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                    }
                                }else{
                                    if(data.json.userAcc[i].child_id == null){
                                        html += `<td>-/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }else{

                                        html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                    }
                                }
                            }else{
                                html += `<td>-</td>`
                            }
                        }
                        html += `<td>${(data.json.userAcc[i].balance - data.json.userAcc[i].creditDebitamount).toFixed(2)}</td>
                        <td>${data.json.userAcc[i].creditDebitamount}</td><td>${data.json.userAcc[i].balance}</td>`
                        if(data.json.userAcc[i].Remark){
                            html += `<td>${data.json.userAcc[i].Remark}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                    }
                }
                count1 += 10;
                if(data.page == 0){
                    if(data.json.userAcc.length == 0){
                        html += `<tr class="empty_table"><td>No record found</td></tr>`
                        $('#load-more').hide()
                    }
                    $('tbody').html(html)

                }else {
                    if(data.json.userAcc.length == 0){
                        $('#load-more').hide()
                    }
                    $('tbody').append(html)

                }
            }
         })

     
    }

    // if(pathname == "/admin/reports"){    
    //     // console.log("Working")
    //     $('.searchUser').keyup(function(){
    //         // console.log('working')
    //         if($(this).hasClass("searchUser")){
    //             // console.log($(this).val())
    //             if($(this).val().length >= 3 ){
    //                 let x = $(this).val(); 
    //                 // console.log(x)
    //                 socket.emit("SearchACC", {x, LOGINDATA})
    //             }else{
    //                 // document.getElementById('select').innerHTML = ``
    //             }
    //         }
    //     })


    if(pathname == "/admin/reports"){
        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            }          

        function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            const csv = [];
            
            for (const row of rows) {
                const rowData = [];
                const columns = row.querySelectorAll('td, th');
                
                for (const column of columns) {
                rowData.push(column.innerText);
                }
                
                csv.push(rowData.join(','));
            }
            
            return csv.join('\n');
            }


        document.getElementById('downloadBtn').addEventListener('click', function() {
            const table = document.getElementById('table12');             
            if (table) {
                const csvContent = convertToCSV(table);
                downloadCSV(csvContent, 'report.csv');
            }
            });


        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){

                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })


        socket.on("ACCSEARCHRES", async(data)=>{
            $('.wrapper').show()

            // console.log(data, 565464)
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        let searchU 
        let SUSER
        let fromDate
        let toDate
        let fGame
        let fBets
        let filterData = {}
        // $(".searchUser").on('input', function(e){
        //     var $input = $(this),
        //         val = $input.val();
        //         var listItems = document.getElementsByTagName("li");
        //     for (var i = 0; i < listItems.length; i++) {
        //         if (listItems[i].textContent === val) {
        //             match = ($(this).val() === val);
        //           break; 
        //         }else{
        //             match = false
        //         }
        //       }

        //         if(match){
        //             // console.log(match.text())
        //             filterData = {}
        //             filterData.userName = val
        //             $('.pageId').attr('data-pageid','1')
        //             socket.emit('userBetDetail',{filterData,LOGINDATA,page:0})
        //         }
        // })


        $('#fGame,#fBets,#fromDate,#toDate').change(function(){
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            fGame = $('#fGame').val()
            fBets = $('#fBets').val()
            data.page = 0;
            // let fromDate 
            // let toDate
            if(fromDate != ''  && toDate != '' ){
                // filterData.date = {$gte : new Date(fromDate), $lte : new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))}
                fromDate = new Date(fromDate)
                toDate = new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))

            }else{
                if(fromDate != '' ){
                    // filterData.date = {$gte : new Date(fromDate)}
                    fromDate = new Date(fromDate)
                }
                if(toDate != '' ){
                    // filterData.date = {$lte : new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))}
                    toDate = new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                // filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            filterData.betType = fGame
            filterData.status = fBets
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            data.fromDate = fromDate
            data.toDate = toDate
            // console.log(data)
            socket.emit('userBetDetail',data)

        })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)

            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            fGame = $('#fGame').val()
            fBets = $('#fBets').val()
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                // filterData.date = {$gte : new Date(fromDate), $lte : new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))}
                fromDate = new Date(fromDate)
                toDate = new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))

            }else{
                if(fromDate != '' ){
                    // filterData.date = {$gte : new Date(fromDate)}
                    fromDate = new Date(fromDate)
                }
                if(toDate != '' ){
                    // filterData.date = {$lte : new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))}
                    toDate = new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))
                }
            }
            filterData.betType = fGame
            filterData.status = fBets
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            data.fromDate = fromDate
            data.toDate = toDate

            $('.wrapper').hide()
            socket.emit('userBetDetail',data)
            
        })

        $('#load-more').click(function(e){
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            fGame = $('#fGame').val()
            fBets = $('#fBets').val()
            let page = parseInt($('.rowId').attr('data-rowid'));
            $('.rowId').attr('data-rowid',page + 1)
            let data = {}
            let userName = $('.searchUser').val()
            if(userName == ''){
                // filterData.userName = LOGINDATA.LOGINUSER.userName
            }else{
                filterData.userName = userName
            }
            if(fromDate != ''  && toDate != '' ){
                // filterData.date = {$gte : new Date(fromDate), $lte : new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))}
                fromDate = new Date(fromDate)
                toDate = new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))

            }else{
                if(fromDate != '' ){
                    // filterData.date = {$gte : new Date(fromDate)}
                    fromDate = new Date(fromDate)
                }
                if(toDate != '' ){
                    // filterData.date = {$lte : new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))}
                    toDate = new Date((new Date(toDate)).getTime() + ((24 * 60 * 60 * 1000) - 1))
                }
            }
            filterData.betType = fGame
            filterData.status = fBets
            data.filterData = filterData;
            data.page = page
            data.LOGINDATA = LOGINDATA
            data.fromDate = fromDate
            data.toDate = toDate
            console.log(data)
            socket.emit('userBetDetail',data)
        })

    
            

        let count = 11
        socket.on('userBetDetail',(data) => {
            if(data.page === 0){
                count = 1
            }
            let page = data.page
            let bets = data.ubDetails;
            let html = '';
                for(let i = 0; i < bets.length; i++){
                    let date = new Date(bets[i].date)
                if(bets[i].bettype2 === 'BACK'){
                    html += `<tr class="back">`
                }else{
                    html += `<tr class="lay">`
                }
                html += `<td>${i + count}</td>
                <td>${bets[i].userName}</td>
                <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}</td>
                <td>${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>`
                if(bets[i].match){
                    html += `<td>-</td>
                    <td>${bets[i].match}</td>
                    <td>${bets[i].marketName}</td>
                    <td>${bets[i].selectionName}</td>
                    <td>${bets[i].oddValue}</td>`
                }else{
                    html += `<td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>`
                }
                html += `
                <td>${bets[i].status}</td>
                <td>${bets[i].Stake}</td>
                <td>${bets[i].returns}</td>
                <td>${bets[i].transactionId}</td>
                <td>${bets[i].event}</td></tr>`
            }
            count += 10
            if(data.page == 0){

                if(bets.length == 0){
                    $('#load-more').hide()
                    html = `<tr class="empty_table"><td>No record found</td></tr>`
                }
                $('.new-body').html(html)
                if(!(bets.length < 10)){
                    document.getElementById('load-more').innerHTML = `<button class="load-more">Load More</button>`
                }
            }else{
                if(bets.length == 0){
                    $('#load-more').hide()
                }      
                $('.new-body').append(html)   
                if((bets.length < 10)){
                    document.getElementById('load-more').innerHTML = ""
                }
            }
        })

    }

        
    // }

    if(pathname == "/admin/casinocontrol"){
      
        let BACCARAT,CASUALGAMES,FISHSHOOTING ,ANDARBAHAR,INSTANTWINGAMES,LIVE,BLACKJACK,FH,GAME,KENO,LIVEBACCARAT= false;
        let RGV = false;
        let EZ = false;
        let EG = false;
        $("#BACCARAT").click(function(){
            if(!BACCARAT){
                console.log("1")
                socket.emit('BACCARAT', "on")
                BACCARAT = true
            }
        })
        $("#ANDARBAHAR").click(function(){
            if(!ANDARBAHAR){
                console.log("1")
                socket.emit('ANDARBAHAR', "on")
                ANDARBAHAR = true
            }
        })
        $("#CASUALGAMES").click(function(){
            if(!CASUALGAMES){
                // console.log("1")
                socket.emit('CASUALGAMES', "on")
                CASUALGAMES = true
            }
        })
        $("#FISHSHOOTING").click(function(){
            if(!FISHSHOOTING){
                // console.log("1")
                socket.emit('FISHSHOOTING', "on")
                FISHSHOOTING = true
            }
        })
        $("#INSTANTWINGAMES").click(function(){
            if(!INSTANTWINGAMES){
                // console.log("1")
                socket.emit('INSTANTWINGAMES', "on")
                INSTANTWINGAMES = true
            }
        })
        $("#LIVE").click(function(){
            if(!LIVE){
                // console.log("1")
                socket.emit('LIVE', "on")
                LIVE = true
            }
        })
        $("#BLACKJACK").click(function(){
            if(!BLACKJACK){
                // console.log("1")
                socket.emit('BLACKJACK', "on")
                BLACKJACK = true
            }
        })
        $("#FH").click(function(){
            if(!FH){
                // console.log("1")
                socket.emit('FH', "on")
                FH = true
            }
        })
        $("#GAME").click(function(){
            if(!GAME){
                // console.log("1")
                socket.emit('GAME', "on")
                GAME = true
            }
        })
        $("#KENO").click(function(){
            if(!KENO){
                // console.log("1")
                socket.emit('KENO', "on")
                KENO = true
            }
        })
        $("#LIVEBACCARAT").click(function(){
            if(!LIVEBACCARAT){
                // console.log("1")
                socket.emit('LIVEBACCARAT', "on")
                LIVEBACCARAT = true
            }
        })



        socket.on('baccarat1', (data) => {
            console.log(data)
            let html = ""
            for(let i = 0 ; i < data.data.length; i++){
                if(data.data[i].status){
                    html += `<div class="new-head on-off-btn-section" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;">
                    <span>${data.data[i].game_name} (${data.data[i].sub_provider_name})</span>
                    <span class="on-off">OFF &nbsp; <label class="switch on">
                    <input type="checkbox" class="change_status" data-id="${data.data[i].game_id}" checked>
                    <span class="slider round"></span>
                    </label>&nbsp; ON</span>
                  </div>`
                }else{
                    html += `<div class="new-head on-off-btn-section" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;">
                    <span>${data.data[i].game_name} (${data.data[i].sub_provider_name})</span>
                    <span class="on-off">OFF &nbsp; <label class="switch">
                    <input type="checkbox" class="change_status" data-id="${data.data[i].game_id}">
                    <span class="slider round"></span>
                    </label>&nbsp; ON</span>
                  </div>`
                }
            }
            console.log($('#'+data.id).parent().next())
            $('#'+data.id).parent().next().children('.accordion-body').html(html)
        });

        $("#RGV").click(function(){
            if(!RGV){
                // console.log(2)
                socket.emit('RGV', "on")
                RGV=true
            }
        })

        $('#EZ').click(function(){
            if(!EZ){
                socket.emit('EZ', "on")
                EZ = true
            }
        })

        $('#EG').click(function(){
            if(!EG){
                socket.emit('EG', "on")
                EG = true
            }
        })

        socket.on("RGV1", (data)=>{
            let html = ""
            // console.log(data.data)
            for(let i = 0; i < data.data.length ; i++){
                if((i%2)==0){
                    html += `
                        <div class="new-head on-off-btn-section" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;margin-bottom: 10px;">
                      <span>${data.data[i].game_name} (${data.data[i].sub_provider_name})</span>`
                      if(data.data[i].status){
                        html += `<span class="on-off">OFF &nbsp; <label class="switch on">
                                <input type="checkbox" data-id="${data.data[i].game_id}" class="change_status" checked>
                                <span class="slider round"></span>
                                </label>&nbsp; ON</span>`
                      }else{
                        html += `<span class="on-off">OFF &nbsp; <label class="switch">
                                <input type="checkbox" data-id="${data.data[i].game_id}" class="change_status">
                                <span class="slider round"></span>
                                </label>&nbsp; ON</span>`
                      }
                      html +=`</div>`
                }else if(((i%2)-1)==0){
                    html += `<div class="new-head on-off-btn-section" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;margin-bottom: 10px;">
                      <span>${data.data[i].game_name} (${data.data[i].sub_provider_name})</span>`
                      if(data.data[i].status){
                        html += `<span class="on-off">OFF &nbsp; <label class="switch on">
                                    <input type="checkbox" data-id="${data.data[i].game_id}" class="change_status" checked>
                                    <span class="slider round"></span>
                                </label>&nbsp; ON</span>`
                      }else{
                        html += `<span class="on-off">OFF &nbsp; <label class="switch">
                                    <input type="checkbox" data-id="${data.data[i].game_id}" class="change_status">
                                    <span class="slider round"></span>
                                </label>&nbsp; ON</span>`
                      }
                      html +=`
                    </div>
                    `
                }else{
                    html += `<div class="new-head on-off-btn-section" style="background-color: #EAEEF7;padding: 5px 15px;    border-radius: 10px;margin-bottom: 10px;">
                      <span>${data.data[i].game_name} (${data.data[i].sub_provider_name})</span>
                      `
                      if(data.data[i].status){
                        html += ` <span class="on-off">OFF &nbsp; <label class="switch on">
                                <input type="checkbox" data-id="${data.data[i].game_id}" class="change_status" checked>
                                <span class="slider round"></span>
                                </label>&nbsp; ON</span>`
                      }else{
                        html += ` <span class="on-off">OFF &nbsp; <label class="switch">
                                <input type="checkbox" data-id="${data.data[i].game_id}" class="change_status">
                                <span class="slider round"></span>
                                </label>&nbsp; ON</span>`
                      }
                      html +=`
                    </div>`
                }
            }
            if(data.provider == "RGV"){
                document.getElementById('RGVd').innerHTML = html
            }else if(data.provider == "EZ"){
                document.getElementById('EZUGId').innerHTML = html
            }else if(data.provider == "EG"){
                document.getElementById('ZEd').innerHTML = html
            }
        })

        $(document).on('click','.change_status',function(e){
            let status = $(this).prop('checked') ? true : false;
            let id = $(this).data('id')
            if(status){
                $(this).parents('.switch').addClass("on");
            }else{
                $(this).parents('.switch').removeClass("on");
            }
            if(id){
                if(confirm('do you want to change status')){
                    socket.emit('casionoStatusChange',{status,id})
                }else{
                    $(this).prop('checked') ? $(this).prop('checked',false) : $(this).prop('checked',true)
                }
            }
        })

        socket.on('casionoStatusChange',async(data)=>{
            if(data.status == 'success'){
                alert('status changed successfully')
            }else{
                alert('somthig watn wrong!!')
            }
        })
    }



    if(pathname == "/ALLGAMEFORTESTING"){
        // console.log('working')
        $('.img').click(function(){
            let id = this.id;
            socket.emit('IMGID', {id, LOGINDATA})
         });

         socket.on('URLlINK', (data) =>{
            // console.log(data)
            document.getElementById('data123').innerHTML = `<iframe src="${data}" width="100%" height="1000"></iframe>`
         })
    }

    if(pathname == "/admin/plreport"){
        // let fromDate
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })
        // let toDate
        let filterData = {}
        

        socket.on("ACCSEARCHRES", async(data)=>{
            $('.wrapper').show()
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        $('#load-more').click(function(e){
            let page = parseInt($('.pageId').attr('data-pageid'));
            $('.pageId').attr('data-pageid',page + 1)
            let data = {}
            let userName = $('.searchUser').val()
            if(userName == ''){
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }else{
                filterData.userName = userName
            }
            // if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
            //     filterData.date = {$gte : fromDate,$lte : toDate}
            // }else{

            //     if(fromDate != undefined && fromDate != '' ){
            //         filterData.date = {$gte : fromDate}
            //     }
            //     if(toDate != undefined && toDate != '' ){
            //         filterData.date = {$lte : toDate}
            //     }
            // }    
            data.filterData = filterData;
            data.page = page
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('userPLDetail',data)
        })
 

        // $(".searchUser").on('input', function(e){
        //     var $input = $(this),
        //         val = $input.val();
        //         var listItems = document.getElementsByTagName("li");
        //         for (var i = 0; i < listItems.length; i++) {
        //             if (listItems[i].textContent === val) {
        //                 match = ($(this).val() === val);
        //               break; 
        //             }else{
        //                 match = false
        //             }
        //           }

        //         if(match){
        //             // console.log(match.text())
        //             filterData = {}
        //             filterData.userName = val
        //             $('.pageId').attr('data-pageid','1')
        //             socket.emit('userPLDetail',{filterData,LOGINDATA,page:0})
        //         }
        // })
        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            $('.wrapper').hide()
            socket.emit('userPLDetail',{filterData,LOGINDATA,page:0})
           
        })

        socket.on('userPLDetail',(data)=>{
            // console.log(data.page)
            let users = data.users
            let page = data.page;
            let html = '';
            for(let i = 0; i < users.length; i++){
                if((i%2) == 0){
                    html += `<tr style="text-align: center;" class="blue">`
                }else{
                    html += `<tr style="text-align: center;">`
                }
                html += `<td>${users[i].userName}</td>
                <td>${users[i].Won}</td>
                <td>${users[i].Loss}</td>
                <td>${users[i].myPL.toFixed(2)}</td>
                </tr>`
            }
            if(page == 0){
                if(users.length == 0){
                    html += `<tr class="empty_table"><td>No record found</td></tr>`
                    $('#load-more').hide()
                }
                $('.new-body').html(html)
            }else{
                if(users.length == 0){
                    $('#load-more').hide()
                }
                $('.new-body').append(html)
            }
          
          
        })


    }
    if(pathname == "/admin/userhistoryreport"){
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })

        socket.on("ACCSEARCHRES", async(data)=>{
            // console.log(data, 565464)
            $('.wrapper').show()
            let html = ``
        if(data.page === 1){
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }else if(data.page === null){
            document.getElementById("button").innerHTML = ``
        }else{
            html = document.getElementById('search').innerHTML
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }
        })

        let fromDate
        let toDate
        let filterData  = {}
        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }

                if(match){
                    // console.log(match.text())
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('userHistory',{filterData,LOGINDATA,page:0})
                }
        })

        // $('.filter').click(function(){
        //     let userName = $('.searchUser').val()
        //     fromDate = $('#fromDate').val()
        //     toDate = $('#toDate').val()
        //     $('.pageId').attr('data-pageid','1')
        //     data.page = 0;
        //     if(fromDate != ''  && toDate != '' ){
        //         filterData.login_time = {$gte : fromDate,$lte : toDate}
        //     }else{

        //         if(fromDate != '' ){
        //             filterData.login_time = {$gte : fromDate}
        //         }
        //         if(toDate != '' ){
        //             filterData.login_time = {$lte : toDate}
        //         }
        //     }
        //     if(userName != ''){
        //         filterData.userName = userName
        //     }else{
        //         filterData.userName = LOGINDATA.LOGINUSER.userName
        //     }
        //     data.filterData = filterData
        //     data.LOGINDATA = LOGINDATA
        //     // console.log(data)
        //     socket.emit('userHistory',data)
        // })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            let userName = this.textContent
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.fromDate = fromDate
                filterData.toDate = toDate
            }else{

                if(fromDate != '' ){
                    filterData.fromDate = fromDate
                }
                if(toDate != '' ){
                    filterData.toDate = toDate
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                // filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            $('.wrapper').hide()
            // console.log(data)
            socket.emit('userHistory',data)
        })
        $('#fromDate,#toDate').change(function(){
                let page = 0
                $('.pageId').attr('data-pageid',1)
                let data = {}
                let userName = $('.searchUser').val()
                fromDate = $('#fromDate').val()
                toDate = $('#toDate').val()
                if(userName == ''){
                    // filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                if(fromDate != ''  && toDate != '' ){
                    filterData.fromDate = fromDate
                    filterData.toDate = toDate
                }else{
    
                    if(fromDate != '' ){
                        filterData.fromDate = fromDate
                    }
                    if(toDate != '' ){
                        filterData.toDate = toDate
                    }
                }
                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('userHistory',data)
        })

        // $(window).scroll(function() {
        //     if($(document).height()-$(window).scrollTop() == window.innerHeight){
        //         let page = parseInt($('.pageId').attr('data-pageid'));
        //         $('.pageId').attr('data-pageid',page + 1)
        //         let data = {}
        //         let userName = $('.searchUser').val()
        //         if(userName == ''){
        //             filterData.userName = LOGINDATA.LOGINUSER.userName
        //         }else{
        //             filterData.userName = userName
        //         }
        //         if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
        //             filterData.login_time = {$gte : fromDate,$lte : toDate}
        //         }else{

        //             if(fromDate != undefined && fromDate != '' ){
        //                 filterData.login_time = {$gte : fromDate}
        //             }
        //             if(toDate != undefined && toDate != '' ){
        //                 filterData.login_time = {$lte : toDate}
        //             }
        //         }

        //         data.filterData = filterData;
        //         data.page = page
        //         data.LOGINDATA = LOGINDATA
        //         // console.log(data)
        //         socket.emit('userHistory',data)



        //     }
        //  }); 


         $(document).on('click', ".load-more", function(e){
            let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let data = {}
                let userName = $('.searchUser').val()
                fromDate = $('#fromDate').val()
                toDate = $('#toDate').val()
                if(userName == ''){
                    // filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                if(fromDate != ''  && toDate != '' ){
                    filterData.fromDate = fromDate
                    filterData.toDate = toDate
                }else{
    
                    if(fromDate != '' ){
                        filterData.fromDate = fromDate
                    }
                    if(toDate != '' ){
                        filterData.toDate = toDate
                    }
                }
                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('userHistory',data)
         })
        
        let count = 11
        socket.on('userHistory',(data)=>{
            if(data.page == 0){
                count = 1
            }
            let html = '';
            let page = data.page
            Logs = data.users
            for(let i = 0; i < Logs.length; i++){
                 let date = new Date(Logs[i].login_time)
                if((i%2) == 0){
                    html += `<tr style="text-align: center;" class="blue">`
                }else{
                    html += `<tr style="text-align: center;">`
                }
                html += `<td>${i+count}</td>
                <td>${Logs[i].userName}</td>
                <td class="date-time" >${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()},${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                <td>${Logs[i].ip_address}</td>`
                if(Logs[i].isOnline){
                    html += `<td>Active</td>`
                }else{
                    html += `<td>LogOut</td>`   
                }
                html += `</tr>`
            }
            count += 10
            if(page == 0){
                if(Logs.length == 0){
                    $('#load-more').hide()
                    html = `<tr class="empty_table"><td>No record found</td></tr>`
                }
                $('.new-body').html(html)
                if(!(Logs.length < 10)){
                    document.getElementById('load-more').innerHTML = `<button class="load-more">Load More</button>`
                }
            }else{
                if(Logs.length == 0){
                    $('#load-more').hide()
                }
                $('.new-body').append(html)
                if((Logs.length < 10)){
                    document.getElementById('load-more').innerHTML = ""
                }
            }


         
        })
    }

    if(pathname == "/admin/gamereport"){
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })

        socket.on("ACCSEARCHRES", async(data)=>{
            $('.wrapper').show()
            let html = ``
        if(data.page === 1){
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }else if(data.page === null){
            document.getElementById("button").innerHTML = ``
        }else{
            html = document.getElementById('search').innerHTML
            for(let i = 0; i < data.user.length; i++){
                html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
            }
            document.getElementById('search').innerHTML = html
            document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
        }
        })

        let filterData = {}
        $(window).scroll(function() {
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let data = {}
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                // if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                //     filterData.date = {$gte : fromDate,$lte : toDate}
                // }else{

                //     if(fromDate != undefined && fromDate != '' ){
                //         filterData.date = {$gte : fromDate}
                //     }
                //     if(toDate != undefined && toDate != '' ){
                //         filterData.date = {$lte : toDate}
                //     }
                // }    
                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('gameReport',data)



            }
         }); 

        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }

                if(match){
                    // console.log(match.text())
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('gameReport',{filterData,LOGINDATA,page:0})
                }
        })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            $('.wrapper').hide()
            socket.emit('gameReport',{filterData,LOGINDATA,page:0})
            
        })

        socket.on('gameReport',(data)=>{
            // console.log(data)
            let page = data.page;
            let games = data.games;
            let html = '';
            let count 
            if(page != 0){
                count = (10 * page) + 1
            }else{
                count = 1
            }
            for(let i = 0;i<games.length;i++){
                if(i % 2 == 0){
                  html += `<tr style="text-align: center;">`
                }else{
                  html += `<tr style="text-align: center;" class="blue">`
                }
                  html += `<td>${count + i}</td>
                  <td>${games[i]._id}</td>
                  <td>${games[i].gameCount}</td>
                  <td>${games[i].betCount}</td>
                  <td>${games[i].won}</td>
                  <td>${games[i].loss}</td>`
                if(games[i].returns >= 0){
                  html += `<td style="color: #46BCAA;">+${games[i].returns}</td>`
                }else{
                  html += `<td style="color: #FE3030;">${games[i].returns}</td>`
                }
                html += `</tr>`
                count++
            }

            if(data.page == 0){
            $('.new-body').html(html)
            }else{
            $('.new-body').append(html)
            }
        })
    }

    if(pathname == "/admin/onlineUsers"){
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchOnlineUser", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
        socket.on("SearchOnlineUser", (data) =>{
            console.log(data, 565464)
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.onlineUsers.length; i++){
                    html += `<li class="searchList" id="${data.onlineUsers[i]._id}">${data.onlineUsers[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.onlineUsers.length; i++){
                    html += `<li class="searchList" id="${data.onlineUsers[i]._id}">${data.onlineUsers[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        $(".logout").click(function(){
            let id = $(this).attr("id")
            socket.emit("SelectLogoutUserId", id)
        })

        socket.on("SelectLogoutUserId", (data) => {
            console.log(data)
            alert("User Logout")
                window.setTimeout(()=>{
                    window.location = '/admin/onlineUsers '
                },500)
        });

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            $('.wrapper').hide()
            let data = {};
            data.filterData = filterData;
            data.page = 0;
            data.LOGINDATA = LOGINDATA
            socket.emit('OnlineUser',data)
            
        })

        let count = 11
        socket.on('OnlineUser', async(data) => {
            console.log(data)
            let html = "";
            if(data.page === 0){
                count = 1
            }
            for(let i = 0;i<data.onlineUsers.length;i++){
                html += `<tr>
                <td>${count + i}</td>
                <td>${data.onlineUsers[i].userName}</td>
                <td>
    
                    <button type="button" id="${data.onlineUsers[i]._id}" class="logout">Logout</button>
                </td>
            </tr>`
            }
            count += 10
            if(data.page == 0){
                if(data.onlineUsers.length == 0){
                    html += `<tr class="empty_table"><td>No record found</td></tr>`
                    $('#load-more').hide()
                }

                $('.new-body').html(html)
            }else{
                if(data.onlineUsers.length == 0){
                    $('#load-more').hide()
                }
                $('.new-body').append(html)
            }

        })


        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchOnlineUser", {x, LOGINDATA, page})
        })

        $('#load-more').click(function(e){
            let filterData = {}
            let page = parseInt($('.pageId').attr('data-pageid'));
            $('.pageId').attr('data-pageid',page + 1)
            let data = {}
            let userName = $('.searchUser').val()
            if(userName == ''){
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }else{
                filterData.userName = userName
            }
            data.filterData = filterData;
            // if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
            //     filterData.date = {$gte : fromDate,$lte : toDate}
            // }else{

            //     if(fromDate != undefined && fromDate != '' ){
            //         filterData.date = {$gte : fromDate}
            //     }
            //     if(toDate != undefined && toDate != '' ){
            //         filterData.date = {$lte : toDate}
            //     }
            // }

            data.page = page
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('OnlineUser',data)



        }); 




    }

    if(pathname == "/admin/betmoniter"){
        var today = new Date();
        var todayFormatted = formatDate(today);
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() - 1);
        var tomorrowFormatted = formatDate(tomorrow);

        $('#fromDate').val(tomorrowFormatted)
        $('#toDate').val(todayFormatted)
        $('#toTime').val("23:59:59")
        $('#fromTime').val("00:00:00")
        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return year + "-" + month + "-" + day;
        }

        $(document).on('keyup','.searchUser',function(){
            // console.log('working')
            // console.log($(this).val())
            if($(this).val().length >= 3 ){
                let x = $(this).val(); 
                console.log(x)
                socket.emit("SearchACC", {x, LOGINDATA})
            }else{
                document.getElementById('search').innerHTML = ``
                document.getElementById("button").innerHTML = ''
            }
        })

        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })


        socket.on("ACCSEARCHRES", async(data)=>{
            console.log(data,'==>resporst of search')
            let html = ``
            $('.wrapper').show()

            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })


        let toDate;
        let fromDate;
        let sport;
        let market;
        let event;
        let result;
        let stack;
        let whiteLabel;
        let IP;
        let toTime;
        let fromTime;
        let filterData = {}
        $(document).on('input','.searchUser', function(e){
            var $input = $(this),
                    val = $input.val();
                    var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }

                if(match){
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('betMoniter',{filterData,LOGINDATA,page:0})
                }
        })

        fromDate = $('#fromDate').val()
        fromTime = $('#fromTime').val()
        toDate = $('#toDate').val()
        toTime = $('#toTime').val()

        function combinedatetime(fromDate,fromTime,toDate,toTime){
            if(!isValidTimeString(fromTime) && !isValidTimeString(toTime)){
                fromTime = "00:00:00"
                toTime = "23:59:59"
            }
            const dateComponents1 = fromDate.split('-').map(Number); 
            const timeComponents1 = fromTime.split(':').map(Number);  
    
            const dateComponents2 = toDate.split('-').map(Number); 
            const timeComponents2 = toTime.split(':').map(Number);  
    
            const combinedDate1 = new Date(dateComponents1[0], dateComponents1[1] - 1, dateComponents1[2]);
            const combinedDate2 = new Date(dateComponents2[0], dateComponents2[1] - 1, dateComponents2[2]);
    
            combinedDate1.setHours(timeComponents1[0]);
            combinedDate1.setMinutes(timeComponents1[1]);
            combinedDate1.setSeconds(timeComponents1[2]);
    
            combinedDate2.setHours(timeComponents2[0]);
            combinedDate2.setMinutes(timeComponents2[1]);
            combinedDate2.setSeconds(timeComponents2[2]);
    
            return {
                combinedDate1,
                combinedDate2
            }
            
        }

        filterData.fromDate = combinedatetime(fromDate,fromTime,toDate,toTime).combinedDate1
        filterData.toDate = combinedatetime(fromDate,fromTime,toDate,toTime).combinedDate2
        

        $('#toTime,#fromTime').keyup(function(e){
            let value = $(this).val()
            if(!isValidTimeString(value)){
                if(!$(this).siblings('span').hasClass('active')){
                    $(this).siblings('span').addClass('active')
                }
            }else{
                $(this).siblings('span').removeClass('active')
                let page = 0;
                let data = {}
                fromTime = $('#fromTime').val()
                toTime = $('#toTime').val()
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                filterData.fromDate = combinedatetime(fromDate,fromTime,toDate,toTime).combinedDate1
                filterData.toDate = combinedatetime(fromDate,fromTime,toDate,toTime).combinedDate2
        
                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('betMoniter',data)
            }
        })

        function isValidTimeString(timeString) {
            // Define a regular expression pattern for a valid time string in HH:MM:SS format
            const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
          
            // Test the timeString against the regex pattern
            return timeRegex.test(timeString);
          }
        $('#fromDate,#toDate,#Sport,#market,#Event,#result,#whiteLabel').change(function(){
            console.log("working")
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            fromTime = $('#fromTime').val()
            toDate = $('#toDate').val()
            toTime = $('#toTime').val()
            sport = $('#Sport').val()
            whiteLabel = $('#whiteLabel').val()
            market = $('#market').val()
            event = $('#Event').val()
            result = $('#result').val()
            stack = $('#stake').val()
            IP = $('#IP').val()
            let type;
            console.log($(this).attr('id'))
            if($(this).attr('id') == 'Event'){
                type = 'changeevent'
            }
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            // if(sport != "All"){
                filterData.betType = sport
            // }
            // if(market != "All"){
                filterData.marketName = market
            // }
            filterData.status = result;
            filterData.Stake = stack;
            filterData.eventId = event
            filterData.ip = IP
            filterData.fromDate = combinedatetime(fromDate,fromTime,toDate,toTime).combinedDate1
            filterData.toDate = combinedatetime(fromDate,fromTime,toDate,toTime).combinedDate2
        
            filterData.whiteLabel = whiteLabel

            Object.keys(filterData).map(ele => {
                if(filterData[ele] == ""){
                    delete filterData[ele]
                }
            })
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            data.page = 0;
            data.type = type
            console.log(data)
            socket.emit('betMoniter',data)

        })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            $('.wrapper').hide()
            socket.emit('betMoniter',{filterData,LOGINDATA,page:0})
        })

        $('#load-more').click(function(e){
            let page = parseInt($('.pageId').attr('data-pageid'));
            $('.pageId').attr('data-pageid',page + 1)
            let data = {}
            let userName = $('.searchUser').val()
            if(userName == ''){
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }else{
                filterData.userName = userName
            }

            data.filterData = filterData;
            data.page = page
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('betMoniter',data)
        })

        function refreshBetMonitorPage(){
            stack = $('#stake').val()
            IP = $('#IP').val()
            let data = {}
            let userName = $('.searchUser').val()
            if(userName == ''){
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }else{
                filterData.userName = userName
            }
            filterData.ip = IP
            filterData.Stake = stack
            Object.keys(filterData).map(ele => {
                if(filterData[ele] == ""){
                    delete filterData[ele]
                }
            })
            data.filterData = filterData;
            data.page = 0
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('betMoniter',data)
        }
        $('.refresh').click(function(e){
           refreshBetMonitorPage()
        })
      
            
        let count = 11
        socket.on('betMoniter',(data) => {
            console.log(data)
            if(data.page === 0){
                count = 1
            }
            let bets = data.ubDetails;
            let html = '';
            let html2 = '';
            if(data.events){
                html2 += `<option value="All" selected> Select Event </option>`
                for(let i = 0;i<data.events.length;i++){
                    if(data.events[i]._id){
                        html2 += `<option value="${data.events[i].eventId}">${data.events[i]._id}</option>`
                    }
                }
                $('#Event').html(html2)
            }
            for(let i = 0; i < bets.length; i++){
                let date = new Date(bets[i].date)
                if(bets[i].bettype2 === 'BACK'){
                    html += `<tr class="back">`
                }else{
                    html += `<tr class="lay">`
                }
                html += `<td>${i + count}</td>
                <td class="date-time">${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                <td>${bets[i].userName}</td>
                `
                if(bets[i].match){
                    html += `
                    <td class="text-nowrap">${bets[i].match}</td>
                    <td class="text-nowrap">${bets[i].marketName}</td>
                    <td>${bets[i].oddValue}</td>
                    <td>${bets[i].selectionName}</td>`
                }else{
                    html += `
                    <td>-</td><td>-</td><td>-</td><td>-</td>`
                }
                html += `
                <td>${bets[i].Stake}</td>
                <td>${bets[i].transactionId}</td>
                <td>${bets[i].status}</td>
                <td>${bets[i].returns.toFixed(2)}</td>`
                if(bets[i].ip){
                    html += `<td>${bets[i].ip}</td>`
                }else{
                    html += `<td>-</td>`
                }
                html += `<td>
                <div class="btn-group">`
                if(bets[i].status == 'Alert'){
                    html +=`<button class="btn alert flag-button" id="${bets[i]._id}"><svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 447.514 447.514" xml:space="preserve">
                    <path d="M389.183,10.118c-3.536-2.215-7.963-2.455-11.718-0.634l-50.653,24.559c-35.906,17.409-77.917,16.884-113.377-1.418
                    c-38.094-19.662-83.542-18.72-120.789,2.487V20c0-11.046-8.954-20-20-20s-20,8.954-20,20v407.514c0,11.046,8.954,20,20,20
                    s20-8.954,20-20V220.861c37.246-21.207,82.694-22.148,120.789-2.487c35.46,18.302,77.47,18.827,113.377,1.418l56.059-27.18
                    c7.336-3.557,11.995-10.993,11.995-19.146V20.385C394.866,16.212,392.719,12.333,389.183,10.118z"/>
                    </svg></button></div></td>`
                }else{
                    html +=`<button class="btn alert flag-button" id="${bets[i]._id}"><svg fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                    viewBox="0 0 489 489" xml:space="preserve">
                    <g>
                    <g>
                        <path d="M454.3,31.6c-28.5-15.3-59.1-23.4-93.7-23.4c-40.7,0-81.5,11.2-120.2,21.4S166,50,130.4,50c-23.8,0-45.3-4.6-65.2-13.7
                        V20.4C65.2,9.2,56,0,44.8,0S24.4,9.2,24.4,20.4v448.2c0,11.2,9.2,20.4,20.4,20.4s20.4-9.2,20.4-20.4v-148
                        c20,6.9,41.2,10.5,64.2,10.5c40.7,0,81.5-11.2,120.2-20.4c38.7-10.2,74.4-20.4,110-20.4c27.5,0,52,6.1,74.4,18.3
                        c12.7,8.7,30.6-2.1,30.6-17.3V49.9C464.4,41.8,460.4,35.7,454.3,31.6z M423.7,258.8c-20.4-7.1-41.8-10.2-64.2-10.2
                        c-40.7,0-81.5,11.2-120.2,21.4s-74.4,20.4-110,20.4c-23.4,0-44.8-4.1-64.2-13.2V79.5c20.4,7.1,41.8,10.2,64.2,10.2
                        c40.7,0,81.5-11.2,120.2-21.4s74.4-20.4,110-20.4c23.4,0,44.8,4.1,64.2,13.2V258.8z"/>
                    </g>
                    </g>
                    </svg></button></div></td>`
                }
                html += `</tr>`
            }
            
            count += 10;
            if(data.page == 0){
                if(bets.length == 0){
                    html += `<tr class="empty_table"><td>No record found</td></tr>`
                    $('#load-more').hide()
                }else{
                    $('#load-more').show()
                }
              
                $('.new-body').html(html)
            }else{
                if(bets.length == 0){
                    $('#load-more').hide()
                }
                $('.new-body').append(html)         
            }
        })

    
    $(document).on('click', '.cancel', async function(e){
        e.preventDefault()
        if(confirm('do you want to cancel this bet')){
            socket.emit('voidBet', this.id)
        }
    })
    

    $(document).on("click", ".alert", function(e){
        e.preventDefault()
        if(confirm('do you want to alert this bet')){
            socket.emit("alertBet", this.id)
        }
    })
    socket.on("alertBet", async(data) => {
        if(data.status === "error"){
            alert("Please try again later")
        }else{
            refreshBetMonitorPage()
        }
    })
            

    }






    if(pathname == "/admin/voidbet"){
        var today = new Date();
        var todayFormatted = formatDate(today);
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() - 1);
        var tomorrowFormatted = formatDate(tomorrow);

        $('#Fdate').val(tomorrowFormatted)
        $('#Tdate').val(todayFormatted)
        $('#toTime').val("23:59:59")
        $('#fromTime').val("00:00:00")
        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return year + "-" + month + "-" + day;
        }

        // console.log("Working")
        $('.searchUser').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchUser")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })

        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })


        socket.on("ACCSEARCHRES", async(data)=>{
            let html = ``
            $('.wrapper').show()
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })

        let to_date;
        let from_date;
        let sport;
        let event;
        let market;
        let toTime;
        let fromTime;
        let filterData = {}
        from_date = $('#Fdate').val()
        fromTime = $('#fromTime').val()
        to_date = $('#Tdate').val()
        toTime = $('#toTime').val()

        function combinedatetime(fromDate,fromTime,toDate,toTime){
            if(!isValidTimeString(fromTime) && !isValidTimeString(toTime)){
                fromTime = "00:00:00"
                toTime = "23:59:59"
            }
            const dateComponents1 = fromDate.split('-').map(Number); 
            const timeComponents1 = fromTime.split(':').map(Number);  
    
            const dateComponents2 = toDate.split('-').map(Number); 
            const timeComponents2 = toTime.split(':').map(Number);  
    
            const combinedDate1 = new Date(dateComponents1[0], dateComponents1[1] - 1, dateComponents1[2]);
            const combinedDate2 = new Date(dateComponents2[0], dateComponents2[1] - 1, dateComponents2[2]);
    
            combinedDate1.setHours(timeComponents1[0]);
            combinedDate1.setMinutes(timeComponents1[1]);
            combinedDate1.setSeconds(timeComponents1[2]);
    
            combinedDate2.setHours(timeComponents2[0]);
            combinedDate2.setMinutes(timeComponents2[1]);
            combinedDate2.setSeconds(timeComponents2[2]);
    
            return {
                combinedDate1,
                combinedDate2
            }
            
        }
        filterData.from_date = combinedatetime(from_date,fromTime,to_date,toTime).combinedDate1
        filterData.to_date = combinedatetime(from_date,fromTime,to_date,toTime).combinedDate2

        $('#toTime,#fromTime').keyup(function(e){
            let value = $(this).val()
            if(!isValidTimeString(value)){
                if(!$(this).siblings('span').hasClass('active')){
                    $(this).siblings('span').addClass('active')
                }
            }else{
                $(this).siblings('span').removeClass('active')
                let page = 0;
                let data = {}
                fromTime = $('#fromTime').val()
                toTime = $('#toTime').val()
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                }
                filterData.from_date = combinedatetime(from_date,fromTime,to_date,toTime).combinedDate1
                filterData.to_date = combinedatetime(from_date,fromTime,to_date,toTime).combinedDate2
                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                socket.emit('voidBET',data)
            }
        })

        function isValidTimeString(timeString) {
            // Define a regular expression pattern for a valid time string in HH:MM:SS format
            const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
          
            // Test the timeString against the regex pattern
            return timeRegex.test(timeString);
          }
        $('#Fdate,#Tdate,#Sport,#market,#Event').change(function(){
            console.log("working")
            let userName = $('.searchUser').val()
            sport = $("#Sport").val()
            market = $("#market").val()
            from_date = $('#Fdate').val() 
            fromTime = $('#fromTime').val()
            to_date = $('#Tdate').val()
            toTime = $('#toTime').val()
            event = $('#Event').val()
            let type;           
            if($(this).attr('id') == 'Event'){
                type = 'changeevent'
            }
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            // if(sport != "All"){
                filterData.betType = sport
            // }
            // if(market != "All"){
                filterData.marketName = market
            // }
            filterData.eventId = event
            filterData.from_date = combinedatetime(from_date,fromTime,to_date,toTime).combinedDate1
            filterData.to_date = combinedatetime(from_date,fromTime,to_date,toTime).combinedDate2
    
            Object.keys(filterData).map(ele => {
                if(filterData[ele] == ""){
                    delete filterData[ele]
                }
            })
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            data.page = 0;
            data.type = type
            console.log(data)
            socket.emit('voidBET',data)

        })

        $(document).on("click", ".searchList", function(){
            document.getElementById("searchUser").value = this.textContent
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            $('.wrapper').hide()
            socket.emit('voidBET',{filterData,LOGINDATA,page:0})            
        })

        $(document).on('click', ".load-more", function(e){
            let page = parseInt($('.pageId').attr('data-pageid'));
            $('.pageId').attr('data-pageid',page + 1)
            let data = {}
            let userName = $('.searchUser').val()
            if(userName == ''){
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }else{
                filterData.userName = userName
            }

            data.filterData = filterData;
            data.page = page
            data.LOGINDATA = LOGINDATA
            socket.emit('voidBET',data)
        })
            
      
            let count = 11
            socket.on('voidBET',(data) => {
                console.log(data)
                if(data.page === 0){
                    count = 1
                }                
                let bets = data.betResult;
                let html = '';
                let html2 = '';
                if(data.events){
                    html2 += `<option value="All" selected> Select Event </option>`
                    for(let i = 0;i<data.events.length;i++){
                        if(data.events[i]._id){
                            html2 += `<option value="${data.events[i].eventId}">${data.events[i]._id}</option>`
                        }
                    }
                    $('#Event').html(html2)
                }
                for(let i = 0; i < bets.length; i++){
                    let date = new Date(bets[i].date)
                    if(bets[i].bettype2 === 'BACK'){
                    html += `<tr class="back">`
                    }else{
                    html += `<tr class="lay">`
                    }
                    html += `<td>${i + count}</td>
                    <td class="date-time" >${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                    <td>${bets[i].userName}</td>
                    `
                    if(bets[i].match){
                    html += `
                    <td class="text-nowrap" >${bets[i].match}</td>
                    <td class="text-nowrap" >${bets[i].marketName}</td>
                    <td>${bets[i].oddValue}</td>
                    <td class="text-nowrap" >${bets[i].selectionName}</td>`
                    }else{
                    html += `<td>-</td>
                    <td>-</td><td>-</td><td>-</td>`
                    }
                    html += `
                    <td>${bets[i].Stake}</td>
                    <td>${bets[i].transactionId}</td>
                    <td>${bets[i].status}</td>
                    <td>${bets[i].returns}</td>
                    </tr>`
                }
                count += 10;
                if(data.page == 0){
                    if((data.betResult.length == 0)){
                        $('#load-more').hide()
                    }else{
                        $('#load-more').show()
                    }
                    if(html == ''){
                        html += `<tr class="empty_table"><td>No record found</td></tr>`
                    }
                    $('.new-body').html(html)

                }else{
                    $('.new-body').append(html)         
                    if((data.betResult.length == 0)){
                        $('#load-more').hide()
                    }
                }
            })

            $(document).on('click', ".cancel-timelyVoide", function(e){
                let form = $("#myModal2").find('.form-data')
                form.attr('id', this.id)
            })

            $(document).on('submit', '.timely-voideBet', function(e){
                e.preventDefault() 
                let form = $(this)[0];
                let fd = new FormData(form);
                let data = Object.fromEntries(fd.entries());
                let id = this.id
                // console.log(id)
                socket.emit('timelyVoideBEt',{data,LOGINDATA, id})
                // console.log(data, "DATA123")
            })


            socket.on('timelyVoideBEt', async(data) => {
                if(data.status === "err"){
                    alert(data.message)
                }else{
                    alert('Bet Voided Successfully !!')
                }
            })
    }


    if(pathname === "/exchange_sports/tennis"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 1000)
        }
        marketId()

        // socket.on("marketId", async(data) => {
        //     $(document).ready(function() {
          
        //         $(".0").each(function() {
        //         let id = this.id
        //         const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //         this.innerHTML = `${foundItem.odds[0].backPrice1}, ${foundItem.odds[0].layPrice1}`
        //         });

        //         $(".1").each(function() {
        //             let id = this.id
        //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             this.innerHTML = `${foundItem.odds[1].backPrice1}, ${foundItem.odds[1].layPrice1}`
        //         });

        //         $(".2").each(function() {
        //             let id = this.id
        //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             this.innerHTML = `${foundItem.odds[2].backPrice1}, ${foundItem.odds[2].layPrice1}`
        //         });

        //     })

        //     $(document).on("click", ".click", function(){
        //         window.location.href = `/exchange_inPlay/match?id=${this.id}`
        //     })
            
        // })
    }



    if(pathname === "/exchange_sports/inplay"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                  ids.push(this.id);
                });
          
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()

        // socket.on("marketId", (data) => {
        //     $(document).ready(function() {
          
        //         $(".0").each(function() {
        //         let id = this.id
        //         const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //         this.innerHTML = `${foundItem.odds[0].backPrice1}, ${foundItem.odds[0].layPrice1}`
        //         });

        //         $(".1").each(function() {
        //             let id = this.id
        //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             this.innerHTML = `${foundItem.odds[1].backPrice1}, ${foundItem.odds[1].layPrice1}`
        //         });

        //         $(".2").each(function() {
        //             let id = this.id
        //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             this.innerHTML = `${foundItem.odds[2].backPrice1}, ${foundItem.odds[2].layPrice1}`
        //         });

        //     })
        // })

        $(document).on("click", ".click", function(){
                window.location.href = `/exchange_inPlay/match?id=${this.id}`
        })
    }

    // if(pathname === "/exchange_inPlay/match"){
    //     function marketId(){
    //         $(document).ready(function() {
    //             var ids = [];
          
    //             $(".market").each(function() {
    //               ids.push(this.id);
    //             });
    //             // console.log(ids)
    //             socket.emit("marketId", ids)
    //           });
    //           setTimeout(()=>{
    //             marketId()
    //           }, 60000)
    //     }
    //     marketId()


    //     socket.on("marketId", async(data) => {
    //         // console.log(data)
    //         $(document).ready(function() {
          
    //             $(".BACK").each(function() {
    //             let id = this.id
    //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
    //             for(let i = 0; i < 3; i++){
    //                 if($(this).hasClass(`${i}`)){
    //                     // this.innerHTML = `<button id="123">${foundItem.odds[i].backPrice1}</button>, <button id="123">${foundItem.odds[i].backPrice2}</button>, <button id="123">${foundItem.odds[i].backPrice3}</button>`
    //                     document.getElementById(`${this.id}0`).innerHTML = `${foundItem.odds[i].backPrice3}`
    //                     document.getElementById(`${this.id}1`).innerHTML = `${foundItem.odds[i].backPrice2}`
    //                     document.getElementById(`${this.id}2`).innerHTML = `${foundItem.odds[i].backPrice1}`

    //                 }
    //             }
    //             });

    //             $(".LAY").each(function() {
    //                 let id = this.id
    //                 const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
    //                 for(let i = 0; i < 3; i++){
    //                     if($(this).hasClass(`${i}`)){
    //                         // this.innerHTML = `<button id="123">${foundItem.odds[i].layPrice1}</button>, <button id="123">${foundItem.odds[i].layPrice2}</button>, <button id="123">${foundItem.odds[i].layPrice3}</button>`
    //                         document.getElementById(`${this.id}3`).innerHTML = `${foundItem.odds[i].layPrice1}`
    //                         document.getElementById(`${this.id}4`).innerHTML = `${foundItem.odds[i].layPrice2}`
    //                         document.getElementById(`${this.id}5`).innerHTML = `${foundItem.odds[i].layPrice3}`
    //                     }
    //                 }
    //                 });
             
    //         })
    //     })

    //     function eventID(){
    //         let eventId = $(".eventName").attr("id")
    //         socket.emit("eventId", eventId)
    //         setTimeout(()=>{
    //             eventID()
    //           }, 500)

    //     }
    //     eventID()
    //     socket.on("eventId", async(data)=>{
    //         if(data != ""){
    //             let score = JSON.parse(data)
                
    //             document.getElementById("Score").innerHTML = score[0].data
    //         }
    //     })

    //     // document.getElementsByClassName('button').addEventListener('click', function() {
    //     //     console.log("1234")
    //     //   var popup = document.getElementById('popupForm');
    //     //   popup.style.display = 'block';
    //     // });
    //     const buttons = document.getElementsByClassName('button');
    //     let popup = document.getElementById('popupForm');
    //     let form = $(popup).find('#bet-form')
    //     Array.from(buttons).forEach(function(button) {
    //         button.addEventListener('click', function() {
    //           popup.style.display = 'block';
    //         });
    //       });

          
    // document.addEventListener('click', function(event) {
    //     if (!popup.contains(event.target) && !Array.from(buttons).some(button => button.contains(event.target))) {
    //       popup.style.display = 'none';
    //       form.find('input[name = "odds"]').val("")
    //     }

    //     if(Array.from(buttons).some(button => button.contains(event.target))){
    //         form.find('input[name = "odds"]').val("")
    //         form.find('input[name = "title"]').removeClass()
    //     }
    //   });



    // //   $(document).on('click','.button',function(e){
    // //     let modleName = $(".popup")
    // //     let form = $(modleName).find('#bet-form')
    // //     let eventName = $(".eventName").text()
    // //     let marketId = $(".match_odd").attr('id')
    // //     let x = parseFloat($(this).text())
    // //     let id = parseFloat($(this).attr("id"))
    // //     // form.find('input[name = "odds"]').val(x)
    // //     form.find('input[name="odds"]').prop('value', x)
    // //     form.find('input[name = "title"]').addClass(id);
    // //     form.find('input[name = "button"]').addClass(marketId);
    // //     form.find('input[name = "title"]').val(eventName)
    // // })

    // document.addEventListener('click', function(e) {
    //     if (e.target.classList.contains('button')) {
    //       e.preventDefault();
      
    //       var modleName = document.querySelector('.popup');
    //       var form = modleName.querySelector('#bet-form');
    //       var eventName = document.querySelector('.eventName').textContent;
    //       var marketId = document.querySelector('.match_odd').getAttribute('id');
    //       var x = parseFloat(e.target.textContent.trim());
    //       var id = e.target.getAttribute('id');
      
    //       form.querySelector('input[name="odds"]').value = x;
    //       form.querySelector('input[name="title"]').classList.add(id);
    //       form.querySelector('input[name="button"]').classList.add(marketId);
    //       form.querySelector('input[name="title"]').value = eventName;
    //     }
    //   });      

    // async function checkOdd() {
    // //    console.log('working')
    //     let modleName = $(".popup")
    //     let form = $(modleName).find('#bet-form')
    //     let formOddsbuttonId = form.find('input[name = "title"]').attr("class");
    //     let odds = $(`#${formOddsbuttonId}`).text()
    //     if(form.find('input[name = "odds"]').val() != odds && form.find('input[name = "odds"]').val() != ''){
    //         alert('odds value change')
    //         form.find('input[name = "odds"]').val(odds)
    //     }
    //    setTimeout(()=>{
    //     formOdds = null
    //     checkOdd()
    //   }, 300)
    // }


    // $(document).on('submit', '#bet-form', async function(e){
    //     e.preventDefault()
    //     let form = $(this)[0];
    //     let fd = new FormData(form);
    //     let data = Object.fromEntries(fd.entries());
    //     data.secId = $("#bet-title").attr("class").slice(0, -1);
    //     data.market = $("#SUBMIT").attr("class");
    //     data.eventId = $('.eventName')[0].id
    //     data.spoetId = $('.details')[0].id
    //     let modleName = $(".popup")
    //     let form1 = $(modleName).find('#bet-form')
    //     let formOddsbuttonId = form1.find('input[name = "title"]').attr("class");
    //     let odds = $(`#${formOddsbuttonId}`).text()
    //     if(odds != data.odds && !data.option1){
    //         alert('odds value change')
    //         form1.find('input[name = "odds"]').val(odds)
    //         data.odds = odds
    //     }else{
    //         form1.find('input[name = "odds"]').val(odds)
    //         data.odds = odds
    //     }
    //     // console.log(data)
    //     socket.emit('betDetails', {data, LOGINDATA});
    // })

    // socket.on("betDetails" , (data) => {
    //     alert(data)
    // })




    // }

    if(pathname === "/exchange_sports/cricket"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()


        // socket.on("marketId", async(data) => {
        //     // console.log(data)
        //     $(document).ready(function() {
          
        //         $(".0").each(function() {
        //         let id = this.id
        //         const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //         this.innerHTML = `${foundItem.odds[0].backPrice1}, ${foundItem.odds[0].layPrice1}`
        //         });

        //         $(".1").each(function() {
        //             let id = this.id
        //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             this.innerHTML = `${foundItem.odds[1].backPrice1}, ${foundItem.odds[1].layPrice1}`
        //         });

        //         $(".2").each(function() {
        //             let id = this.id
        //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             this.innerHTML = `${foundItem.odds[2].backPrice1}, ${foundItem.odds[2].layPrice1}`
        //         });

        //     })

        //     $(document).on("click", ".click", function(){
        //         window.location.href = `/exchange_inPlay/match?id=${this.id}`
        //     })

        // })
    }


    if(pathname === "/exchange_sports/football"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()

        // socket.on("marketId", async(data) => {
        //     $(document).ready(function() {
          
        //         $(".0").each(function() {
        //         let id = this.id
        //         const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //         this.innerHTML = `${foundItem.odds[0].backPrice1}, ${foundItem.odds[0].layPrice1}`
        //         });

        //         $(".1").each(function() {
        //             let id = this.id
        //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             this.innerHTML = `${foundItem.odds[1].backPrice1}, ${foundItem.odds[1].layPrice1}`
        //         });

        //         $(".2").each(function() {
        //             let id = this.id
        //             const foundItem = data.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             this.innerHTML = `${foundItem.odds[2].backPrice1}, ${foundItem.odds[2].layPrice1}`
        //         });

        //     })

        //     $(document).on("click", ".click", function(){
        //         window.location.href = `/exchange_inPlay/match?id=${this.id}`
        //     })
            
        // })
    }




    if(pathname === '/admin/Notification'){

        $(document).on('submit', '.addNotification', async function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            // console.log(LOGINDATA)
            socket.emit("createNotification", {data, LOGINDATA})
        })

        socket.on('createNotification', async(data)=>{
            if(data.status != "success"){
                alert(data.message)
            }else{
                alert("Notification added successfully")
                window.location.href = '/admin/Notification'
            }
        })

        $(document).on('click', '.update', async function(){
            let id = $(this).attr('id')
            if(confirm('do you want to change status')){
                socket.emit('updateStatus', {id, LOGINDATA})
            }
        })

        $(document).on('click', '.delete', async function(){
            let id = $(this).attr('id')
            if(confirm('do you want to delte this notification')){
                socket.emit('deleteNotification', {id, LOGINDATA})
            }
        })

        socket.on('updateStatus', async(data)=>{
            if(data.message === "updated"){
                let html = ``
                if(data.status){
                    html += `Enable`
                    document.getElementById(`${data.id}`).classList.remove("disable")
                }else{
                    html += `Disable`
                    document.getElementById(`${data.id}`).classList.add("disable")
                }
                document.getElementById(`${data.id}`).innerHTML = html
            }else{
                alert(data)
            }
        })

        socket.on('deleteNotification', async(data)=>{
            if(data.status === 'success'){
                alert("Deleted successfully")
                window.setTimeout(()=>{
                    window.location = '/admin/Notification'
                },500)
            }else{
                alert(data.message)
            }
        })




    };





    if(pathname === "/"){
        $(document).on('click', '.foo', async function(){
            let id = $(this).attr('id')
            socket.emit("PromotionId", id)
        })

        socket.on("PromotionId", async(data) => {
            window.open(`${data.link}`, "_blank");
        })
    }


    if(pathname === "/admin/promotion"){
        $(document).on('click','.promotionDetails', function(){
            let id = $(this).attr('id')
            socket.emit("PromotionIdByData", id)
        });

        socket.on("PromotionIdByData", async(data) => {
                console.log(data)
                let modleName = "#myModal5"
                let form = $(modleName).find('.form-data1')
                let PMD = data
                form.attr('id', PMD._id);
                // form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "name"]').attr('value',PMD.position)
                form.find('input[name = "link"]').attr('value',PMD.link)
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                    form.find('input[name = "check"]').parent('.switch').addClass('on');
                }else{
                    form.find('input[name = "check"]').attr("checked", "");
                    form.find('input[name = "check"]').parent('.switch').removeClass('on');

                }
                if(PMD.video){
                    form.find('#img').html(`<video src="../img/${PMD.position}.mp4" type="video/mp4" height=100 width=100>`)
                }else{
                    form.find('#img').html(`<img src="../img/${PMD.position}.png" height=100 width=100>`)
                }
        })
    }



    if(pathname === "/admin/liveMarket"){
        // function marketId(){
            // $(document).ready(function() {
            //     var ids = [];
          
            //     $(".MarketIds").each(function() {
            //       ids.push(this.id);
            //     });
            //     // console.log(ids)
            //     socket.emit("aggreat", {ids, LOGINDATA})
            //   });
        //       setTimeout(()=>{
        //         marketId()
        //       }, 60000)
        // }
        // marketId()
        function marketId(){
            $(document).ready(function() {
                // var ids = [];
          
                // $(".MarketIdsR").each(function() {
                //   ids.push(this.id);
                // });
                // console.log(ids)
                socket.emit("aggreat",  LOGINDATA)
                // socket.emit("aggreat", LOGINDATA)
              });
              setTimeout(()=>{
                if(pathname === "/admin/liveMarket"){
                    marketId()
                }
              }, 500)
        }
        marketId()
        

        socket.on("aggreat", async(data) => {
            console.log(data)
            let stake1 = 0;
            let stake2 = 0;
            data.forEach(item => {
                // item.betData.forEach(bet => {
                    if(document.getElementById(`${item._id}`)){
                        document.getElementById(`${item._id}`).innerText = item.totalStake
                        document.getElementById(`${item._id}B`).innerText = item.count
                    }
                // })
            })
        })
    }


    if(pathname === "/admin/cms"){

        //FOR VERTICLE MENU//
        $(document).on('submit', '.form-data20', async function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            // console.log(data)
            socket.emit("createVerticalMenu", {data, LOGINDATA})
        })

        socket.on("createVerticalMenu", async(data)=>{
            console.log(data)
            if(data.status === "success"){
                alert("Menu Added Successfully")
                    window.setTimeout(()=>{
                        window.location = '/admin/cms'
                    },500)
            }else{
                alert(`${data.err.message}`)
            }
        })


        $(document).on('click','.getVerticalMenuDetails', function(){
            let id = $(this).attr('id')
            socket.emit("VerticalMenuIdByData", id)
            // console.log(id)
        });

        socket.on("VerticalMenuIdByData", async(data) => {
                let modleName = "#myModal5"
                let form = $(modleName).find('.form-data21')
                let PMD = data.verticalMenu
                form.attr('id', PMD._id);
                // form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "menuName"]').attr('value',PMD.menuName)
                form.find('input[name = "num"]').attr('value',PMD.num)
                form.find('input[name = "url"]').attr('value',PMD.url)
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                    form.find('input[name = "check"]').parent('.switch').addClass('on');
                }else{
                    form.find('input[name = "check"]').attr("checked", "");
                    form.find('input[name = "check"]').parent('.switch').removeClass('on');
                }
                let html = ``
                for(let i =0 ; i<data.page.length; i++){
                    if(data.page[i].Name === data.verticalMenu.page){
                        html += `<option selected value="${data.page[i].Name}">${data.page[i].Name}</option>`
                    }else{
                        html += `<option value="${data.page[i].Name}">${data.page[i].Name}</option>`
                    }
                }
                document.getElementById('page123').innerHTML = html
        })

        $(document).on('submit', ".form-data21", function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            let id  = $(this).attr('id')
            data.id = id
            socket.emit("updateVerticalMenu", data)
        });
        
        socket.on("updateVerticalMenu", async(data)=>{
            alert(`${data}`)
                    window.setTimeout(()=>{
                        window.location = '/admin/cms'
                    },500)
        })

        $(document).on('click', ".deleteVerticalMenuDetails", function(e){
            let id = $(this).attr('id')
            if(confirm('do you want to delete this menu')){
                socket.emit("deleteVerticalMenu", id)
            }
        })

        socket.on("deleteVerticalMenu", async(data) => {
            alert("Menu Deleted Successfully")
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },500)
        })


        $(document).on('click', ".getHorizontalMenuDetails", function(e){
            let id = $(this).attr('id')
            socket.emit("HorizontalMenuIdByData", id)
        })
        socket.on('HorizontalMenuIdByData', async(data) => {
                let modleName = "#myModal6"
                let form = $(modleName).find('.form-data23')
                let PMD = data
                form.attr('id', PMD._id);
                // form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "menuName"]').attr('value',PMD.menuName)
                form.find('input[name = "url"]').attr('value',PMD.url)
                form.find('input[name = "num"]').attr('value',PMD.Number)
                form.find('input[name = "page"]').attr('value',PMD.page)
                document.getElementById('img').innerHTML = `<img src="../imgForHMenu/${PMD.icon}.png" alt="img" class="form__user-photo">`
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                    form.find('input[name = "check"]').parent('.switch').addClass('on');
                }else{
                    form.find('input[name = "check"]').attr("checked", "");
                    form.find('input[name = "check"]').parent('.switch').removeClass('on');
                }
        })

        $(document).on('click', ".deleteHorizontalMenu", function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            socket.emit("deleteHorizontalMenu", id)
        })
        socket.on('deleteHorizontalMenu', async(data)=>{
            alert("Menu deleted")
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })

        $(document).on("click", ".getBannerDetails", function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            socket.emit("getBannerDetails", id)
        })

        socket.on("getBannerDetails", async(data) => {
            let modleName = "#myModal7"
                let form = $(modleName).find('.form-data25')
                let PMD = data
                form.attr('id', PMD._id);
                // form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "Name"]').attr('value',PMD.bannerName)
                form.find('input[name = "url"]').attr('value',PMD.url)
                document.getElementById('banner12').innerHTML = `<img src="../banner/${PMD.banner}.png" alt="img" class="form__user-photo">`
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                    form.find('input[name = "check"]').parent('.switch').addClass('on');
                }else{
                    form.find('input[name = "check"]').attr("checked", "");
                    form.find('input[name = "check"]').parent('.switch').removeClass('on');
                }
        })

        $(document).on("click", ".deleteBanner", function(e){
            let id = $(this).attr('id')
            if(confirm('do you want to delete this banner')){
                socket.emit("deleteBanner", id)
            }
        })

        socket.on("deleteBanner", data =>{
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })

        socket.emit("CmsPage", "Connected")
        socket.on('CmsPage', async(data) => {
            for(let i = 0; i < data.length; i++){
                let form = $(`#${data[i]._id}`)
                form.find('input[name = "url"]').attr('value', data[i].mainUrl)
                form.find('input[name = "name"]').attr('value', data[i].name)
                form.find('input[name = "Number"]').attr('value', data[i].Number)
                form.find('input[name = "check"]').removeAttr('checked');
                if(data[i].status){
                    form.find('input[name = "check"]').attr("checked", "checked");
                }
            }
        })

        $(document).on('click', ".btn-filter-image", function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            let modleName = "#addImage"
            let form = $(modleName).find('.form-data26')
            form.attr('id', id);
        })

        $(document).on('click', ".dleteImageSport", function(e){
            e.preventDefault()
            let id = $(this).attr("id")
            if(confirm('do you want to delete this image')){
                socket.emit("dleteImageSport", id)
            }
        })
        socket.on("dleteImageSport", async(data)=>{
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })

        $(document).on('click', ".editImageSport", function(e){
            e.preventDefault()
            let id = $(this).attr('id')
            let modleName = "#EditSliderInImage"
            let form = $(modleName).find('.editImageSportForm')
            form.attr('id', id);
            socket.emit("editImageSport", id)
        })

        socket.on('editImageSport', data => {
            if(data == "Please try again later"){
                alert(data)
            }else{
                let modleName = "#EditSliderInImage"
                let form = $(modleName).find('.editImageSportForm')
                form.find('input[name = "name"]').attr('value',data.name)
                form.find('input[name = "url"]').attr('value',data.url)
                document.getElementById('banner12345').innerHTML = `<img src="../sliderImages/${data.name}.png" alt="img" class="form__user-photo">`
            }
        })

        socket.on('UpdateSport', async(data) => {
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })


        $(document).on('click', ".deleteSlider", function(e){
            e.preventDefault()
            let id = $(this).attr('id')
            if(confirm('do you want to delete this slider')){
                socket.emit('deleteSlider', id)
            }
        })
        socket.on('deleteSlider', async(data) => {
            alert(data)
            window.setTimeout(()=>{
                window.location = '/admin/cms'
            },200)
        })
    }


    if(pathname === "/exchange"){
        
        function marketId(){
            socket.emit("liveData" , "data12")
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()

        socket.on('liveData', async(data) => {
            let html = ``
            for(let i = 0; i < data.LiveCricket.length; i++){
                if(data.LiveCricket[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.LiveCricket[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg02.svg" alt="">
                                    ${data.LiveCricket[i].eventData.name}
                                </a>`
                }
            }
            for(let i = 0; i < data.liveFootBall.length; i++){
                if(data.liveFootBall[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.liveFootBall[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg03.svg" alt="">
                                    ${data.liveFootBall[i].eventData.name}
                                </a>`
                }
            }
            for(let i = 0; i < data.liveTennis.length; i++){
                if(data.liveTennis[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.liveTennis[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg04.svg" alt="">
                                    ${data.liveTennis[i].eventData.name}
                                </a>`
                }
            }
            document.getElementById('liveMatch_data').innerHTML = html
        })

        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                    if($(this).val() != "-"){
                        ids.push(this.id);
                    }
                });
          
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 1000)
        }
        marketId()
    }


    if(pathname === '/exchange_inPlay/match'){

        // $(document).ready(function(){
        //     $(".exchange-pg-inn-tbl .button").click(function(event){
        //       $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').slideUp()
        //       $('tr.tbl-data-href td .button').removeAttr("style");
        //       $(this).parents('tr').next().find('.my-exc-inn-colaps-txt-dv').slideDown();
        //       $(this).parents('tr').find('.button').css({"pointer-events": "none"});
        //       event.stopPropagation()
        //     });
        //     $("tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv").click(function(event){
        //       event.stopPropagation()
        //     });
        //     $(".my-exc-inn-colaps-txt-dv .close-btn, body").click(function(){
        //       $('tr.tbl-data-href td .button').removeAttr("style");
        //       $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').slideUp()
        //     });
        //   });

        $(document).ready(function(){
            $("table .button").click(function(){
              $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').removeClass('open');
              $(this).parents('tr').next().find('.my-exc-inn-colaps-txt-dv').addClass('open');
            });
            $(".my-exc-inn-colaps-txt-dv .close-btn").click(function(){
              $('tr:not(.tbl-data-href) .my-exc-inn-colaps-txt-dv').removeClass('open');
            });
        });
        
        
        

        function marketLimitId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".market-limit").each(function() {
                    if (!ids.includes(this.id)) {
                        ids.push(this.id);
                    }
                });
                // console.log(ids)
                socket.emit("marketLimitId", ids)
              });
        }
        marketLimitId()


        function marketNotificationId(){
            $(document).ready(function() {
            var marketIds = [];

            $('.marketNotification').each(function(){
                if(!marketIds.includes(this.id)){
                    marketIds.push(this.id)
                }
            })
            socket.emit("marketnotificationId", marketIds)
            setTimeout(()=>{
                marketNotificationId()
              }, 1000 * 60)
        });
        }
        marketNotificationId()

        socket.on('marketnotificationId', async(data) => {
            data.forEach(item => {
                $('.marketNotification').each(function(){
                    if(this.id == item.marketId){
                        console.log("WORKING")
                        $(this).html(`<marquee>${item.message}</marquee>`)
                    }
                })
            })
        })




        socket.on('marketLimitId', data => {
            // console.log(data, 'returnData')
            $('.market-limit').each(function(){
                let limitData = data.find(item => item.type == this.id)
                if(limitData){
                    this.innerHTML = `<b>Min : ${limitData.min_stake}, Max : ${limitData.max_stake}</b>`
                }
            })
        })



        function showLoader() {
            document.getElementById("loader-overlay").style.display = "flex";
          }
          
          function hideLoader() {
            document.getElementById("loader-overlay").style.display = "none";
          }


        let id = search.split('=')[1]
        function eventID(){
            socket.emit("eventId", id)
            setTimeout(()=>{
                eventID()
              }, 500)

        }
        eventID()
        socket.on("eventId", async(data)=>{
            if(data != ""){
                let score = JSON.parse(data)
                let element = document.getElementsByClassName("score")
                for(let i = 0; i < element.length; i++){
                    element[i].innerHTML = score[0].data
                }
                // document.getElementById("score").innerHTML = score[0].data
            }
        })

        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".market").each(function() {
                  ids.push(this.id);
                });
                let eventId = search.split('=')[1]
                socket.emit("marketId", {ids, eventId})
              });
              setTimeout(()=>{
                marketId()
              }, 5000)
        }
        marketId()

        let first = true
        socket.on("marketId", async(data) => {
            // console.log("working")
            $(".match_odd_Blue").each(function() {
                    
                let id = this.id

                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}1` ){
                    if( section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            if(data1 != section.backPrice1){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}2`){
                    if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                        }else{

                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            if(data1 != section.backPrice2){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}3`){
                    if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.backPrice3){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                    }
                }
            })


            $(".match_odd_Red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}4` ){
                    if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice1){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if(this.id == `${section.selectionId}5`){
                    if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice2){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if (this.id == `${section.selectionId}6`){
                    if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice3){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }
            })



            $(".winner_Blue").each(function() {
                    
                let id = this.id

                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}1` ){
                    if( section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            if(data1 != section.backPrice1){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}2`){
                    if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                        }else{

                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            if(data1 != section.backPrice2){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}3`){
                    if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.backPrice3){
                                this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                    }
                }
            })



            $(".winner_Red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                let parentElement = this.parentNode
                if(this.id == `${section.selectionId}4` ){
                    if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice1){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if(this.id == `${section.selectionId}5`){
                    if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice2){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if (this.id == `${section.selectionId}6`){
                    if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        if(first){
                            this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice3){
                                this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }
            })
            // $(".tied_match_Blue").each(function() {
                    
            //     let id = this.id
            //     id = id.slice(0, -1);
            //     let section = null;
            //     console.log(data.finalResult)
            //     data.finalResult.items.some(item => {
            //         if(item && item.odds){
            //             console.log(item, 4564654654)
            //             section = item.odds.find(odd => odd.selectionId == id);
            //             return section !== undefined;
            //         }
            //     });
            //     console.log(section)
            //     if(this.id == `${section.selectionId}1` ){
            //         if( section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
            //             // this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
            //             this.innerHTML = `<span><b>${section.backPrice1}</b></span> 
            //                             <span>${section.backSize1}</span>`
            //         }
            //     }else if(this.id == `${section.selectionId}2`){
            //         if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
            //             // this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
            //             this.innerHTML = `<span><b>${section.backPrice2}</b></span> 
            //             <span>${section.backSize2}</span>`
            //         }
            //     }else if (this.id == `${section.selectionId}3`){
            //         if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
            //             // this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
            //             this.innerHTML = `<span><b>${section.backPrice3}</b></span> 
            //             <span>${section.backSize3}</span>`
            //         }
            //     }
            // })


            // $(".tied_match_Red").each(function() {
                    
            //     let id = this.id
            //     id = id.slice(0, -1);
            //     let section = null;
            //     data.finalResult.items.some(item => {
            //         if(item && item.odds){
            //         section = item.odds.find(odd => odd.selectionId == id);
            //         return section !== undefined;
            //         }
            //     });
            //     if(this.id == `${section.selectionId}4` ){
            //         if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             this.innerHTML = `<span><b>${section.layPrice1}</b></span> 
            //                                 <span>${section.laySize1}</span>`
            //         }
            //     }else if(this.id == `${section.selectionId}5`){
            //         if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             this.innerHTML = `<span><b>${section.layPrice2}</b></span> 
            //                             <span>${section.laySize2}</span>`
            //         }
            //     }else if (this.id == `${section.selectionId}6`){
            //         if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             this.innerHTML = `<span><b>${section.layPrice3}</b></span> 
            //                             <span>${section.laySize3}</span>`
            //         }
            //     }
            // })
            $(".bookmaker_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                let item = data.finalResult.items.some(item => {
                    if(item){
                        // console.log(id)
                        if(item.runners){
                            // console.log(item)
                            let section1 = item.runners.find(item2 => item2.secId == id)
                            if(section1){
                                section = section1
                            }
                        }
                    }
                })
                if(this.id == `${section.secId}1` ){
                    if( section.back == "-" || section.back == "1,000.00" || section.back == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        // this.innerHTML = `<span><b>${section.layPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.back}</b></span> <span> ${section.backSize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                    }
                }
            })

            $(".bookmaker_red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                let sectionData 
                data.finalResult.items.some(item => {
                    if(item){
                        sectionData = item
                        if(item.runners){
                            let section1 = item.runners.find(item2 => item2.secId == id)
                            if(section1){
                                section = section1
                            }
                        }
                    }
                })
                let parentElement = this.parentNode
                // console.log(parentElement)
                if(this.id == `${section.secId}2` ){
                    if( section.lay == "-" || section.lay == "1,000.00" || section.lay == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      if( section.back == "-" || section.back == "1,000.00" || section.back == "0"){
                          parentElement.classList.add("suspended");
                          $(this).parent().find(".match-status-message").text("Suspended")
                      }
                    }else if(sectionData.win_result != 'undefined' && sectionData.win_result != " " && sectionData.win_result != ""){
                        this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text('Result Declared')
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                            parentElement.classList.remove("suspended")
                            $(this).parent().find(".match-status-message").text("")
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.lay}</b></span> <span> ${section.laySize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                        // this.innerHTML = `<b>${section.layPrice}</b> <br> ${section.laySize}`
                    }
                    if( !(section.back == "-" || section.back == "1,000.00" || section.back == "0")){
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                    }
                   
                }
            })

            $(".odd_even_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                if(this.id == `${section.market_id}1` ){
                    if( section.odd == "-" || section.odd == "1,000.00" || section.odd == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        let x = ((section.odd * 100) - 100).toFixed(2)
                        this.innerHTML = `<span><b>1</b></span> <span> ${x}</span>` 
                    }
                }
            })

            $(".odd_even_red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                let parentElement = this.parentNode
                if(this.id == `${section.market_id}2` ){
                    if(section.ball_running){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Ball Running")
                    }else if(section.win_result != 'undefined' && section.win_result != " " && section.win_result != ""){
                        this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text('Result Declared')
                    }else if(section.suspended){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else if( section.even == "-" || section.even == "1,000.00" || section.even == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        $(this).parent().find(".match-status-message").text("")
                        parentElement.classList.remove("suspended")
                        let x = ((section.even * 100) - 100).toFixed(2)
                        this.innerHTML = `<span><b>1</b></span> <span> ${x}</span>` 
                    }
                }
            });

            $(".only_over_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                if(this.id == `${section.market_id}1` ){
                    if( section.yes == "-" || section.yes == "1,000.00" || section.yes == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        // this.innerHTML = `<span><b>${section.yes}</b></span>` 
                        let x = (parseFloat(section.yes_rate) + 100)/100
                        // this.innerHTML = `<span><b>${x}</b></span> <span> ${section.yes}</span>`
                        this.innerHTML = `<span><b>${section.yes}</b></span> <span> ${section.yes_rate}</span>`
                    }
                }
            });


            $(".only_over_red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                let parentElement = this.parentNode
                // console.log(section.ball_running)
                if(this.id == `${section.market_id}2` ){
                    if(section.ball_running){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Ball Running")
                    }else if(section.win_result != 'undefined' && section.win_result != " " && section.win_result != ""){
                        this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text('Result Declared')
                    }else if(section.suspended){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else if( section.no == "-" || section.no == "1,000.00" || section.no == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        $(this).parent().find(".match-status-message").text("")
                        parentElement.classList.remove("suspended")
                        let x = (parseFloat(section.no_rate) + 100)/100
                        // this.innerHTML = `<span><b>${x}</b></span> <span> ${section.no}</span>`
                        this.innerHTML = `<span><b>${section.no}</b></span> <span> ${section.no_rate}</span>`
                        // this.innerHTML = `<span><b>${section.no}</b></span>` 
                    }
                }
            });

            first = false
            const spanElement2 = document.querySelectorAll('.button');
                setTimeout(() => {
                    spanElement2.forEach(spanElement => {
                        if(spanElement.style){
                            spanElement.style.backgroundColor = '';
                        }// Remove background color
                      });
                    
                },300)
        })

        // const buttons = document.querySelectorAll(".button");
        // buttons.forEach((button) => {
        //   button.addEventListener("click", (event) => {
        //     const clickedButton = event.target;
        //     const firstChildValue = clickedButton.firstElementChild.innerText;
        //     const numSpan = document.querySelector(".nww-bet-slip-wrp-col1-txt-num");
        //     numSpan.innerText = firstChildValue;
        //   });
        // });
      
        // jQuery approach
        $(document).ready(function () {
            $(".button").click(function () {
            if(this.classList.contains('match_odd_Blue') || this.classList.contains('match_odd_Red')){
                let odds = $(this).children("span:first-child").attr('data-id');
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                let secId2;
                if($(this).hasClass('match_odd_Blue')){
                  secId2 = secId.slice(0,-1) + '1'
                  }else{
                  secId2 = secId.slice(0,-1) + '4'
                  }
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId2}1`);;
                numSpan.text(odds);

                if($(this).hasClass('tbl-bg-blu-spn')){
                    $(this).closest("tr").next().removeClass('lay-inplaymatch')
                    $(this).closest("tr").next().addClass('back-inplaymatch')
                }else{
                    $(this).closest("tr").next().removeClass('back-inplaymatch')
                    $(this).closest("tr").next().addClass('lay-inplaymatch')
                }

            }else if(this.classList.contains('bookmaker_blue') || this.classList.contains('bookmaker_red')){
                let odds = $(this).children("span:first-child").text();
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);;
                numSpan.text(odds);

                if($(this).hasClass('tbl-bg-blu-spn')){
                    $(this).closest("tr").next().removeClass('lay-inplaymatch')
                    $(this).closest("tr").next().addClass('back-inplaymatch')
                }else{
                    $(this).closest("tr").next().removeClass('back-inplaymatch')
                    $(this).closest("tr").next().addClass('lay-inplaymatch')
                }
            }else{
                let odds = $(this).children("span").eq(1).text();
                let beton = $(this).closest("tr").find("td:first-child").text();
                let secondPTag = $(this).closest("tr").next().find(".beton");
                let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
                let secId = this.id
                secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);;
                numSpan.text(odds);

                if($(this).hasClass('tbl-bg-blu-spn')){
                    $(this).closest("tr").next().removeClass('lay-inplaymatch')
                    $(this).closest("tr").next().addClass('back-inplaymatch')
                }else{
                    $(this).closest("tr").next().removeClass('back-inplaymatch')
                    $(this).closest("tr").next().addClass('lay-inplaymatch')
                }
            }
            });
          });

          $(document).ready(function () {
            $(".nww-bet-slip-wrp-col2-inn span").click(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                console.log(buttonId, "buttonId")
                let IdButton = $(`#${buttonId}`)
                // console.log(IdButton.attr("class"), "IdButton")
                // console.log(IdButton, "IdButton")
            if($(this).closest('tr').hasClass('back-inplaymatch')){
                if(IdButton.hasClass('match_odd_Blue')){
                    var spanId = $(this).attr("id");
                    let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
                    let newStake
                  //   console.log(OldStake)
                    if(OldStake == ""){
                      newStake = parseFloat(spanId)
                    }else{
                      newStake = parseFloat(spanId) + parseFloat(OldStake)
                    }
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    var result = (parseFloat(newStake) * betValue) - parseFloat(newStake);
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
                      $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(spanId))
                      let result2 = (parseFloat(spanId) * betValue) - parseFloat(spanId)
                      $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result2.toFixed(2));
                    }else{
                        $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
                        $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result.toFixed(2));
                    }
                }else{
                    console.log(IdButton)
                    var spanId = $(this).attr("id");
                    let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
                    let newStake
                  //   console.log(OldStake)
                    if(OldStake == ""){
                      newStake = parseFloat(spanId)
                    }else{
                      newStake = parseFloat(spanId) + parseFloat(OldStake)
                    }
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    var result = ((parseFloat(newStake) * betValue) / 100);
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
                      $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(spanId))
                      let result2 = ((parseFloat(spanId) * betValue) / 100)
                      $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result2.toFixed(2));
                    }else{
                        $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
                        $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result.toFixed(2));
                    }
                }
            }else{
                if(IdButton.hasClass('match_odd_Red')){
                    var spanId = $(this).attr("id");
                    let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
                    let newStake
                  //   console.log(OldStake)
                    if(OldStake == ""){
                      newStake = parseFloat(spanId)
                    }else{
                      newStake = parseFloat(spanId) + parseFloat(OldStake)
                    }
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    var result = (parseFloat(newStake) * 2) - parseFloat(newStake);
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
                      $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(spanId))
                      let result2 = (parseFloat(spanId) * 2) - parseFloat(spanId)
                      $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result2.toFixed(2));
                    }else{
                        $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
                        $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result.toFixed(2));
                    }
                }else{
                    var spanId = $(this).attr("id");
                    let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
                    let newStake
                  //   console.log(OldStake)
                    if(OldStake == ""){
                      newStake = parseFloat(spanId)
                    }else{
                      newStake = parseFloat(spanId) + parseFloat(OldStake)
                    }
                    var betValue = parseFloat(
                      $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                    );
                    let result
                    if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                        result = (parseFloat(newStake) * 2) - parseFloat(newStake);
                    }else{
                        result = ((parseFloat(newStake) * betValue)/100)
                    }
                  //   console.log(this.classList.contains("MAX"), this.classList.contains("ALLIN"))
                    if(this.classList.contains("MAX") || this.classList.contains("ALLIN")){
                      $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(spanId))
                      let result2 
                      if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                        result2 = (parseFloat(spanId) * 2) - parseFloat(spanId)
                      }else{
                        result2 = ((parseFloat(spanId) * betValue)/100).toFixed(2)
                      }
                      $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result2.toFixed(2));
                    }else{
                        $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
                        $(this)
                          .closest("tr")
                          .find(".c-gren")
                          .text(result.toFixed(2));
                    }
                }
            }
            });
          });

          $(document).ready(function () {
            $(".set-stake-form-input2").change(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                let IdButton = $(`#${buttonId}`)
                if($(this).closest('tr').hasClass('back-inplaymatch')){
                    var spanId = $(this).val()
                    var betValue = parseFloat(
                        $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                      );
                      var result 
                      if(IdButton.hasClass('match_odd_Blue')){
                        result = (parseFloat(spanId) * betValue) - parseFloat(spanId);
                      }else{
                        result = (parseFloat(spanId) * betValue) / 100
                      }
                      $(this)
                      .closest("tr")
                      .find(".c-gren")
                      .text(result.toFixed(2));
                }else{
                    var spanId = $(this).val()
                    var betValue = parseFloat(
                        $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                      );
                      let result
                      if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                           result = (parseFloat(spanId) * 2) - parseFloat(spanId);
                      }else{
                            result = (parseFloat(spanId) * betValue) / 100
                      }
                      $(this)
                      .closest("tr")
                      .find(".c-gren")
                      .text(result.toFixed(2));
                }
            })
          })
        
          $(document).ready(function(){
            $(".minus").click(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                let IdButton = $(`#${buttonId}`)
                let spanId =  ($(this).closest("tr").find('.set-stake-form-input2').val())
                let Odds = parseFloat($(this).closest('tr').find(".nww-bet-slip-wrp-col1-txt-num").text())
                let NewStake = spanId - 100;
                let result
                if($(this).closest('tr').hasClass('back-inplaymatch')){
                    if(IdButton.hasClass('match_odd_Blue')){
                        result = (NewStake * Odds) - NewStake;
                    }else{
                        result = (NewStake * Odds) / 100
                    }
                }else{
                    if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                        result = (NewStake * 2) - NewStake;
                    }else{
                        result = (NewStake * Odds) / 100
                    }
                }
                if(!spanId){
                    $(this).closest("tr").find('.set-stake-form-input2').val(0)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(0);
                }else if(NewStake < 0){
                    $(this).closest("tr").find('.set-stake-form-input2').val(0)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(0);
                }
                else{
                    // console.log("WORKING")
                    $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(result.toFixed(2));
                }
            })
          })


          $(document).on('click','.tbl-td-with5',function(e){
                // console.log("WORKING")
                $(".minus").closest("tr").find('.set-stake-form-input2').val(0)
                $(".minus")
                .closest("tr")
                .find(".c-gren")
                .text('00');
               
          })

          
          $(document).ready(function(){
            $(".plus").click(function () {
                let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
                let IdButton = $(`#${buttonId}`)
                console.log(IdButton)
                let spanId =  ($(this).closest("tr").find('.set-stake-form-input2').val())
                let Odds = parseFloat($(this).closest('tr').find(".nww-bet-slip-wrp-col1-txt-num").text())
                // let NewStake = parseFloat(spanId) + 100;
                let NewStake 
                if(spanId){
                    NewStake = parseFloat(spanId) + 100;
                }else{
                    NewStake = 100
                }
                let result
                if($(this).closest('tr').hasClass('back-inplaymatch')){
                    if(IdButton.hasClass('match_odd_Blue')){
                        result = (NewStake * Odds) - NewStake;
                    }else{
                        result = (NewStake * Odds) / 100
                    }
                }else{
                    if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
                        result = (NewStake * 2) - NewStake;
                    }else{
                        result = (NewStake * Odds) / 100
                    }
                }
                // console.log(result)
                if(!spanId){
                    $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(result.toFixed(2));
                }else if(NewStake < 0){
                    $(this).closest("tr").find('.set-stake-form-input2').val(0)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(0);
                }
                else{
                    // console.log("WORKING")
                    $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                    $(this)
                    .closest("tr")
                    .find(".c-gren")
                    .text(result.toFixed(2));
                }
            })
          })
          // Get all the rows with class "acount-stat-tbl-body-tr"
        //   const rows = document.querySelectorAll(".acount-stat-tbl-body-tr");
        
        //   // Iterate over each row and handle the click event
        //   rows.forEach(row => {
        //     handleRowClick(row);
        //   });


        // var buttons = document.querySelectorAll('.button1');
        // let elements = document.getElementsByClassName("betOn");
        // buttons.forEach(function(button) {
        //     button.addEventListener('click', function() {
        //       var parentRow = button.closest('tr');
        //       var teamName = parentRow.querySelector('td:first-child').innerText.trim();
        //       var buttonId = button.id;
        //       var spanInnerText = button.querySelector('span:first-child').innerText.trim();
        //       console.log('Team Name:', teamName);
        //       console.log('Button ID:', buttonId);
        //       console.log(this.id)
        //       console.log('Span Inner Text:', spanInnerText);
        //       elements[0].innerHTML  = `Bet on  :${teamName}@${spanInnerText}`
        //       elements[0].id = parentRow.querySelector('td:first-child').id;
        //       var elements2 = document.getElementsByClassName('oddsvalue');
        //       elements2[0].innerHTML = spanInnerText
        //       elements2[0].id = this.id;
        //     });
        //   });

        // const buttons = document.querySelectorAll('.button1');
        // buttons.forEach(function(button) {
        //     button.addEventListener('click', function() {
        //         const runnerNameElement = this.closest('.table-data').querySelector('.runnerName');
        //         const teamName = runnerNameElement.textContent.trim();
        //         const spanInnerText = this.querySelector('b').textContent.trim();
        //         const marketId = runnerNameElement.getAttribute('id');
        //         var buttonId = button.id;
        //         console.log('Team Name:', teamName);
        //         console.log('Button ID:', buttonId);
        //         console.log(this.id.slice(-1))
        //         console.log('Span Inner Text:', spanInnerText);
        //         let elements = document.getElementsByClassName(`betOn${marketId.slice(-1)}`);
        //         for (let i = 0; i < elements.length; i++) {
        //             elements[i].innerHTML = `Bet on: ${teamName}@${spanInnerText}`;
        //             elements[i].id = marketId.slice(0, -1);
        //           }
        //         var elements2 = document.getElementsByClassName(`oddsvalue${marketId.slice(-1)}`);
        //         for (let i = 0; i < elements2.length; i++) {
        //             elements2[i].innerHTML = spanInnerText
        //             elements2[i].id = this.id;
        //           }
                
                
        //     });
        //   });

        






       // Add a common class to the containers that wrap each section of the HTML


          


        
          


        //   var buttonsforOddEven = document.querySelectorAll('.odd_even button');
        // let elementsforOddEven = document.getElementsByClassName("betOn");
        // buttonsforOddEven.forEach(function(button) {
        //     button.addEventListener('click', function() {
        //       var parentRow = button.closest('tr');
        //       var teamName = parentRow.querySelector('td:first-child').innerText.trim();
        //       var buttonId = button.id;
        //       var spanInnerText = button.querySelector('span:first-child').innerText.trim();
        //       console.log('Team Name:', teamName);
        //       console.log('Button ID:', buttonId);
        //       console.log(this.id)
        //       console.log('Span Inner Text:', spanInnerText);
        //       elementsforOddEven[0].innerHTML  = `Bet on  :${teamName}@${spanInnerText}`
        //       elementsforOddEven[0].id = parentRow.querySelector('td:first-child').id;
        //       var elements2 = document.getElementsByClassName('oddsvalue');
        //       elements2[0].innerHTML = spanInnerText
        //       if(button.id.slice(-1) == 1){
        //         elements2[0].id = "odd_Even_Yes ";
        //       }else if(button.id.slice(-1) == 2){
        //         elements2[0].id = "odd_Even_No ";
        //     }
        //     });
        //   });

            // var spans = document.querySelectorAll('.exc-pg-rit-tabtxt-data-stack-num-col span');
            // var stakeSpan = document.querySelector('#stakeSpan'); 
            // var resultElement = document.querySelector('.c-gren');
            // spans.forEach(function(span) {
            // span.addEventListener('click', function() {
            //     var spanInnerText = span.innerText.trim();
            //     var currentStake = parseFloat(stakeSpan.innerText.trim());
            //     var newStake = currentStake + parseFloat(spanInnerText.replace(/,/g, ''));
            //     stakeSpan.innerText = newStake.toFixed(2);
            //     var elements3 = document.getElementsByClassName('oddsvalue');
            //     var multiplicationResult = (newStake * parseFloat(elements3[0].innerText)) - parseFloat(stakeSpan.innerText);
            //     resultElement.innerText = multiplicationResult.toFixed(2);
            // });
            // });

            // document.addEventListener('DOMContentLoaded', function() {
            //     const stakeAmountSpans = document.querySelectorAll('.nww-bet-slip-wrp-col2-inn span');
            //     stakeAmountSpans.forEach(span => {
            //         span.addEventListener('click', () => {
            //             console.log("working")
            //             const stakeAmount = span.textContent.trim();
            //             const profitElement = span.closest('.my-exc-inn-colaps-txt-body').querySelector('.c-gren');
            //             document.getElementById("Stake").value = stakeAmount;
            //         });
            //     });
            // });

            // function handleClickableSpan(event) {
            //     const clickedSpan = event.target;
            //     const customStakeInput = clickedSpan.closest(".nww-bet-slip-wrp").querySelector(".set-stake-form-input2");
            //     customStakeInput.value = clickedSpan.textContent;
            //     const oddsElement = clickedSpan.closest(".nww-bet-slip-wrp").querySelector(".nww-bet-slip-wrp-col1-txt-num");
            //     const oddsValue = parseFloat(oddsElement.textContent);
            //     const stakeValue = parseFloat(customStakeInput.value);
            //     const profitValue = (oddsValue * stakeValue) - stakeValue;
            //     const profitElement = clickedSpan.closest(".nww-bet-slip-wrp").querySelector(".nww-bet-slip-wrp-col1-txt b");
            //     profitElement.textContent = profitValue.toFixed(2);
            //   }
            
            //   // Get all the clickable spans
            //   const clickableSpans = document.querySelectorAll(".nww-bet-slip-wrp-col2-inn span");
            
            //   // Attach a click event listener to each clickable span
            //   clickableSpans.forEach((span) => {
            //     span.addEventListener("click", handleClickableSpan);
            //   });

        // $(document).on("click", ".eventId", function(e){
        //     e.preventDefault()
        //     let data = {}
        //     let title = document.getElementsByClassName("eventTitle")
        //     let odd = document.getElementsByClassName("oddsvalue")
        //     let market = document.getElementsByClassName("betOn")
        //     data.title = title[0].innerText.trim();
        //     data.eventId = title[0].id
        //     data.odds = odd[0].innerText.trim();
        //     data.secId = odd[0].id.slice(0,-1)
        //     data.market = market[0].id
        //     data.stake = document.getElementById("stakeSpan").innerText.trim();
        //     data.spoetId = this.id
        //     // console.log(data)
        //     socket.emit("betDetails", {data, LOGINDATA})
        // })

        $(document).ready(function () {
            $(".eventId").click(function () {
                // console.log("working")
            let data = {}
            let secforFency 
            data.title = $(this).closest("tr").find(".name").text()
            data.eventId = $(this).attr("id");
            data.odds = $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
            let secId = $(this).closest("tr").find(".beton").attr('id')
            data.secId = secId.slice(0,-1)
            data.market = $(this).closest("table").attr("id");
            data.stake = $(this).closest("tr").find(".set-stake-form-input2").val()
            data.spoetId = $(this).closest("tr").find(".c-gren").attr('id')
            if(data.market == undefined){
                data.market = $(this).closest("tr").prev().find('.market').attr('id')
                // console.log(data.market)
                secforFency = secId.slice(0,-1)
                secforFency = secforFency.replace(".", "\\.");
                if(secId.charAt(secId.length - 2) == 1){
                    data.secId = "odd_Even_Yes"
                }else{
                    data.secId = "odd_Even_No"
                }
            }
            let specificSpan 
            if(data.secId.startsWith('odd_Even_')){
                specificSpan = $(`#${secforFency}`).children("span").eq(1).text();
                // console.log(`#${secforFency}`)
            }else{
                specificSpan = $(`#${secId.slice(0,-1)}`).children("span:first-child").text();
                
            }
            let check = $(this).closest("tr").find("#changes").prop("checked");
            // console.log(data)
            if(specificSpan == data.odds){
                if(data.stake === "" || data.stake == 0){
                    // alert("Please select stake")
                    togglePopupMain('popup-2', "redPopUP2", "Please select stake")
                }else{
                    if(data.odds != '\n                        \n                      '){
                        socket.emit("betDetails", {data, LOGINDATA})
                        // console.log(data)
                        showLoader();
                    }else{
                        togglePopupMain("popup-2", "redPopUP2", "Bet Not Allowed In this market")
                    }
                }
            }else{
                if(check ){
                    data.oldOdds = data.odds
                    data.odds = specificSpan
                    if(data.stake === ""){
                        // alert("Please select stake")
                        togglePopupMain('popup-2', "redPopUP2", "Please select stake")
                    }else{
                        if(data.odds != '\n                        \n                      '){
                            socket.emit("betDetails", {data, LOGINDATA})
                            showLoader();
                        }else{
                            togglePopupMain("popup-2", "redPopUP2", "Bet Not Allowed In this market")
                        }
                    }
                }else{
                    togglePopupMain('popup-2', "redPopUP2", "Odds out of range")
                }
            }
            });
          });

        // function handlePlaceBetClick(event) {
        //     const clickedLink = event.target;
        //     const parentContainer = clickedLink.closest(".nww-bet-slip-wrp");
        //     let data = {
        //         spoetId : clickedLink.dataset.sportId,
        //         title : parentContainer.querySelector(".eventTitle").textContent,
        //         eventId : parentContainer.querySelector(".eventTitle").id,
        //         odds : parentContainer.querySelector(".nww-bet-slip-wrp-col1-txt-num").textContent,
        //         secId : parentContainer.querySelector(".nww-bet-slip-wrp-col1-txt-num").id.slice(0,-1),
        //         market : parentContainer.querySelector("[class^='betOn']").id,
        //         stake : parentContainer.querySelector(".set-stake-form-input2").value,
        //     }
        //     socket.emit("betDetails", {data, LOGINDATA})
        //   }
        
        //   // Get all the "PLACE BET" links
        //   const placeBetLinks = document.querySelectorAll(".PLACEBET");
        
        //   // Attach a click event listener to each link
        //   placeBetLinks.forEach((link) => {
        //     link.addEventListener("click", handlePlaceBetClick);
        //   });

        socket.on("betDetails" , (data) => {
            hideLoader()
            // console.log(data.result)
            // function togglePopup(idname, id){
            //     document.getElementById(idname).classList.toggle("active");
            //     document.getElementById(id).innerText  = data.result.toUpperCase()
            //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
            //   }
            if(data.result === "Bet placed successfully"){
                togglePopupMain('popup-1', "redPopUP", data.result.toUpperCase())
            }else{
                togglePopupMain('popup-2', "redPopUP2", data.result.toUpperCase())
            }
            let buttonALlin = document.getElementsByClassName("ALLIN")
            for (let i = 0; i < buttonALlin.length; i++) {
                buttonALlin[i].id = `${data.user.availableBalance}`; // Replace "newId" with the desired ID value
            }
            // buttonALlin[0].id = 
            let html2 = ""
            document.getElementById("betsTitleSide").innerHTML = `<h5>Open Bets (${data.openBet.length})</h5>`
            document.getElementById("pills-profilebb-tab").innerHTML = `Open Bets (${data.openBet.length})`
            console.log(data.openBet, "data.openBet.data.openBet.data.openBet.")
            if(data.openBet.length === 1){
                html2 = `<table class="table-new-d">
                <thead>
                  <tr class="thead-border my-open-bet-trr">
                    <th>Selection</th>
                    <th>Odds</th>
                    <th>Stake</th>
                  </tr>
                </thead>
                <tbody id="tableBET">
                  `
                if(data.openBet[0].bettype2 === "BACK"){
                    html2 += `<tr class="back-inplaymatch">`
                }else{
                    html2 += `<tr class="lay-inplaymatch">`
                }
                  html2 += `<td>${ data.openBet[0].selectionName}</td>
                    <td>${ data.openBet[0].oddValue }</td>
                    <td>${ data.openBet[0].Stake }</td>
                  </tr>
                </tbody>
              </table>`
              document.getElementById('length1').innerHTML = html2
              document.getElementById('length2').innerHTML = html2
            }else{
                for(let i = 0; i < data.openBet.length; i++){
                    if(data.openBet[i].bettype2 === "BACK"){
                        html2 += `<tr class="back-inplaymatch">`
                    }else{
                        html2 += `<tr class="lay-inplaymatch">`
                    }
                    html2 += `<td>${ data.openBet[i].selectionName}</td>
                    <td>${ data.openBet[i].oddValue }</td>
                    <td>${ data.openBet[i].Stake }</td>
                  </tr>`
                }
                // console.log(html2, "tableBETtableBET")
                document.getElementById('tableBET').innerHTML = html2
                document.getElementById('tableBET1').innerHTML = html2
            }
        })
        
    }


    if(pathname === "/admin/pageManager"){
        $(document).on("click", ".UploadEjs", async function(){
            let id = $(this).attr('id')
            socket.emit("checkPage", id)
        })

        socket.on("checkPage", async(data) => {
            let form = $(`#updatePages`)
            form.find('input[name = "heading"]').attr('value', data.heading)
            form.find('textarea[name = "details"]').html(data.details)
            form.find('input[name = "heading"]').attr('id', data._id)
        })


        $(document).on("submit", ".updatePages", async function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            let id  = $('.heading').attr('id')
            data.id = id
            socket.emit("updatePage", data)
        })

        socket.on("updatePage", async(data) => {
            if(data === "success"){
                alert("Page updates")
                setTimeout(()=>{
                    window.location = '/admin/pageManager'
                  }, 500)
            }else{
                alert("Something Went Wrong Please try again later")
            }
        })

    }


    if(pathname === "/live_casino"){
        $(document).ready(function() {
            $('.form-select').on('change', function() {
              var selectedValue = $(this).val();
              socket.emit("liveCasinoPage", {selectedValue, LOGINDATA})
            });
          });


          socket.on("liveCasinoPage", async(games) =>{
            let html = ""
            if(!games.fevGames){
                games.fevGames = []
            }
            for(let i = 0; i < games.games.length; i++){
                html += `<div class="liv-casino-games-cards-dv col-lg-3 col-md-3 col-6">
                <a class="liv-casino-games-cards-a" href="#">
                  <div class="liv-casino-games-cards-imgdv">
                    <img class="img-fluid img-bdr-red15 forIMG" src="${games.games[i].url_thumb}" alt="">
                    <div class="liv-casino-games-cards-txt">
                      <div class="liv-casino-games-cards-txtcol">
                        <h6>${games.games[i].game_name}</h6>`
                        if(games.fevGames.includes(games.games[i]._id)){
                            html += `<i id="${games.games[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart fa-solid liked-star"></i>`
                        }else{
                            html += `<i id="${games.games[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart"></i>`
                        }
                        html += `
                      </div>
                    </div>
                    <div class="liv-casino-games-cards-txt2">`
                    // console.log(games.fevGames)
                    if(LOGINDATA.LOGINUSER === ""){
                      html +=  `<a class="liv-casino-games-cards-txt2-btn" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">LOGIN TO CONTINUE</a>`
                    }else{
                        html += `<a class="liv-casino-games-cards-txt2-btn" href="/live_casinoInPlay?gameId=${games.games[i]._id}">PLAY NOW</a>`
                    }
                    html += `</div>
                            </div>
                             </a>
                            </div>`
            }
            document.getElementById("games").innerHTML = html


            let htmlF = ""
            for(let i = 0; i < games.games.length; i++){
              if(games.fevGames.includes(games.games[i]._id)){
                htmlF += `<div class="liv-casino-games-cards-dv col-lg-3 col-md-3 col-6">
                <a class="liv-casino-games-cards-a" href="#">
                  <div class="liv-casino-games-cards-imgdv">
                    <img class="img-fluid img-bdr-red15 forIMG" src="${games.games[i].url_thumb}" alt="">
                    <div class="liv-casino-games-cards-txt">
                      <div class="liv-casino-games-cards-txtcol">
                        <h6>${games.games[i].game_name}</h6>`
                            htmlF += `<i id="${games.games[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart fa-solid liked-star"></i>`
                            htmlF += `
                          </div>
                        </div>
                        <div class="liv-casino-games-cards-txt2">`
                          // console.log(games.fevGames)
                          if(LOGINDATA.LOGINUSER === ""){
                            htmlF +=  `<a class="liv-casino-games-cards-txt2-btn" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">LOGIN TO CONTINUE</a>`
                          }else{
                            htmlF += `<a class="liv-casino-games-cards-txt2-btn" href="/live_casinoInPlay?gameId=${games.games[i]._id}">PLAY NOW</a>`
                          }
                          htmlF += `</div>
                        </div>
                      </a>
                    </div>`
                  }
                }
            document.getElementById("gamesFevorite").innerHTML = htmlF
            

            let vertuals = games.games.filter(item => item.category == "Virtual")
            let htmlV = ""
            for(let i = 0; i < vertuals.length; i++){
                htmlV += `<div class="liv-casino-games-cards-dv col-lg-3 col-md-3 col-6">
                <a class="liv-casino-games-cards-a" href="#">
                  <div class="liv-casino-games-cards-imgdv">
                    <img class="img-fluid img-bdr-red15 forIMG" src="${vertuals[i].url_thumb}" alt="">
                    <div class="liv-casino-games-cards-txt">
                      <div class="liv-casino-games-cards-txtcol">
                        <h6>${vertuals[i].game_name}</h6>`
                        if(games.fevGames.includes(vertuals[i]._id)){
                            htmlV += `<i id="${vertuals[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart fa-solid liked-star"></i>`
                        }else{
                            htmlV += `<i id="${vertuals[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart"></i>`
                        }
                        // <i class="fa-regular fa-heart"></i>
                        htmlV += `</div>
                    </div>
                    <div class="liv-casino-games-cards-txt2">`
                    if(LOGINDATA.LOGINUSER === ""){
                      htmlV +=  `<a class="liv-casino-games-cards-txt2-btn" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">LOGIN TO CONTINUE</a>`
                    }else{
                        htmlV += `<a class="liv-casino-games-cards-txt2-btn" href="/live_casinoInPlay?gameId=${vertuals[i]._id}">PLAY NOW</a>`
                    }
                    htmlV += `</div>
                            </div>
                             </a>
                            </div>`
            }
            document.getElementById("vertuals").innerHTML = htmlV

            let roulette = games.games.filter(item => 
                {
                    const gameName = item.game_name.toLowerCase();
                    const category = item.category.toLowerCase();
                    return gameName.includes('roulette') || category.includes('roulette');
                  }
                )
            let htmlr = ""
            for(let i = 0; i < roulette.length; i++){
                htmlr += `<div class="liv-casino-games-cards-dv col-lg-3 col-md-3 col-6">
                <a class="liv-casino-games-cards-a" href="#">
                  <div class="liv-casino-games-cards-imgdv">
                    <img class="img-fluid img-bdr-red15 forIMG" src="${roulette[i].url_thumb}" alt="">
                    <div class="liv-casino-games-cards-txt">
                      <div class="liv-casino-games-cards-txtcol">
                        <h6>${roulette[i].game_name}</h6>`
                        if(games.fevGames.includes(roulette[i]._id)){
                            htmlr += `<i id="${roulette[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart fa-solid liked-star"></i>`
                        }else{
                            htmlr += `<i id="${roulette[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart"></i>`
                        }
                        // <i class="fa-regular fa-heart"></i>
                        htmlr +=  `</div>
                    </div>
                    <div class="liv-casino-games-cards-txt2">`
                    if(LOGINDATA.LOGINUSER === ""){
                      htmlr +=  `<a class="liv-casino-games-cards-txt2-btn" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">LOGIN TO CONTINUE</a>`
                    }else{
                        htmlr += `<a class="liv-casino-games-cards-txt2-btn" href="/live_casinoInPlay?gameId=${roulette[i]._id}">PLAY NOW</a>`
                    }
                    htmlr += `</div>
                            </div>
                             </a>
                            </div>`
            }
            document.getElementById("roulette").innerHTML = htmlr




            let baccarat = games.games.filter(item => 
                {
                    const gameName = item.game_name.toLowerCase();
                    const category = item.category.toLowerCase();
                    return gameName.includes('baccarat') || category.includes('baccarat');
                  }
                )
            let htmlb = ""
            for(let i = 0; i < baccarat.length; i++){
                htmlb += `<div class="liv-casino-games-cards-dv col-lg-3 col-md-3 col-6">
                <a class="liv-casino-games-cards-a" href="#">
                  <div class="liv-casino-games-cards-imgdv">
                    <img class="img-fluid img-bdr-red15 forIMG" src="${baccarat[i].url_thumb}" alt="">
                    <div class="liv-casino-games-cards-txt">
                      <div class="liv-casino-games-cards-txtcol">
                        <h6>${baccarat[i].game_name}</h6>`
                        if(games.fevGames.includes(baccarat[i]._id)){
                            htmlb += `<i id="${baccarat[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart fa-solid liked-star"></i>`
                        }else{
                            htmlb += `<i id="${baccarat[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart"></i>`
                        }
                        // <i class="fa-regular fa-heart"></i>
                        htmlb += `</div>
                    </div>
                    <div class="liv-casino-games-cards-txt2">`
                    if(LOGINDATA.LOGINUSER === ""){
                      htmlb +=  `<a class="liv-casino-games-cards-txt2-btn" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">LOGIN TO CONTINUE</a>`
                    }else{
                        htmlb += `<a class="liv-casino-games-cards-txt2-btn" href="/live_casinoInPlay?gameId=${baccarat[i]._id}">PLAY NOW</a>`
                    }
                    htmlb += `</div>
                            </div>
                             </a>
                            </div>`
            }
            document.getElementById("baccarat").innerHTML = htmlb



            let live = games.games.filter(item => 
                {
                    const gameName = item.game_name.toLowerCase();
                    const category = item.category.toLowerCase();
                    return gameName.includes('live') || category.includes('live');
                  }
                )
            let htmll = ""
            for(let i = 0; i < live.length; i++){
                htmll += `<div class="liv-casino-games-cards-dv col-lg-3 col-md-3 col-6">
                <a class="liv-casino-games-cards-a" href="#">
                  <div class="liv-casino-games-cards-imgdv">
                    <img class="img-fluid img-bdr-red15 forIMG" src="${live[i].url_thumb}" alt="">
                    <div class="liv-casino-games-cards-txt">
                      <div class="liv-casino-games-cards-txtcol">
                        <h6>${live[i].game_name}</h6>`
                        if(games.fevGames.includes(live[i]._id)){
                            htmll += `<i id="${live[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart fa-solid liked-star"></i>`
                        }else{
                            htmll += `<i id="${live[i]._id}" class="fa-regular fa-heart my-heart-icon fevoriteHeart"></i>`
                        }
                        // <i class="fa-regular fa-heart"></i>
                        htmll += `</div>
                    </div>
                    <div class="liv-casino-games-cards-txt2">`
                    if(LOGINDATA.LOGINUSER === ""){
                      htmll +=  `<a class="liv-casino-games-cards-txt2-btn" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">LOGIN TO CONTINUE</a>`
                    }else{
                        htmll += `<a class="liv-casino-games-cards-txt2-btn" href="/live_casinoInPlay?gameId=${live[i]._id}">PLAY NOW</a>`
                    }
                    htmll += `</div>
                            </div>
                             </a>
                            </div>`
            }
            document.getElementById("live").innerHTML = htmll


          })
    }


    if(pathname === "/myAccountStatment"){

        function generatePDF(table) {
            const printWindow = window.open('', '_blank');
                    printWindow.document.open();
                    printWindow.document.write(`
                    <html>
                        <head>
                        <title>Account Statement</title>
                        <style>
                            .ownAccDetails {
                                color: black;
                                border: none;
                                background-color: inherit;
                                padding: 14px 28px;
                                font-size: 16px;
                                cursor: pointer;
                                display: inline-block;
                            }
                            body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            }
                            table {
                            border-collapse: collapse;
                            width: 100%;
                            }
                            th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            }
                            th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                            }
                        </style>
                        </head>
                        <body>
                        ${table.outerHTML}
                        </body>
                    </html>
                    `);
                    printWindow.document.close();

                    printWindow.print();
                
          }

        document.getElementById('pdfDownload').addEventListener('click', function(e) {
            e.preventDefault()
            const table = document.getElementById('table12');
            
            if (table) {
              generatePDF(table);
            }
          });


       
          


        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }          

          function sanitizeCellValue(value) {
            // Define a character whitelist (allow only printable ASCII and basic punctuation)
            const allowedCharactersRegex = /[\x20-\x7E\u0020-\u007E]/g;
            
            return value.match(allowedCharactersRegex).join('').trim();
          }
          
          function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            
            let csv = '';
            for (const row of rows) {
              const columns = row.querySelectorAll('td, th');
              let rowData = '';
              for (const column of columns) {
                const data = sanitizeCellValue(column.innerText);
                rowData += (data.includes(',') ? `"${data}"` : data) + ',';
              }
              csv += rowData.slice(0, -1) + '\n';
            }
            
            return csv;
          }

        document.getElementById('downloadBtn').addEventListener('click', function(e) {
            e.preventDefault()
            const table = document.getElementById('table12');             
            if (table) {
              const csvContent = convertToCSV(table);
              downloadCSV(csvContent, 'AccountStatement.csv');
            }
          });


        // $(window).scroll(function() {
        //     var scroll = $(window).scrollTop();
        //     var windowHeight = $(window).height();
        //     var documentHeight = $(document).height();
        //     if (scroll + windowHeight >= documentHeight) {
                // let page = parseInt($('.pageId').attr('data-pageid'));
                // $('.pageId').attr('data-pageid',page + 1)
                // let fromDate = $('#Fdate').val()
                // let toDate = $('#Tdate').val()
                // let type = $("#select").val()
                // let filterData = {}
                // filterData.fromDate = fromDate,
                // filterData.toDate = toDate
                // filterData.type = type
                // socket.emit("ACCSTATEMENTUSERSIDE", {page, LOGINDATA, filterData})
        //     }
        // });


        $(function () {
            $("div").slice(0, 4).show();
            $("#loadMore").on('click', function (e) {
                e.preventDefault();
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let fromDate = $('#Fdate').val()
                let toDate = $('#Tdate').val()
                let type = $("#select").val()
                let filterData = {}
                filterData.fromDate = fromDate,
                filterData.toDate = toDate
                filterData.type = type
                socket.emit("ACCSTATEMENTUSERSIDE", {page, LOGINDATA, filterData})
            });
        });

        const FdateInput = document.getElementById('Fdate');
        const TdateInput = document.getElementById('Tdate');
        const selectElement = document.getElementById('select');
        FdateInput.addEventListener('change', handleInputChange);
        TdateInput.addEventListener('change', handleInputChange);
        selectElement.addEventListener('change', handleInputChange);
        function handleInputChange(event) {
            let fromDate = $('#Fdate').val()
            let toDate = $('#Tdate').val()
            let type = $("#select").val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            filterData.type = type
            page = 0
            $('.pageId').attr('data-pageid',1)
            socket.emit("ACCSTATEMENTUSERSIDE", {page, LOGINDATA, filterData})
          }


        let count = 21
        socket.on("ACCSTATEMENTUSERSIDE", async(data) => {
            if(data.userAcc.length > 0){
            console.log(data.page)
            if(data.page === 0){
                count = 1
            }
            let page = data.page
            let userAcc = data.userAcc;
            let html = '';
             for(let i = 0; i < userAcc.length; i++){
                var date = new Date(userAcc[i].date);
                var options = { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                };
                var formattedTime = date.toLocaleString('en-US', options);
                html += `<tr class="acount-stat-tbl-body-tr">
                    <td title="SR No." >${i+count}</td>
                    <td title="Date & Time" >${formattedTime}</td>`
                    if(userAcc[i].creditDebitamount > 0){
                        html += `<td title="Credit" >${userAcc[i].creditDebitamount}</td>
                        <td title="Debit" >0</td>`
                    }else{
                        html += ` <td title="Credit" >0</td>
                        <td title="Debit" >${userAcc[i].creditDebitamount}</td>`
                    }

                    if(userAcc[i].stake){
                        html += `<td title="Stake" >${userAcc[i].stake}</td>`
                    }else{
                        html += `<td title="Stake" >-</td>`
                    }

                    html += `<td title="Pts" >0</td>
                    <td title="Closing" >${userAcc[i].balance}</td>
                    <td title="Description" >${userAcc[i].description}</td>
                    <td title="Remark" >-</td>`
            }
            count += 20
            if(data.page == 0){
                $('.acount-stat-tbl-body').html(html)
            }else{
                $('.acount-stat-tbl-body').append(html)         
            }
        }else{
            console.log("working")
                $('.loadMoredive').html("")
        }
        })
    }


    if(pathname === "/mybets"){
        // console.log("WORKING")
        // $(window).scroll(function() {
        //     var scroll = $(window).scrollTop();
        //     var windowHeight = $(window).height();
        //     var documentHeight = $(document).height();
        //     if (scroll + windowHeight >= documentHeight) {
                // let page = parseInt($('.pageId').attr('data-pageid'));
                // $('.pageId').attr('data-pageid',page + 1)
                // let fromDate = $('#Fdate').val()
                // let toDate = $('#Tdate').val()
                // let type = $("#select").val()
                // let filterData = {}
                // filterData.fromDate = fromDate,
                // filterData.toDate = toDate
                // filterData.type = type
                // socket.emit("BETSFORUSER", {page, LOGINDATA, filterData})
        //     }
        // });

        $(function () {
            $("div").slice(0, 4).show();
            $("#loadMore").on('click', function (e) {
                e.preventDefault();
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let fromDate = $('#Fdate').val()
                let toDate = $('#Tdate').val()
                let type = $("#select").val()
                let filterData = {}
                filterData.fromDate = fromDate,
                filterData.toDate = toDate
                filterData.type = type
                socket.emit("BETSFORUSER", {page, LOGINDATA, filterData})
            });
        });
        
        
        
        
        


        const FdateInput = document.getElementById('Fdate');
        const TdateInput = document.getElementById('Tdate');
        const selectElement = document.getElementById('select');
        FdateInput.addEventListener('change', handleInputChange);
        TdateInput.addEventListener('change', handleInputChange);
        selectElement.addEventListener('change', handleInputChange);
        function handleInputChange(event) {
            let fromDate = $('#Fdate').val()
            let toDate = $('#Tdate').val()
            let type = $("#select").val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            filterData.type = type
            page = 0
            $('.pageId').attr('data-pageid', 1)
            socket.emit("BETSFORUSER", {page, LOGINDATA, filterData})
          }


        let count = 21
        socket.on("BETSFORUSER", async(data) => {
            if(data.MyBets.length > 0){
            console.log(data.page)
            if(data.page === 0){
                count = 1
            }
            let page = data.page
            let bets = data.MyBets;
            let html = '';
             for(let i = 0; i < bets.length; i++){
                var date = new Date(bets[i].date);
                var options = { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                };
                var formattedTime = date.toLocaleString('en-US', options);
                if(bets[i].bettype2 === 'BACK'){
                    html += '<tr class="back acount-stat-tbl-body-tr">'
                }else{
                    html += '<tr class="lay acount-stat-tbl-body-tr">'
                }
                html += `
                    <td title='Sr. No'>${i+count}</td>
                    <td title='Date & Time'>${formattedTime}</td>`
                if(bets[i].betType === "Casino"){
                        html += "<td title='Sports'>-</td>"
                }else{
                        html += `<td title='Sports'>${bets[i].betType}</td>`
                }
                html += `<td title='Event'>${bets[i].event}</td>`
                if(bets[i].match){
                        html +=  `<td title='Match'>${bets[i].match}</td>`
                }else{
                        html += "<td title='Match'>-</td>"
                }
                if(bets[i].marketName){
                        html += `<td title='Market'>${bets[i].marketName}</td>`
                }else{
                        html += "<td title='Market'>-</td>"
                }
                if(bets[i].selectionName){
                        html +=    `<td title='Bet On'>${bets[i].selectionName}</td>
                        <td title="Bet Type" >${bets[i].bettype2}</td>
                            <td title='Odds'>${bets[i].oddValue}</td>`
                }else{
                        html +=    "<td title='Bet On'>-</td><td title='Bet Type' >-</td><td title='Odds'>-</td>"
                }
                html += ` <td title='Status'>${bets[i].status}</td>
                        <td title='Stake'>${bets[i].Stake}</td>`
                        if(bets[i].returns > 0){
                           html += `<td class="c-gren" title="Returns" >${bets[i].returns}</td>`
                        }else{
                            html += `<td class="c-reed" title="Returns" >${bets[i].returns}</td>`
                        }
                   html +=  "</tr>"
                    
            }
            count += 20
            if(data.page == 0){
                $('.acount-stat-tbl-body').html(html)
            }else{
                $('.acount-stat-tbl-body').append(html)         
            }
        }else{
            console.log("working")
                $('.loadMoredive').html("")
                if(data.page == 0){
                    $('.acount-stat-tbl-body').html("")
                }
        }
        })
    }


    if(pathname === "/exchange/inPlay" ){
        function marketId1(){
            socket.emit("liveData" , "data12")
              setTimeout(()=>{
                marketId1()
              }, 60000)
        }
        marketId1()

        socket.on('liveData', async(data) => {
            let html = ``
            for(let i = 0; i < data.LiveCricket.length; i++){
                if(data.LiveCricket[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.LiveCricket[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg02.svg" alt="">
                                    ${data.LiveCricket[i].eventData.name}
                                </a>`
                }
            }
            for(let i = 0; i < data.liveFootBall.length; i++){
                if(data.liveFootBall[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.liveFootBall[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg03.svg" alt="">
                                    ${data.liveFootBall[i].eventData.name}
                                </a>`
                }
            }
            for(let i = 0; i < data.liveTennis.length; i++){
                if(data.liveTennis[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.liveTennis[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg04.svg" alt="">
                                    ${data.liveTennis[i].eventData.name}
                                </a>`
                }
            }
            document.getElementById('liveMatch_data').innerHTML = html
        })

        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                    if($(this).val() != "-"){
                        ids.push(this.id);
                    }
                });
          
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()
        // socket.on("marketId", (data) => {
        //     $(document).ready(function() {
          
        //         $(".0L").each(function() {
                    
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[0].layPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[0].layPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[0].layPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[0].layPrice1}</span>`
        //                 }
        //         });

        //         $(".0B").each(function() {
                    
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[0].backPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[0].backPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[0].backPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
        //             }
        //         });

        //         $(".1L").each(function() {
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[1].layPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[1].layPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[1].layPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[1].layPrice1}</span>`
        //                 }
        //         });

        //         $(".1B").each(function() {
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[1].backPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[1].backPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[1].backPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[1].backPrice1}</span>`
        //             }
        //         });

        //         $(".2B").each(function() {
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[2].backPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[2].backPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[2].backPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[2].backPrice1}</span>`
        //                 }
        //         });

        //         $(".2L").each(function() {
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[2].layPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[2].layPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[2].layPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[2].layPrice1}</span>`
        //             }
        //         });
        //     })
        // })

    }


    if(pathname === "/exchange/cricket"){
        function marketId1(){
            socket.emit("liveData" , "data12")
              setTimeout(()=>{
                marketId1()
              }, 60000)
        }
        marketId1()

        socket.on('liveData', async(data) => {
            let html = ``
            for(let i = 0; i < data.LiveCricket.length; i++){
                if(data.LiveCricket[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.LiveCricket[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg02.svg" alt="">
                                    ${data.LiveCricket[i].eventData.name}
                                </a>`
                }
            }
            // for(let i = 0; i < data.liveFootBall.length; i++){
            //     if(data.liveFootBall[i].marketList.match_odd != null){
            //        html += `<a href="/exchange_inPlay/match?id=${data.liveFootBall[i].eventData.eventId}">
            //                         <img src="/assets/img/home/side-menuimg03.svg" alt="">
            //                         ${data.liveFootBall[i].eventData.name}
            //                     </a>`
            //     }
            // }
            // for(let i = 0; i < data.liveTennis.length; i++){
            //     if(data.liveTennis[i].marketList.match_odd != null){
            //        html += `<a href="/exchange_inPlay/match?id=${data.liveTennis[i].eventData.eventId}">
            //                         <img src="/assets/img/home/side-menuimg04.svg" alt="">
            //                         ${data.liveTennis[i].eventData.name}
            //                     </a>`
            //     }
            // }
            document.getElementById('liveMatch_data').innerHTML = html
        })

        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                    if($(this).val() != "-"){
                        ids.push(this.id);
                    }
                });
          
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()
        // socket.on("marketId", (data) => {
        //     $(document).ready(function() {
          
        //         $(".0L").each(function() {
                    
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[0].layPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[0].layPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[0].layPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[0].layPrice1}</span>`
        //                 }
        //         });

        //         $(".0B").each(function() {
                    
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[0].backPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[0].backPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[0].backPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
        //             }
        //         });

        //         $(".1L").each(function() {
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[1].layPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[1].layPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[1].layPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[1].layPrice1}</span>`
        //                 }
        //         });

        //         $(".1B").each(function() {
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[1].backPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[1].backPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[1].backPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[1].backPrice1}</span>`
        //             }
        //         });

        //         $(".2B").each(function() {
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[2].backPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[2].backPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[2].backPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[2].backPrice1}</span>`
        //                 }
        //         });

        //         $(".2L").each(function() {
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[2].layPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[2].layPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[2].layPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[2].layPrice1}</span>`
        //             }
        //         });
        //     })
        // })

    }

    if(pathname === "/exchange/football"){
        function marketId1(){
            socket.emit("liveData" , "data12")
              setTimeout(()=>{
                marketId1()
              }, 60000)
        }
        marketId1()

        socket.on('liveData', async(data) => {
            let html = ``
            // for(let i = 0; i < data.LiveCricket.length; i++){
            //     if(data.LiveCricket[i].marketList.match_odd != null){
            //        html += `<a href="/exchange_inPlay/match?id=${data.LiveCricket[i].eventData.eventId}">
            //                         <img src="/assets/img/home/side-menuimg02.svg" alt="">
            //                         ${data.LiveCricket[i].eventData.name}
            //                     </a>`
            //     }
            // }
            for(let i = 0; i < data.liveFootBall.length; i++){
                if(data.liveFootBall[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.liveFootBall[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg03.svg" alt="">
                                    ${data.liveFootBall[i].eventData.name}
                                </a>`
                }
            }
            // for(let i = 0; i < data.liveTennis.length; i++){
            //     if(data.liveTennis[i].marketList.match_odd != null){
            //        html += `<a href="/exchange_inPlay/match?id=${data.liveTennis[i].eventData.eventId}">
            //                         <img src="/assets/img/home/side-menuimg04.svg" alt="">
            //                         ${data.liveTennis[i].eventData.name}
            //                     </a>`
            //     }
            // }
            document.getElementById('liveMatch_data').innerHTML = html
        })

        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                    if($(this).val() != "-"){
                        ids.push(this.id);
                    }
                });
          
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()
        // socket.on("marketId", (data) => {
        //     $(document).ready(function() {
          
        //         $(".0L").each(function() {
                    
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[0].layPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[0].layPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[0].layPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[0].layPrice1}</span>`
        //                 }
        //         });

        //         $(".0B").each(function() {
                    
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[0].backPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[0].backPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[0].backPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
        //             }
        //         });

        //         $(".1L").each(function() {
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[1].layPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[1].layPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[1].layPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[1].layPrice1}</span>`
        //                 }
        //         });

        //         $(".1B").each(function() {
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[1].backPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[1].backPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[1].backPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[1].backPrice1}</span>`
        //             }
        //         });

        //         $(".2B").each(function() {
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[2].backPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[2].backPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[2].backPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     console.log("Wirkinf", 4)
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[2].backPrice1}</span>`
        //                 }
        //         });

        //         $(".2L").each(function() {
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[2].layPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[2].layPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[2].layPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[2].layPrice1}</span>`
        //             }
        //         });
        //     })
        // })
    }


    if(pathname === "/exchange/tennis"){
        function marketId1(){
            socket.emit("liveData" , "data12")
              setTimeout(()=>{
                marketId1()
              }, 60000)
        }
        marketId1()

        socket.on('liveData', async(data) => {
            let html = ``
            // for(let i = 0; i < data.LiveCricket.length; i++){
            //     if(data.LiveCricket[i].marketList.match_odd != null){
            //        html += `<a href="/exchange_inPlay/match?id=${data.LiveCricket[i].eventData.eventId}">
            //                         <img src="/assets/img/home/side-menuimg02.svg" alt="">
            //                         ${data.LiveCricket[i].eventData.name}
            //                     </a>`
            //     }
            // }
            // for(let i = 0; i < data.liveFootBall.length; i++){
            //     if(data.liveFootBall[i].marketList.match_odd != null){
            //        html += `<a href="/exchange_inPlay/match?id=${data.liveFootBall[i].eventData.eventId}">
            //                         <img src="/assets/img/home/side-menuimg03.svg" alt="">
            //                         ${data.liveFootBall[i].eventData.name}
            //                     </a>`
            //     }
            // }
            for(let i = 0; i < data.liveTennis.length; i++){
                if(data.liveTennis[i].marketList.match_odd != null){
                   html += `<a href="/exchange_inPlay/match?id=${data.liveTennis[i].eventData.eventId}">
                                    <img src="/assets/img/home/side-menuimg04.svg" alt="">
                                    ${data.liveTennis[i].eventData.name}
                                </a>`
                }
            }
            document.getElementById('liveMatch_data').innerHTML = html
        })

        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".name1").each(function() {
                    if($(this).val() != "-"){
                        ids.push(this.id);
                    }
                });
          
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()
        // socket.on("marketId", (data) => {
        //     $(document).ready(function() {
          
        //         $(".0L").each(function() {
                    
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[0].layPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[0].layPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[0].layPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[0].layPrice1}</span>`
        //                 }
        //         });

        //         $(".0B").each(function() {
                    
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[0].backPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[0].backPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[0].backPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[0].backPrice1}</span>`
        //             }
        //         });

        //         $(".1L").each(function() {
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[1].layPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[1].layPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[1].layPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[1].layPrice1}</span>`
        //                 }
        //         });

        //         $(".1B").each(function() {
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[1].backPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[1].backPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[1].backPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[1].backPrice1}</span>`
        //             }
        //         });

        //         $(".2B").each(function() {
        //                 let id = this.id
        //                 const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //                 if(data.betLimits[0].max_odd < foundItem.odds[2].backPrice1){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if (foundItem.odds[2].backPrice1 == "-"){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //                 }else if(foundItem.odds[2].backPrice1=="1,000.00"){
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data ">
        //                     <i class="fa-solid fa-lock"></i>
        //                   </span>`
        //                 }else{
        //                     this.innerHTML = `<span class="tbl-td-bg-blu-spn">${foundItem.odds[2].backPrice1}</span>`
        //                 }
        //         });

        //         $(".2L").each(function() {
        //             let id = this.id
        //             const foundItem = data.finalResult.items.find(item => item.odds.find(odd => odd.selectionId == id));
        //             if(data.betLimits[0].max_odd < foundItem.odds[2].layPrice1){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if (foundItem.odds[2].layPrice1 == "-"){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
        //                                 <i class="fa-solid fa-lock"></i>
        //                               </span>`
        //             }else if(foundItem.odds[2].layPrice1=="1,000.00"){
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
        //                 <i class="fa-solid fa-lock"></i>
        //               </span>`
        //             }else{
        //                 this.innerHTML = `<span class="tbl-td-bg-pich-spn">${foundItem.odds[2].layPrice1}</span>`
        //             }
        //         });
        //     })
        // })
    }


    if(pathname === "/myGameReport"){
        // $(window).scroll(function() {
        //     var scroll = $(window).scrollTop();
        //     var windowHeight = $(window).height();
        //     var documentHeight = $(document).height();
        //     if (scroll + windowHeight >= documentHeight) {
                // let page = parseInt($('.pageId').attr('data-pageid'));
                // $('.pageId').attr('data-pageid',page + 1)
                // let fromDate = $('#Fdate').val()
                // let toDate = $('#Tdate').val()
                // let filterData = {}
                // filterData.fromDate = fromDate,
                // filterData.toDate = toDate
                // socket.emit("GAMEREPORTUSER", {page, LOGINDATA, filterData})
        //     }
        // });

        $(function () {
            $("div").slice(0, 4).show();
            $("#loadMore").on('click', function (e) {
                e.preventDefault();
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let fromDate = $('#Fdate').val()
                let toDate = $('#Tdate').val()
                let filterData = {}
                filterData.fromDate = fromDate,
                filterData.toDate = toDate
                socket.emit("GAMEREPORTUSER", {page, LOGINDATA, filterData})
            });
        });


        const FdateInput = document.getElementById('Fdate');
        const TdateInput = document.getElementById('Tdate');
        FdateInput.addEventListener('change', handleInputChange);
        TdateInput.addEventListener('change', handleInputChange);
        function handleInputChange(event) {
            let fromDate = $('#Fdate').val()
            let toDate = $('#Tdate').val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            page = 0
            $('.pageId').attr('data-pageid',1)
            socket.emit("GAMEREPORTUSER", {page, LOGINDATA, filterData})
          }


          let count = 21
        socket.on("GAMEREPORTUSER", async(data) => {
            console.log(data)
            if(data.bets.length > 0){

            if(data.page === 0){
                count = 1
            }
            let page = data.page
            let bets = data.bets;
            let html = '';
             for(let i = 0; i < bets.length; i++){
                let encodedEventName = encodeURIComponent(bets[i]._id);
                html += `
                <tr class="acount-stat-tbl-body-tr tbl-data-href" data-href='/event/?eventname=${encodedEventName}'>
                    <td title="S.No" >${i + 1}</td>
                    <td title="Event" >${bets[i]._id}</td>
                    <td title="Market Count" >${bets[i].uniqueMarketCount}</td>
                    <td title="Bets" >${bets[i].totalData}</td>
                    <td title="Open" >${bets[i].Open}</td>
                    <td title="Win" >${bets[i].won}</td>
                    <td title="Lost" >${bets[i].loss}</td>
                    <td title="Cancel" >${bets[i].Cancel}</td>`
                    if(bets[i].sumOfReturns > 0){
                      html += `<td class="c-gren" title="Profit/Loss">${bets[i].sumOfReturns}</td>`
                    }else{
                      html += `<td class="c-reed" title="Profit/Loss">${bets[i].sumOfReturns}</td>`
                      }
                html += "</tr>"
            }
            count += 20
            if(data.page == 0){
                $('.acount-stat-tbl-body').html(html)
            }else{
                $('.acount-stat-tbl-body').append(html)         
            }
        }else{
            console.log("working")
                $('.loadMoredive').html("")
        }
        })
    }

    if(pathname === "/gameReport/match"){
        function getJSONDataFromQueryString(queryString) {
            const urlParams = new URLSearchParams(queryString);
            const jsonData = {};
            for (const [key, value] of urlParams.entries()) {
              jsonData[key] = value;
            }
            return jsonData;
          }
          let jsonData = getJSONDataFromQueryString(search);

        //   $(window).scroll(function() {
        //     var scroll = $(window).scrollTop();
        //     var windowHeight = $(window).height();
        //     var documentHeight = $(document).height();
        //     if (scroll + windowHeight >= documentHeight) {
                // let page = parseInt($('.pageId').attr('data-pageid'));
                // $('.pageId').attr('data-pageid',page + 1)
                // socket.emit("GAMEREPORTMATCHPAGEUSER", {page, LOGINDATA, jsonData})
        //     }
        // });

        $(function () {
            $("div").slice(0, 4).show();
            $("#loadMore").on('click', function (e) {
                e.preventDefault();
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                socket.emit("GAMEREPORTMATCHPAGEUSER", {page, LOGINDATA, jsonData})
            });
        });

          socket.on("GAMEREPORTMATCHPAGEUSER", async(data) => {
            // console.log(data.result)
            if(data.result.length > 0){

                let result = data.result;
                let html = '';
                for(let i = 0; i < result.length; i++){
                    
                    var date = new Date(result[i].date);
                    var options = { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    };
                    var formattedTime = date.toLocaleString('en-US', options);
                    
                    html += `<tr class="acount-stat-tbl-body-tr" >
                    <td title="Settlement Date" >${formattedTime}</td>
                    <td title="Market" >${result[i].marketName}</td>
                    <td title="Bet On" >${result[i].selectionName}</td>
                    <td title="Odds" ><span class="tbl-td-bg-blu-spn">${result[i].oddValue}</span></td>
                    <td title="Status" >${result[i].status}</td>
                    <td class="c-gren" title="Stake">${result[i].Stake}</td>`
                    if(result[i].returns > 0){
                        html += `<td class="c-gren" title="Profit/Loss">${result[i].returns}</td>`
                    }else{
                        html += `<td class="c-reed" title="Profit/Loss">-${result[i].Stake}</td>`
                    }
                    html += "</tr>"
                }
                if(data.page == 0){
                    $('.acount-stat-tbl-body').html(html)
                }else{
                    $('.acount-stat-tbl-body').append(html)         
                }
            }else{
                console.log("working")
                $('.loadMoredive').html("")
            }
        })
          
    }


    if(pathname === "/exchange/multimarkets"){

        function showLoader() {
            document.getElementById("loader-overlay").style.display = "flex";
          }
          
          function hideLoader() {
            document.getElementById("loader-overlay").style.display = "none";
          }
        // if(LOGINDATA.LOGINUSER != ""){
        //     socket.emit("MultiMarketPage", LOGINDATA)
        // }
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".market").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 60000)
        }
        marketId()
        socket.on("marketId", async(data) => {
            $(".match_odd_Blue").each(function() {
              
                let id = this.id
      
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}1` ){
                    if( section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}2`){
                    if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}3`){
                    if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.innerHTML = `<span data-id="${section.backPrice1}"><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                    }
                }
            })


            $(".match_odd_Red").each(function() {
              
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}4` ){
                    if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}5`){
                    if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}6`){
                    if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span data-id="${section.layPrice1}"><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                    }
                }
            })

            $(".bookmaker_blue").each(function() {
              
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){
                        // console.log(id)
                        if(item.runners){
                            // console.log(item)
                            let section1 = item.runners.find(item2 => item2.secId == id)
                            if(section1){
                                section = section1
                            }
                        }
                    }
                })
                if(this.id == `${section.secId}1` ){
                    if( section.backPrice == "-" || section.backPrice == "1,000.00" || section.backPrice == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.layPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.backPrice}</b></span> <span> ${section.backSize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                    }
                }
            })

            $(".bookmaker_red").each(function() {
              
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){
      
                        if(item.runners){
                            let section1 = item.runners.find(item2 => item2.secId == id)
                            if(section1){
                                section = section1
                            }
                        }
                    }
                })
                if(this.id == `${section.secId}2` ){
                    if( section.layPrice == "-" || section.layPrice == "1,000.00" || section.layPrice == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.layPrice}</b></span> <span> ${section.laySize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                        // this.innerHTML = `<b>${section.layPrice}</b> <br> ${section.laySize}`
                    }
                }
            })
        
        })



          $(document).ready(function () {

            $(".button").click(function () {
              let odds = $(this).children("span:first-child").attr('data-id');
              let beton = $(this).closest("tr").find("td:first-child").text();
              let secondPTag = $(this).closest("tr").next().find(".beton");
              let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
              let secId = this.id
              let secId2;
              if($(this).hasClass('match_odd_Blue')){
                secId2 = secId.slice(0,-1) + '1'
                }else{
                secId2 = secId.slice(0,-1) + '4'
                }
              secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId2}1`);;
              numSpan.text(odds);
            });
          });
    
          $(document).ready(function () {
            $(".nww-bet-slip-wrp-col2-inn span").click(function () {
              var spanId = $(this).attr("id");
              let OldStake = $(this).closest("tr").find(".set-stake-form-input2").val()
              let newStake
              console.log(OldStake)
              if(OldStake == ""){
                newStake = parseFloat(spanId)
              }else{
                newStake = parseFloat(spanId) + parseFloat(OldStake)
              }
              var betValue = parseFloat(
                $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
              );
              var result = (parseFloat(newStake) * betValue) - parseFloat(newStake);
              $(this).closest("tr").find(".set-stake-form-input2").val(parseFloat(newStake))
              $(this)
                .closest("tr")
                .find(".c-gren")
                .text(result.toFixed(2));
            });
          });

          $(document).ready(function () {
            $(".set-stake-form-input2").change(function () {
                var spanId = $(this).val()
                var betValue = parseFloat(
                    $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                  );
                  var result = (parseFloat(spanId) * betValue) - parseFloat(spanId);
                  $(this)
                  .closest("tr")
                  .find(".c-gren")
                  .text(result.toFixed(2));
            })
          })
        



              $(document).ready(function () {
                $(".eventId").click(function () {
                    // console.log("working")
                let data = {}
                let secforFency 
                data.title = $(this).closest("tr").find(".name").text()
                data.eventId = $(this).attr("id");
                data.odds = $(this).closest("tr").find(".nww-bet-slip-wrp-col1-txt-num").text()
                let secId = $(this).closest("tr").find(".beton").attr('id')
                data.secId = secId.slice(0,-1)
                data.market = $(this).closest("table").attr("id");
                data.stake = $(this).closest("tr").find(".set-stake-form-input2").val()
                data.spoetId = $(this).closest("tr").find(".c-gren").attr('id')
                if(data.market == undefined){
                    data.market = $(this).closest("tr").prev().find('.market').attr('id')
                    // console.log(data.market)
                    secforFency = secId.slice(0,-1)
                    secforFency = secforFency.replace(".", "\\.");
                    if(secId.charAt(secId.length - 2) == 1){
                        data.secId = "odd_Even_Yes"
                    }else{
                        data.secId = "odd_Even_No"
                    }
                }
                let specificSpan 
                if(data.secId.startsWith('odd_Even_')){
                    specificSpan = $(`#${secforFency}`).children("span:first-child").text();
                    // console.log(`#${secforFency}`)
                }else{
                    specificSpan = $(`#${secId.slice(0,-1)}`).children("span:first-child").text();
                    
                }
                let check = $(this).closest("tr").find("#changes").prop("checked");
                // console.log((data.odds != '\n                        \n                      '), 121212)
                if(specificSpan == data.odds){
                    if(data.stake === ""){
                        // alert("Please select stake")
                        togglePopupMain('popup-2', "redPopUP2", "Please select stake")
                    }else{
                        if(data.odds != '\n                        \n                      '){
                            socket.emit("betDetails", {data, LOGINDATA})
                            showLoader();
                        }else{
                            togglePopupMain("popup-2", "redPopUP2", "Bet Not Allowed In this market")
                        }
                    }
                }else{
                    if(check ){
                        data.odds = specificSpan
                        if(data.stake === ""){
                            // alert("Please select stake")
                            togglePopupMain('popup-2', "redPopUP2", "Please select stake")
                        }else{
                            if(data.odds != '\n                        \n                      '){
                                socket.emit("betDetails", {data, LOGINDATA})
                                showLoader();
                            }else{
                                togglePopupMain("popup-2", "redPopUP2", "Bet Not Allowed In this market")
                            }
                        }
                    }else{
                        togglePopupMain('popup-2', "redPopUP2", "Odds value changed, please try again ")
                    }
                }
                });
              });

              $(document).ready(function(){
                $(".minus").click(function () {
                    let spanId =  ($(this).closest("tr").find('.set-stake-form-input2').val())
                    let Odds = parseFloat($(this).closest('tr').find(".nww-bet-slip-wrp-col1-txt-num").text())
                    let NewStake = spanId - 100;
                    let result = (NewStake * Odds) - NewStake;
                    if(!spanId){
                        $(this).closest("tr").find('.set-stake-form-input2').val(0)
                        $(this)
                        .closest("tr")
                        .find(".c-gren")
                        .text(0);
                    }else if(NewStake < 0){
                        $(this).closest("tr").find('.set-stake-form-input2').val(0)
                        $(this)
                        .closest("tr")
                        .find(".c-gren")
                        .text(0);
                    }
                    else{
                        // console.log("WORKING")
                        $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                        $(this)
                        .closest("tr")
                        .find(".c-gren")
                        .text(result.toFixed(2));
                    }
                })
              })
    
              $(document).ready(function(){
                $(".plus").click(function () {
                    let spanId =  ($(this).closest("tr").find('.set-stake-form-input2').val())
                    let Odds = parseFloat($(this).closest('tr').find(".nww-bet-slip-wrp-col1-txt-num").text())
                    // let NewStake = parseFloat(spanId) + 100;
                    let NewStake 
                    if(spanId){
                        NewStake = parseFloat(spanId) + 100;
                    }else{
                        NewStake = 100
                    }
                    let result = (NewStake * Odds) - NewStake;
                    // console.log(result)
                    if(!spanId){
                        $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                        $(this)
                        .closest("tr")
                        .find(".c-gren")
                        .text(result.toFixed(2));
                    }else if(NewStake < 0){
                        $(this).closest("tr").find('.set-stake-form-input2').val(0)
                        $(this)
                        .closest("tr")
                        .find(".c-gren")
                        .text(0);
                    }
                    else{
                        // console.log("WORKING")
                        $(this).closest("tr").find('.set-stake-form-input2').val(NewStake)
                        $(this)
                        .closest("tr")
                        .find(".c-gren")
                        .text(result.toFixed(2));
                    }
                })
              })
    
            // function handlePlaceBetClick(event) {
            //     const clickedLink = event.target;
            //     const parentContainer = clickedLink.closest(".nww-bet-slip-wrp");
            //     let data = {
            //         spoetId : clickedLink.dataset.sportId,
            //         title : parentContainer.querySelector(".eventTitle").textContent,
            //         eventId : parentContainer.querySelector(".eventTitle").id,
            //         odds : parentContainer.querySelector(".nww-bet-slip-wrp-col1-txt-num").textContent,
            //         secId : parentContainer.querySelector(".nww-bet-slip-wrp-col1-txt-num").id.slice(0,-1),
            //         market : parentContainer.querySelector("[class^='betOn']").id,
            //         stake : parentContainer.querySelector(".set-stake-form-input2").value,
            //     }
            //     socket.emit("betDetails", {data, LOGINDATA})
            //   }
            
            //   // Get all the "PLACE BET" links
            //   const placeBetLinks = document.querySelectorAll(".PLACEBET");
            
            //   // Attach a click event listener to each link
            //   placeBetLinks.forEach((link) => {
            //     link.addEventListener("click", handlePlaceBetClick);
            //   });
    
            socket.on("betDetails" , (data) => {
                hideLoader()
                console.log(data.result)
                // function togglePopup(idname, id){
                //     document.getElementById(idname).classList.toggle("active");
                //     document.getElementById(id).innerText  = data.result.toUpperCase()
                //     setTimeout(function(){document.getElementById(idname).classList.toggle("active")}, 5000);
                //   }
                if(data.result === "Bet placed successfully"){
                    togglePopupMain('popup-1', "redPopUP", data.result.toUpperCase())
                }else{
                    togglePopupMain('popup-2', "redPopUP2", data.result.toUpperCase())
                }
                
                let html2 = ""
                document.getElementById("betsTitleSide").innerHTML = `<h5>Open Bets (${data.openBet.length})</h5>`
                if(data.openBet.length === 1){
                    html2 = `<table class="table-new-d">
                    <thead>
                      <tr class="thead-border my-open-bet-trr">
                        <th>Selection</th>
                        <th>Odds</th>
                        <th>Stake</th>
                      </tr>
                    </thead>
                    <tbody id="tableBET">
                      <tr>
                        <td>${ data.openBet[0].selectionName}</td>
                        <td>${ data.openBet[0].oddValue }</td>
                        <td>${ data.openBet[0].Stake }</td>
                      </tr>
                    </tbody>
                  </table>`
                  document.getElementById('length1').innerHTML = html2
                }else{
                    for(let i = 0; i < data.openBet.length; i++){
                        html2 += `<tr>
                        <td>${ data.openBet[i].selectionName}</td>
                        <td>${ data.openBet[i].oddValue }</td>
                        <td>${ data.openBet[i].Stake }</td>
                      </tr>`
                    }
                    document.getElementById('tableBET').innerHTML = html2
                }
            })



            $(document).on('click','.tbl-td-with5',function(e){
                // console.log("WORKING")
                $(".minus").closest("tr").find('.set-stake-form-input2').val(0)
                $(".minus")
                .closest("tr")
                .find(".c-gren")
                .text('00');
            })


    }

    

    if(pathname === "/admin/gameRules"){

       
          

        $(document).on('submit', '.uploadRulesPage', async function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            // console.log(data)
            socket.emit("createNewRule", {data, LOGINDATA})
        })

        socket.on("createNewRule", data => {
            if(data.message === "updated"){
                let num = $("#table123").find('tr').length;
                let html = `<tr>
                <td> ${num + 1} </td>
                <td>${data.data1.name}</td>
                <td><button class="description" data-bs-toggle="modal" data-bs-target="#uploadFile" id="${data.data1._id}" ><i class="fa-solid fa-database"></i></button></td>
              </tr>`
              $('#table123').append(html)
            }else{
                alert("Something wrong, please try again later")
            }
        })

        $(document).on("click", ".description", function(e){
            e.preventDefault()
            let id = this.id
            console.log(id)
            socket.emit("getDetailsOfRUles", id)
        })

        let textEditorInstance = null; // Initialize a variable to store the editor instance

        socket.on('getDetailsOfRUles', async (data) => {
            // console.log(data)
          let form = $(`.updaterules`);
          console.log(form)
          form.find('input[name="name"]').attr('value', data.name);
          form.attr('id', data._id);
        
          if (textEditorInstance) {
            // Update the existing editor with new data
            textEditorInstance.setData(data.description);
          } else {
            // If the editor is not initialized, create a new instance
            ClassicEditor
              .create(document.getElementById('detailsTextArea1'))
              .then(editor => {
                textEditorInstance = editor; // Store the new editor instance in the variable
                textEditorInstance.setData(data.description); // Set initial data
                console.log('ClassicEditor was initialized', editor);
              })
              .catch(error => {
                console.error('Error initializing ClassicEditor', error);
              });
          }
        });

        $(document).on('submit', ".updaterules", function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            let id = this.id
            data.id = id
            socket.emit("updateRules", data)
        })

        socket.on("updateRules", data =>{
            if(data === "err"){
                alert("Something wrong, please try again later")
            }else{
                // console.log(data)
                const trElement = $(`tr:has(button#${data._id})`);
                if (trElement.length) {
                    trElement.find('td:eq(0)').text(`${trElement.index() + 1}`);
                    trElement.find('td:eq(1)').text(`${data.name}`);
                    // trElement.find('td:eq(1)').text(`${data.description}`);
                }
                alert("Updated!!")

            }
        })
        
    }

    // console.log(pathname)

    if(pathname === "/kyc" || pathname === "/Kyc"){
        console.log("Working")
        $(document).on('click', ".submit", function(e){
            e.preventDefault()
            let data = {}
             data.files = $("#formFileSm")[0].files[0];
             data.name = $("#cardName").val()
             data.idNum = $('#exampleInputPassword1').val()
            socket.emit("KYC", {data, LOGINDATA})
        })

        document.getElementById("viewPdfButton").addEventListener("click", function() {
            console.log("Click")
            socket.emit('getPdf', {LOGINDATA})
          });


          socket.on('getPdf', pdfData => {
            try {
                const blob = new Blob([pdfData.data1], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(blob);
                window.open(pdfUrl, '_blank');
                URL.revokeObjectURL(pdfUrl);
              } catch (error) {
                console.error('Error creating or opening the PDF:', error);
              }
          })
    }

    if(pathname === "/admin/dashboard" ){
        console.log(LOGINDATA.LOGINUSER)
        if(LOGINDATA.LOGINUSER != ""){
            console.log("WORKING")
            socket.emit('chartMain', LOGINDATA) 
            console.log(LOGINDATA)
            socket.on("chartMain", data => {
    
                var options = {
                    series: [{
                    name: 'Income',
                    type: 'column',
                    data: data.Income.reverse()
                  },  
                  {
                    name: 'Cashflow',
                    type: 'column',
                    data: data.Revanue.reverse()
                  }],
                    chart: {
                    height: 350,
                    type: 'line',
                    stacked: false
                  },
                  dataLabels: {
                    enabled: false
                  },
                  stroke: {
                    width: [1, 1, 4]
                  },
                  
                  yaxis: [
                    {
                      axisTicks: {
                        show: true,
                      },
                      axisBorder: {
                        show: true,
                        color: '#008FFB'
                    },
                      labels: {
                        style: {
                          colors: '#008FFB',
                        }
                    },
                    title: {
                        text: "Income (Indian Rupee)",
                        style: {
                            color: '#008FFB',
                        }
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                {
                    seriesName: 'Income',
                    opposite: true,
                    axisTicks: {
                        show: true,
                    },
                    axisBorder: {
                        show: true,
                        color: '#00E396'
                    },
                    labels: {
                        style: {
                            colors: '#00E396',
                        }
                    },
                      title: {
                        text: "Revenue (Indian Rupee)",
                        style: {
                          color: '#00E396',
                        }
                    },
                },
                // {
                //     seriesName: 'Revenue',
                //     opposite: true,
                //     axisTicks: {
                //         show: true,
                //     },
                //     axisBorder: {
                //         show: true,
                //         color: '#FEB019'
                //     },
                //     labels: {
                //         style: {
                //             colors: '#FEB019',
                //         },
                //     },
                //     title: {
                //         text: "Revenue (Indian Rupee)",
                //         style: {
                //             color: '#FEB019',
                //         }
                //     }
                // },
            ],
            tooltip: {
                fixed: {
                      enabled: true,
                      position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                      offsetY: 30,
                      offsetX: 60
                    },
                  },
                  legend: {
                    horizontalAlign: 'left',
                    offsetX: 40
                  }
                  };
          
                  var chart = new ApexCharts(document.querySelector("#chart"), options);
                  chart.render();
                })

                // $(document).on("change", ".selected", function(e){
                //     e.preventDefault()
                //     let value = $(this).val()
                    // socket.emit("FIlterDashBoard", {LOGINDATA, value})
                // })
                $(document).ready(function() {
                    $(".dropdown .item").click(function(e) {
                        e.preventDefault();
                        let value = $(this).attr("id");
                        $("#destination").text($(this).text());
                        socket.emit("FIlterDashBoard", { LOGINDATA, value });
                        // console.log(value)
                    });
                });

                socket.on("FIlterDashBoard", data => {
                    console.log(data)
                    if(data.result.betCount){
                        document.getElementById('betCount').innerText = data.result.betCount
                    }else{
                        document.getElementById('betCount').innerText = 0
                    }
                    document.getElementById('Profit').innerText = data.result.Income
                    document.getElementById('turnOver').innerText = data.result.turnOver
                    document.getElementById('adminCount').innerText = data.result.adminCount
                    document.getElementById('userCount').innerText = data.result.userCount
                })
        }
    }

    if(pathname === "/admin/commissionReport"){

        //For EventLevel
        $(document).on('keyup change', "#FdateEvent,#TdateEvent", function(e){
            e.preventDefault()
            // console.log('Working')
            let page = 0;
            let data = {}
            data.fromTime = $('#FdateEvent').val()
            data.toTime = $('#TdateEvent').val()
            $('.pageIdUser').attr('data-pageid','1')
            socket.emit('commissionReportFilter', {data, LOGINDATA, page:0})
        })

        $(document).on('click', "#loadMoreEvent", function(e){
            let page = parseInt($('.pageIdUser').attr('data-pageid'));
            $('.pageIdUser').attr('data-pageid', page + 1)
            data.fromTime = $('#FdateEvent').val()
            data.toTime = $('#TdateEvent').val()
            socket.emit('commissionReportFilter', {data, LOGINDATA, page})
        })

        socket.on('commissionReportFilter', async(data) => {
            let html = ''
            for(let i = 0; i < data.eventData.length; i++){
                var timestamp = data.eventData[i].eventDate ; 
                var date = new Date(timestamp);
                var options = { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
              };
              var formattedTime = date.toLocaleString('en-US', options);

              html += `<tr class="tbl-data-href" data-href="/admin/commissionReportEvent?event=${data.eventData[i]._id}">
              <td>${formattedTime}</td>
              <td>${data.eventData[i]._id}</td>
              <td>${data.eventData[i].totalCommission}</td>
                </tr>`
            }

            if(data.eventData.length != 0){
                if(data.page == 0){
                    $('#event-tbody').html(html)
                    document.getElementById('loadMorediveEvent').innerHTML = '<a id="loadMoreEvent">Load More</a>'
                }else{
                    $('#event-tbody').append(html); 
                    document.getElementById('loadMorediveEvent').innerHTML = '<a id="loadMoreEvent">Load More</a>'
                }
            }else{
                document.getElementById('loadMorediveEvent').innerHTML = ""
                if(data.page == 0){
                    $('#event-tbody').html("NO MORE DATA ")
                }
            }
            // if(data.page == 0){
            //     $('#event-tbody').html(html)
            // }else{
            //     $('#event-tbody').append(html); 
            // }
        })



        //ACC STATEMENT

        $(document).on('keyup change', "#FdateAccCom,#TdateAccCom", function(e){
            e.preventDefault()
            // console.log('Working')
            let page = 0;
            let data = {}
            data.fromTime = $('#FdateAccCom').val()
            data.toTime = $('#TdateAccCom').val()
            let id = $('#searchUser').val()
            $('.pageIdACCComm').attr('data-pageid','1')
            socket.emit('commissionAccFilter', {data, LOGINDATA, page:0, id})
        });


        $(document).on('click', ".searchList", function(e){
            e.preventDefault()
            let page = 0;
            let data = {}
            data.fromTime = $('#FdateAccCom').val()
            data.toTime = $('#TdateAccCom').val()
            // console.log(this.id, "ID")
            document.getElementById("searchUser").value = this.textContent
            let id = this.textContent
            $('.pageIdACCComm').attr('data-pageid','1')
            $('.wrapper').hide()
            socket.emit('commissionAccFilter', {data, LOGINDATA, page:0, id})
        })

        $(document).on('click', "#loadMoreAccCom", function(e){
            e.preventDefault()
            let data = {}
            data.fromTime = $('#FdateAccCom').val()
            data.toTime = $('#TdateAccCom').val()
            // console.log(this.id, "ID")
            let id = $('#searchUser').val()
            let page = parseInt($('.pageIdACCComm').attr('data-pageid'));
            $('.pageIdACCComm').attr('data-pageid',page + 1)
            socket.emit('commissionAccFilter', {data, LOGINDATA, page, id})
        })

        socket.on('commissionAccFilter', async(data) => {
            let html = "";
            console.log(data)
            for(let i = 0; i < data.accStatements.length; i++){
                var timestamp = data.accStatements[i].date ; 
                var date = new Date(timestamp);
                var options = { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true
              };
              var formattedTime = date.toLocaleString('en-US', options);
              let bal = (data.accStatements[i].balance - data.accStatements[i].creditDebitamount).toFixed(2)
              html += `<tr >
              <td>${formattedTime}</td>
              <td>${data.accStatements[i].userName}</td>
              <td>${data.accStatements[i].description}</td>
              <td>${data.accStatements[i].creditDebitamount}</td>
              <td>${bal}</td>
              <td>${data.accStatements[i].balance.toFixed(2)}</td>
          </tr>`
            }
            if(data.accStatements.length != 0){
                if(data.page == 0){
                    $('#AccountCom-tbody').html(html)
                    document.getElementById('loadMorediveAccCom').innerHTML = '<a id="loadMoreAccCom">Load More</a>'
                }else{
                    $('#AccountCom-tbody').append(html); 
                    document.getElementById('loadMorediveAccCom').innerHTML = '<a id="loadMoreAccCom">Load More</a>'
                }
            }else{
                document.getElementById('loadMorediveAccCom').innerHTML = ""
                if(data.page == 0){
                    $('#AccountCom-tbody').html("NO MORE DATA ")
                }
            }
        })


        $(document).on('keyup','.searchUser',function(e){
            e.preventDefault()
            // console.log('working')
            // console.log($(this).val())
            if($(this).val().length >= 3 ){
                let x = $(this).val(); 
                console.log(x)
                socket.emit("SearchACC", {x, LOGINDATA})
            }else{
                document.getElementById('search').innerHTML = ``
                document.getElementById("button").innerHTML = ''
            }
        })


        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })

        socket.on("ACCSEARCHRES", async(data)=>{
            // console.log(data,'==>resporst of search')
            let html = ``
            $('.wrapper').show()
    
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })


        //USER LEVEL 
        $(document).on('keyup change', "#FdateUserLevel,#TdateUserLevel", function(e){
            e.preventDefault()
            // console.log('Working')
            let page = 0;
            let data = {}
            data.fromTime = $('#FdateUserLevel').val()
            data.toTime = $('#TdateUserLevel').val()
            $('.pageIdUser').attr('data-pageid','1')
            socket.emit('commissionUserLevel', {data, LOGINDATA, page:0})
        })


        $(document).on('click', "#loadMoreUser", function(e){
            e.preventDefault()
            let page =  parseInt($('.pageIdUser').attr('data-pageid'));
            let data = {}
            data.fromTime = $('#FdateUserLevel').val()
            data.toTime = $('#TdateUserLevel').val()
            $('.pageIdUser').attr('data-pageid',page + 1)
            socket.emit('commissionUserLevel', {data, LOGINDATA, page})
        })

        socket.on('commissionUserLevel', async(data) => {

            let html = ''
            for(let i = 0; i < data.userWiseData.length; i++){
                html += `<tr class="tbl-data-href" data-href="/admin/commissionReportUser?User=${data.userWiseData[i]._id}">
                <td>${data.userWiseData[i]._id}</td>
                <td>${data.userWiseData[i].totalCommission}</td>
                <td>${data.userWiseData[i].totalUPline}</td>
                </tr>`
            }
            // console.log(html, "HTML")
            if(data.userWiseData.length != 0){
                if(data.page == 0){
                    $('#userLevel-tbody').html(html)
                    document.getElementById('loadMorediveUser').innerHTML = '<a id="loadMoreUser">Load More</a>'
                }else{
                    $('#userLevel-tbody').append(html); 
                    document.getElementById('loadMorediveUser').innerHTML = '<a id="loadMoreUser">Load More</a>'
                }
            }else{
                document.getElementById('loadMorediveUser').innerHTML = ""
                if(data.page == 0){
                    $('#userLevel-tbody').html("NO MORE DATA ")
                }
            }
            // console.log(data)
        })

        // jQuery(document).ready(function($) {
        //     $(".tbl-data-href").click(function() {
        //         window.location = $(this).data("href");
        //     });
        // });
        $(document).on('click', ".tbl-data-href", function(e){
            window.location = $(this).data("href");
        })
    }
    


    if(pathname === "/admin/houseManagement"){
        console.log('working')
        $(document).on("submit", ".HouseFund", function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            socket.emit("FUndData", {data, LOGINDATA})
        })

        socket.on("FUndData", async(data) => {
            if(data.status === "error"){
                alert("Please Try again later")
            }else{
                window.location.reload()
                // $('#myModaladduser').modal('toggle');
            //     let html = ""
            //     const tbody = document.getElementById("tableBody");
            //     const numberOfRows = tbody.getElementsByTagName("tr").length;
            //     if(numberOfRows%2 == 0){
            //         html += `<tr style="text-align: center;" class="blue">`
            //     }else{
            //         html += `<tr style="text-align: center;" >`
            //     }
            //     var date = new Date(data.date);
            //     var options = { 
            //     year: 'numeric',
            //     month: 'long',
            //     day: 'numeric',
            //     hour: 'numeric',
            //     minute: 'numeric',
            //     hour12: true
            //     };
            //     var formattedTime = date.toLocaleString('en-US', options);
            //     var formattedTimeWithoutComma = formattedTime.replace(",", "");
            //     html += `<td>${numberOfRows+1}</td>
            //     <td>${formattedTimeWithoutComma}</td>
            //     <td>Deposit</td>
            //     <td>Betbhai</td>
            //     <td> <i class="fa-solid fa-arrow-right"></i> </td>
            //     <td>Betbhai</td>
            //     <td>${data.amount}</td>
            //     <td>${data.closingBalance}</td>
            //     <td>${data.Remark}</td>
            //   </tr>`

            //   tbody.insertAdjacentHTML("beforeend", html);
            }
        })

        function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }          

          function sanitizeCellValue(value) {
            // Define a character whitelist (allow only printable ASCII and basic punctuation)
            const allowedCharactersRegex = /[\x20-\x7E\u0020-\u007E]/g;
            
            return value.match(allowedCharactersRegex).join(',').trim();
          }
          
          function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            
            let csv = '';
            for (const row of rows) {
              const columns = row.querySelectorAll('td, th');
              let rowData = '';
              for (const column of columns) {
                
                const data = sanitizeCellValue(column.innerText);
                rowData += (data.includes(',') ? `"${data}"` : data) + ',';
              }
              csv += rowData.slice(0, -1) + '\n';
            }
            
            return csv;
          }

        document.getElementById('downloadBtn').addEventListener('click', function(e) {
            e.preventDefault()
            const table = document.getElementById('table12');             
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                const headers = table.querySelectorAll('thead th:not(:last-child)');
                const csvRows = [];

                // Extract headers
                const headerRow = Array.from(headers).map(header => header.textContent.trim());
                csvRows.push(headerRow.join(','));

                // Extract data from each row except the last column
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td:not(:last-child)');
                    const csvRow = Array.from(cells).map(cell => cell.textContent.trim());
                    csvRows.push(csvRow.join(','));
                });

                // Combine rows into a CSV string
                const csvContent = csvRows.join('\n');

                // Create a Blob and initiate download
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'table_data.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
          });

        $(document).on('click', '.load-more', function(e){
            e.preventDefault()
            let page = parseInt($('.rowId').attr('data-rowid'))
            $('.rowId').attr('data-rowid',page + 1)
            socket.emit('HouseFundData', {LOGINDATA, page})
        })

        let count = 11
        socket.on('HouseFundData', data => {
            let html = ''
            for(const i in data){
                var date = new Date(data[i].date);
                var options = { 
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
                };
                var formattedTime = date.toLocaleString('en-US', options);
                var formattedTimeWithoutComma = formattedTime.replace(",", "");
                html += `<tr>
                <td>${ count }</td>
                  <td class="date-time">${formattedTimeWithoutComma}</td>
                  <td>Deposit</td>
                  <td>Betbhai</td>
                  <td> <i class="fa-solid fa-arrow-right"></i> </td>
                  <td>Betbhai</td>
                  <td>${data[i].amount}</td>
                  <td>${data[i].closingBalance}</td>
                  <td>${data[i].Remark}</td>
                </tr>`
                count++
            }

            $('tbody').append(html)
        })
    }


    if(pathname === "/admin/alertbet"){

        var today = new Date();
        var todayFormatted = formatDate(today);
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() - 7);
        var tomorrowFormatted = formatDate(tomorrow);

        $('#fromDate').val(tomorrowFormatted)
        $('#toDate').val(todayFormatted)
        $('#toTime').val("23:59:59")
        $('#fromTime').val("00:00:00")
        function formatDate(date) {
            var year = date.getFullYear();
            var month = (date.getMonth() + 1).toString().padStart(2, '0');
            var day = date.getDate().toString().padStart(2, '0');
            return year + "-" + month + "-" + day;
        }
        $('.searchUser').keyup(function(){
            if($(this).hasClass("searchUser")){
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    socket.emit("SearchACC", {x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                    document.getElementById("button").innerHTML = ''
                }
            }
        })
    
        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })
    
        socket.on("ACCSEARCHRES", async(data)=>{
            $('.wrapper').show()
            let html = ``
            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })
    
        let toDate;
        let fromDate;
        let sport;
        let market;
        let result;
        let filterData = {}
        fromDate = $('#fromDate').val()
        toDate = $('#toDate').val()
        filterData.fromDate = fromDate;
        filterData.toDate = toDate;
      

        $('#Sport,#market,#fromDate,#toDate,#result').change(function(){
            $('.pageId').attr('data-pageid','1')

            console.log("working")
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            sport = $('#Sport').val()
            market = $('#market').val()
            result = $('#result').val()
            data.page = 0;
       
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            filterData.betType = sport
            filterData.marketName = market
            filterData.alertStatus = result
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            socket.emit('AlertBet',data)
    
        })
    
        $(document).on("click", ".searchList", function(){
            $('.pageId').attr('data-pageid','1')
            
            document.getElementById("searchUser").value = this.textContent
         
            data.page = 0;
          
            filterData.userName = this.textContent
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            $('.pageId').attr('data-pageid','1')
            $('.wrapper').hide()
            socket.emit('AlertBet',data)
            
        })
    

        $('#load-more').click(function(e){
            let page = parseInt($('.pageId').attr('data-pageid'));
            $('.pageId').attr('data-pageid',page + 1)
            let data = {}
            let userName = $('.searchUser').val()
            if(userName == ''){
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }else{
                filterData.userName = userName
            }
            data.filterData = filterData;
            data.page = page
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('AlertBet',data)
        })
        
        let count = 11
        socket.on('AlertBet',(data) => {
            console.log(data)
            if(data.page === 0){
                count = 1
            }
            let bets = data.ubDetails;
            let html = '';
            for(let i = 0; i < bets.length; i++){
                let date = new Date(bets[i].date)
                if(bets[i].bettype2 === 'BACK'){
                    html += `<tr class="back">`
                }else{
                    html += `<tr class="lay">`
                }
                html += `<td>${i + count}</td>
                <td class="text-nowrap" >${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                <td>${bets[i].userName}</td>
                <td class="text-nowrap" >${bets[i].event}</td>
                `
                if(bets[i].match){
                    html += `
                    <td class="text-nowrap" >${bets[i].marketName}</td>
                    <td>${bets[i].oddValue}</td>
                    <td class="text-nowrap" >${bets[i].match}</td>
                    <td class="text-nowrap" >${bets[i].selectionName}</td>`
                }else{
                    html += `<td>-</td>
                    <td>-</td><td>-</td><td>-</td>`
                }
                html += `
                <td>${bets[i].Stake}</td>
                <td>${bets[i].transactionId}</td>
                <td>${bets[i].status}</td>
                <td>`
                if(bets[i].status == 'Alert'){

                    html += `<div class="btn-group">
                        <button class="btn cancel" id="${bets[i]._id}"> Cancel Bet</button>
                        <button class="btn accept" id="${bets[i]._id}"> accept Bet</button>
                    </div>`
                }else{
                    html += `-`
                }
                html += `</td>
                </tr>`
            }
            count += 10;
            if(data.page == 0){
                if(bets.length == 0){
                    html += `<tr class="empty_table"><td>No record found</td></tr>`
                    $('#load-more').hide()
                }else{

                    $('#load-more').show()
                }

                $('.new-body').html(html)
            }else{
                if(bets.length == 0){
                    $('#load-more').hide()
                }
                $('.new-body').append(html)         
            }
        })

        $(document).on('click', '.cancel', async function(e){
            e.preventDefault()
            if(confirm('do you want to cancel this bet')){

                socket.emit('voidBet', this.id)
            }
        })

        $(document).on('click', '.accept', async function(e){
            e.preventDefault()
            if(confirm('do you want to accept this bet')){

                socket.emit('acceptBet', this.id)
            }
        })

        
        socket.on("acceptBet", (data)=>{
            if(data.status === "error"){
                alert("Please try again later")
            }else{
               location.reload(true)
            }
        })
    
    }


    if(pathname === "/admin/userdetails"){
        $(document).on("submit", ".userDetails", function(e){
            e.preventDefault()
            let form = $(this)[0];
            console.log(form)
            let share = $(".userDetails").find('input[name="Share"]').val()
            let myShare = $(".userDetails").find('input[name="myShare"]').val()
            let id = this.id
            socket.emit("myShare", {share, myShare, id})
        })

        socket.on("myShare", data => {
            console.log(data)
            if(data.status === "error"){
                alert(data.message)
            }else{
                alert("Updated")
                $(".userDetails").find('input[name="Share"]').val(data.share)
                $(".userDetails").find('input[name="myShare"]').val(data.myShare)
            }
        })

        const num1Input = document.getElementById('myShare');
        const num2Input = document.getElementById('Share');
        num1Input.addEventListener('input', () => {
            const num1 = parseFloat(num1Input.value);
            const num2 = 100 - num1;
            num2Input.value = num2;
        });

        num2Input.addEventListener('input', () => {
            const num2 = parseFloat(num2Input.value);
            const num1 = 100 - num2;
            num1Input.value = num1;
        });



        $(document).on("submit", ".Wallet", function(e){
            e.preventDefault()
            let maxCreditReference = $(".Wallet").find('input[name="maxCreditReference"]').val()
            let transferLock =  $(".Wallet").find('select[name="transferLock"]').val()
            let id = this.id
            socket.emit("Wallet", {maxCreditReference, transferLock, id})
        })

        socket.on("maxCreditReference", data =>{
            if(data.status === "error"){
                alert(data.message)
            }else{
                alert("Updated")
                $(".Wallet").find('input[name="maxCreditReference"]').val(data.maxCreditReference)
                // $(".Wallet").find('select[name="transferLock"]').val(data.transferLock)
            }
        })


        $(document).on("click", ".loadMoredive", function(e){
            e.preventDefault()
            let id = search.split("=")[1]
            let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let fromDate = $('#FdateBet').val()
                let toDate = $('#TdateBet').val()
                let type = $("#selectBet").val()
                let filterData = {}
                filterData.fromDate = fromDate,
                filterData.toDate = toDate
                filterData.type = type
                socket.emit("BETSFORUSERAdminSide", {page, id, filterData})
        })
  
        const FdateInput = document.getElementById('FdateBet');
        const TdateInput = document.getElementById('TdateBet');
        const selectElement = document.getElementById('selectBet');
        FdateInput.addEventListener('change', handleInputChange);
        TdateInput.addEventListener('change', handleInputChange);
        selectElement.addEventListener('change', handleInputChange);
        function handleInputChange(event) {
            let fromDate = $('#FdateBet').val()
            let toDate = $('#TdateBet').val()
            let type = $("#selectBet").val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            filterData.type = type
            page = 0
            $('.pageId').attr('data-pageid', 1)
            let id = search.split("=")[1]
            console.log(filterData)
            socket.emit("BETSFORUSERAdminSide", {page, id, filterData})
          }

          let count = 11
          socket.on("BETSFORUSERAdminSide", async(data) => {
            // console.log(data)
            if(data.bets.length > 0){
                // console.log(data.page)
                if(data.page === 0){
                    count = 1
                }
                let page = data.page
                let bets = data.bets;
                let html = '';
                 for(let i = 0; i < bets.length; i++){
                    var date = new Date(bets[i].date);
                    var options = { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    };
                    var formattedTime = date.toLocaleString('en-US', options);
                    html += `<tr class="acount-stat-tbl-body-tr">
                        <td>${i+count}</td>
                        <td class="date-time">${formattedTime}</td>
                        <td>${bets[i].userName}</td>
                        <td>${bets[i].event}</td>`
                    if(bets[i].match){
                            html += `<td>${bets[i].marketName}</td>
                            <td>${bets[i].oddValue}</td>
                            <td>${bets[i].match}</td>
                            <td>${bets[i].selectionName}</td>`
                    }else{
                            html += `<td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>`
                    }
                    html += `<td>${bets[i].Stake}</td>
                    <td>${bets[i].transactionId}</td>
                    <td>${bets[i].status}</td>
                    <td>${bets[i].returns}</td>
                    </tr>`
                        
                }
                count += 10
                if(data.page == 0){
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
                }
               
            }else{
                console.log("working")
                if(data.page == 0){
                    if(bets.length == 0){
                        html += `<tr class="empty_table">
                        <td>No record found</td>
                      </tr>`
                    }
                    $('.new-body').html("")
                }
                $('.loadMoredive').hide()

            }
          })


          function generatePDF(table) {
            const printWindow = window.open('', '_blank');
                    printWindow.document.open();
                    printWindow.document.write(`
                    <html>
                        <head>
                        <title>Account Statement</title>
                        <style>
                            .ownAccDetails {
                                color: black;
                                border: none;
                                background-color: inherit;
                                padding: 14px 28px;
                                font-size: 16px;
                                cursor: pointer;
                                display: inline-block;
                            }
                            body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            }
                            table {
                            border-collapse: collapse;
                            width: 100%;
                            }
                            th, td {
                            border: 1px solid #ccc;
                            padding: 8px;
                            }
                            th {
                            background-color: #f2f2f2;
                            font-weight: bold;
                            }
                        </style>
                        </head>
                        <body>
                        ${table.outerHTML}
                        </body>
                    </html>
                    `);
                    printWindow.document.close();

                    printWindow.print();
                
          }
          document.getElementById('downloadBtnACC').addEventListener('click', function(e) {
            e.preventDefault()
            const table = document.getElementById('table12');
            
            if (table) {
              generatePDF(table);
            }
          });

          function downloadCSV(csvContent, fileName) {
            const link = document.createElement('a');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          }          

          function sanitizeCellValue(value) {
            // Define a character whitelist (allow only printable ASCII and basic punctuation)
            const allowedCharactersRegex = /[\x20-\x7E\u0020-\u007E]/g;
            
            return value.match(allowedCharactersRegex).join('').trim();
          }
          
          function convertToCSV(table) {
            const rows = table.querySelectorAll('tr');
            
            let csv = '';
            for (const row of rows) {
              const columns = row.querySelectorAll('td, th');
              let rowData = '';
              for (const column of columns) {
                const data = sanitizeCellValue(column.innerText);
                rowData += (data.includes(',') ? `"${data}"` : data) + ',';
              }
              csv += rowData.slice(0, -1) + '\n';
            }
            
            return csv;
          }

        document.getElementById('pdfDownloadACC').addEventListener('click', function(e) {
            e.preventDefault()
            const table = document.getElementById('table12');             
            if (table) {
              const csvContent = convertToCSV(table);
              downloadCSV(csvContent, 'AccountStatement.csv');
            }
          });


        //for accountstatement/

        $(document).on("click", ".loadMorediveACC", function(e){
            e.preventDefault();
            console.log("Working")
            let page = parseInt($('.pageIdACC').attr('data-pageid'));
            $('.pageIdACC').attr('data-pageid',page + 1)
            let fromDate = $('#FdateACC').val()
            let toDate = $('#TdateACC').val()
            let type = $("#selectACC").val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            filterData.type = type
            let id = search.split("=")[1]
            socket.emit("ACCSTATEMENTADMINSIDE", {page, id, filterData})
        })

        const FdateInputACC = document.getElementById('FdateACC');
        const TdateInputAcc = document.getElementById('TdateACC');
        const selectElementAcc = document.getElementById('selectACC');
        FdateInputACC.addEventListener('change', handleInputChangeACC);
        TdateInputAcc.addEventListener('change', handleInputChangeACC);
        selectElementAcc.addEventListener('change', handleInputChangeACC);
        function handleInputChangeACC(event) {
            let fromDate = $('#FdateACC').val()
            let toDate = $('#TdateACC').val()
            let type = $("#selectACC").val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            filterData.type = type
            page = 0
            $('.pageIdACC').attr('data-pageid',1)
            let id = search.split("=")[1]
            socket.emit("ACCSTATEMENTADMINSIDE", {page, id, filterData})
          }


        let countAcc = 11
        socket.on("ACCSTATEMENTADMINSIDE", async(data) => {
            console.log(data)
            let userAcc = data.userAcc;
            let page = data.page
            let html = '';

            if(data.userAcc.length > 0){
            
            if(data.page === 0){
                countAcc = 1
            }
             for(let i = 0; i < userAcc.length; i++){
                var date = new Date(userAcc[i].date);
                var options = { 
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                };
                var formattedTime = date.toLocaleString('en-US', options);
                html += `<tr class="acount-stat-tbl-body-tr">
                    <td>${i+countAcc}</td>
                    <td class="date-time">${formattedTime}</td>`
                    if(userAcc[i].creditDebitamount > 0){
                        html += `<td>${userAcc[i].creditDebitamount}</td>
                        <td>0</td>`
                    }else{
                        html += ` <td>0</td>
                        <td>${userAcc[i].creditDebitamount}</td>`
                    }

                    if(userAcc[i].stake){
                        html += `<td>${userAcc[i].stake}</td>`
                    }else{
                        html += "<td>-</td>"
                    }

                    html += `<td>0</td>
                    <td>${userAcc[i].balance}</td>
                    <td>${userAcc[i].description}</td>
                    <td>-</td>`
            }
            countAcc += 10
            if(data.page == 0){
               
                $('.acount-stat-tbl-body').html(html)
            }else{
                $('.acount-stat-tbl-body').append(html)         
            }
            if(userAcc.length == 0){
                $('.loadMorediveACC').hide()
            }else{
                $('.loadMorediveACC').show()
            }
        }else{
            if(data.page == 0){
                html += `<tr class="empty_table">
                <td>No record found</td>
              </tr>`
              $('.acount-stat-tbl-body').html(html)

            }
            $('.loadMorediveACC').hide()
        }
        })



        //For user History/

        $(document).on("click", ".loadMorediveHistory", function(e){
            e.preventDefault();
            console.log("Working")
            let page = parseInt($('.pageIdHistory').attr('data-pageid'));
            $('.pageIdHistory').attr('data-pageid',page + 1)
            let id = search.split("=")[1]
            socket.emit("loadMorediveHistory", {page, id})
        })

        let countHistory = 11
        socket.on("loadMorediveHistory", data => {
            // console.log(data)
            if(data.length > 0){
                let html = ""
                for(let i = 0; i < data.length; i++){
                    // console.log(data[i])
                    var date = new Date(data[i].login_time);
                    var options = { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    };
                    var formattedTime = date.toLocaleString('en-US', options);
                    let date2
                    let formattedTime2
                    if(!data[i].isOnline){
                        date2 = new Date(data[i].logOut_time);
                        formattedTime2 = date2.toLocaleString('en-US', options);
                    }
                    html += `<tr class="acount-stat-tbl-body-tr">
                    <td>${i+countHistory}</td>
                    <td>${formattedTime}</td>`
                    if(!data[i].isOnline){
                        html += `<td>${formattedTime2}</td> `
                    }else{
                        html += ``
                    }
                    html += `<td>${data[i].ip_address}</td>`
                    if(!data[i].isOnline){
                        html += ` <td>Online</td></tr>`
                    }else{
                        html += ` <td>LogOut</td></tr>`
                    }
                    countHistory += 10
                }
                console.log(html)
                if(data.page == 0){

                    $('.acount-stat-tbl-body111').html(html) 
                }else{

                    $('.acount-stat-tbl-body111').append(html) 
                }

            }else{
                if(data.page){
                    html += `<tr class="empty_table">
                    <td>No record found</td>
                  </tr>`
                    $('.acount-stat-tbl-body111').html(html) 

                }
                $('.loadMorediveHistory').hide()
            }
           

        })
        
    }

    if(pathname === "/admin/settlement"){
        $(document).on("change", ".checkbox", function(e) {
            e.preventDefault()
            if ($(this).is(":checked")) {
                socket.emit("Autosettle", {LOGINDATA, status:true})
              } else {
                socket.emit("Autosettle", {LOGINDATA, status:false})
              }
        });

        let fromdate;
        let todate;
        // $('#from_date').change(function(e){
        //     fromdate =  new Date(Date.parse($('#from_date').val()));
        //     if($('#to_date').val() != ''){
                
        //         todate = new Date(Date.parse($('#to_date').val()))
        //     }
        //     console.log(fromdate,todate)
        //     socket.emit('settlement',{LOGINUSER:LOGINDATA.LOGINUSER,todate,fromdate})

        // })
        // $('#to_date').change(function(e){
        //     todate = new Date(Date.parse($('#to_date').val()))
        //     if($('#from_date').val() != ''){
                
        //         fromdate =  new Date((Date.parse($('#from_date').val())) );
        //     }
        //     console.log(fromdate,todate)
        //     socket.emit('settlement',{LOGINUSER:LOGINDATA.LOGINUSER,todate,fromdate})

            
        // })


        $('#from_date').change(function (e) {
            fromdate = new Date(Date.parse($('#from_date').val()));
            fromdate.setHours(0, 0, 0, 0); // Set the time to midnight
            if ($('#to_date').val() != '') {
                todate = new Date(Date.parse($('#to_date').val()));
                todate.setHours(0, 0, 0, 0); // Set the time to midnight
            }
            console.log(fromdate, todate);
            socket.emit('settlement', { LOGINUSER: LOGINDATA.LOGINUSER, todate, fromdate });
        });
        
        $('#to_date').change(function (e) {
            todate = new Date(Date.parse($('#to_date').val()));
            todate.setHours(0, 0, 0, 0); // Set the time to midnight
            if ($('#from_date').val() != '') {
                fromdate = new Date(Date.parse($('#from_date').val()));
                fromdate.setHours(0, 0, 0, 0); // Set the time to midnight
            }
            console.log(fromdate, todate);
            socket.emit('settlement', { LOGINUSER: LOGINDATA.LOGINUSER, todate, fromdate });
        });

        socket.on('settlement',async(data)=>{
            console.log(data)
            if(data.betsEventWise.length !== 0){
                let betsEventWiseData = data.betsEventWise.find(item => item.id == 'Cricket')
                if(betsEventWiseData){
                    let htmlC = ''
                    betsEventWiseData = betsEventWiseData.data
                    for(let i = 0; i < betsEventWiseData.length; i++){
                        htmlC += `<tr>`
                    var timestamp = new Date(betsEventWiseData[i].eventdate).getTime(); 
                    var date = new Date(timestamp);
                    var options = { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    };
                    var formattedTime = date.toLocaleString('en-US', options);
                      
                      htmlC += `<td>${ i + 1} </td>
                      <td>${formattedTime}</td>
                      <td>${betsEventWiseData[i].series}</td>
                      <td>${betsEventWiseData[i].matchName}</td>
                      <td>${betsEventWiseData[i].count}</td>
                      <td>${betsEventWiseData[i].count2}</td>
                      <td><a href="/admin/settlementIn?id=${betsEventWiseData[i].eventid}" class="btn-green">settle</a></td>
                    </tr>`
                    }
                    $('#cricket-tbody').html(htmlC)
                }else{
                    $('#cricket-tbody').html(`<tr class="empty_table"><td>No record found</td></tr>`)
                }




                let betsEventWiseData2 = data.betsEventWise.find(item => item.id == 'Football')
                if(betsEventWiseData2){
                    let htmlf = ''
                    betsEventWiseData2 = betsEventWiseData2.data
                    for(let i = 0; i < betsEventWiseData2.length; i++){
                        htmlf += `<tr>`
                    var timestamp = new Date(betsEventWiseData2[i].eventdate).getTime(); 
                    var date = new Date(timestamp);
                    var options = { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    };
                    var formattedTime = date.toLocaleString('en-US', options);
                      
                      htmlf += `<td>${ i + 1} </td>
                      <td>${formattedTime}</td>
                      <td>${betsEventWiseData2[i].series}</td>
                      <td>${betsEventWiseData2[i].matchName}</td>
                      <td>${betsEventWiseData2[i].count}</td>
                      <td>${betsEventWiseData2[i].count2}</td>
                      <td><a href="/admin/settlementIn?id=${betsEventWiseData2[i].eventid}" class="btn-green">settle</a></td>
                    </tr>`
                    }
                    $('#football-tbody').html(htmlf)
                }else{
                    $('#football-tbody').html(`<tr class="empty_table"><td>No record found</td></tr>`)
                }


                let betsEventWiseData3 = data.betsEventWise.find(item => item.id == 'Tennis')
                if(betsEventWiseData3){
                    let htmlt = ''
                    betsEventWiseData3 = betsEventWiseData3.data
                    for(let i = 0; i < betsEventWiseData3.length; i++){
                        htmlt += `<tr>`
                    var timestamp = new Date(betsEventWiseData3[i].eventdate).getTime(); 
                    var date = new Date(timestamp);
                    var options = { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    };
                    var formattedTime = date.toLocaleString('en-US', options);
                      
                      htmlt += `<td>${ i + 1} </td>
                      <td>${formattedTime}</td>
                      <td>${betsEventWiseData3[i].series}</td>
                      <td>${betsEventWiseData3[i].matchName}</td>
                      <td>${betsEventWiseData3[i].count}</td>
                      <td>${betsEventWiseData3[i].count2}</td>
                      <td><a href="/admin/settlementIn?id=${betsEventWiseData3[i].eventid}" class="btn-green">settle</a></td>
                    </tr>`
                    }
                    $('#tennis-tbody').html(htmlt)
                }else{
                    $('#tennis-tbody').html(`<tr class="empty_table"><td>No record found</td></tr>`)
                }

            }else{
                $('tbody').html('<tr class="empty_table"><td>No record found</td></tr>')
            }
        })
    }

    if(pathname == '/admin/settlementHistory'){
        $(document).on('change','#Fdate',function(e){
            let from_date = $(this).val()
            let to_date
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let page = 0
            $('.rowId').attr('data-rowid',page + 1)
            socket.emit('settlementHistory',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page})
        })

        $(document).on('change','#Tdate',function(e){
            let to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            let page = 0
            $('.rowId').attr('data-rowid',page + 1)
            socket.emit('settlementHistory',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page})
        })
        let limit = 10
        socket.on('settlementHistory',async(data)=>{
            console.log(data)
            let html = ''
            limit = 10 * data.page
            for(let i = 0; i < data.History.length; i++){
                var date = new Date(data.History[i].date)
                html += `<tr>
                  <td>${limit+1+i}</td> 
                  <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear() + " "+ date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>
                  <td>${data.History[i].eventName}</td>
                  <td>${data.History[i].marketName}</td>
                  <td>${data.History[i].user[0].userName}</td>
                  <td>${data.History[i].result}</td>
                </tr>`
            } 
            if(data.page == 0){
                if((data.History.length == 10)){
                    document.getElementById('load-more').innerHTML = `<button class="load-more">Load More</button>`
                }
                if(data.History.length == 0){
                    html += `<tr class="empty_table"><td>No record found</td></tr>`
                    document.getElementById('load-more').innerHTML = ""
                }
                $('tbody').html(html)
            }else{
                $('tbody').append(html)
                if((data.History.length < 10)){
                    document.getElementById('load-more').innerHTML = ""
                }
            }
        })

        // $(window).scroll(async function() {
        //     var scroll = $(window).scrollTop();
        //     var windowHeight = $(window).height();
        //     var documentHeight = $(document).height();
        //     if (scroll + windowHeight + 1 >= documentHeight) {
        //         console.log('working')
        //         let page = parseInt($('.rowId').attr('data-rowid'))
        //         $('.rowId').attr('data-rowid',page + 1)
        //         let to_date;
        //         let from_date
        //         if($('#Fdate').val() != ''){
        //             from_date = $('#Fdate').val()
        //         }
        //         if($('#Tdate').val() != ''){
        //             to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
        //         }
        //         socket.emit('settlementHistory',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page})
        //     }
        // })

        $(document).on('click', ".load-more", function(e){
            let page = parseInt($('.rowId').attr('data-rowid'))
                $('.rowId').attr('data-rowid',page + 1)
                let to_date;
                let from_date
                if($('#Fdate').val() != ''){
                    from_date = $('#Fdate').val()
                }
                if($('#Tdate').val() != ''){
                    to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
                }
                socket.emit('settlementHistory',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page})
        })
    }

    if(pathname === "/admin/settlementIn"){
        // let inprogressTable = document.getElementById('InprogresDATA')
        // if(inprogressTable){
            function getinProgressData(){
                $(document).ready(function() {
                    socket.emit("getinProgressData", search.split('=')[1])
                  });
                  setTimeout(()=>{
                    getinProgressData()
                  }, 500)
            }
            getinProgressData()
        // }
        let status = false
        socket.on('getinProgressData', data => {
            let html= ''
            for(let i = 0; i < data.length; i++){
                html = `<tr class="RAWCLASS" id="${data[i].marketId}"><td>${data[i].marketName}</td>
                <td>${data[i].progressType}</td>
                <td>${data[i].settledBet}</td>
                <td>${data[i].length}</td></tr>`
            }
            if(data.length > 0){
                status = true
                let inprogressTable = document.getElementById('InprogresDATA')
                if(inprogressTable){
                    document.getElementById('InprogresDATA').innerHTML = html
                }else{
                    let html2 = `<thead>
                    <tr>
                      <th>Market Name</th>
                      <th>Type</th>
                      <th>Settled Bets</th>
                      <th>Total Bets</th>
                    </tr>
                  </thead><tbody class="new-body" id="InprogresDATA" >`
                  document.getElementById('inprogress-market-table').innerHTML = html2 + html + '</tbody>'
                }
            }else{
                document.getElementById('inprogress-market-table').innerHTML = '<tr class="empty_table"><td>No INPROGRESS Markets! </td></tr>'
                if(status){
                    window.location.reload()
                }
            }

        })

        $(document).on('click', '.voidBet2', function(e){
            e.preventDefault()
            let id =  this.id
            let modleName = "#myModalSE1"
            let form = $(modleName).find('.voidbet-form2')
            form.attr('id', id);
        })

        $(document).on('click', '.ROLLBACK', function(e){
            e.preventDefault()
            let id = this.id
            let modleName = "#myModalSE2"
            let form = $(modleName).find('.rollBack-form')
            form.attr('id', id);
        })

        $(document).on('submit', ".voidbet-form2", function(e){
            e.preventDefault();
            let id = this.id
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            // console.log(data, id)
            socket.emit("VoidBetIn2", {LOGINDATA, id, data})
        })

        socket.on('VoidBetIn2', data => {
            if(data.status === "error"){
                alert("Please try again later")
            }else{ 
                alert(data)
                // window.location.reload()
            }
        })


        $(document).on('submit', '.rollBack-form', function(e){
            e.preventDefault()
            let id = this.id
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            // console.log(data, id)
            socket.emit("ROLLBACKDETAILS", {LOGINDATA, id, data})
        })

        socket.on('ROLLBACKDETAILS', data => {
            if(data.status === "error"){
                alert("Please try again later")
            }else{ 
                console.log(data, " <=== Data")
                alert(data.message)
                const deleteButton = document.getElementById(data.id);
                // console.log(deleteButton)
                const row = deleteButton.closest('tr'); 
                if (row) {
                    const table = row.parentNode;
                    const rowIndex = Array.from(table.rows).indexOf(row);
                    row.remove();
                  }
            }
        })
       

        $(document).on("click", ".voidBet", function(e){
            e.preventDefault()
            let id =  this.id
            let modleName = "#myModalSE"
            let form = $(modleName).find('.voidbet-form')
            form.attr('id', id);
            // socket.emit("VoidBetIn", {LOGINDATA, id})
        })

        $(document).on('submit', ".voidbet-form", function(e){
            e.preventDefault();
            let id = this.id
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            socket.emit("VoidBetIn", {LOGINDATA, id, data})
        })

        socket.on("VoidBetIn", async(data) => {
            if(data.status === "error"){
                if(data.message){
                    alert(data.message)
                }else{
                    alert("Please try again later")
                }
            }else{
                alert(data.message)
                const deleteButton = document.getElementById(data.id);
                const row = deleteButton.closest('tr'); 
                if (row) {
                    const table = row.parentNode;
                    const rowIndex = Array.from(table.rows).indexOf(row);
                    row.remove(); 
                  }
                //   let html = ``
                //   console.log(document.getElementById('void-market-table').getElementsByClassName('empty_table'))
                //   if(document.getElementById('void-market-table').getElementsByClassName('empty_table').length != 0){
                //     html += `
                //     <thead>
                //     <tr>
                //       <th>Market Name</th>
                //       <th>Cancel Bet</th>
                //     </tr>
                //   </thead>`}
                // html += ` <tbody class="new-body" id="voidMarket"><tr>
                // <td>${data.betdata.marketName}</td><td>${data.count + 1}</td></tr>
                // </tbody>`
                // if(document.getElementById('void-market-table').getElementsByClassName('empty_table').length === 0){
                //     document.getElementById('voidMarket').insertAdjacentHTML('beforeend', html);
                // }else{
                //     document.getElementById('void-market-table').innerHTML = html
                // }
                // alert('Bets canceled successfully')
            }
        })

        $(document).on('click', ".Unmap", function(e){
            e.preventDefault()
            let id = this.id
            socket.emit('unmapBet', {LOGINDATA, id})
        })

        socket.on('unmapBet', data => {
            if(data.status === "error"){
                alert(data.message.toUpperCase())
            }else{
                const deleteButton = document.getElementById(data.betdata.marketId);
                // console.log(deleteButton)
                const row = deleteButton.closest('tr'); 
                if (row) {
                    const table = row.parentNode;
                    const rowIndex = Array.from(table.rows).indexOf(row);
                    row.remove(); 
                    // const rowsToUpdate = Array.from(table.rows).slice(rowIndex);
                    // rowsToUpdate.forEach((row, index) => {
                    //     const srNoCell = row.cells[0]; 
                    //     srNoCell.textContent = index + rowIndex + 1;
                    //   });
                  }
                  let html = ``
                  console.log(document.getElementById('open-market-table').getElementsByClassName('empty_table'))
                  if(document.getElementById('open-market-table').getElementsByClassName('empty_table').length != 0){
                    html += `
                    <thead>
                    <tr>
                      <th>Market Name</th>
                      <th>Result</th>
                      <th>Action</th>
                    </tr>
                  </thead>`}
                html += ` <tbody class="new-body" id="openmarket"><tr>
                <td>${data.betdata.marketName}</td>`
                if(data.betdata.marketName != "Match Odds" && data.betdata.marketName != "Bookmaker 0%Comm" && data.betdata.marketName != "TOSS" && data.betdata.marketName != "BOOKMAKER 0% COMM"){
                    html += `<td>
                    <select class="selectOption" >
                      <option value="" selected></option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </td>`
                }else{
                    let option = data.betdata.match.split(" v ")
                    let option1 = option[0]
                    let option2 = option[1]
                    html += `<td>
                                <select class="selectOption">
                                <option value="" selected></option>
                                <option value="${option1 }">${option1 }</option>
                                <option value="${option2 }">${option2 }</option>
                                </select>
                            </td>`
                }
                html += `<td>
                    <div class="btn-group">
                        <button class="voidBet" data-bs-toggle="modal" data-bs-target="#myModalSE" id="${data.betdata.marketId}"> VOID</button>
                        <button class="acceptBet" id="${data.betdata.marketId}"> MAP</button>
                    </div>
                </td>
                </tr>
                </tbody>   `

                if(document.getElementById('open-market-table').getElementsByClassName('empty_table').length === 0){
                    document.getElementById('openmarket').insertAdjacentHTML('beforeend', html);
                }else{
                    document.getElementById('open-market-table').innerHTML = html
                }
                alert('Bet Unmaped Successfully')
            }
        })

        $(document).on('click', ".Settle", function(e){
            e.preventDefault()
            let id = this.id
            let resultTag = $(this).closest('tr').find('.Result')
            let result = resultTag.text()
            socket.emit('Settle', {LOGINDATA, id, result})
        })

        socket.on('Settle', data => {
            if(data.status === "error"){
                alert(data.message.toUpperCase())
            }else{
                alert(data.message)
                const deleteButton = document.getElementById(data.id);
                const row = deleteButton.closest('tr'); 
                if (row) {
                    const table = row.parentNode;
                    const rowIndex = Array.from(table.rows).indexOf(row);
                    row.remove(); 
                  }
            }
        })

        $(document).on("click", ".acceptBet", function(e){
            e.preventDefault()
            let id =  this.id
            var newColumnCell = $(this).closest('tr').find('.selectOption');
            // console.log(newColumnCell.val())
            let result = newColumnCell.val()
            socket.emit("VoidBetIn22", {LOGINDATA, id, result})
            // console.log(id)
        })

        socket.on("VoidBetIn22", async(data) => {
            if(data.status === "error"){
                alert(data.message.toUpperCase())
            }else{
                const deleteButton = document.getElementById(data.betdata.marketId);
                // console.log(deleteButton)
                const row = deleteButton.closest('tr'); 
                if (row) {
                    const table = row.parentNode;
                    const rowIndex = Array.from(table.rows).indexOf(row);
                    row.remove(); 
                    // const rowsToUpdate = Array.from(table.rows).slice(rowIndex);
                    // rowsToUpdate.forEach((row, index) => {
                    //     const srNoCell = row.cells[0]; 
                    //     srNoCell.textContent = index + rowIndex + 1;
                    //   });
                  }
                  let html = ``
                  console.log(document.getElementById('mapped-market-table').getElementsByClassName('empty_table'))
                  if(document.getElementById('mapped-market-table').getElementsByClassName('empty_table').length != 0){
                    html += `
                    <thead>
                    <tr>
                      <th>Market Name</th>
                      <th>Result</th>
                      <th>Action</th>
                    </tr>
                  </thead>`}
                html += ` <tbody class="new-body" id="mapMarket"><tr>
                <td>${data.betdata.marketName}</td>
                <td class="Result" >${data.result}</td>
                <td>
                    <div class="btn-group">
                        <button class="Unmap" id="${data.betdata.marketId}"> Unmap</button>
                        <button class="Settle" id="${data.betdata.marketId}"> Settle</button>
                        <button class="voidBet" data-bs-toggle="modal" data-bs-target="#myModalSE" id="${data.betdata.marketId}"> VOID</button>
                    </div>
                </td>
                </tr>
                </tbody>   `
                if(document.getElementById('mapped-market-table').getElementsByClassName('empty_table').length === 0){
                    console.log("WORKING")
                    document.getElementById('mapMarket').insertAdjacentHTML('beforeend', html);
                }else{
                    document.getElementById('mapped-market-table').innerHTML = html
                }
                // document.getElementById('mapped-market-table').innerHTML = html
                alert('Bets Maped Successfully')
            }
        })



        // socket.on("Settle", async(data) => {
        //     if(data.status === "error"){
        //         alert(data.message.toUpperCase())
        //     }else{
        //         const deleteButton = document.getElementById(data.betdata.marketId);
        //         // console.log(deleteButton)
        //         const row = deleteButton.closest('tr'); 
        //         if (row) {
        //             const table = row.parentNode;
        //             const rowIndex = Array.from(table.rows).indexOf(row);
        //             row.remove(); 
        //             const rowsToUpdate = Array.from(table.rows).slice(rowIndex);
        //             rowsToUpdate.forEach((row, index) => {
        //                 const srNoCell = row.cells[0]; 
        //                 srNoCell.textContent = index + rowIndex + 1;
        //               });
        //           }
        //           let html = ``
        //         alert('Bet Settled Successfully')
        //     }
        // })
    }

    if(pathname == "/admin/catalogcontrol/compitations"){
        $(document).on('click','.status_check',function(){
            let status = $(this).prop('checked') ? true : false;
            let id = $(this).data('id')
            console.log(id)
            if(id){
                if(confirm('do you want to change status')){
                    socket.emit('sportStatusChange',{status,id})
                }else{
                    if(status){
                        $(this).prop('checked','')
                    }else{
                        $(this).prop('checked','checked')
                    }
                }
            }else if(id == 0) {
                if(confirm('do you want to change status')){
                    socket.emit('sportStatusChange',{status,id})
                }else{
                    if(status){
                        $(this).prop('checked','')
                    }else{
                        $(this).prop('checked','checked')
                    }
                }
            }
        })

        socket.on('sportStatusChange',async(data)=>{
            if(data.status == 'success'){
                console.log(data.msg)
            }else{
                console.log('somethig went wrong!!')
            }
        })
    }


    if(pathname === "/admin/catalogcontrol/compitations/events" || pathname == '/admin/eventcontrol'){
        $(document).on('click','.status_check',function(){
            let status = $(this).prop('checked') ? true : false;
            let id = $(this).data('id')
            console.log(id)
            if(id){
                if(confirm('do you want to change status')){
                    socket.emit('sportStatusChange2',{status,id})
                }else{
                    if(status){
                        $(this).prop('checked','')
                    }else{
                        $(this).prop('checked','checked')
                    }
                }
            }else if(id == 0) {
                if(confirm('do you want to change status')){
                    socket.emit('sportStatusChange2',{status,id})
                }else{
                    if(status){
                        $(this).prop('checked','')
                    }else{
                        $(this).prop('checked','checked')
                    }
                }
            }
        })
        $(document).on('click','.status_check_feature',function(){
            let status = $(this).prop('checked') ? true : false;
            let id = $(this).data('id')
            console.log(id)
            if(id){
                if(confirm('do you want to change status')){
                    socket.emit('sportStatusChange3',{status,id})
                }else{
                    if(status){
                        $(this).prop('checked','')
                    }else{
                        $(this).prop('checked','checked')
                    }
                }
            }else if(id == 0) {
                if(confirm('do you want to change status')){
                    socket.emit('sportStatusChange3',{status,id})
                }else{
                    if(status){
                        $(this).prop('checked','')
                    }else{
                        $(this).prop('checked','checked')
                    }
                }
            }
        })
        socket.on('sportStatusChange3',async(data)=>{
            if(data.status == 'success'){
                console.log(data.msg)
            }else{
                console.log('somethig went wrong!!')
            }
        })
    }
    
    
    if(pathname == "/admin/commissionMarkets"){
        // $(document).ready(function() {
        //     $('#MarketMatch').on('input change', function() {
        //       var inputValue = $(this).val();
        //       if(inputValue.length > 3){
        //         socket.emit("MarketMatch", {LOGINDATA, inputValue});
        //         }else{
        //             socket.emit("MarketMatch", "LessTheN3");
        //         }
        //         // socket.emit("MarketMatch", {LOGINDATA, inputValue})
        //     });
        //   });

          $('.searchUser').keyup(function(){
            if($(this).hasClass("searchUser")){
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    socket.emit("MarketMatch", {inputValue:x, LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                }
            }
        })

        //   socket.on("MarketMatch", async(data) => {
        //     console.log(data)
        //     let html = ""
        //     for(let i = 0; i < data.length; i++){
        //         html += "<ul>"
        //         html += `<li id="${data[i].eventData.eventId}" class="matchName">${data[i].eventData.name}</li>`
        //         html += "</ul>"
        //     }
        //     document.getElementById("myMarkets").innerHTML = html
        //     $('#myMarkets').click(function(e){
        //         $('#myMarkets').hide()
        //         $('#MarketMatch').val('')
        //     })
        //     // document.getElementById("demonames1").innerHTML = html
        //   })

          socket.on("MarketMatch", async(data)=>{
            $('.wrapper').show()
            let html = ``
            for(let i = 0; i < data.length; i++){
                html += `<li id="${data[i].eventData.eventId}" class="matchName">${data[i].eventData.name}</li>`
            }
            document.getElementById('search').innerHTML = html
        })

          $(document).on("click", ".matchName", function(e){
            document.getElementById("searchUser").value = this.textContent
            e.preventDefault()
            // console.log($(this).attr('id'))
            let id = $(this).attr('id')
            $('.wrapper').hide()
            socket.emit("eventIdForMarketList", {LOGINDATA, id})
          })

          socket.on("eventIdForMarketList", async(data) => {
            console.log(data)
            let i = 0
            let html = ""
            for (var marketKey in data.result.marketList) {
                if (data.result.marketList.hasOwnProperty(marketKey)) {
                  var market = data.result.marketList[marketKey];
                  if (market !== null && typeof market === "object") {
                    i ++
                    console.log("Market Key:", marketKey);
                    console.log("Market Object:", market);
                    if(Array.isArray(market)){
                        if(market.length !== 0){
                            for(let j = 0; j < market.length; j++){
                                html += `
                                <tr id='${market[j].marketId}'>
                                <td>${i + j }</td>
                                <td>${market[j].title}</td>`
                                if(data.data1.some(item => item.marketId == market[j].marketId)){
                                    html += `<td width="120px"> <div class="on-off-btn-section">
                                    <span class="on-off">OFF &nbsp; <label class="switch on">
                                    <input class="checkbox" name="autoSattled" checked type="checkbox" id="checkbox">
                                    <span class="slider round"></span>
                                    </label>&nbsp; ON</span>
                                </div></td>
                                  </tr>`
                                }else{
                                    html += `<td width="120px"> <div class="on-off-btn-section">
                                    <span class="on-off">OFF &nbsp; <label class="switch">
                                    <input class="checkbox" name="autoSattled" type="checkbox" id="checkbox">
                                    <span class="slider round"></span>
                                    </label>&nbsp; ON</span>
                                </div></td>
                                  </tr>`
                                }
                            }
                        }else{
                            html += `<tr class="empty_table"><td>No record found</td></tr>`
                        }
                       
                    }else{
                        html += `
                            <tr id='${market.marketId}'>  
                            <td>${i}</td>
                            <td>${market.title}</td>`
                            if(data.data1.some(item => item.marketId == market.marketId)){
                                html += `<td width="120px"> <div class="on-off-btn-section">
                                <span class="on-off">OFF &nbsp; <label class="switch on">
                                <input class="checkbox" name="autoSattled" checked type="checkbox" id="checkbox">
                                <span class="slider round"></span>
                                </label>&nbsp; ON</span>
                            </div></td>
                              </tr>`
                            }else{
                                html += `<td width="120px"> <div class="on-off-btn-section">
                                <span class="on-off">OFF &nbsp; <label class="switch">
                                <input class="checkbox" name="autoSattled" type="checkbox" id="checkbox">
                                <span class="slider round"></span>
                                </label>&nbsp; ON</span>
                            </div></td>
                              </tr>`
                            }
                    }
                  }
                }
              }
              console.log(html)
              console.log(html == "")
              if(html == ""){
                html += `<tr class="empty_table"><td>No record found</td></tr>`
              }
              console.log(html)
              document.getElementById("markets").innerHTML = html
          })
          $(document).on("change", ".checkbox", function(e) {
              e.preventDefault()
              const isChecked = $(this).prop("checked");
              if(isChecked){
                $(this).parents('.switch').addClass("on");
                }else{
                    $(this).parents('.switch').removeClass("on");
                }
              let parentNode = this.closest('tr')
              let marketId = parentNode.id
              socket.emit("commissionMarketbyId", {marketId, isChecked, LOGINDATA});
          })
      
          socket.on("commissionMarketbyId", data =>{
                alert(data.msg)
          })
    }

    if(pathname == "/admin/riskAnalysis"){
        function marketId(){
            $(document).ready(function() {
                var ids = [];
          
                $(".market").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("marketId", {ids})
              });
              setTimeout(()=>{
                marketId()
              }, 1000)
        }
        marketId()


        let eventId = search.split('=')[1]
        function eventIDFOrScore(){
            socket.emit("eventId", eventId)
            setTimeout(()=>{
                eventIDFOrScore()
            }, 500)

        }
        eventIDFOrScore()
        socket.on("eventId", async(data)=>{
            if(data != ""){
                let score = JSON.parse(data)
                let element = document.getElementsByClassName("live-score")
                for(let i = 0; i < element.length; i++){
                    element[i].innerHTML = score[0].data
                }
            }
        })


        let first = true
        socket.on("marketId", async(data) => {
            // console.log(data)
            $(".match_odd_Blue").each(function() {
                    
                let id = this.id

                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}1` ){
                    // console.log('Working')
                    if( section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        if(first){
                            this.innerHTML = `<strong>${section.backPrice1}</strong> <span class="small">${section.backSize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            if(data1 != section.backPrice1){
                                this.innerHTML = `<strong>${section.backPrice1}</strong> <span class="small">${section.backSize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<strong>${section.backPrice1}</strong> <span class="small">${section.backSize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}2`){
                    if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<strong>${section.backPrice2}</strong> <span class="small">${section.backSize2}</span>`
                        }else{

                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            if(data1 != section.backPrice2){
                                this.innerHTML = `<strong>${section.backPrice2}</strong> <span class="small">${section.backSize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<strong>${section.backPrice2}</strong> <span class="small">${section.backSize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}3`){
                    if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<strong>${section.backPrice3}</strong> <span class="small">${section.backSize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.backPrice3){
                                this.innerHTML = `<strong>${section.backPrice3}</strong> <span class="small">${section.backSize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                    }
                }
            })


            $(".match_odd_Red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}4` ){
                    if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        if(first){
                            this.innerHTML = `<strong>${section.layPrice1}</strong> <span class="small">${section.laySize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice1){
                                this.innerHTML = `<strong>${section.layPrice1}</strong> <span class="small">${section.laySize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if(this.id == `${section.selectionId}5`){
                    if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<strong>${section.backPrice1}</strong> <span class="small">${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<strong>${section.layPrice2}</strong> <span class="small">${section.laySize2}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice2){
                                this.innerHTML = `<strong>${section.layPrice2}</strong> <span class="small">${section.laySize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if (this.id == `${section.selectionId}6`){
                    if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<strong>${section.backPrice1}</strong> <span class="small">${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<strong>${section.layPrice3}</strong> <span class="small">${section.laySize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice3){
                                this.innerHTML = `<strong>${section.layPrice3}</strong> <span class="small">${section.laySize3}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }
            })

            $(".bookmaker_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                let item = data.finalResult.items.some(item => {
                    if(item){
                        // console.log(id)
                        if(item.runners){
                            // console.log(item)
                            let section1 = item.runners.find(item2 => item2.secId == id)
                            if(section1){
                                section = section1
                            }
                        }
                    }
                })
                if(this.id == `${section.secId}1` ){
                    if( section.backPrice == "-" || section.backPrice == "1,000.00" || section.backPrice == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.layPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<strong>${section.backPrice}</strong> <span class="small"> ${section.backSize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                    }
                }
            })

            $(".bookmaker_red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.runners){
                            let section1 = item.runners.find(item2 => item2.secId == id)
                            if(section1){
                                section = section1
                            }
                        }
                    }
                })
                let parentElement = this.parentNode
                // console.log(parentElement)
                if(this.id == `${section.secId}2` ){
                    if( section.layPrice == "-" || section.layPrice == "1,000.00" || section.layPrice == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        // this.innerHTML = `<strong>${section.backPrice1}</strong> <span class="small"> ${section.backSize1}</span>`
                        this.innerHTML = `<strong>${section.layPrice}</strong> <span class="small"> ${section.laySize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                        // this.innerHTML = `<b>${section.layPrice}</b> <br> ${section.laySize}`
                    }
                }
            })


            $(".only_over_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                if(this.id == `${section.market_id}1` ){
                    if( section.yes == "-" || section.yes == "1,000.00" || section.yes == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        let x = (parseFloat(section.yes_rate) + 100)/100
                        this.innerHTML = `<strong>${x}</strong> <span class="small"> ${section.yes}</span>`
                    }
                }
            });


            $(".only_over_red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                let parentElement = this.parentNode
                // console.log(section.ball_running)
                if(this.id == `${section.market_id}2` ){
                    if(section.ball_running){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Ball Running")
                    }else if(section.suspended){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else if( section.no == "-" || section.no == "1,000.00" || section.no == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        $(this).parent().find(".match-status-message").text("")
                        parentElement.classList.remove("suspended")
                        let x = (parseFloat(section.no_rate) + 100)/100
                        this.innerHTML = `<strong>${x}</strong> <span class="small"> ${section.no}</span>`
                        // this.innerHTML = `<span><b>${section.no}</b></span>` 
                    }
                }
            });

            $(".odd_even_blue").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                if(this.id == `${section.market_id}1` ){
                    if( section.odd == "-" || section.odd == "1,000.00" || section.odd == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.innerHTML = `<strong>${section.odd}</strong>` 
                    }
                }
            })

            $(".odd_even_red").each(function() {
                    
                let id = this.id
                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    if(item){

                        if(item.market_id == id){
                            section = item
                        }
                    }
                })
                let parentElement = this.parentNode
                if(this.id == `${section.market_id}2` ){
                    if(section.ball_running){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else if(section.suspended){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }
                    else if( section.even == "-" || section.even == "1,000.00" || section.even == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.innerHTML = `<strong>${section.even}</strong>` 
                    }
                }
            });

        })


        let id = search.split('=')[1]
            function eventID(){
                socket.emit("eventId", id)
                setTimeout(()=>{
                    eventID()
                }, 500)

            }
            eventID()
            socket.on("eventId", async(data)=>{
                if(data != ""){
                    let score = JSON.parse(data)
                    let element = document.getElementsByClassName("live-score")
                    for(let i = 0; i < element.length; i++){
                        element[i].innerHTML = score[0].data
                    }
                }
            })

            function eventID(){
                let type = 'loop'
                let page = parseInt($('.rowId').attr('data-rowid'))
                socket.emit("BETONEVENT", {id ,type,page, LOGINDATA})
                setTimeout(()=>{
                    eventID()
                }, 5000)

            }
            eventID()

            socket.on('BETONEVENT', async(data) => {
                // console.log(data,'betonevent')
                let html = ``
                for(let i = 0; i < data.data.length; i++){
                    let date = new Date(data.data[i].date)
                    // console.log(data.data[i].bettype2)
                    if(data.data[i].bettype2 === "BACK"){
                        html += '<tr class="back" >'
                    }else{
                        html += '<tr class="lay" >'
                    }
                    html += `
                    <td>${data.data[i].userName}</td>
                    <td class="date-time" >${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>
                    <td>${data.data[i].marketName}</td>
                    <!-- <td>${data.data[i].userName}</td> -->
                    <td>${data.data[i].oddValue}</td>
                    <td>${data.data[i].Stake}</td>
                    <td><div class="btn-group"><button class="btn alert-btn" id="${data.data[i]._id}">Alert</button></div></td>
                </tr>`
                }
                if(data.type == 'loop'){

                    document.getElementById('betTableBody').innerHTML = html
                }else{
                   $('#betTableBody').append(html)

                }

                if(data.data.length == 0){
                    $('#load-more').hide()
                }
            })

            $('#load-more').click(function(e){
                let page = parseInt($('.rowId').attr('data-rowid'))
                let type = 'loadmore'
                $('.rowId').attr('data-rowid',page + 1)
                socket.emit("BETONEVENT", {id ,page,type, LOGINDATA})

            })



            $(document).on("click", ".alert-btn", function(e){
                e.preventDefault()
                socket.emit("alertBet", this.id)
            })

            socket.on("alertBet", async(data) => {
                if(data.status === "error"){
                    alert("Please try again later")
                }else{
                    // console.log(data.bet._id)
                    const deleteButton = document.getElementById(data.bet._id);
                    // console.log(deleteButton)
                    const row = deleteButton.closest('tr'); 
                    if (row) {
                        const table = row.parentNode;
                        const rowIndex = Array.from(table.rows).indexOf(row);
                        row.remove(); 
                        // const rowsToUpdate = Array.from(table.rows).slice(rowIndex);
                        // rowsToUpdate.forEach((row, index) => {
                        //     const srNoCell = row.cells[0]; 
                        //     srNoCell.textContent = index + rowIndex + 1;
                        //   });
                      }
                }
            })

            $(document).ready(function () {
                $('.userBook').click(function () {
                    let id = LOGINDATA.LOGINUSER._id
                    var closestMarket = $(this).parents('.bets-table').find('.market');
                    // console.log(closestMarket)
                    if (closestMarket.length > 0) {
                        var marketId = closestMarket.attr('id');
                        $("#match_odd").attr('data-marketid',marketId)
                        let type = 'userBook'
                        let newData = true
                        socket.emit('UerBook', {marketId, LOGINDATA,id,type,newData})
                    } else {
                        console.log('Market not found.');
                    }
                });
            });

            $(document).ready(function () {
                $('.BookList').click(function () {
                    let id = LOGINDATA.LOGINUSER._id
                    var closestMarket = $(this).parents('.bets-table').find('.market');
                    // console.log(closestMarket)
                    if (closestMarket.length > 0) {
                        var marketId = closestMarket.attr('id');
                        $("#match_odd_Book").attr('data-marketid',marketId)
                        let type = 'bookList'
                        let newData = true
                        socket.emit('UerBook', {marketId, LOGINDATA,id,type,newData})
                    } else {
                        console.log('Market not found.');
                    }
                });
            });

            $('.searchUser').keyup(function(){
                // console.log('working')
                if($(this).hasClass("searchUser")){
                    // console.log($(this).val())
                    if($(this).val().length >= 3 ){
                        let x = $(this).val(); 
                        // console.log(x)
                        socket.emit("SearchACC", {x, LOGINDATA})
                    }else{
                        document.getElementById('search').innerHTML = ``
                        document.getElementById("button").innerHTML = ''
                    }
                }
            })

            socket.on("ACCSEARCHRES", async(data)=>{
                // console.log(data, 565464)
                $('.wrapper').show()
                let html = ``
                if(data.page === 1){
                    for(let i = 0; i < data.user.length; i++){
                        html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                    }
                    document.getElementById('search').innerHTML = html
                    document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
                }else if(data.page === null){
                    document.getElementById("button").innerHTML = ``
                }else{
                    html = document.getElementById('search').innerHTML
                    for(let i = 0; i < data.user.length; i++){
                        html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                    }
                    document.getElementById('search').innerHTML = html
                    document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
                }
            })

            $(document).on("click", ".next", function(e){
                e.preventDefault()
                let page = $(this).attr("id")
                let x = $("#searchUser").val()
                socket.emit("SearchACC", {x, LOGINDATA, page})
            })

            // $('.userBook').click(function () {
                // var closestMarket = $(this).parents('.bets-table').find('.market');
                // if (closestMarket.length > 0) {
                //     var marketId = closestMarket.attr('id');
                //     socket.emit('UerBook', {marketId, LOGINDATA})
                // } else {
                //     console.log('Market not found.');
                // }
            // });
            $(document).on("click", ".searchList", function(){
                // console.log("working")
                // console.log(this.textContent)
                let data = {}
                let marketId = $("#searchUser").attr('data-marketid')
                document.getElementById("searchUser").value = this.textContent
                data.id = this.id
                data.LOGINDATA = LOGINDATA
                data.marketId = marketId
                data.type = 'data1'
                data.newData = false
                $('.wrapper').hide()
                // console.log(data)
                socket.emit('UerBook', data)

             
               
            })

            $(document).on('click','#match_odd .userBookParent',function(e){
                if(!$(this).parent('tr').hasClass('active')){
                    $('#match_odd').find('tr.active').removeClass('active')
                    $(this).parent('tr').addClass('active')
                    $('#match_odd').find('tr.children').remove()
                    let userName = $(this).attr('data-usename')
                    let marketId = $("#match_odd").attr('data-marketid')
                    let type = 'userBook'

                    socket.emit('UerBook1', {marketId,LOGINDATA,userName,type})
                }else{
                    $(this).parent('tr').removeClass('active')
                    $('#match_odd').find('tr.children').remove()

                }

            })
            $(document).on('click','#match_odd_Book .userBookParent',function(e){
                if(!$(this).parent('tr').hasClass('active')){
                    $('#match_odd_Book').find('tr.active').removeClass('active')
                    $(this).parent('tr').addClass('active')
                    $('#match_odd_Book').find('tr.children').remove()
                    let userName = $(this).attr('data-usename')
                    let marketId = $("#match_odd_Book").attr('data-marketid')
                    let type = 'bookList'
                    socket.emit('UerBook1', {marketId,LOGINDATA,userName,type})
                }else{
                    $(this).parent('tr').removeClass('active')
                    $('#match_odd_Book').find('tr.children').remove()

                }

            })

            socket.on('UerBook1',async(data)=>{
                // console.log(data,"==>UserBook1 Response")
                if(data.Bets.length > 0){
                    let html = '';
                    let match = data.Bets[0].selections[0].matchName
                    let team1 = match.split('v')[0]
                    let team2 = match.split('v')[1]
                    for(let i = 0; i < data.Bets.length; i++){
                        let team1data = 0 
                        let team2data = 0
                        // console.log(data.Bets[i].selections[0].selectionName.toLowerCase() , team1.toLowerCase())
                        // console.log(data.Bets[i].selections[0].selectionName.toLowerCase().trim() == team1.toLowerCase().trim())
                        if(data.Bets[i].selections[0].selectionName.toLowerCase().trim() == team1.toLowerCase().trim()){
                            team1data = data.Bets[i].selections[0].totalAmount
                            if(data.Bets[i].selections[1]){
                                team2data = data.Bets[i].selections[1].totalAmount
                            }else{
                                team2data = -data.Bets[i].selections[0].Stake
                            }
                        }else{
                            team2data = data.Bets[i].selections[0].totalAmount
                            if(data.Bets[i].selections[1]){
                                team1data = data.Bets[i].selections[1].totalAmount
                            }else{
                                team1data = -data.Bets[i].selections[0].Stake
                            }
                           
                        }
                        if(data.type == 'bookList'){
                            html += `
                            <tr class="tabelBodyTr children">
                                <td data-usename="${data.Bets[i].userName}">${data.Bets[i].userName}</td>`
                            if(team1data.toFixed(2) > 0){
                                html += `<td class="red"> ${team1data.toFixed(2) * -1}</td>`
                            }else{
                                html += `<td class="green"> ${team1data.toFixed(2) * -1}</td>`
                            }
                            
                            if(team2data.toFixed(2) > 0){
                                html += `<td class="red">${team2data.toFixed(2) * -1}</td></tr>`
                            }else{
                                html += `<td class="green">${team2data.toFixed(2) * -1}</td></tr>`
                            }
                        }else{

                            html += `
                            <tr class="tabelBodyTr children">
                                <td data-usename="${data.Bets[i].userName}">${data.Bets[i].userName}</td>`
                            if(team1data.toFixed(2) > 0){
                                html += `<td class="green"> ${team1data.toFixed(2)}</td>`
                            }else{
                                html += `<td class="red"> ${team1data.toFixed(2) * 1}</td>`
                            }
                            
                            if(team2data.toFixed(2) > 0){
                                html += `<td class="green">${team2data.toFixed(2)}</td></tr>`
                            }else{
                                html += `<td class="red">${team2data.toFixed(2) * 1}</td></tr>`
                            }
                        }
                    }
                    if(data.type == 'bookList'){
                        $('#match_odd_Book').find('tr.active').after(html)
                    }else{
                        $('#match_odd').find('tr.active').after(html)
                    }
                }else{
                  
                }
            })
    
            socket.on('UerBook', async(data) => {
                // console.log(data)
                if(data.Bets.length > 0){
                    let team1 = data.Bets[0].Bets.teamA
                    let team2 = data.Bets[0].Bets.teamB
                    let html = `<tr class="headDetail"><th>User name</th>
                    <th>${team1}</th>
                    <th>${team2}</th></tr>`
                    let sumOfTeamA = 0
                    let sumOfTeamB = 0
                    for(let i = 0; i < data.Bets.length; i++){
                        html += `
                        <tr class="tabelBodyTr userBookParentTr">
                            <td class="userBookParent" data-usename="${data.Bets[i].ele.userName}">${data.Bets[i].ele.userName}</td>`
                            if(data.type == 'bookList'){
                                if(data.Bets[i].Bets.teama.toFixed(2) > 0){
                                html += `<td class="red">${data.Bets[i].Bets.teama.toFixed(2) * -1}</td>`
                            }else{
                                html += `<td class="green">${data.Bets[i].Bets.teama.toFixed(2) * -1}</td>`
                            }
                            
                            if(data.Bets[i].Bets.teamb.toFixed(2) > 0){
                                html += `<td class="red">${data.Bets[i].Bets.teamb.toFixed(2) * -1}</td></tr>`
                            }else{
                                html += `<td class="green">${data.Bets[i].Bets.teamb.toFixed(2) * -1}</td></tr>`
                            }
                        }else{

                            if(data.Bets[i].Bets.teama.toFixed(2) > 0){
                                html += `<td class="green">${data.Bets[i].Bets.teama.toFixed(2)}</td>`
                            }else{
                                html += `<td class="red">${data.Bets[i].Bets.teama.toFixed(2) * 1}</td>`
                            }
                            
                            if(data.Bets[i].Bets.teamb.toFixed(2) > 0){
                                html += `<td class="green">${data.Bets[i].Bets.teamb.toFixed(2)}</td></tr>`
                            }else{
                                html += `<td class="red">${data.Bets[i].Bets.teamb.toFixed(2) * 1}</td></tr>`
                            }
                        }
                        sumOfTeamA += data.Bets[i].Bets.teama
                        sumOfTeamB += data.Bets[i].Bets.teamb
                    }
                    if(data.type == 'bookList'){
                        html += `<tr class="totleCount">
                        <td>Total</td>`
                        if(sumOfTeamA.toFixed(2) > 0){
                            html += `<td class="red"> ${sumOfTeamA.toFixed(2) * -1}</td>`
                        }else{
                            html += `<td class="green">${sumOfTeamA.toFixed(2) * -1}</td>`
                        }
                        
                        if(sumOfTeamB.toFixed(2) > 0){
                            html += `<td class="red">${sumOfTeamB.toFixed(2) * -1}</td></tr>`
                        }else{
                            html += `<td class="green">${sumOfTeamB.toFixed(2) * -1}</td></tr>`
                        }
                    }else{
                        html += `<tr class="totleCount">
                        <td>Total</td>`
                        if(sumOfTeamA.toFixed(2) > 0){
                            html += `<td class="green"> ${sumOfTeamA.toFixed(2)}</td>`
                        }else{
                            html += `<td class="red">${sumOfTeamA.toFixed(2) * 1}</td>`
                        }
                        
                        if(sumOfTeamB.toFixed(2) > 0){
                            html += `<td class="green">${sumOfTeamB.toFixed(2)}</td></tr>`
                        }else{
                            html += `<td class="red">${sumOfTeamB.toFixed(2) * 1}</td></tr>`
                        }
                    }
                 
                //     `<td>${sumOfTeamA.toFixed(2)}</td>
                //     <td>${sumOfTeamB.toFixed(2)}</td>
                // </tr>`
                if(data.type == 'bookList'){
                    document.getElementById('match_odd_Book').innerHTML = html

                }else{
                    document.getElementById('match_odd').innerHTML = html

                }
                }else{
                    if(data.type == 'bookList'){
                        $('#match_odd_Book').html(`<tbody><tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr></tbody>`)
                    }else{
                        $('#match_odd').html(`<tbody><tr class="tabelBodyTr empty_table"><td>There is no bets in this market</td></tr></tbody>`)
                    }
                }
            })


            $(document).on('click', '.Suspend-Resume', function(e){
                e.preventDefault()
                // console.log("WORKING", this.id)
                socket.emit('suspendResume', {id:this.id, LOGINDATA})
            })

            socket.on('suspendResume', async(data) => {
                console.log(data)
                if(data.status){
                    var button = document.getElementsByClassName('Suspend-Resume');
                    button.forEach(item => {
                        item.innerHTML  = 'Suspend'
                    })
                }else{
                    var button = document.getElementsByClassName('Suspend-Resume');
                    // button.innerHTML  = 'Resume'
                    button.forEach(item => {
                        item.innerHTML  = 'Resume'
                    })
                }

            })
    }

    if(pathname == "/admin/matchBets"){

        function getJSONDataFromQueryString(queryString) {
            const urlParams = new URLSearchParams(queryString);
            const jsonData = {};
            for (const [key, value] of urlParams.entries()) {
              jsonData[key] = value;
            }
            return jsonData;
          }
          let jsonData = getJSONDataFromQueryString(search);
        $(document).on('keyup','.searchUser',function(){
            // console.log('working')
            // console.log($(this).val())
            if($(this).val().length >= 3 ){
                let x = $(this).val(); 
                // console.log(x)
                socket.emit("SearchACC", {x, LOGINDATA})
            }else{
                document.getElementById('search').innerHTML = ``
                document.getElementById("button").innerHTML = ''
            }
        })

        $(document).on("click", ".next", function(e){
            e.preventDefault()
            let page = $(this).attr("id")
            let x = $("#searchUser").val()
            socket.emit("SearchACC", {x, LOGINDATA, page})
        })

        socket.on("ACCSEARCHRES", async(data)=>{
            let html = ``
            $('.wrapper').show()

            if(data.page === 1){
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }else if(data.page === null){
                document.getElementById("button").innerHTML = ``
            }else{
                html = document.getElementById('search').innerHTML
                for(let i = 0; i < data.user.length; i++){
                    html += `<li class="searchList" id="${data.user[i]._id}">${data.user[i].userName}</li>`
                }
                document.getElementById('search').innerHTML = html
                document.getElementById("button").innerHTML = `<button id="${data.page}" class="next">Show More</button>`
            }
        })


        let toDate;
        let fromDate;
        let filterData = {}
        filterData.marketId = jsonData.id


        $('#fromDate,#toDate').change(function(){
            console.log("working")
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            $('.rowId').attr('data-rowid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.date = {$gte : fromDate,$lte : new Date(new Date(toDate).getTime() + ((24 * 60*60*1000)-1))}
            }else{

                if(fromDate != '' ){
                    filterData.date = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.date = {$lte : new Date(new Date(toDate).getTime() + ((24 * 60*60*1000)-1))}
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            data.page = 0;
            console.log(data)
            socket.emit('matchBets',data)

        })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData.userName = this.textContent
            $('.rowId').attr('data-rowid','1')
            $('.wrapper').hide()
            socket.emit('matchBets',{filterData,LOGINDATA,page:0})
            
        })


        $('#load-more').click(function(e){
            let page = parseInt($('.rowId').attr('data-rowid'));
            $('.rowId').attr('data-rowid',page + 1)
            let data = {}
            let userName = $('.searchUser').val()
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                filterData.date = {$gte : fromDate,$lte : toDate}
            }else{

                if(fromDate != undefined && fromDate != '' ){
                    filterData.date = {$gte : fromDate}
                }
                if(toDate != undefined && toDate != '' ){
                    filterData.date = {$lte : toDate}
                }
            }

            data.filterData = filterData;
            data.page = page
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('matchBets',data)
        })
      
            
        let count = 11
        socket.on('matchBets',(data) => {
            console.log(data)
            if(data.page === 0){
                count = 1
            }
            let bets = data.ubDetails;
            let html = '';
            for(let i = 0; i < bets.length; i++){
                let date = new Date(bets[i].date)
                html += `<tr style="text-align: center;" >`
                html += `<td>${bets[i].userName}</td>
                <td class="date-time">${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                <td>${bets[i].marketName}</td>
                <td class="text-nowrap">${bets[i].oddValue}</td>
                <td class="text-nowrap">${bets[i].Stake}</td>
                <td>
                    <div class="btn-group">
                    <button class="btn alert" id="${bets[i]._id}">Alert</button>
                    </div>
                </td>

                </tr>`
            }
            
            count += 10;
            if(data.page == 0){
                if(bets.length == 0){
                    $('#load-more').hide()
                }
                if(html == ''){
                    html += `<tr class="empty_table"><td>No record found</td></tr>`
                }
                $('.new-body').html(html)
            }else{
                if(bets.length == 0){
                    $('#load-more').hide()
                }
                $('.new-body').append(html)         
            }
        })

    

    $(document).on("click", ".alert", function(e){
        e.preventDefault()
        if(confirm('do you want to alert this bet')){
            socket.emit("alertBet", this.id)
        }
    })
    socket.on("alertBet", async(data) => {
        if(data.status === "error"){
            alert("Please try again later")
        }else{
            console.log(data.bet._id)
            const deleteButton = document.getElementById(data.bet._id);
            console.log(deleteButton)
            const row = deleteButton.closest('tr'); 
            if (row) {
                const table = row.parentNode;
                const rowIndex = Array.from(table.rows).indexOf(row);
                row.remove(); 
               
            }
        }
    })
    }


    if(pathname == "/profile"){
        $(document).on("click", ".Detail", function(e){
            e.preventDefault()
            let form = $('#user-details-page')
            console.log(form)
        })

        $(document).on('submit', "#user-details-page", function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            let id = LOGINDATA.LOGINUSER._id
            data.id = id
            socket.emit("updateUserDetailssss", data)
            // console.log(data)
        })

        socket.on('updateUserDetailssss', data => {
            if(data.message == "err"){
                togglePopupMain('popup-2', "redPopUP2", "Something went wrong please try again later")
            }else{
                togglePopupMain('popup-1', "redPopUP", "updated!")
                setTimeout(()=>{
                    window.location = '/profile'
                  }, 500)
            }
        })
    }

    if(pathname == "/admin/gameanalysis"){
        $(document).on('change','#Fdate',function(e){
            let from_date = $(this).val()
            let market = $("#market").val()
            let to_date
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let Sport = $("#Event").val()
            let page = 0
            if(Sport != 'All'){
                socket.emit('gameAnalysis',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})
            }
        })

        $(document).on('change','#Tdate',function(e){
            let to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            let market = $("#market").val()
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            let Sport = $("#Event").val()
            let page = 0
            if(Sport != 'All'){
                socket.emit('gameAnalysis',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})
            }        
        })

        $('#Sport').change(function() {
            let Sport = $(this).val()
            console.log(Sport)
            if(['1','2','4'].includes(Sport)){
                socket.emit('getEvetnsOfSport',{sport:Sport})
            }else{
                $('#Event').html(`<option value="All" selected> Select Event </option>`)
            }
        })

        socket.on('getEvetnsOfSport',async(data)=>{
            console.log(data,"getEvetnsOfSport")
            let html =''
            html += `<option value="All" selected> Select Event </option>`
            for(let i = 0;i<data.eventList.length;i++){
                html += `<option value="${data.eventList[i].eventData.eventId}">${data.eventList[i].eventData.name}</option>`
            }
            $('#Event').html(html)
        })

        $('#Event').change(function() {
            console.log("Working")
            let Sport = $(this).val()
            let market = $("#market").val()
            let to_date
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let page = 0
            if(Sport != 'All'){
                socket.emit('gameAnalysis',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})
            }
        })


        $('#market').change(function() {
            // console.log("Working")
            let Sport = $("#Event").val()
            let market = $(this).val()
            let to_date
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let page = 0
            if(Sport != 'All'){
                socket.emit('gameAnalysis',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})
            }
        })
        $('.refresh').click(function() {
            // console.log("Working")
            let Sport = $("#Event").val()
            let market = $('#market').val()
            let to_date
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let page = 0
            if(Sport != 'All'){
                socket.emit('gameAnalysis',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})
            }
        })


        $(document).on('click', ".load-more-football", function(e){
            let page = parseInt($('.rowId').attr('data-rowid'))
            let market = $("#market").val()
            $('.rowId').attr('data-rowid',page + 1)
            let to_date;
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let Sport = $("#Event").val()
            socket.emit('matchOdds',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})
        })
        $(document).on('click', ".load-more-cricket", function(e){
            let page = parseInt($('.rowId2').attr('data-rowid2'))
            let market = $("#market").val()
            $('.rowId2').attr('data-rowid2',page + 1)
            let to_date;
            let from_date
            let own = $('.matchOddOwn').attr('data-parent')
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let Sport = $("#Event").val()
            socket.emit('matchOdds',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market,own})
        })

        $(document).on('click','.matchOdds',function(e){
            let result = $(this).parent().children().eq(8).text()
            $('#FOOTBALL').find('.welcome-info-btn').append(`<div class="skin-data green">
            <h5>Result</h5>
            <h6>${result}</h6>
            </div>`)
            let page = 0
            let market = $("#market").val()
            let to_date;
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let Sport = $("#Event").val()
            socket.emit('matchOdds',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})

        })
        $(document).on('click','.matchOddOwn',function(e){
            let result = $(this).parent().children().eq(8).text()
            $('#Cricket').find('.welcome-info-btn').append(`<div class="skin-data green">
            <h5>Result</h5>
            <h6>${result}</h6>
            </div>`)
            let own = $(this).attr('data-parent')
            let page = 0
            let market = $("#market").val()
            let to_date;
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let Sport = $("#Event").val()
            socket.emit('matchOddsOwn',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market,own})

        })

        $(document).on('click','.matchOddsBack',function(e){
            $(this).removeClass('active')
            let html = ""
            let html2 = ""
            html += ` <thead>
            <tr>
                <th>S.No</th>
                <th>Market</th>
                <th>Total Bets</th>
                <th>Won</th>
                <th>Lost</th>
                <th>Void </th>
                <th>Open </th>
                <th>P/L</th>
                <th>Result</th>
            </tr>
            </thead>
            <tbody class="new-body">
            
            </tbody>`
            html2 += ` <thead>
            <tr >
              <th>S.No</th>
              <th>White Label</th>
              <th>Active Users</th>
              <th>Total Bets</th>
              <th>Won</th>
              <th>Lost</th>
              <th>Void </th>
              <th>Open </th>
              <th>P/L</th>
            </tr>
            </thead>
            <tbody class="new-body">
            
            </tbody>`
            $('#FOOTBALL').find('table').html(html)
            $('#Cricket').find('table').html(html2)
            let page =0
            let market = $("#market").val()
            let to_date;
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let Sport = $("#Event").val()
            socket.emit('gameAnalysis',{from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})
        })

        $(document).on('click','.childgameAnalist',function(e){

            let roleType = $(this).attr('data-roleType')
            let parent = $(this).attr('data-parent')
            let page = 0
            let market = $("#market").val()
            let to_date;
            let from_date
            if($('#Fdate').val() != ''){
                from_date = $('#Fdate').val()
            }
            if($('#Tdate').val() != ''){
                to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            }
            let Sport = $("#Event").val()
            console.log(roleType,parent,from_date,to_date,page, Sport, market)
            socket.emit('childGameAnalist',{roleType,parent,from_date,to_date,USER:LOGINDATA.LOGINUSER,page, Sport, market})
        })

        let limit;

        socket.on('matchOddsOwn',async(data)=>{
            console.log(data)
            let html = ""            
            limit = 10 * data.page
            if(data.matchOdds.length !== 0){
                if(data.page == 0){
                    html += `
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Bet Placed Date</th>
                            <th>Bet On</th>
                            <th>Odds</th>
                            <th>Amount </th>
                            <th>P/L </th>
                            <th>Status</th>
                            <th>Ip Address</th>
                        </tr>
                    </thead><tbody>`
                }

                for(let i = 0;i<data.matchOdds.length;i++){
                    let date = new Date(data.matchOdds[i].date)
                    html += `<tr>
                    <td>${i + 1 + limit}</td>
                    <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear() + " "+ date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>
                    <td>${data.matchOdds[i].selectionName}</td>
                    <td>${data.matchOdds[i].oddValue}</td>`
                    html += `<td>${data.matchOdds[i].returns}</td>`
                    html += `<td>${data.matchOdds[i].returns}</td>`
                    html += `
                    <td>${data.matchOdds[i].status}</td>`
                    if(data.matchOdds[i].ip){

                        html += `<td>${data.matchOdds[i].ip}</td>`
                    }else{
                        html += `<td>-</td>`
                    }
                    html += `</tr>`
                }
                if(data.page == 0){
                    html += `</tbody>`
                    if(!(data.matchOdds.length < 10)){
                        document.getElementById('load-more').innerHTML = `<button class="load-more">Load More</button>`
                    }
                    if(data.matchOdds.length == 0){
                        html += `<tr class="empty_table"><td>No record found</td></tr>`
                    }
                    $('#Cricket').find('table').html(html)
                    if(data.matchOdds.length == 10){
                        $('#Cricket').find('#load-more-cricket').show()
                    }
                }else{
                    $('#Cricket').find('table').append(html)
                    if(data.matchOdds.length <= 10){
                        $('#Cricket').find('#load-more-cricket').hide()
                    }
                }


            }else{
                if(data.page > 0){
                    if(data.matchOdds.length <= 10){
                        $('#Cricket').find('#load-more-cricket').hide()
                    }
                }
            }
        })

        socket.on('childGameAnalist',async(data)=>{
            console.log(data)
            let html = ""
            let html2 = ""
            let html3 = ""
            let tb = 0;
            let w = 0;
            let l = 0;
            let v = 0;
            let o = 0;
            let pl = 0;
            limit = 10 * data.page
            if(data.page == 0){
                if(data.type == 'user'){

                    html += `<thead>
                    <tr >
                      <th>S.No</th>
                      <th>User Name</th>
                      <th>Total Bets</th>
                      <th>Won</th>
                      <th>Lost</th>
                      <th>Void </th>
                      <th>Open </th>
                      <th>P/L</th>
                    </tr>
                </thead><tbody class="new-body">`
                }else{
                    html += `<thead>
                    <tr >
                      <th>S.No</th>
                      <th>Market</th>
                      <th>Total Bets</th>
                      <th>Won</th>
                      <th>Lost</th>
                      <th>Void </th>
                      <th>Open </th>
                      <th>P/L</th>
                      <th>Result</th>
                    </tr>
                </thead><tbody class="new-body">`
                }
            }
            $('#Cricket').find('.dashboard-welcome-section').html('')
            for(let i = 0; i < data.result.length; i++){
                if(data.result[i].betDetails){
                    tb += data.result[i].betDetails.betcount
                    w += data.result[i].betDetails.won
                    l += data.result[i].betDetails.loss
                    v += data.result[i].betDetails.void
                    o += data.result[i].betDetails.open
                    pl += data.result[i].betDetails.returns
             
                    html += `<tr>
                    <td>${i + 1 + limit}</td>`
                    if(data.type == 'user'){
                        html += `<td class="childgameAnalist cursor-pointer" data-roleType="${data.result[i].ele.role_type}" data-parent="${data.result[i].ele.userName}">${data.result[i].ele.userName}</td>`
                    }else{
                        html += `<td class="matchOddOwn cursor-pointer" data-roleType="${data.result[i].ele.role_type}" data-parent="${data.result[i].ele.userName}">${data.result[i].betDetails.marketName}</td>`
                    }
                    html += `<td>${data.result[i].betDetails.betcount}</td>
                    <td> ${data.result[i].betDetails.won} </td>
                    <td>${data.result[i].betDetails.loss}</td>
                    <td>${data.result[i].betDetails.void}</td>
                    <td>${data.result[i].betDetails.open}</td>`
                    if(data.result[i].betDetails.returns > 0){
                        html += `<td class="green">+${data.result[i].betDetails.returns.toFixed(2)}</td>`
                    }else{
                        html += `<td class="red">${data.result[i].betDetails.returns.toFixed(2)}</td>`
                    }

                    if(data.type != 'user'){
                        html += `<td>-</td>`
                    }
                    html += `</tr>`
                }
            } 
        
            if(data.page == 0){
                html += `</tbody>`
                if(!(data.result.length < 10)){
                    document.getElementById('load-more').innerHTML = `<button class="load-more">Load More</button>`
                }
                if(data.result.length == 0){
                    html += `<tr class="empty_table"><td>No record found</td></tr>`
                }
                html2 = `<ul>`
                for(let i = 0;i<data.breadcum.length;i++){
                    if(i == 0){
                        html2 += `<li class="childgameAnalist" data-roleType="1" data-parent="${data.breadcum[i]}">${data.breadcum[i]}</li>`
                    }
                    else if(i == 1){
                        html2 += `<li class="childgameAnalist" data-roleType="2" data-parent="${data.breadcum[i]}">${data.breadcum[i]}</li>`
                    }
                    else if(i == 2){
                        html2 += `<li class="childgameAnalist" data-roleType="5" data-parent="${data.breadcum[i]}">${data.breadcum[i]}</li>`
                    }
                }
                html2 += `</ul>`

                if(tb > 0){
                    html3 += ` <div class="skin-data green">
                            <h5>Total Bets</h5>
                            <h6>${tb}</h6>
                            </div>`
                }else{
                    html3 += ` <div class="skin-data red">
                            <h5>Total Bets</h5>
                            <h6>${tb}</h6>
                            </div>`
                }
               
                if(w > 0){

                    html3 += `<div class="skin-data green">
                        <h5>Won</h5>
                        <h6>${w}</h6>
                    </div>`
                }else{
                    html3 = `<div class="skin-data red">
                        <h5>Won</h5>
                        <h6>${w}</h6>
                        </div>`

                }

                if(l > 0){

                    html3 += `<div class="skin-data green">
                        <h5>Lost</h5>
                        <h6>${l}</h6>
                        </div>`
                }else{
                    html3 += `<div class="skin-data red">
                        <h5>Lost</h5>
                        <h6>${l}</h6>
                        </div>`

                }

                if(v > 0){
                    
                    html3 += `<div class="skin-data green">
                        <h5>Void</h5>
                        <h6>${v}</h6>
                    </div>`
                }else{
                    html3 += `<div class="skin-data red">
                        <h5>Void</h5>
                        <h6>${v}</h6>
                    </div>`

                }
                
                if(o > 0){

                    html3 += `<div class="skin-data green">
                        <h5>Open</h5>
                        <h6>${o}</h6>
                    </div>`
                }else{
                    html3 += `<div class="skin-data red">
                        <h5>Open</h5>
                        <h6>${o}</h6>
                    </div>`

                }

                if(pl > 0){

                    html3 += `<div class="skin-data green">
                        <h5>P&L</h5>
                        <h6>${pl.toFixed(2)}</h6>
                    </div></div>`
                }else{
                    html3 += `<div class="skin-data red">
                        <h5>P&L</h5>
                        <h6>${pl.toFixed(2)}</h6>
                    </div></div>`

                }

                html3 = '<div class="welcome-info-btn">' + html3


              $('#Cricket').find('table').html(html)
              $('#Cricket').find('.bredcum-container').html(html2)
                $('#Cricket').find('.dashboard-welcome-section').html(html3)

            }else{
                $('#Cricket').find('tbody').append(html)
               
                if((data.gameAnalist.length < 10)){
                    document.getElementById('load-more').innerHTML = ""
                }
                
            }
        })



        socket.on('matchOdds',async(data)=>{
            console.log(data)
            let html = ""
            limit = 10 * data.page
            if(data.matchOdds.length !== 0){
                if(data.page == 0){
                    html += `
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Bet Placed Date</th>
                            <th>User</th>
                            <th>Bet ON</th>
                            <th>Odds</th>
                            <th>Amount </th>
                            <th>P/L </th>
                            <th>Status</th>
                            <th>Ip Address</th>
                        </tr>
                    </thead><tbody>`
                }

                for(let i = 0;i<data.matchOdds.length;i++){
                    let date = new Date(data.matchOdds[i].date)
                    html += `<tr>
                    <td>${i + 1 + limit}</td>
                    <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear() + " "+ date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>
                    <td>${data.matchOdds[i].userName}</td>
                    <td>${data.matchOdds[i].selectionName}</td>
                    <td>${data.matchOdds[i].oddValue}</td>`
                    html += `<td>${data.matchOdds[i].returns}</td>`
                    html += `<td>${data.matchOdds[i].returns}</td>`
                    html += `
                    <td>${data.matchOdds[i].status}</td>`
                    if(data.matchOdds[i].ip){

                        html += `<td>${data.matchOdds[i].ip}</td>`
                    }else{
                        html += `<td>-</td>`
                    }
                    html += `</tr>`
                }
                $('.matchOddsBack').addClass('active')
                $('.matchOddsBack').html('<i class="fa-solid fa-angle-left"></i> Match Odds')
                if(data.page == 0){
                    html += `</tbody>`
                    if(data.matchOdds.length == 10){
                        $('#FOOTBALL').find('#load-more-football').show()
                    }
                    $('#FOOTBALL').find('table').html(html)
                }else{
                    $('#FOOTBALL').find('tbody').append(html)
                    if(data.matchOdds.length <= 10){
                        $('#FOOTBALL').find('#load-more-football').hide()
                    }
                }


            }else{
                if(data.page > 0){
                    if(data.matchOdds.length <= 10){
                        $('#FOOTBALL').find('#load-more-football').hide()
                    }
                }
            }
        })



        socket.on("gameAnalysis", data => {
            console.log(data)
            if($('#FOOTBALL').find('.matchOddsBack')){
                $('#FOOTBALL').find('.matchOddsBack').html('')
            }
            if($('#Cricket').find('.bredcum-container')){
                $('#Cricket').find('.bredcum-container').html('')
            }
            $('.welcome-info-btn').remove()
            $('.matchOddsBack').removeClass('active')

            let html = ""
            let html2 = ""
            let html3 = ""
            let tb = 0;
            let w = 0;
            let l = 0;
            let v = 0;
            let o = 0;
            let pl = 0;
            limit = 10 * data.page
            for(let i = 0; i < data.gameAnalist.length; i++){
                tb += data.gameAnalist[i].betcount
                w += data.gameAnalist[i].won
                l += data.gameAnalist[i].loss
                v += data.gameAnalist[i].void
                o += data.gameAnalist[i].open
                pl += data.gameAnalist[i].returns
                html += `<tr>
                <td>${i + 1 + limit}</td>
                <td class="childgameAnalist cursor-pointer" data-roleType="1" data-parent="${data.gameAnalist[i]._id}">${data.gameAnalist[i]._id}</td>
                <td>${data.gameAnalist[i].Total_User}</td>
                <td>${data.gameAnalist[i].betcount}</td>
                <td> ${data.gameAnalist[i].won} </td>
                <td>${data.gameAnalist[i].loss}</td>
                <td>${data.gameAnalist[i].void}</td>
                <td>${data.gameAnalist[i].open}</td>`
                if(data.gameAnalist[i].returns > 0){
                    html += `<td class="green">+${data.gameAnalist[i].returns.toFixed(2)}</td></tr>`
                }else{
                    html += `<td class="red">${data.gameAnalist[i].returns.toFixed(2)}</td></tr>`
                }
            } 
            for(let i = 0; i < data.marketAnalist.length; i++){
                html2 += `<tr>
                <td>${i + 1 + limit}</td>
                <td class="matchOdds cursor-pointer">${data.marketAnalist[i]._id}</td>
                <td>${data.marketAnalist[i].betcount}</td>
                <td> ${data.marketAnalist[i].won} </td>
                <td>${data.marketAnalist[i].loss}</td>
                <td>${data.marketAnalist[i].void}</td>
                <td>${data.marketAnalist[i].open}</td>`
                if(data.marketAnalist[i].returns > 0){
                    html2 += `<td class="green">+${data.marketAnalist[i].returns.toFixed(2)}</td>`
                }else{
                    html2 += `<td class="red">${data.marketAnalist[i].returns.toFixed(2)}</td>`
                }
                html2 += `<td>-</td></tr>`
            } 
            if(data.page == 0){
                if(!(data.gameAnalist.length < 10)){
                    document.getElementById('load-more').innerHTML = `<button class="load-more">Load More</button>`
                }
                if(data.gameAnalist.length == 0){
                    html += `<tr class="empty_table"><td>No record found</td></tr>`
                }
                if(!(data.marketAnalist.length < 10)){
                    document.getElementById('load-more').innerHTML = `<button class="load-more">Load More</button>`
                }
                if(data.marketAnalist.length == 0){
                    html2 += `<tr class="empty_table"><td>No record found</td></tr>`
                }

                if(tb > 0){
                    html3 += ` <div class="skin-data green">
                            <h5>Total Bets</h5>
                            <h6>${tb}</h6>
                            </div>`
                }else{
                    html3 += ` <div class="skin-data red">
                            <h5>Total Bets</h5>
                            <h6>${tb}</h6>
                            </div>`
                }
               
                if(w > 0){

                    html3 += `<div class="skin-data green">
                        <h5>Won</h5>
                        <h6>${w}</h6>
                    </div>`
                }else{
                    html3 = `<div class="skin-data red">
                        <h5>Won</h5>
                        <h6>${w}</h6>
                        </div>`

                }

                if(l > 0){

                    html3 += `<div class="skin-data green">
                        <h5>Lost</h5>
                        <h6>${l}</h6>
                        </div>`
                }else{
                    html3 += `<div class="skin-data red">
                        <h5>Lost</h5>
                        <h6>${l}</h6>
                        </div>`

                }

                if(v > 0){
                    
                    html3 += `<div class="skin-data green">
                        <h5>Void</h5>
                        <h6>${v}</h6>
                    </div>`
                }else{
                    html3 += `<div class="skin-data red">
                        <h5>Void</h5>
                        <h6>${v}</h6>
                    </div>`

                }
                
                if(o > 0){

                    html3 += `<div class="skin-data green">
                        <h5>Open</h5>
                        <h6>${o}</h6>
                    </div>`
                }else{
                    html3 += `<div class="skin-data red">
                        <h5>Open</h5>
                        <h6>${o}</h6>
                    </div>`

                }

                if(pl > 0){

                    html3 += `<div class="skin-data green">
                        <h5>P&L</h5>
                        <h6>${pl.toFixed(2)}</h6>
                    </div></div>`
                }else{
                    html3 += `<div class="skin-data red">
                        <h5>P&L</h5>
                        <h6>${pl.toFixed(2)}</h6>
                    </div></div>`

                }

                html3 = '<div class="welcome-info-btn">' + html3

                if(data.gameAnalist.length > 0){

                    $('#Cricket').find('.dashboard-welcome-section').html(html3)
                }
                if(data.marketAnalist.length > 0){

                    $('#FOOTBALL').find('.dashboard-welcome-section').html(html3)
                }
                $('#Cricket').find('tbody').html(html)
                $('#FOOTBALL').find('tbody').html(html2)

            }else{
                $('#Cricket').find('tbody').append(html)
                $('#FOOTBALL').find('tbody').append(html2)
                if((data.gameAnalist.length < 10)){
                    document.getElementById('load-more').innerHTML = ""
                }
                if((data.marketAnalist.length < 10)){
                    document.getElementById('load-more').innerHTML = ""
                }
            }
        })


    }


    if(pathname == "/admin/betlimit"){
        $('.searchEvents').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchEvents")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    let type = 'All'
                    socket.emit("searchEvents", {x,type,LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                }
            }
        })

        socket.on("searchEvents", async(data)=>{
            // console.log(data, 565464)
            $('.wrapper').show()
            let html = ``
            for(let i = 0; i < data.sportList.length; i++){
                html += `<li class="searchList" id="${data.sportList[i].eventData.id}"><a href="/admin/betlimit/sports/match?match=${data.sportList[i].eventData.name}">${data.sportList[i].eventData.name}</a></li>`

            }
            document.getElementById('search').innerHTML = html
        })

    }
    if(pathname == "/admin/betlimit/sport"){
        $('.searchEvents').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchEvents")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    let type = 'All'
                    socket.emit("searchEvents", {x,type,LOGINDATA})
                }else{
                    document.getElementById('search').innerHTML = ``
                }
            }
        })

        socket.on("searchEvents", async(data)=>{
            console.log(data, 565464)
            $('.wrapper').show()
            let html = ``
            for(let i = 0; i < data.sportList.length; i++){
                html += `<li class="searchList" id="${data.sportList[i].eventData.id}"><a href="/admin/betlimit/sports/match?match=${data.sportList[i].eventData.name}">${data.sportList[i].eventData.name}</a></li>`

            }
            document.getElementById('search').innerHTML = html
        })

    }
    if(pathname.startsWith("/admin/betlimit/sports")){
        console.log(search,"==>Search")
        $('.searchEvents').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchEvents")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    let type = 'sportEvent'
                    let eventSearch = search.split("=")[1]
                    socket.emit("searchEvents", {x,type,LOGINDATA,search:eventSearch})
                }else{
                    document.getElementById('search').innerHTML = ``
                }
            }
        })

        socket.on("searchEvents", async(data)=>{
            console.log(data, 565464)
            $('.wrapper').show()
            let html = ``
            for(let i = 0; i < data.sportList.length; i++){
                html += `<li class="searchList" id="${data.sportList[i].eventData.id}"><a href="/admin/betlimit/sports/match?match=${data.sportList[i].eventData.name}">${data.sportList[i].eventData.name}</a></li>`

            }
            document.getElementById('search').innerHTML = html
        })
    }
    if(pathname.startsWith("/admin/betlimit/sports/event")){
        // console.log(search,"==>Search")
        $('.searchEvents').keyup(function(){
            // console.log('working')
            if($(this).hasClass("searchEvents")){
                // console.log($(this).val())
                if($(this).val().length >= 3 ){
                    let x = $(this).val(); 
                    // console.log(x)
                    let type = 'seriesEvent'
                    let eventSearch = search.split("=")[1]
                    socket.emit("searchEvents", {x,type,LOGINDATA,search:eventSearch})
                }else{
                    document.getElementById('search').innerHTML = ``
                }
            }
        })

        socket.on("searchEvents", async(data)=>{
            // console.log(data, 565464)
            $('.wrapper').show()
            let html = ``
            for(let i = 0; i < data.sportList.length; i++){
                html += `<li class="searchList" id="${data.sportList[i].eventData.id}"><a href="/admin/betlimit/sports/match?match=${data.sportList[i].eventData.name}">${data.sportList[i].eventData.name}</a></li>`

            }
            document.getElementById('search').innerHTML = html
        })


        $(document).on('click', ".event-notification", function(e){
            e.preventDefault()
            // console.log(this.id, "innerTextinnerTextinnerText")
            socket.emit('eventNotification', {id:this.id})
        })


        socket.on('eventNotification', data => {
            if(data.status === "noFound"){
                let form = $('#myModaNotification').find('.add-event-notification')
                form.attr('id', data.id)
                form.find('input[name = "status"]').closest('div').addClass('hide')
                // form.find('input[name = "status"]').
                form.find('input[name = "message"]').val("")
            }else{
                console.log(data.eventNotificationSetting, 454545545454545)
                let form = $('#myModaNotification').find('.add-event-notification')
                form.attr('id', data.id)
                form.find('input[name = "status"]').closest('div').removeClass('hide')
                if(data.eventNotificationSetting.status){
                    form.find('input[name = "status"]').prop('checked', true);
                }else{
                    console.log("WORKNIG")
                    form.find('input[name = "status"]').prop('checked', false);
                }
                form.find('input[name = "message"]').val(data.eventNotificationSetting.message)
            }
        })


        $(document).on('submit', '.add-event-notification', function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            let id = $(this).attr('id');
            data.id = id
            // console.log(data)
            if(data.status){
                if(data.status === 'on'){
                    data.status = true
                }else{
                    data.status = false
                }
            }else{
                data.status = false
            }
            socket.emit('eventNotification2', data)
        })


        socket.on('eventNotification2', data => {
            if(data.status === "err"){
                alert('Please try again later')
            }else{
                alert('Notification Updated successfully!!!')
            }
        })
    }
    if(pathname == "/admin/betlimit/sports/match"){

    
        $(document).on('click','.updateBetLimitMATCH',function(e){
            let firstTd = $(this).closest("tr").find("td:first");
            var innerText = firstTd.text();
            let id = firstTd.attr('id');
            console.log(innerText, id)
            socket.emit("updateBetLimitMATCH", {innerText, id})
         })

   

         socket.on('updateBetLimitMATCH', data =>{
             if(data.status == "notFound"){
                // console.log('working')
            let form = $('#myModal2').find('.form-data')
            form.find('input[name = "min_stake"]').val(0)
            form.find('input[name = "max_stake"]').val(0)
            form.find('input[name = "max_profit"]').val(0)
            form.find('input[name = "max_odd"]').val(0)
            form.find('input[name = "delay"]').val(0)
            form.find('input[name = "type"]').val(data.data)
            form.attr('id', data.id)
            }else if (data.status == "errr"){
                alert('please try again leter')
            }else{
                let form = $('#myModal2').find('.form-data')
                // console.log(data.marketData)
                form.find('input[name = "min_stake"]').val(data.marketData.min_stake)
                form.find('input[name = "max_stake"]').val(data.marketData.max_stake)
                form.find('input[name = "max_profit"]').val(data.marketData.max_profit)
                form.find('input[name = "max_odd"]').val(data.marketData.max_odd)
                form.find('input[name = "delay"]').val(data.marketData.delay)
                form.find('input[name = "type"]').val(data.data)
                form.attr('id', data.id)
            }
         })


         $(document).on('submit', '.form-betLimitMatch', function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            let id = $(this).attr('id');
            data.type = id
            // console.log(id)
            // console.log(data)
            // data.id = id
            socket.emit('UpdateBetLimit', {data, LOGINDATA})
         })

         socket.on('updateBetLimitMarket', data => {
            if(data.status == "err"){
                alert('please try again leter')
            }else{
                alert('updated!')
                window.location.reload()
            }
         })



    }

    if(pathname == '/admin/streammanagement' || pathname.startsWith('/admin/streammanagement/event')){
        $('.game-analysis-heading-from').submit(function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            data.sportName = $('.sportId option:selected').text().trim()
            data.eventName = $('.eventId option:selected').text().trim()
            data.date = new Date()
            socket.emit('addnewStream',data)


        })

        socket.on('addnewStream',async(data)=>{
            if(data.status == 'success'){
                alert(data.msg)
                window.location.reload(true)

            }
        })
        

        $('.sportId').change(function() {
            let Sport = $(this).val()
            console.log(Sport)
            socket.emit('getEvetnsOfSport',{sport:Sport})
        })

        socket.on('getEvetnsOfSport',async(data)=>{
            console.log(data)
            let html =''
            for(let i = 0;i<data.eventList.length;i++){
                html += `<option value="${data.eventList[i].eventData.eventId}">${data.eventList[i].eventData.name}</option>`
            }
            $('.eventId').html(html)
        })

        $(document).on('click','.delete',function(e){
            let id = $(this).closest('tr').attr('data-id')
            let rowId = $(this).closest('tr').attr('id')
            $('.rowId').attr('data-rowid',rowId)
            if(confirm('do you want to delete this stream')){
                socket.emit('delteStreame',id)
            }
        })

        socket.on('delteStreame',async(data)=>{
            if(data.status == 'success'){
                alert('stream deleted successfully')
                window.location.reload(true)
            }
        })

        $(document).on('click','.editStrem',function(e){
            let data = JSON.parse($(this).closest('tr').attr('data-id'))
            let form = $('.editStreamForm');
            form.find('input[name="url"]').val(data.url)
            form.find('input[name="eventId"]').val((data.eventId).toString())
            form.find('input[name="sportId"]').val(data.sportId)
            form.find('input[name="eventName"]').val(data.eventName)
            form.find('input[name="sportName"]').val(data.sportName)
            if(data.status == true){
                form.find('input[name = "status"]').prop('checked', true);
                form.find('input[name = "status"]').parent('.switch').addClass('on');
            }else{
                form.find('input[name = "status"]').prop('checked', false);
                form.find('input[name = "status"]').parent('.switch').removeClass('on');
            }

        })

        $(document).on('submit','.editStreamForm',function(e){
            e.preventDefault()
            let form = $(this)[0];
            let fd = new FormData(form);
            let data = Object.fromEntries(fd.entries());
            if(data.status){
                data.status = true
            }else{
                data.status = false
            }
            data.date = new Date()
            console.log(data)
            socket.emit('editStream',data)
        })

        socket.on('editStream',async(data) =>{
            console.log(data)
            if(data.status == 'success'){
                alert('stream updated successfully')
                location.reload(true)
            }
        })
    }

})
})