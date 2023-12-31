$(document).ready(function(){
    $(".plus").click(function () {
        let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
        let IdButton = $(`#${buttonId}`)
        // console.log(IdButton)
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
        let element = $(this)
        let plusMinus = 0
        let oldResult = $(this).closest("tr").find('.set-stake-form-input2').val()
        if($(this).closest('tr').hasClass('back-inplaymatch')){
            let diff = 0
            if(IdButton.hasClass('match_odd_Blue') || IdButton.hasClass('winner_Blue')){
                result = (NewStake * Odds) - NewStake;
                diff = (100 * Odds) - 100;
            }else{
                result = (NewStake * Odds) / 100
                diff = (100 * Odds) / 100
            }
            let data = {
                result : diff,
                element,
                status:false,
                NewStake : 100
            }
            marketplusminus(data)
        }else{
            result = NewStake
            let diff = 100
            if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('winner_Blue')){
                plusMinus = (100 * Odds) - 100;
                 
            }else{
                plusMinus = (100 * Odds) / 100
            }
            let data = {
                result : diff ,
                element,
                status:true,
                NewStake : 100,
                plusMinus
            }
            marketplusminus(data)
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