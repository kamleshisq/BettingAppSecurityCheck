winAmount2: {
                                                $reduce:{
                                                    input:'$parentArray',
                                                    initialValue: { value: 0, flag: true },
                                                    in : {
                                                        $cond:{
                                                            if : {
                                                                $and: [
                                                                  { $ne: ['$$this.parentUSerId', ele.id] }, 
                                                                  { $eq: ['$$value.flag', true] } 
                                                                ]
                                                              },
                                                            then : {
                                                                value: { 
                                                                    $cond:{
                                                                        if:{ $eq: ["$$value.value", 0] },
                                                                        then:{
                                                                            $multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                        },
                                                                        else:{
                                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                        }
                                                                    }
                                                                },
                                                                flag: true,
                                                                
                                                            },
                                                            else : {
                                                                value: {
                                                                    $cond : {
                                                                        if : { $eq : ["$$value.value" , 0]},
                                                                        then : {
                                                                            $cond:{
                                                                                if : {$eq : ["$parentId", ele.id]},
                                                                                then:{$subtract : ["$$selection.winAmount",{$multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]}]},
                                                                                else:{$subtract : ["$$selection.winAmount",{$multiply: ["$$selection.winAmount", { $divide: ["$$this.uplineShare", 100] }]}]}
                                                                            }
                                                                        },
                                                                        else :{$cond:{
                                                                            if : {$eq : ['$$value.flag', true]},
                                                                            then: {$subtract : ["$$value.value",{$multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]}]},
                                                                            else:"$$value.value"
                                                                        }}
                                                                        
                                                                    }
                                                                },
                                                                flag:false
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            lossAmount2:{
                                                $reduce:{
                                                    input:'$parentArray',
                                                    initialValue: { value: 0, flag: true },
                                                    in : {
                                                        $cond:{
                                                            if : {
                                                                $and: [
                                                                  { $ne: ['$$this.parentUSerId', ele.id] }, 
                                                                  { $eq: ['$$value.flag', true] } 
                                                                ]
                                                              },
                                                            then : {
                                                                value: { 
                                                                    $cond:{
                                                                        if:{ $eq: ["$$value.value", 0] },
                                                                        then:{
                                                                            $multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]
                                                                        },
                                                                        else:{
                                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                        }
                                                                    }
                                                                },
                                                                flag: true,
                                                                
                                                            },
                                                            else : {
                                                                value: {
                                                                    $cond : {
                                                                        if : { $eq : ["$$value.value" , 0]},
                                                                        then : {
                                                                            $cond:{
                                                                                if : {$eq : ["$parentId", ele.id]},
                                                                                then:{$subtract : ["$$selection.lossAmount",{$multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]}]},
                                                                                else:{$subtract : ["$$selection.lossAmount",{$multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]}]}
                                                                            }
                                                                        },
                                                                        else :{$cond:{
                                                                            if : {$eq : ['$$value.flag', true]},
                                                                            then: {$subtract : ["$$value.value",{$multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]}]},
                                                                            else:"$$value.value"
                                                                        }}
                                                                        
                                                                    }
                                                                },
                                                                flag:false
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            exposure: {
                                                $reduce:{
                                                    input:'$parentArray',
                                                    initialValue: { value: 0, flag: true },
                                                    in : {
                                                        $cond:{
                                                            if : {
                                                                $and: [
                                                                  { $ne: ['$$this.parentUSerId', ele.id] }, 
                                                                  { $eq: ['$$value.flag', true] } 
                                                                ]
                                                              },
                                                            then : {
                                                                value: { 
                                                                    $cond:{
                                                                        if:{ $eq: ["$$value.value", 0] },
                                                                        then:{
                                                                            $multiply: ["$$selection.exposure", { $divide: ["$$this.uplineShare", 100] }]
                                                                        },
                                                                        else:{
                                                                            $multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]
                                                                        }
                                                                    }
                                                                },
                                                                flag: true,
                                                                
                                                            },
                                                            else : {
                                                                value: {
                                                                    $cond : {
                                                                        if : { $eq : ["$$value.value" , 0]},
                                                                        then : {
                                                                            $cond:{
                                                                                if : {$eq : ["$parentId", ele.id]},
                                                                                then:{$subtract : ["$$selection.exposure",{$multiply: ["$$selection.exposure", { $divide: ["$$this.uplineShare", 100] }]}]},
                                                                                else:{$subtract : ["$$selection.exposure",{$multiply: ["$$selection.exposure", { $divide: ["$$this.uplineShare", 100] }]}]}
                                                                            }
                                                                        },
                                                                        else :{$cond:{
                                                                            if : {$eq : ['$$value.flag', true]},
                                                                            then: {$subtract : ["$$value.value",{$multiply: ["$$value.value", { $divide: ["$$this.uplineShare", 100] }]}]},
                                                                            else:"$$value.value"
                                                                        }}
                                                                        
                                                                    }
                                                                },
                                                                flag:false
                                                            }
                                                        }
                                                    }
                                                }
                                            },