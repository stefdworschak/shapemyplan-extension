var imported = document.createElement('script');
imported.src = chrome.runtime.getURL("jquery.min.js");
document.head.appendChild(imported);

$(document).ready(function(){
    let weekly_list = {};
    let dates = $('.day');
    let days_with_meals = $('.meal-row-inner:not(.filtertag_result)');
    for(let day of dates){
        weekly_list[day.innerText] = [];
    }

    let num_day = 0;
    for(let day_with_meals of days_with_meals){
        let meals_of_day = $(day_with_meals).children();
        let meal_cards = meals_of_day.find('.card-meal.mb-2');
        for(let meal_card of meal_cards){
            let card = $(meal_card);
            let day_key = Object.keys(weekly_list)[num_day];
            weekly_list[day_key].push(
                {
                    'category': card.children()[1].innerText,
                    'name': card.children()[2].innerText,
                    'href': card.attr('href')
                }
            )
        }
        num_day++;
    }
    chrome.runtime.sendMessage({type: 'createList', data: weekly_list})
    let meal_keys = Object.keys(weekly_list);
    for(let d in meal_keys){
        let meal_key = meal_keys[d];
        console.log(weekly_list[meal_key])
        for(let m in Object.entries(weekly_list[meal_key])){
            let meal = weekly_list[meal_key][m];
            console.log(meal)
            getLinkContents(meal.href, meal_key, meal.name);
        }
    }
                  
})


function parseLinkContent(content){
    let ingredients = $(content).find('.ingred-par');
    return ingredients;

}

async function getLinkContents(url, key, name){
    let list_of_ingredients = [];
    let content = await $.get(url);
    let ingredients = $(content).find('.ingred-par');
    console.log($(content).find('.ingred-par'));
    for(let ingredient of ingredients){
        list_of_ingredients.push(ingredient.innerText.trim());
    }
    chrome.runtime.sendMessage(
        {type:'updateList', data: list_of_ingredients, key: key, name: name});
    console.log(true);
    return;
}