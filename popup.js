let weekly_list;
let ingredients = [];
let quantities = [
    'ml', 'cm', 'g', 'kg', 
    'pinch', 'medium', 'handful',
    'slices', 'slice', 'small', 'large',
    'sprinkle', 'squares', 'tbsp', 'tsp', 'whole']
let combined_ingredients = {};

chrome.runtime.sendMessage({type: 'showList'});
chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        switch(msg.type) {
            case "populateList":
                weekly_list = msg.data;
                for(let day in weekly_list){
                    for(let meal of weekly_list[day]){
                        for(let ingredient of meal.shopping_list){
                            ingredients.push(ingredient)
                        }
                    }
                }
                ingredients.sort(function(x,y){
                    var xp = x.split(' ').slice(2).join(' ');
                    var yp = y.split(' ').slice(2).join(' ');
                    return xp == yp ? 0 : xp < yp ? -1 : 1;
                  });
                
                
                let added = [];
                for(let i in ingredients){
                    var name = ingredients[i].split(' ').slice(2).join(' ');
                    var qty = ingredients[i].split(' ')[1];
                    var amnt = ingredients[i].split(' ')[0];
                    if(!added.includes(name)) {
                        combined_ingredients[name] = {
                            "ingredient": name,
                            "quantity": qty,
                            "amount": Number(amnt)
                        }
                        added.push(name);
                    } else {
                        combined_ingredients[name]['amount'] += Number(amnt);
                    }
                }
                break;
            default:
                console.error("Unrecognised message: ", msg);
        }
    }
);

$(document).ready(function(){
    $('#download_csv').click(function(){
        let csvContent = "data:text/csv;charset=utf-8,";
        let download_arr = []
        csvContent += Object.keys(Object.values(combined_ingredients)[0]).join(",") +'\n'
        for(let c of Object.values(combined_ingredients)){
            csvContent += Object.values(c).join(",") +'\n';
        }
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "custom_shopping_list.csv");
        document.body.appendChild(link);
        link.click();

    })
})

/*chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.runtime.sendMessage({type: 'showList'});
});*/