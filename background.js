let weekly_list;
let ingredients = [];
let ingredients_count = 0;

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        switch(msg.type) {
            case "createList":
                weekly_list = msg.data;
                break;
            case "updateList":
                console.log(weekly_list);
                for(let k in weekly_list[msg.key]) {
                    let meal = weekly_list[msg.key][k];
                    if(meal.name == msg.name){
                        weekly_list[msg.key][k]['shopping_list']=msg.data;
                        ingredients.concat(msg.data);
                        ingredients_count++;
                    }
                }
                if(ingredients_count == (7 * 5)){
                    chrome.browserAction.setIcon({path: "48_green.png"});
                }
                break;
            case "showList":
                if(ingredients_count == (7 * 5)){
                    chrome.runtime.sendMessage({type: 'populateList', data: weekly_list, ingredients: ingredients})
                }
                break;
            default:
                console.error("Unrecognised message: ", msg);
        }
    }
);