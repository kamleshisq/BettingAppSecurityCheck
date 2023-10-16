if(pathname === '/exchange_inPlay/match'){


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
              if( section.backPrice2 == "-" || section.backPrice2 == "1,000.00" || section.backPrice2 == "0"){
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
              if( section.backPrice3 == "-" || section.backPrice3 == "1,000.00" || section.backPrice3 == "0"){
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
              if( section.layPrice1 == "-" || section.layPrice1 == "1,000.00" || section.layPrice1 == "0"){
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
              if( section.layPrice2 == "-" || section.layPrice2 == "1,000.00" || section.layPrice2 == "0"){
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
              if( section.layPrice3 == "-" || section.layPrice3 == "1,000.00" || section.layPrice3 == "0"){
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
              if( section.backPrice == "-" || section.backPrice == "1,000.00" || section.backPrice == "0"){
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
          if(this.id == `${section.secId}2` ){
              if( section.layPrice == "-" || section.layPrice == "1,000.00" || section.layPrice == "0"){
                  this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                  <i class="fa-solid fa-lock"></i>
                </span>`
                this.removeAttribute("data-bs-toggle");
                parentElement.classList.add("suspended");
                $(this).parent().find(".match-status-message").text("Suspended")
              }else if(section.win_result != 'undefined' && section.win_result != " "){
                  this.removeAttribute("data-bs-toggle");
                parentElement.classList.add("suspended");
                $(this).parent().find(".match-status-message").text(section.win_result)
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
              if( section.odd == "-" || section.odd == "1,000.00" || section.odd == "0"){
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
              }else if(section.win_result != 'undefined' && section.win_result != " "){
                  this.removeAttribute("data-bs-toggle");
                parentElement.classList.add("suspended");
                $(this).parent().find(".match-status-message").text(section.win_result)
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
          if(this.id == `${section.market_id}2` ){
              if(section.ball_running){
                  this.innerHTML = `<span class="tbl-td-bg-pich-spn mylock-data">
                  <i class="fa-solid fa-lock"></i>
                </span>`
                this.removeAttribute("data-bs-toggle");
                parentElement.classList.add("suspended");
                $(this).parent().find(".match-status-message").text("Ball Running")
              }else if(section.win_result != 'undefined' && section.win_result != " "){
                  this.removeAttribute("data-bs-toggle");
                parentElement.classList.add("suspended");
                $(this).parent().find(".match-status-message").text(section.win_result)
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


    $(document).on('click','.tbl-td-with5',function(e){
          $(".minus").closest("tr").find('.set-stake-form-input2').val(0)
          $(".minus")
          .closest("tr")
          .find(".c-gren")
          .text('00');
         
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