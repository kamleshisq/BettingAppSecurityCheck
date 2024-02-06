const userModel = require('../model/userModel');

async function findvisible( user ){

    let visibleofThatUser2 = 0
    for(let i = 0; i < user.parentUsers.length; i++){
        let thatParentUSer = await userModel.findById(user.parentUsers[i])
        visibleofThatUser2 +=  thatParentUSer.Share
    }

    let actualVisible = 100 - visibleofThatUser2
    return actualVisible
}

module.exports = findvisible