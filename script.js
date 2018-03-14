
   var topics = ["moon", "stars", "sun"];
    
    function buttonMaker() {
        //create a loop to iterate through the topics array
        for(var i = 0; i <= topics.length - 1; i++){
            //creates a new div with the text of topics
            var newButton = $('<div>').text(topics[i]);
            //adds classes to the div to make them a button
            newButton.addClass('btn btn-secondary initialClick');
            //places buttons in topic array's order to the div with the id of buttonHolder
            $('#buttonHolder').append(newButton);
        }
    }

    function clearFavorties(){
        $('#clearButton').on('click', function(){
        localStorage.clear();
        
        generateFavorites();
    })
}

function changeSource(response) {
    //adds click event listener to all pictures
     $('.pictureButton').on('click', function(){
        //this gives the number variable a value equal to the position of the clicked picture in the rasponse.data
        var number = ($(this).data('number'));
        //if the data-value is at the originally assigned value
        if(($(this).data('value')) == "a") {
            //changes source to the running gif
            this.src = response.data[number].images.fixed_height.url;
            //changes value
            ($(this).data("value", "b"));

        } else {
            //changes source to unplayed gif
            this.src = response.data[number].images.fixed_height_still.url;
            //changes data-value back to original 
            ($(this).data("value", "a"));

        }
    });
}

function changeFavoriteSource(urlList) {
    $('.favoritePicture').on('click', function(){
        var number = ($(this).data('number'));

        if(($(this).data('value')) == 'a') {

            this.src = urlList[number].runningImage;

            $(this).data('value','b');
        } else {
            this.src = urlList[number].stillImage;
            ($(this).data('value', 'a'));
        }
    })
}


function addFavorites(response) {
    $('.card-text').on('click', function(){
        var list = JSON.parse(localStorage.getItem('favoriteList'));
        //var wordsList = JSON.parse(localStorage.getItem('wordList'));

        if(!Array.isArray(list)){
            list= [];
            
        }

       /*  if(!Array.isArray(wordsList)){
            wordsList = [];
        }
 */
        var imgNumber = $(this).data('number');
        var pushedImage = {
            rating: response.data[imgNumber].rating,
            stillImage: response.data[imgNumber].images.fixed_height_still.url,
            runningImage: response.data[imgNumber].images.fixed_height.url
        }  
        

        list.push(pushedImage);
        //wordsList.push(response.data[imgNumber].rating);
        localStorage.setItem('favoriteList', JSON.stringify(list));
       // localStorage.setItem('wordList', JSON.stringify(wordsList));
        generateFavorites();

    });
}

    function generateFavorites() {
        var urlList = JSON.parse(localStorage.getItem('favoriteList'));
        //var wordGeneratorList = JSON.parse(localStorage.getItem('wordList'));
        console.log(urlList);
        $('.removeHere').remove();

        if(!Array.isArray(urlList)){
            urlList = [];
           
        }

       /*  if(!Array.isArray(wordGeneratorList)){
            wordGeneratorList = [];
        }
        */ 
        for (var i = 0; i < urlList.length; i++){
            var divContainer = $('<div>').addClass('col-xs-6 col-sm-6 col-md-6 col-lg-6 removeHere');
            var img = $('<img>').attr('src', urlList[i].stillImage);
            var word = $('<p>').text('rating: ' + urlList[i].rating);
            word.attr('style', 'color: white;' )
            img.data('value ', 'a');
            img.data('number', i);
            img.attr('style', 'padding-bottom: 20px; width: 80%; height: 200px;')
            img.addClass('favoritePicture btn');
            divContainer.attr('style', 'borders: solid 2px white; background-color: grey;');
            divContainer.append(img);
            divContainer.prepend(word);
            $('#favoritesHere').append(divContainer);
        }  
        changeFavoriteSource(urlList); 
     }
    


    function getGiphy() {
        //creats a click event listener on the buttons
        $('.initialClick').on('click', function(){
            //clear out the buttons 
            $('#pictureHolder').empty();
                var topicName = ($(this).text());
                console.log(topicName);
                $.ajax({
                    url: "https://api.giphy.com/v1/gifs/search?q=" + topicName + "&limit=10&api_key=CTQB8RbrPA6QANI0K2AHuM915bo0avta",
                    method: 'GET',
            }).then(function(response) {
                //function needs to be inside the api call so that it recognizes "response"

                //puts the returned object in the console
                console.log(response);
                //loops through our newly given JSON
                for(var i = 0; i <= response.data.length - 1; i++){

                    //creates the new html elements
                    var newPicture = $('<img>').attr('src', response.data[i].images.fixed_height_still.url);
                    var containerDiv = $('<div>').attr('style', 'width:50%;');
                    var cardBlockDiv = $('<div>');
                    var ratingText = $('<h4>').addClass('card-title col-xs-12 col-sm-12 col-md-12 col-lg-12');
                    var cardButton = $('<p>').addClass('btn btn-info card-text');
                    
                    //adds neccessary classes and bootstrap classes
                    cardBlockDiv.addClass('card-block col-xs-12 col-sm-12 col-md-12 col-lg-12 text-center');
                    cardButton.data('number', i);
                    containerDiv.addClass('card text-center');
                    newPicture.addClass('btn pictureButton card-img-top');
                    ratingText.addClass('text-center');

                    //adds attributes to the html elements
                    newPicture.attr('style', 'width:80%; height: 200px;');
                    newPicture.attr('data-value', 'a');
                    newPicture.attr('data-number', i);
                   // ratingText.attr('style','width: 100%;');

                    //puts text into the desired html element
                    cardButton.text('click here to save to favorites');
                    ratingText.text('rating: ' + response.data[i].rating);

                    ratingText.append(cardButton);
                    cardBlockDiv.append(ratingText);
                    containerDiv.append(newPicture, cardBlockDiv)
                    $('#pictureHolder').append(containerDiv);
                    
                }
                changeSource(response);
                addFavorites(response);
            })
        })
    }

$(document).ready(function(){
    buttonMaker();
    $('#addButton').on('click', function(){
        event.preventDefault();

        $('#buttonHolder').empty();

        var buttonTitle = $('#wordSubmit').val().trim();
        $('#wordSubmit').val('');
        console.log(buttonTitle);
        var makeButton = topics.push(buttonTitle); 

        buttonMaker();
        getGiphy();
    });
    clearFavorties();
    generateFavorites();
    getGiphy();
})