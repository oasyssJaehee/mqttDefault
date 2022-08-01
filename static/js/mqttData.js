/*
    0 : 구분
    1 : 1on/0off
    2 : 릴레이소켓
*/
var relayOn = new Uint8Array(10); 
relayOn[0] = 211;
relayOn[1] = 1;
relayOn[2] = 0;
relayOn[3] = 0;
relayOn[4] = 0;
relayOn[5] = 0;
relayOn[6] = 0;
relayOn[7] = 0;
relayOn[8] = 0;
relayOn[9] = 0;

var relayOff = new Uint8Array(10); 
relayOff[0] = 211;
relayOff[1] = 0;
relayOff[2] = 0;
relayOff[3] = 0;
relayOff[4] = 0;
relayOff[5] = 0;
relayOff[6] = 0;
relayOff[7] = 0;
relayOff[8] = 0;
relayOff[9] = 0;

function checkSum(data){
    var check = 0;
    for (var j = 0; j < 9; j++) {
        check += data[j];
    }
    var result = check % 256;
    data[9] = result;

    return data;
}
/*
    on  : relayOn
    off : relayOff
*/
// function dataOutput(type){
//     if(type == "on"){
//         for(){

//         }
//     }
//     return
// }