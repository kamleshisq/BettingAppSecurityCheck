




const socket = io();
socket.on('disconnect', () => {
    console.log("WebSocket Disconnected");
    // Refresh the page when the WebSocket connection is lost
    
    window.location.reload();
});
let c = 0
socket.on('connect', () => {
    console.log("websocket Connected")
    let LOGINDATA = {}
    socket.on('loginUser',(data) => {
        console.log('WORKING45654', data)
        LOGINDATA.LOGINUSER = data.loginData.User
        LOGINDATA.LOGINTOKEN = data.loginData.Token
        // if(LOGINDATA.LOGINUSER == "" && c == 0){
        //     window.location.reload();
        //     c++
        // }
        const {
            host, hostname, href, origin, pathname, port, protocol, search
          } = window.location
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





   $(document).on('submit', ".change-pass-model-form", function(e){
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
                    if(data.betLimits[0].max_odd < foundItem.odds[0].layPrice1){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data ">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                    }else if (foundItem.odds[0].layPrice1 == "-"){
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
                if(data.betLimits[0].max_odd < foundItem.odds[0].backPrice1){
                    this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                }else if (foundItem.odds[0].backPrice1 == "-"){
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
                    if(data.betLimits[0].max_odd < foundItem.odds[1].layPrice1){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                    }else if (foundItem.odds[1].layPrice1 == "-"){
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
                if(data.betLimits[0].max_odd < foundItem.odds[1].backPrice1){
                    this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                }else if (foundItem.odds[1].backPrice1 == "-"){
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
                    if(data.betLimits[0].max_odd < foundItem.odds[2].backPrice1){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                    }else if (foundItem.odds[2].backPrice1 == "-"){
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
                if(data.betLimits[0].max_odd < foundItem.odds[2].layPrice1){
                    this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                                    <i class="fa-solid fa-lock"></i>
                                  </span>`
                }else if (foundItem.odds[2].layPrice1 == "-"){
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







    //..................FOR user management page...........//




    // console.log(window.location.href)

    if(pathname.startsWith('/admin/userManagement')){
        console.log(LOGINDATA, 45654654)
        function getOwnChild(id,page,token) {
            socket.emit(token,{
                id,
                page
            })
        
        }

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
            let type = form.find('select[name = "type"]').val()
            if(type == "deposit"){
                form.find('input[name = "toUser"]').attr('value',userData.userName)
                form.find('input[name = "fuBalance"]').attr('value',me.availableBalance)
                form.find('input[name = "tuBalance"]').attr('value',userData.availableBalance)
                form.find('input[name = "clintPL"]').attr('value',userData.clientPL)
                form.find('input[name = "fromUser"]').attr('value',me.userName)
                form.attr('id', userData._id);
            }else{
                form.find('input[name = "toUser"]').attr('value',me.userName)
                form.find('input[name = "fuBalance"]').attr('value',userData.availableBalance)
                form.find('input[name = "tuBalance"]').attr('value',me.availableBalance)
                form.find('input[name = "clintPL"]').attr('value',me.clientPL)
                form.find('input[name = "fromUser"]').attr('value',userData.userName)
                form.attr('id', userData._id);
            }
            }
        })


        $(document).on("change", ".DepositW", function(e){
            e.preventDefault()
            let type = $(this).val()
            var row = this.closest('form');
            // console.log(row.id)
            var dataId = row.id;
            // console.log(dataId)
            socket.emit("DepositW", {dataId, type})
        })

        socket.on("DepositW", async(data) => {
            let modleName = "#myModal"
            let form = $(modleName).find('.form-data')
            let userData = data.user
            let me = data.parent
            if(data.type == "withdrawl"){
                form.find('input[name = "toUser"]').attr('value',me.userName)
                form.find('input[name = "fuBalance"]').attr('value',userData.availableBalance)
                form.find('input[name = "tuBalance"]').attr('value',me.availableBalance)
                form.find('input[name = "clintPL"]').attr('value',me.clientPL)
                form.find('input[name = "fromUser"]').attr('value',userData.userName)
                form.attr('id', userData._id); 
            }else{
                form.find('input[name = "toUser"]').attr('value',userData.userName)
                form.find('input[name = "fuBalance"]').attr('value',me.availableBalance)
                form.find('input[name = "tuBalance"]').attr('value',userData.availableBalance)
                form.find('input[name = "clintPL"]').attr('value',userData.clientPL)
                form.find('input[name = "fromUser"]').attr('value',me.userName)
                form.attr('id', userData._id);                 
            }
        })


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
                if(data.page == 0){
                    count = 1;
                    let html1 = ""
                    if(LOGINDATA.LOGINUSER.roleName == "admin"){
                        html1 = `<thead><tr>`+
                        "<th>S.No</th>"+
                        "<th>User Name</th>"+
                        "<th>White lable</th>"+
                        "<th>Type</th>"+
                        "<th>Credit Reference</th>"+
                        "<th>Available Balance</th>"+
                        "<th>Downlevel Balance</th>"+
                        "<th>My P/L</th>"+
                        "<th>Upline P/L</th>"+
                        "<th>Exposure Limit</th>"+
                        "<th>Exposure</th>"+
                        "<th>Action</th>"+
                    "</tr></thead>"
                    }else{
                        html1 = `<thead><tr>`+
                        "<th>S.No</th>"+
                        "<th>User Name</th>"+
                        "<th>Type</th>"+
                        "<th>Credit Reference</th>"+
                        "<th>Available Balance</th>"+
                        "<th>Downlevel Balance</th>"+
                        "<th>My P/L</th>"+
                        "<th>Upline P/L</th>"+
                        "<th>Exposure Limit</th>"+
                        "<th>Exposure</th>"+
                        "<th>Action</th>"+
                    "</tr></thead>"
                    }
                        $('table').html(html1)
                }
                
            let html ="<tbody class='new-body'>";
            for(let i = 0; i < response.length; i++){ 
                if((i+1) % 2 != 0){

                    html +=
                    `<tr  class="trtable" id="${count + i}" data-id="${response[i]._id}">`
                }else{
                    html +=
                    `<tr class="trtable" id="${count + i}" data-id="${response[i]._id}">` 
                }
                    
                html += `<td> ${count + i} </td>
                    <td class="getOwnChild" data-bs-dismiss='${JSON.stringify(response[i])}'>`
                    if(response[i].roleName != 'user'){
                        html+= `<a href='/admin/userManagement?id=${response[i]._id}'>${response[i].userName}</a>`
                    }else{
                        html+= `${response[i].userName}`
                    }

                    html += `</td>`
                    if(data.currentUser.roleName == "admin"){
                        html += `<td> ${response[i].whiteLabel}</td>`
                    }else{

                    }
                    html += `
                    <td>  <span class="role-type">
                            ${response[i].roleName}
                        </span>
                        </td>
                    <td> ${response[i].balance}</td>
                    <td> ${response[i].availableBalance}</td>
                    <td> ${response[i].downlineBalance}</td>
                    <td> ${response[i].myPL}</td>
                    <td> ${response[i].uplinePL}</td>
                    <td> ${response[i].exposureLimit}</td>
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
                        if(data.currentUser.role.authorization.includes('betLockAndUnloack')){
                            if(response[i].betLock){
                                html += `<button type="button" class="betLockStatus Locked" title="Bet Unlock">B</button>`
                            }else{ 
                                html += `<button type="button" class="betLockStatus" title="Bet Lock">B</button>`
                            } 
                        }
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
            html += `</tbody>`
            count += 10;
            $('table').append(html)
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
        $(document).on('change keyup','#searchUser, #ROLEselect, #WhiteLabel',function(e){
            // console.log($(this).hasClass("searchUser"), 123)
            if($(this).hasClass("WhiteLabel")){
                    filterData.whiteLabel = $(this).val()
                    if(filterData.whiteLabel != "" && filterData.whiteLabel != undefined){
                        W = true
                    }else{
                        W = false
                        delete filterData.whiteLabel 
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
               $('.pageLink').attr('data-page',1)
               let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;
               socket.emit("search", {filterData,page,id, LOGINDATA })
        // }
    })

    $(window).scroll(function() {
        if($(document).height()-$(window).scrollTop() == window.innerHeight){
            // console.log(W,S,R)
            let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;

            let page = parseInt($('.pageLink').attr('data-page'));
        //  console.log(page)


            $('.pageLink').attr('data-page',page + 1)
            if(W || S || R){
                    
                    
                // let page = parseInt($('.pageLink').attr('data-page'));
                // $('.pageLink').attr('data-page',page + 1)
                // console.log(W, S, R)
                socket.emit("search", {filterData,page,id, LOGINDATA })
            }else{
                getOwnChild(id,page ,'getOwnChild')
            }
        }
     }); 
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




    if(pathname == "/admin/useracount"){


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
                    if(data.parent_id.userName == data.user_id.userName){
                        html += `<td>${data.child_id.userName}/${data.parent_id.userName}</td>`
                    }else{
                        html += `<td>${data.parent_id.userName}/${data.child_id.userName}</td>`
                    }
                }else{
                    html += `<td>0</td><td>${data.creditDebitamount}</td>`
                    if(data.parent_id.userName == data.user_id.userName){
                        html += `<td>${data.parent_id.userName}/${data.child_id.userName}</td>`
                    }else{
                        html += `<td>${data.child_id.userName}/${data.parent_id.userName}</td>`
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
        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                // console.log(val,1234)
                var listItems = document.getElementsByTagName("li");
                for (var i = 0; i < listItems.length; i++) {
                    if (listItems[i].textContent === val) {
                        match = ($(this).val() === val);
                      break; 
                    }else{
                        match = false
                    }
                  }
                // console.log(match, 123)
             if(match) {
                searchU = true
                let  data = {}
                let Fdate = document.getElementById("Fdate").value
                let Tdate = document.getElementById("Tdate").value
                if(!Fdate){
                    Fdate = 'undefined'
                }
                if(!Tdate){
                    Tdate = 'undefined'
                }
                data.Fdate = Fdate;
                data.Tdate = Tdate;
                data.userName = val
                SUSER = val
                data.Tdate = document.getElementById("Tdate").value
                data.page = 0
                data.LOGINDATA = LOGINDATA
                $('.pageLink').attr('data-page',1)
                // console.log(data, 456)
                 socket.emit( "UserSearchId", data)
             }else{
                searchU = false
             }
        });

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            searchU = true
                let  data = {}
                let Fdate = document.getElementById("Fdate").value
                let Tdate = document.getElementById("Tdate").value
                if(!Fdate){
                    Fdate = 'undefined'
                }
                if(!Tdate){
                    Tdate = 'undefined'
                }
                data.Fdate = Fdate;
                data.Tdate = Tdate;
                data.userName = this.textContent
                SUSER = this.textContent
                data.Tdate = document.getElementById("Tdate").value
                data.page = 0
                data.LOGINDATA = LOGINDATA
                $('.pageLink').attr('data-page',1)
                // console.log(data, 456)
                 socket.emit( "UserSearchId", data)
        })

        $(document).on("click", ".load", function(){
            
            let page = 0;
            $('.pageLink').attr('data-page',1)
            let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;
           
            Fdate = document.getElementById("Fdate").value
            Tdate = document.getElementById("Tdate").value
            let data = {}
            if(searchU){
                 data.id = SUSER,
                 data.page = page,
                 data.Fdate = Fdate,
                 data.Tdate = Tdate,
                 data.LOGINDATA = LOGINDATA
            }{
                 data.page = page,
                 data.Fdate = Fdate,
                 data.Tdate = Tdate,
                 data.LOGINDATA = LOGINDATA
            }
            socket.emit('AccountScroll',data)        
        })

        $(window).scroll(function() {
            // console.log(LOGINDATA)
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
            let id = JSON.parse(document.querySelector('#meDatails').getAttribute('data-me'))._id;
                // console.log(loginUser, id)
                let page = parseInt($('.pageLink').attr('data-page'));
                // console.log(page)
                Fdate = document.getElementById("Fdate").value
                Tdate = document.getElementById("Tdate").value
                $('.pageLink').attr('data-page',page + 1)
                let data = {}
               if(searchU){
                    data.id = SUSER,
                    data.page = page,
                    data.Fdate = Fdate,
                    data.Tdate = Tdate,
                    data.LOGINDATA = LOGINDATA
               }{
                    data.page = page,
                    data.Fdate = Fdate,
                    data.Tdate = Tdate,
                    data.LOGINDATA = LOGINDATA
               }
                
                socket.emit('AccountScroll',data)
            }
         }); 

         let count1 = 11
         socket.on("Acc", async(data) => {
            // console.log(data)
            if(data.json.status == "success"){
                if(data.page == 0){
                    count1 = 1;

                        $('table').html(`<tr >+
                        "<th>S.No</th>" +
                        "<th>Date</th>" +
                        "<th>Time</th>" +
                        "<th>Stake</th>" +
                        "<th>Credit</th>"+
                        "<th>Debit</th>"+
                        "<th>From / To</th>"+
                        "<th>Closing</th>"+
                        "<th>Description</th>"+
                        "<th>Remarks</th>"+
                      "</tr> `)
                }
                let html = "";
                for(let i = 0; i < data.json.userAcc.length; i++){
                    let date = new Date(data.json.userAcc[i].date);
                    // let abc =date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate()
                    // console.log(abc)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue" >
                        <td>${count1 + i}</td>
                        <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td>${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].stake){
                            html += `<td>${data.json.userAcc[i].stake}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                        if(data.json.userAcc[i].creditDebitamount > 0){
                            html += `<td>${data.json.userAcc[i].creditDebitamount}</td>
                            <td>0</td>`
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                }else{
                                    html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                }
                            }else{
                                html += "<td>-</td>"
                            }
                        }else{
                            html += `<td>0</td>`
                            if(data.json.userAcc[i].parent_id){
                                html += `<td>${data.json.userAcc[i].creditDebitamount}</td>`
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                }else{
                                    html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                }
                            }else{
                                html += `<td>${data.json.userAcc[i].creditDebitamount}</td><td>-</td>`
                            }
                        }
                        html += `<td>${data.json.userAcc[i].balance}</td>
                        <td><button class="ownAccDetails" id="${data.json.userAcc[i]._id}" style="background-color: transparent;" data-bs-toggle="modal" data-bs-target="#myModal5"> ${data.json.userAcc[i].description}&nbsp;<i class="fa-solid fa-sort-down"></i></button></td>
                        <td>-</td>`
                    }else{
                        html += `<tr style="text-align: center;" >
                        <td>${count1 + i}</td>
                        <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                        <td>${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                        if(data.json.userAcc[i].stake){
                            html += `<td>${data.json.userAcc[i].stake}</td>`
                        }else{
                            html += `<td>-</td>`
                        }
                        if(data.json.userAcc[i].creditDebitamount > 0){
                            html += `<td>${data.json.userAcc[i].creditDebitamount}</td>
                            <td>0</td>`
                            if(data.json.userAcc[i].parent_id){
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                }else{
                                    html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                }
                            }else{
                                html += "<td>-</td>"
                            }
                        }else{
                            html += `<td>0</td>`
                            if(data.json.userAcc[i].parent_id){
                                html += `<td>${data.json.userAcc[i].creditDebitamount}</td>`
                                if(data.json.userAcc[i].parent_id.userName == data.json.userAcc[i].user_id.userName){
                                    html += `<td>${data.json.userAcc[i].parent_id.userName}/${data.json.userAcc[i].child_id.userName}</td>`
                                }else{
                                    html += `<td>${data.json.userAcc[i].child_id.userName}/${data.json.userAcc[i].parent_id.userName}</td>`
                                }
                            }else{
                                html += `<td>${data.json.userAcc[i].creditDebitamount}</td><td>-</td>`
                            }
                        }
                        html += `<td>${data.json.userAcc[i].balance}</td>
                        <td><button class="ownAccDetails" id="${data.json.userAcc[i]._id}"  data-bs-toggle="modal" data-bs-target="#myModal5"> ${data.json.userAcc[i].description}&nbsp;<i class="fa-solid fa-sort-down"></i></button></td>
                        <td>-</td>`
                    }
                }
                count1 += 10;
                $('table').append(html)
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
                        socket.emit('userBetDetail',{filterData,LOGINDATA,page:0})
                    }
            })
    
    
            $('.filter').click(function(){
                let userName = $('.searchUser').val()
                fromDate = $('#fromDate').val()
                toDate = $('#toDate').val()
                fGame = $('#fGame').val()
                fBets = $('#fBets').val()
                let page = $('.pageId').attr('data-pageid','1')
                data.page = 0;
                if(fromDate != ''  && toDate != '' ){
                    filterData.date = {$gte : fromDate,$lte : toDate}
                }else{
    
                    if(fromDate != '' ){
                        filterData.date = {$gte : fromDate}
                    }
                    if(toDate != '' ){
                        filterData.date = {$lte : toDate}
                    }
                }
                if(userName != ''){
                    filterData.userName = userName
                }else{
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }
                filterData.betType = fGame
                filterData.status = fBets
                data.filterData = filterData
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('userBetDetail',data)
    
            })

            $(document).on("click", ".searchList", function(){
                // console.log("working")
                // console.log(this.textContent)
                document.getElementById("searchUser").value = this.textContent
                filterData = {}
                filterData.userName = this.textContent
                $('.pageId').attr('data-pageid','1')
                socket.emit('userBetDetail',{filterData,LOGINDATA,page:0})
                
            })
    
            $(window).scroll(function() {
                // $(window).scroll(function() {
                    var scroll = $(window).scrollTop();
                    var windowHeight = $(window).height();
                    var documentHeight = $(document).height();
                    if (scroll + windowHeight >= documentHeight) {
                    console.log("working")
                    let page = parseInt($('.pageId').attr('data-pageid'));
                    $('.pageId').attr('data-pageid',page + 1)
                    let data = {}
                    let userName = $('.searchUser').val()
                    if(userName == ''){
                        filterData.userName = LOGINDATA.LOGINUSER.userName
                    }else{
                        filterData.userName = userName
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
                    if(fGame !== undefined ){
                        filterData.betType = fGame
                    }
                    if(fBets != undefined ){
                        filterData.status = fBets
                    }
    
                    data.filterData = filterData;
                    data.page = page
                    data.LOGINDATA = LOGINDATA
                    // console.log(data)
                    socket.emit('userBetDetail',data)
    
    
    
                }
             }); 
             

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
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;" >`
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
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
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
                    <span class="on-off">OFF &nbsp; <label class="switch">
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
                        html += `<span class="on-off">OFF &nbsp; <label class="switch">
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
                        html += `<span class="on-off">OFF &nbsp; <label class="switch">
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
                        html += ` <span class="on-off">OFF &nbsp; <label class="switch">
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
                socket.emit('userPLDetail',data)



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
                    socket.emit('userPLDetail',{filterData,LOGINDATA,page:0})
                }
        })
        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
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
                <td>${users[i].myPL}</td>
                </tr>`
            }
            if(page == 0){
                $('.new-body').html(html)
            }else{
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

        $('.filter').click(function(){
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.login_time = {$gte : fromDate,$lte : toDate}
            }else{

                if(fromDate != '' ){
                    filterData.login_time = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.login_time = {$lte : toDate}
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('userHistory',data)
        })

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
                filterData.login_time = {$gte : fromDate,$lte : toDate}
            }else{

                if(fromDate != '' ){
                    filterData.login_time = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.login_time = {$lte : toDate}
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('userHistory',data)
        })

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
                if(fromDate != undefined  && toDate != undefined && fromDate != ''  && toDate != '' ){
                    filterData.login_time = {$gte : fromDate,$lte : toDate}
                }else{

                    if(fromDate != undefined && fromDate != '' ){
                        filterData.login_time = {$gte : fromDate}
                    }
                    if(toDate != undefined && toDate != '' ){
                        filterData.login_time = {$lte : toDate}
                    }
                }

                data.filterData = filterData;
                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('userHistory',data)



            }
         }); 
        
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
                <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()},${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
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
                $('.new-body').html(html)
            }else{
                $('.new-body').append(html)
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
            socket.emit('OnlineUser',{filterData,LOGINDATA,page:0})
            
        })

        socket.on('OnlineUser', async(data) => {
            console.log(data)
            if(data.page == 0){
                let html = `<tr style="text-align: center;" class="blue">
                <td>1</td>
                <td>${data.onlineUsers[0].userName}</td>
                <td>
    
                    <button type="button" id="${data.onlineUsers[0]._id}" class="logout">Logout</button>
                </td>
            </tr>`
            $('.new-body').html(html)
            }else{
                let html = ''
                for(let i = 0; i < data.onlineUsers.length; i++){
                    if(i%2 == 0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;">`
                    }
                    html+= `<td>1</td>
                    <td>${data.onlineUsers[i].userName}</td>
                    <td>
        
                        <button type="button" id="${data.onlineUsers[i]._id}" class="logout">Logout</button>
                    </td>
                </tr>`
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


        $(window).scroll(function() {
            if($(document).height()-$(window).scrollTop() == window.innerHeight){
            let filterData = {}
            let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let data = {}
                let userName = $('.searchUser').val()
                if(userName == ''){
                    filterData.userName = LOGINDATA.LOGINUSER.userName
                }else{
                    filterData.userName = userName
                    data.filterData = filterData;
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

                data.page = page
                data.LOGINDATA = LOGINDATA
                // console.log(data)
                socket.emit('OnlineUser',data)



            }
            }); 




    }

    if(pathname == "/admin/betmoniter"){
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
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('betMoniter',{filterData,LOGINDATA,page:0})
                }
        })


        $('.filter').click(function(){
            console.log("working")
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            sport = $('#Sport').val()
            market = $('#market').val()
            $('.pageId').attr('data-pageid','1')
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
            // if(sport != "All"){
                filterData.betType = sport
            // }
            // if(market != "All"){
                filterData.marketName = market
            // }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            console.log(data)
            socket.emit('betMoniter',data)

        })

        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            $('.wrapper').hide()
            socket.emit('betMoniter',{filterData,LOGINDATA,page:0})
            
        })

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
                socket.emit('betMoniter',data)



            }
            }); 
            
            let count = 11
            socket.on('betMoniter',(data) => {
                console.log(data)
                if(data.page === 0){
                    count = 1
                }
                let bets = data.ubDetails;
                let html = '';
                    for(let i = 0; i < bets.length; i++){
                        let date = new Date(bets[i].date)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;" >`
                    }
                    html += `<td>${i + count}</td>
                    <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                    <td>${bets[i].userName}</td>
                    <td>${bets[i].event}</td>
                    `
                    if(bets[i].match){
                        html += `
                        <td>${bets[i].marketName}</td>
                        <td>${bets[i].oddValue}</td>
                        <td>${bets[i].match}</td>
                        <td>${bets[i].selectionName}</td>`
                    }else{
                        html += `<td>-</td>
                        <td>-</td><td>-</td><td>-</td>`
                    }
                    html += `
                    <td>${bets[i].Stake}</td>
                    <td>${bets[i].transactionId}</td>
                    <td>${bets[i].status}</td>
                    <td>${bets[i].returns}</td>
                    <td>
                    <div class="btn-group">
                    <button class="btn cancel" id="${bets[i]._id}">Cancel Bet</button>
                    <button class="btn alert" id="${bets[i]._id}"> Alert Bet</button></div></td>
                    </tr>`
                }
                count += 10;
                if(data.page == 0){
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
                }
            })

    
    $(document).on('click', '.cancel', async function(e){
        e.preventDefault()
        socket.emit('voidBet', this.id)
    })
    

    $(document).on("click", ".alert", function(e){
        e.preventDefault()
        socket.emit("alertBet", this.id)
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
                const rowsToUpdate = Array.from(table.rows).slice(rowIndex);
                rowsToUpdate.forEach((row, index) => {
                    const srNoCell = row.cells[0]; 
                    srNoCell.textContent = index + rowIndex + 1;
                  });
              }
        }
    })
            

    }






    if(pathname == "/admin/voidbet"){
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
                    // document.getElementById('select').innerHTML = ``
                }
            }
        })


        socket.on("ACCSEARCHRES", async(data)=>{
            // console.log(data)
            let html = ` `
            for(let i = 0; i < data.length; i++){
                html += `<option><button onclick="myFunction(${data[i].userName})">${data[i].userName}</button>`
            }
            // console.log(html)
            document.getElementById('select').innerHTML = html

            let datalist = document.querySelector('#text_editors');
            // console.log(datalist)
            let  select = document.querySelector('#select');
            // console.log(select)
            let options = select.options;
            // console.log(options)



            / when user selects an option from DDL, write it to text field /
            select.addEventListener('change', fill_input);

            function fill_input() {
                    input.value = options[this.selectedIndex].value;
            hide_select();
            }

            / when user wants to type in text field, hide DDL /
            let input = document.querySelector('.searchUser');
            input.addEventListener('focus', hide_select);

            function hide_select() {
            datalist.style.display = '';
            //   button.textContent = "▼";
            }
        })

        let toDate;
        let fromDate;
        let filterData = {}
        $(".searchUser").on('input', function(e){
            var $input = $(this),
                val = $input.val();
                list = $input.attr('list'),
                match = $('#'+list + ' option').filter(function() {
                    return ($(this).val() === val);
                });

                if(match.length > 0){
                    // console.log(match.text())
                    filterData = {}
                    filterData.userName = match.text()
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('voidBET',{filterData,LOGINDATA,page:0})
                }
        })


        $('.filter').click(function(){
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.date = {$gte : fromDate,$lte : toDate}
            }else{

                if(fromDate != '' ){
                    filterData.date = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.date = {$lte : toDate}
                }
            }
            if(userName != ''){
                filterData.userName = userName
            }else{
                filterData.userName = LOGINDATA.LOGINUSER.userName
            }
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('voidBET',data)

        })

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
                socket.emit('voidBET',data)



            }
            }); 
            
            let count = 11
            socket.on('voidBET',(data) => {
                // console.log(data)
                let bets = data.ubDetails;
                let html = '';
                    for(let i = 0; i < bets.length; i++){
                        let date = new Date(bets[i].date)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;" >`
                    }
                    html += `<td>${i + count}</td>
                    <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                    <td>${bets[i].userName}</td>
                    <td>${bets[i].event}</td>
                    `
                    if(bets[i].match){
                        html += `
                        <td>${bets[i].marketName}</td>
                        <td>${bets[i].oddValue}</td>
                        <td>${bets[i].match}</td>
                        <td>${bets[i].selectionName}</td>`
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
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
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
                socket.emit("marketId", ids)
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
          
                socket.emit("marketId", ids)
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
                socket.emit("marketId", ids)
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
                socket.emit("marketId", ids)
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
            
                let modleName = "#myModal5"
                let form = $(modleName).find('.form-data1')
                let PMD = data
                form.attr('id', PMD._id);
                form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "name"]').attr('value',PMD.position)
                form.find('input[name = "link"]').attr('value',PMD.link)
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
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
                var ids = [];
          
                $(".MarketIdsR").each(function() {
                  ids.push(this.id);
                });
                // console.log(ids)
                socket.emit("aggreat", {ids, LOGINDATA})
                // socket.emit("aggreat", LOGINDATA)
              });
              setTimeout(()=>{
                if(pathname === "/admin/liveMarket"){
                    marketId()
                }
              }, 500)
        }
        marketId()
        

        // socket.on("aggreat", async(data) => {
        //     console.log(data)
        //     let stake1 = 0;
        //     let stake2 = 0;
        //     data.forEach(item => {
        //         // document.getElementById(`${item._id}`).innerText = item.totalStake
        //         item.betData.forEach(bet => {
                    
        //         })
        //         document.getElementById(`${item._id}B`).innerText = item.count
        //     })
        // })
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
                form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "menuName"]').attr('value',PMD.menuName)
                form.find('input[name = "num"]').attr('value',PMD.num)
                form.find('input[name = "url"]').attr('value',PMD.url)
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
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
                form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "menuName"]').attr('value',PMD.menuName)
                form.find('input[name = "url"]').attr('value',PMD.url)
                form.find('input[name = "num"]').attr('value',PMD.Number)
                form.find('input[name = "page"]').attr('value',PMD.page)
                document.getElementById('img').innerHTML = `<img src="../imgForHMenu/${PMD.icon}.png" alt="img" class="form__user-photo">`
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
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
                form.find('input[name = "check"]').removeAttr('checked');
                form.find('input[name = "bannerName"]').attr('value',PMD.bannerName)
                form.find('input[name = "url"]').attr('value',PMD.url)
                document.getElementById('banner12').innerHTML = `<img src="../banner/${PMD.banner}.png" alt="img" class="form__user-photo">`
                if(PMD.status){
                    form.find('input[name = "check"]').attr("checked", "checked");
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
          
                socket.emit("marketId", ids)
              });
              setTimeout(()=>{
                marketId()
              }, 1000)
        }
        marketId()
    }


    if(pathname === '/exchange_inPlay/match'){

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
                // console.log(ids)
                socket.emit("marketId", ids)
              });
              setTimeout(()=>{
                marketId()
              }, 1000)
        }
        marketId()

        let first = true
        socket.on("marketId", async(data) => {
            console.log("working")
            $(".match_odd_Blue").each(function() {
                    
                let id = this.id

                id = id.slice(0, -1);
                let section = null;
                data.finalResult.items.some(item => {
                    section = item.odds.find(odd => odd.selectionId == id);
                    return section !== undefined;
                });
                if(this.id == `${section.selectionId}1` ){
                    if(data.betLimits[0].max_odd < section.backPrice1 || section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            if(data1 != section.backPrice1){
                                this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}2`){
                    if(data.betLimits[0].max_odd < section.backPrice2 || section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                        }else{

                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            if(data1 != section.backPrice2){
                                this.innerHTML = `<span><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        // this.innerHTML = `<span><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}3`){
                    if(data.betLimits[0].max_odd < section.backPrice3 || section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.backPrice3){
                                this.innerHTML = `<span><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
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
                    if(data.betLimits[0].max_odd < section.layPrice1 || section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice1){
                                this.innerHTML = `<span><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if(this.id == `${section.selectionId}5`){
                    if(data.betLimits[0].max_odd < section.layPrice2 || section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice2){
                                this.innerHTML = `<span><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                                this.style.backgroundColor = 'blanchedalmond';
                            }
                        }
                        
                    }
                }else if (this.id == `${section.selectionId}6`){
                    if(data.betLimits[0].max_odd < section.layPrice3 || section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.setAttribute("data-bs-toggle", "collapse");
                        if(first){
                            this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
                        }else{
                            let htmldiv = $('<div>').html(this.innerHTML)
                            let data1 = htmldiv.find('span:first').text()
                            // console.log(data1)
                            if(data1 != section.layPrice3){
                                this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
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
            //         if(data.betLimits[0].max_odd < section.backPrice1 || section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
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
            //         if(data.betLimits[0].max_odd < section.backPrice2 || section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
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
            //         if(data.betLimits[0].max_odd < section.backPrice3 || section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
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
            //         if(data.betLimits[0].max_odd < section.layPrice1 || section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             this.innerHTML = `<span><b>${section.layPrice1}</b></span> 
            //                                 <span>${section.laySize1}</span>`
            //         }
            //     }else if(this.id == `${section.selectionId}5`){
            //         if(data.betLimits[0].max_odd < section.layPrice2 || section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
            //             this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
            //             <i class="fa-solid fa-lock"></i>
            //           </span>`
            //         }else{
            //             this.innerHTML = `<span><b>${section.layPrice2}</b></span> 
            //                             <span>${section.laySize2}</span>`
            //         }
            //     }else if (this.id == `${section.selectionId}6`){
            //         if(data.betLimits[0].max_odd < section.layPrice3 || section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
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
                    if(data.betLimits[0].max_odd < section.backPrice || section.backPrice == "-" || section.backPrice == "1,000.00" || section.backPrice == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
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
                let parentElement = this.parentNode
                console.log(parentElement)
                if(this.id == `${section.secId}2` ){
                    if(data.betLimits[0].max_odd < section.layPrice || section.layPrice == "-" || section.layPrice == "1,000.00" || section.layPrice == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        parentElement.classList.remove("suspended")
                        $(this).parent().find(".match-status-message").text("")
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.layPrice}</b></span> <span> ${section.laySize}</span>`
                        // this.innerHTML = `<b>${section.backPrice}</b> <br> ${section.backSize}`
                        // this.innerHTML = `<b>${section.layPrice}</b> <br> ${section.laySize}`
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
                    if(data.betLimits[0].max_odd < section.odd || section.odd == "-" || section.odd == "1,000.00" || section.odd == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        this.innerHTML = `<span><b>${section.odd}</b></span>` 
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
                    }else if(section.suspended){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                      parentElement.classList.add("suspended");
                      $(this).parent().find(".match-status-message").text("Suspended")
                    }
                    else if(data.betLimits[0].max_odd < section.even || section.even == "-" || section.even == "1,000.00" || section.even == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        $(this).parent().find(".match-status-message").text("")
                        parentElement.classList.remove("suspended")
                        this.innerHTML = `<span><b>${section.even}</b></span>` 
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
                    if(data.betLimits[0].max_odd < section.yes || section.yes == "-" || section.yes == "1,000.00" || section.yes == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        // this.innerHTML = `<span><b>${section.yes}</b></span>` 
                        let x = (parseFloat(section.yes_rate) + 100)/100
                        this.innerHTML = `<span><b>${x}</b></span> <span> ${section.yes}</span>`
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
                console.log(section.ball_running)
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
                    }else if(data.betLimits[0].max_odd < section.no || section.no == "-" || section.no == "1,000.00" || section.no == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                      this.removeAttribute("data-bs-toggle");
                    }else{
                        this.setAttribute("data-bs-toggle", "collapse");
                        $(this).parent().find(".match-status-message").text("")
                        parentElement.classList.remove("suspended")
                        let x = (parseFloat(section.no_rate) + 100)/100
                        this.innerHTML = `<span><b>${x}</b></span> <span> ${section.no}</span>`
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
              let odds = $(this).children("span:first-child").text();
              let beton = $(this).closest("tr").find("td:first-child").text();
              let secondPTag = $(this).closest("tr").next().find(".beton");
              let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
              let secId = this.id
              secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);;
              numSpan.text(odds);
            });
          });

          $(document).ready(function () {
            $(".nww-bet-slip-wrp-col2-inn span").click(function () {
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
                specificSpan = $(`#${secforFency}`).children("span:first-child").text();
                // console.log(`#${secforFency}`)
            }else{
                specificSpan = $(`#${secId.slice(0,-1)}`).children("span:first-child").text();
                
            }
            let check = $(this).closest("tr").find("#changes").prop("checked");
            console.log(data)
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
            let buttonALlin = document.getElementsByClassName("ALLIN")
            for (let i = 0; i < buttonALlin.length; i++) {
                buttonALlin[i].id = `${data.user.availableBalance}`; // Replace "newId" with the desired ID value
            }
            // buttonALlin[0].id = 
            let html2 = ""
            document.getElementById("betsTitleSide").innerHTML = `<h5>Open Bets (${data.openBet.length})</h5>`
            document.getElementById("pills-profilebb-tab").innerHTML = `Open Bets (${data.openBet.length})`
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
              document.getElementById('length2').innerHTML = html2
            }else{
                for(let i = 0; i < data.openBet.length; i++){
                    html2 += `<tr>
                    <td>${ data.openBet[i].selectionName}</td>
                    <td>${ data.openBet[i].oddValue }</td>
                    <td>${ data.openBet[i].Stake }</td>
                  </tr>`
                }
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
                html += `<tr class="acount-stat-tbl-body-tr">
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
                            <td title='Odds'>${bets[i].oddValue}</td>`
                }else{
                        html +=    "<td title='Bet On'>-</td><td title='Odds'>-</td>"
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
          
                socket.emit("marketId", ids)
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
          
                socket.emit("marketId", ids)
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
          
                socket.emit("marketId", ids)
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
          
                socket.emit("marketId", ids)
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
                socket.emit("marketId", ids)
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
                    if(data.betLimits[0].max_odd < section.backPrice1 || section.backPrice1 == "-" || section.backPrice1 == "1,000.00" || section.backPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}2`){
                    if(data.betLimits[0].max_odd < section.backPrice2 || section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.innerHTML = `<span><b>${section.backPrice2}</b></span> <span> ${section.backSize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}3`){
                    if(data.betLimits[0].max_odd < section.backPrice3 || section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-blu-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        this.innerHTML = `<span><b>${section.backPrice3}</b></span> <span> ${section.backSize3}</span>`
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
                    if(data.betLimits[0].max_odd < section.layPrice1 || section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.layPrice1}</b></span> <span> ${section.laySize1}</span>`
                    }
                }else if(this.id == `${section.selectionId}5`){
                    if(data.betLimits[0].max_odd < section.layPrice2 || section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.layPrice2}</b></span> <span> ${section.laySize2}</span>`
                    }
                }else if (this.id == `${section.selectionId}6`){
                    if(data.betLimits[0].max_odd < section.layPrice3 || section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
                        this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                        <i class="fa-solid fa-lock"></i>
                      </span>`
                    }else{
                        // this.innerHTML = `<span><b>${section.backPrice1}</b></span> <span> ${section.backSize1}</span>`
                        this.innerHTML = `<span><b>${section.layPrice3}</b></span> <span> ${section.laySize3}</span>`
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
                    if(data.betLimits[0].max_odd < section.backPrice || section.backPrice == "-" || section.backPrice == "1,000.00" || section.backPrice == "0"){
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
                    if(data.betLimits[0].max_odd < section.layPrice || section.layPrice == "-" || section.layPrice == "1,000.00" || section.layPrice == "0"){
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
              let odds = $(this).children("span:first-child").text();
              let beton = $(this).closest("tr").find("td:first-child").text();
              let secondPTag = $(this).closest("tr").next().find(".beton");
              let numSpan = $(this).closest("tr").next().find(".nww-bet-slip-wrp-col1-txt-num");
              let secId = this.id
              secondPTag.text(`Bet on :${beton}@${odds}`).attr("id", `${secId}1`);;
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
                console.log((data.odds != '\n                        \n                      '), 121212)
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

    if(pathname === "/admin/dashboard" && href === "http://ollscores.com/admin/dashboard"){
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
                    document.getElementById('betCount').innerText = data.result.betCount
                    document.getElementById('Profit').innerText = data.result.Income
                    document.getElementById('turnOver').innerText = data.result.turnOver
                    document.getElementById('adminCount').innerText = data.result.adminCount
                    document.getElementById('userCount').innerText = data.result.userCount
                })
        }
    }

    if(pathname === "/admin/commissionReport"){
        const FdateInput = document.getElementById('Fdate');
        const TdateInput = document.getElementById('Tdate');
        FdateInput.addEventListener('change', handleInputChangeCommission);
        TdateInput.addEventListener('change', handleInputChangeCommission);
        function handleInputChangeCommission(event) {
            console.log("Work")
            let fromDate = $('#Fdate').val()
            let toDate = $('#Tdate').val()
            let filterData = {}
            filterData.fromDate = fromDate,
            filterData.toDate = toDate
            page = 0
            $('.pageId').attr('data-pageid',1)
            socket.emit("CommissionRReport", {page, LOGINDATA, filterData})
        }

        $(window).scroll(async function() {
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            var documentHeight = $(document).height();
            if (scroll + windowHeight >= documentHeight) {
                console.log("working")
                let page = parseInt($('.pageId').attr('data-pageid'));
                $('.pageId').attr('data-pageid',page + 1)
                let filterData = {};
                let fromDate1 = $('#Fdate').val()
                let toDate = $('#Tdate').val()
                console.log(fromDate1)
                filterData.fromDate = fromDate1,
                filterData.toDate = toDate
                socket.emit("CommissionRReport", {page, LOGINDATA, filterData})
            }
          })
          let count = 21
          socket.on("CommissionRReport", data => {
            console.log(data)
            // if(data.CommissionData.length > 0){
                if(data.page === 0){
                    count = 1
                }
                let page = data.page
                let userAcc = data.CommissionData;
                let html = ""
                for(let i = 0; i < userAcc.length; i++){
                    let date = new Date(userAcc[i].date)
                    html += `<tr style="text-align: center;" class="blue"><td>${count + i}</td>
                    <td>${date.getDate() + '-' +(date.getMonth() + 1) + '-' + date.getFullYear()}</td>
                <td>${date.getHours() + ':' + date.getMinutes() +':' + date.getSeconds()}</td>`
                if(userAcc[i].creditDebitamount > 0){
                    html += ` <td>${userAcc[i].creditDebitamount}</td>
                    <td>-</td>`
                }else{
                    html += ` <td>-</td>
                    <td>${userAcc[i].creditDebitamount}</td>`
                }
                html += `<td>${userAcc[i].balance}</td>
                <td>${userAcc[i].description}</td>
            </tr>`
                }

                count += 20
                if(data.page == 0){
                    // console.log(html)
                    $('.table-body').html(html)
                    // if(data.CommissionData.length === 0){
                    //     $('.table-body').html("1")
                    // }
                }else{
                    $('.table-body').append(html)         
                }
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
                // $('#myModaladduser').modal('toggle');
                let html = ""
                const tbody = document.getElementById("tableBody");
                const numberOfRows = tbody.getElementsByTagName("tr").length;
                if(numberOfRows%2 == 0){
                    html += `<tr style="text-align: center;" class="blue">`
                }else{
                    html += `<tr style="text-align: center;" >`
                }
                var date = new Date(data.date);
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
                html += `<td>${numberOfRows+1}</td>
                <td>${formattedTimeWithoutComma}</td>
                <td>Deposit</td>
                <td>Betbhai</td>
                <td> <i class="fa-solid fa-arrow-right"></i> </td>
                <td>Betbhai</td>
                <td>${data.amount}</td>
                <td>${data.closingBalance}</td>
                <td>${data.Remark}</td>
              </tr>`

              tbody.insertAdjacentHTML("beforeend", html);
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
    }


    if(pathname === "/admin/alertbet"){
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
        let filterData = {}
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
                    filterData = {}
                    filterData.userName = val
                    $('.pageId').attr('data-pageid','1')
                    socket.emit('AlertBet',{filterData,LOGINDATA,page:0})
                }
        })
        $('.filter').click(function(){
            console.log("working")
            let userName = $('.searchUser').val()
            fromDate = $('#fromDate').val()
            toDate = $('#toDate').val()
            sport = $('#Sport').val()
            market = $('#market').val()
            $('.pageId').attr('data-pageid','1')
            data.page = 0;
            if(fromDate != ''  && toDate != '' ){
                filterData.date = {$gte : fromDate,$lte : toDate}
            }else{
    
                if(fromDate != '' ){
                    filterData.date = {$gte : fromDate}
                }
                if(toDate != '' ){
                    filterData.date = {$lte : toDate}
                }
            }
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
            data.filterData = filterData
            data.LOGINDATA = LOGINDATA
            // console.log(data)
            socket.emit('AlertBet',data)
    
        })
    
        $(document).on("click", ".searchList", function(){
            // console.log("working")
            // console.log(this.textContent)
            document.getElementById("searchUser").value = this.textContent
            filterData = {}
            filterData.userName = this.textContent
            $('.pageId').attr('data-pageid','1')
            $('.wrapper').hide()
            socket.emit('AlertBet',{filterData,LOGINDATA,page:0})
            
        })
    
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
                socket.emit('AlertBet',data)
    
    
    
            }
            }); 
            
            let count = 11
            socket.on('AlertBet',(data) => {
                // console.log(data)
                if(data.page === 0){
                    count = 1
                }
                let bets = data.ubDetails;
                let html = '';
                    for(let i = 0; i < bets.length; i++){
                        let date = new Date(bets[i].date)
                    if((i%2)==0){
                        html += `<tr style="text-align: center;" class="blue">`
                    }else{
                        html += `<tr style="text-align: center;" >`
                    }
                    html += `<td>${i + count}</td>
                    <td>${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</td>
                    <td>${bets[i].userName}</td>
                    <td>${bets[i].event}</td>
                    `
                    if(bets[i].match){
                        html += `
                        <td>${bets[i].marketName}</td>
                        <td>${bets[i].oddValue}</td>
                        <td>${bets[i].match}</td>
                        <td>${bets[i].selectionName}</td>`
                    }else{
                        html += `<td>-</td>
                        <td>-</td><td>-</td><td>-</td>`
                    }
                    html += `
                    <td>${bets[i].Stake}</td>
                    <td>${bets[i].transactionId}</td>
                    <td>${bets[i].status}</td>
                    <td>${bets[i].returns}</td>
                    <td><button class="voidBet" id="${bets[i]._id}">Cancel Bet</button><button class="alertBet" id="${bets[i]._id}"> Alert Bet</button></td>
                    </tr>`
                }
                count += 10;
                if(data.page == 0){
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
                }
            })

            $(document).on('click', '.cancel', async function(e){
                e.preventDefault()
                socket.emit('voidBet', this.id)
            })
    
            $(document).on('click', '.accept', async function(e){
                e.preventDefault()
                socket.emit('acceptBet', this.id)
            })

            
            socket.on("acceptBet", (data)=>{
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
                        const rowsToUpdate = Array.from(table.rows).slice(rowIndex);
                        rowsToUpdate.forEach((row, index) => {
                            const srNoCell = row.cells[0]; 
                            srNoCell.textContent = index + rowIndex + 1;
                          });
                      }
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

          let count = 21
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
                        <td>${formattedTime}</td>
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
                count += 20
                if(data.page == 0){
                    $('.new-body').html(html)
                }else{
                    $('.new-body').append(html)         
                }
                let html12 = `<a id="loadMore">Load More</a>`
                $('.loadMoredive').html(html12)
            }else{
                console.log("working")
                if(data.page == 0){
                    $('.new-body').html("")
                }

                    $('.loadMoredive').html("")
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
            $('.pageId').attr('data-pageid',1)
            let id = search.split("=")[1]
            socket.emit("ACCSTATEMENTADMINSIDE", {page, id, filterData})
          }


        let countAcc = 21
        socket.on("ACCSTATEMENTADMINSIDE", async(data) => {
            if(data.userAcc.length > 0){
            console.log(data.page)
            if(data.page === 0){
                countAcc = 1
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
                    <td>${i+countAcc}</td>
                    <td>${formattedTime}</td>`
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
            countAcc += 20
            if(data.page == 0){
                $('.acount-stat-tbl-body').html(html)
            }else{
                $('.acount-stat-tbl-body').append(html)         
            }
        }else{
            console.log("working")
                $('.loadMorediveACC').html("")
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

        let countHistory = 21
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
    
                }
                console.log(html)
                $('.acount-stat-tbl-body111').append(html) 

            }else{
                $('.loadMorediveHistory').html("")
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
        $('#from_date').change(function(e){
            fromdate = $(this).val();
            todate = $('#to_date').val();
            console.log(fromdate,todate)
            socket.emit('settlement',{LOGINUSER:LOGINDATA.LOGINUSER,todate,fromdate})

        })
        $('#to_date').change(function(e){
            todate = $(this).val();
            fromdate = $('#from_date').val();
            console.log(fromdate,todate)
            socket.emit('settlement',{LOGINUSER:LOGINDATA.LOGINUSER,todate,fromdate})

            
        })

        socket.on('settlement',async(data)=>{
            console.log(data)
            let html = ''
            for(let i = 0; i < data.betsEventWise.length; i++){ 
                html += `<tr>`
                var timestamp = data.betsEventWise[i].eventdate * 1000; 
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
                  
                  html += `<td>${i+1} </td>
                  <td>${formattedTime}</td>
                  <td>${data.betsEventWise[i].series}</td>
                  <td>${data.betsEventWise[i].matchName}</td>
                  <td>${data.betsEventWise[i].count}</td>
                  <td>${data.betsEventWise[i].count}</td>
                  <td><a href="/admin/settlementIn?id=${data.betsEventWise[i].eventid}" class="btn-green">settle</a></td>
                </tr>`
            } 

            $('tbody').html(html)
        })
    }

    if(pathname == '/admin/settlementHistory'){
        $(document).on('change','#Fdate',function(e){
            let from_date = $(this).val()
            let to_date = new Date(new Date($('#Tdate').val()).getTime() + ((24 * 60 * 60 *1000)-1))
            socket.emit('settlementHistory',{from_date,to_date,USER:LOGINDATA.LOGINUSER})
        })

        socket.on('settlementHistory',async(data)=>{
            console.log(data)
        })
    }

    if(pathname === "/admin/settlementIn"){
       

        $(document).on("click", ".voidBet", function(e){
            e.preventDefault()
            let id =  this.id
            socket.emit("VoidBetIn", {LOGINDATA, id})
        })

        socket.on("VoidBetIn", async(data) => {
            if(data.status === "error"){
                alert("Please try again later")
            }else{
                // console.log(data.bet._id)
                const deleteButton = document.getElementById(data.marketId);
                // console.log(deleteButton)
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

        $(document).on("click", ".acceptBet", function(e){
            e.preventDefault()
            let id =  this.id
            var newColumnCell = $(this).closest('tr').find('.selectOption');
            console.log(newColumnCell.val())
            let result = newColumnCell.val()
            socket.emit("VoidBetIn22", {LOGINDATA, id, result})
            // console.log(id)
        })

        socket.on("VoidBetIn22", async(data) => {
            if(data.status === "error"){
                alert(data.message.toUpperCase())
            }
        })
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


    if(pathname === "/admin/catalogcontrol/compitations/events"){
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
        socket.on('sportStatusChange2',async(data)=>{
            if(data.status == 'success'){
                console.log(data.msg)
            }else{
                console.log('somethig went wrong!!')
            }
        })
    }
    
    
    if(pathname == "/admin/commissionMarkets"){
        $(document).ready(function() {
            $('#MarketMatch').on('input change', function() {
              var inputValue = $(this).val();
              if(inputValue.length > 3){
                socket.emit("MarketMatch", {LOGINDATA, inputValue});
                }else{
                    socket.emit("MarketMatch", "LessTheN3");
                }
                // socket.emit("MarketMatch", {LOGINDATA, inputValue})
            });
          });

          socket.on("MarketMatch", async(data) => {
            console.log(data)
            let html = ""
            for(let i = 0; i < data.length; i++){
                html += "<ul>"
                html += `<li id="${data[i].eventData.eventId}" class="matchName">${data[i].eventData.name}</li>`
                html += "</ul>"
            }
            document.getElementById("myMarkets").innerHTML = html
            $('#myMarkets').click(function(e){
                $('#myMarkets').hide()
                $('#MarketMatch').val('')
            })
            // document.getElementById("demonames1").innerHTML = html
          })

          $(document).on("click", ".matchName", function(e){
            e.preventDefault()
            // console.log($(this).attr('id'))
            let id = $(this).attr('id')
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
                                    <span class="on-off">OFF &nbsp; <label class="switch">
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
                                <span class="on-off">OFF &nbsp; <label class="switch">
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
              let parentNode = this.closest('tr')
              let marketId = parentNode.id
              socket.emit("commissionMarketbyId", {marketId, isChecked, LOGINDATA});
          })
      
          socket.on("commissionMarketbyId", data =>{
              if(data == "err"){
                  // alert("Opps, somthing went wrong please try again leter")
              }
          })
    }

})
})