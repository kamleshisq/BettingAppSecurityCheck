/api/v1/users/getOwnChild?id=653f47d6bc7bfe73fde5beee



64e5c23e2ceb9abbb4e4d266

64e5c1892ceb9abbb4e4d1b4


if(data.LOGINDATA.LOGINUSER.role.roleName == 'Operator'){
    let parentUser = await User.findById(data.LOGINDATA.LOGINUSER.parent_id)
    data.LOGINDATA.LOGINUSER = parentUser
}


/var/www/bettingApp/utils/betPlace.js:64
            marketDetails = oddEvenData.find(item => item.marketId === data.data.market)
                                        ^

TypeError: Cannot read properties of null (reading 'find')
    at placeBet (/var/www/bettingApp/utils/betPlace.js:64:41)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Socket.<anonymous> (/var/www/bettingApp/server.js:1834:22)

Node.js v18.13.0

function eventID(){
            let eventId = $(".eventName").attr("id")
            socket.emit("eventId", eventId)
            setTimeout(()=>{
                eventID()
              }, 500)

        }



        data: {
            title: 'Pakistan v Bangladesh',
            eventId: '32744419',
            odds: '1.01',
            secId: '7461',
            market: '1.220192671',
            stake: '300',
            spoetId: '4',
            bettype2: 'LAY'
          }





          {
            data: {
              title: 'Bangladesh Women v Pakistan Women',
              eventId: 32758662,
              market: '1.220453794',
              stake: '1000',
              spoetId: '4',
              odds: '-',
              secId: 10816383,
              bettype2: 'BACK'
            },
            LOGINDATA: {
              LOGINUSER: {
                _id: new ObjectId("6540fd0a26a533b518692d27"),
                userName: 'mjRT2ec',
                name: 'mjRT2ec',
                roleName: 'user',
                whiteLabel: 'jayesh',
                creditReference: 10000,
                balance: 10000,
                availableBalance: 10000,
                downlineBalance: 0,
                myPL: 0,
                uplinePL: 0,
                lifetimePL: 0,
                pointsWL: 0,
                exposure: 0,
                exposureLimit: 1000,
                lifeTimeCredit: 0,
                lifeTimeDeposit: 0,
                parent_id: '6540fb205030a819abeaec9e',
                role: new ObjectId("6492fe4fd09db28e00761694"),
                role_type: 5,
                password: '$2b$12$NJyzDlPwkvthZwI/t/gbleOMqf0CMqB2bbmFz0tLN6mR/FvikjLtW',
                isActive: true,
                is_Online: false,
                betLock: false,
                parentUsers: [Array],
                gameCount: [],
                Bets: 0,
                Won: 0,
                Loss: 0,
                kycDocName: null,
                kycDoc: null,
                kycDocNum: null,
                kycNotification: false,
                isKycVer: false,
                contact: 987654321,
                email: 'cronetestingUser@gmail.com',
                myShare: 100,
                Share: 0,
                transferLock: false,
                maxCreditReference: 100000,
                commission: 0,
                netCommisssion: 0,
                OperatorAuthorization: [],
                __v: 0
              }
            }
          }


          FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
 1: 0x7fed13a00c6c node::Abort() [/lib/x86_64-linux-gnu/libnode.so.108]
 2: 0x7fed138f42ac  [/lib/x86_64-linux-gnu/libnode.so.108]
 3: 0x7fed13d8b5b4 v8::Utils::ReportOOMFailure(v8::internal::Isolate*, char const*, bool) [/lib/x86_64-linux-gnu/libnode.so.108]
 4: 0x7fed13d8b9a7 v8::internal::V8::FatalProcessOutOfMemory(v8::internal::Isolate*, char const*, bool) [/lib/x86_64-linux-gnu/libnode.so.108]
 5: 0x7fed13f74a59  [/lib/x86_64-linux-gnu/libnode.so.108]
 6: 0x7fed13f8ac23 v8::internal::Heap::CollectGarbage(v8::internal::AllocationSpace, v8::internal::GarbageCollectionReason, v8::GCCallbackFlags) [/lib/x86_64-linux-gnu/libnode.so.108]
 7: 0x7fed13f65d76 v8::internal::HeapAllocator::AllocateRawWithLightRetrySlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/lib/x86_64-linux-gnu/libnode.so.108]
 8: 0x7fed13f67127 v8::internal::HeapAllocator::AllocateRawWithRetryOrFailSlowPath(int, v8::internal::AllocationType, v8::internal::AllocationOrigin, v8::internal::AllocationAlignment) [/lib/x86_64-linux-gnu/libnode.so.108]
 9: 0x7fed13f46066 v8::internal::Factory::AllocateRaw(int, v8::internal::AllocationType, v8::internal::AllocationAlignment) [/lib/x86_64-linux-gnu/libnode.so.108]
10: 0x7fed13f3dbc0 v8::internal::FactoryBase<v8::internal::Factory>::AllocateRawArray(int, v8::internal::AllocationType) [/lib/x86_64-linux-gnu/libnode.so.108]
11: 0x7fed13f3dd38 v8::internal::FactoryBase<v8::internal::Factory>::NewFixedArrayWithFiller(v8::internal::Handle<v8::internal::Map>, int, v8::internal::Handle<v8::internal::Oddball>, v8::internal::AllocationType) [/lib/x86_64-linux-gnu/libnode.so.108]
12: 0x7fed14214ce5 v8::internal::Handle<v8::internal::NameDictionary> v8::internal::HashTable<v8::internal::NameDictionary, v8::internal::NameDictionaryShape>::NewInternal<v8::internal::Isolate>(v8::internal::Isolate*, int, v8::internal::AllocationType) [/lib/x86_64-linux-gnu/libnode.so.108]
13: 0x7fed142150f6 v8::internal::Handle<v8::internal::NameDictionary> v8::internal::HashTable<v8::internal::NameDictionary, v8::internal::NameDictionaryShape>::EnsureCapacity<v8::internal::Isolate>(v8::internal::Isolate*, v8::internal::Handle<v8::internal::NameDictionary>, int, v8::internal::AllocationType) [/lib/x86_64-linux-gnu/libnode.so.108]
14: 0x7fed14215167 v8::internal::Handle<v8::internal::NameDictionary> v8::internal::Dictionary<v8::internal::NameDictionary, v8::internal::NameDictionaryShape>::Add<v8::internal::Isolate>(v8::internal::Isolate*, v8::internal::Handle<v8::internal::NameDictionary>, v8::internal::Handle<v8::internal::Name>, v8::internal::Handle<v8::internal::Object>, v8::internal::PropertyDetails, v8::internal::InternalIndex*) [/lib/x86_64-linux-gnu/libnode.so.108]
15: 0x7fed142155fe v8::internal::BaseNameDictionary<v8::internal::NameDictionary, v8::internal::NameDictionaryShape>::Add(v8::internal::Isolate*, v8::internal::Handle<v8::internal::NameDictionary>, v8::internal::Handle<v8::internal::Name>, v8::internal::Handle<v8::internal::Object>, v8::internal::PropertyDetails, v8::internal::InternalIndex*) [/lib/x86_64-linux-gnu/libnode.so.108]
16: 0x7fed1434e56d v8::internal::Runtime_AddDictionaryProperty(int, unsigned long*, v8::internal::Isolate*) [/lib/x86_64-linux-gnu/libnode.so.108]
17: 0x7fed13c9b379  [/lib/x86_64-linux-gnu/libnode.so.108]
[nodemon] app crashed - waiting for file changes before starting...