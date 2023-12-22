$(document).ready(function(){
    $(".minus").click(function () {
        let buttonId = $(this).closest("tr").find(".beton").attr("id").slice(0, -1);
        let IdButton = $(`#${buttonId}`)
        let spanId =  ($(this).closest("tr").find('.set-stake-form-input2').val())
        let Odds = parseFloat($(this).closest('tr').find(".nww-bet-slip-wrp-col1-txt-num").text())
        let NewStake = spanId - 100;
        let result
        let element = $(this)
        let staleDiff = 100
        if($(this).closest('tr').hasClass('back-inplaymatch')){
            if(IdButton.hasClass('match_odd_Blue') || IdButton.hasClass('winner_Blue')){
                result = (NewStake * Odds) - NewStake;
                resultDiff = (staleDiff * Odds) - staleDiff;
            }else{
                result = (NewStake * Odds) / 100
                resultDiff = (staleDiff * Odds) / 100
            }
            let data = {
                result : resultDiff,
                element,
                status:false,
                NewStake : staleDiff,
                check : NewStake
            }
            Onlyminus(data)
        }else{
            result = NewStake
            let resultDiff = 100

            if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('winner_Blue')){
                plusMinus = (100 * Odds) - 100;
                 
            }else{
                plusMinus = (100 * Odds) / 100
            }
            let data = {
                result:resultDiff,
                element,
                status:true,
                NewStake : 100,
                plusMinus,
                check:NewStake
            }
            Onlyminus(data)
            // if(IdButton.hasClass('match_odd_Red') || IdButton.hasClass('bookmaker_red')){
            //     result = (NewStake * 2) - NewStake;
            // }else{
            //     result = (NewStake * Odds) / 100
            // }
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