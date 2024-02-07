{
                    $project: { 
                        _id:'$_id',
                        userName: "$userName",
                        parentArray:"$parentArray",
                        selections2:{ 
                            $map: { 
                                input: "$selections",
                                as: "selection",
                                in: { 
                                    selectionName: "$$selection.selectionName",
                                    totalAmount: "$$selection.totalAmount",
                                    matchName: "$$selection.matchName",
                                    Stake: "$$selection.Stake",
                                    winAmount :"$$selection.winAmount",
                                    lossAmount : "$$selection.lossAmount",
                                    winAmount2: {
                                        $reduce: {
                                          input: { $reverseArray: '$parentArray' },
                                          initialValue: { value: 0, flag: true },
                                          in: {

                                            $cond: {
                                              if: {
                                                $and: [
                                                  { $eq: ['$$this.parentUSerId', loginId] },
                                                  { $eq: ['$$value.flag', true] }
                                                ]
                                              },
                                              then: {                                                
                                                $cond: {
                                                  if: { $eq: [data.LOGINDATA.LOGINUSER.roleName, "AGENT"] },
                                                  then: {
                                                    value: {
                                                      $multiply: [
                                                        '$$selection.winAmount',
                                                        { $divide: [{ $subtract: [100, "$$this.uplineShare"] }, 100] }
                                                      ]
                                                    }                                                   
                                                  },
                                                  else: {value: "$$value.value"}
                                                }
                                              },
                                              else: {
                                                $cond: {
                                                  if: { $eq: ["$$value.value", 0]
                                                    },
                                                  then: {                                                    
                                                    value: 
                                                    {
                                                      $multiply: [
                                                        '$$selection.winAmount',
                                                        { $divide: ["$$this.uplineShare", 100] }
                                                      ]
                                                    }
                                                  },
                                                  else: {value: "$$value.value"}
                                                }
                                              }
                                            }
                                          }
                                        }
                                      },
                                    lossAmount2:{
                                        $reduce:{
                                            input: { $reverseArray: '$parentArray' },
                                            initialValue: { value: 0, flag: true },
                                            in : {
                                                $cond:{
                                                    if : {
                                                        $and: [
                                                          { $ne: ['$$this.parentUSerId', loginId] }, 
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
                                                                        if : {$eq : ["$$this.parentUSerId", loginId]},
                                                                        then:{
                                                                            $cond:{
                                                                                if:{$eq:['$$this.uplineShare', 0]},
                                                                                then:0,
                                                                                else:{$subtract : ["$$selection.lossAmount",{$multiply: ["$$selection.lossAmount", { $divide: ["$$this.uplineShare", 100] }]}]}

                                                                            }
                                                                        },
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
                                    exposure:{
                                        $reduce:{ 
                                            input: { $reverseArray: '$parentArray' },
                                            initialValue: { value: 0, flag: true },
                                            in : {
                                                $cond:{
                                                    if : {
                                                        $and: [
                                                          { $ne: ['$$this.parentUSerId', loginId] }, 
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
                                                                        if : {$eq : ["$parentId", loginId]},
                                                                        then:{$subtract : ["$$selection.exposure",{$multiply: ["$$selection.exposure", { $divide: ["$$this.uplineShare", 100] }]}]},
                                                                        else:{$subtract : ["$$selection.exposure",{$multiply: ["$$selection.exposure", { $divide: ["$$this.uplineShare", 100] }]}]}
                                                                    }
                                                                },
                                                                else : {$cond:{
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
                                    winAmount3: {
                                        $reduce:{
                                            input: { $reverseArray: '$parentArray' },
                                            initialValue: { value: 0, flag: true },
                                            in : {
                                                $cond:{
                                                    if : {
                                                        $and: [
                                                          { $ne: ['$$this.parentUSerId', loginId] }, 
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
                                                                        if : {$eq : ["$parentId", loginId]},
                                                                        then:"$$selection.winAmount",
                                                                        else:"$$selection.winAmount"
                                                                    }
                                                                },
                                                                else : "$$value.value"
                                                            }
                                                        },
                                                        flag:false
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    lossAmount3:{
                                        $reduce:{
                                            input: { $reverseArray: '$parentArray' },
                                            initialValue: { value: 0, flag: true },
                                            in : {
                                                $cond:{
                                                    if : {
                                                        $and: [
                                                          { $ne: ['$$this.parentUSerId', loginId] }, 
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
                                                                        if : {$eq : ["$parentId", loginId]},
                                                                        then:"$$selection.lossAmount",
                                                                        else:"$$selection.lossAmount"
                                                                    }
                                                                },
                                                                else : "$$value.value"
                                                            }
                                                        },
                                                        flag:false
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    exposure2:{
                                        $reduce:{ 
                                            input: { $reverseArray: '$parentArray' },
                                            initialValue: { value: 0, flag: true },
                                            in : {
                                                $cond:{
                                                    if : {
                                                        $and: [
                                                          { $ne: ['$$this.parentUSerId', loginId] }, 
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
                                                                        if : {$eq : ["$parentId", loginId]},
                                                                        then:"$$selection.exposure",
                                                                        else:"$$selection.exposure"
                                                                    }
                                                                },
                                                                else : "$$value.value"
                                                            }
                                                        },
                                                        flag:false
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },