$(function () { 


    const booksGallery = $(".books-gallery");
    const booksForm = $(".books-form");
    const booksInput = $(".books-form-search")
    let startIndex = 0;
    let maxResults = 12;


    booksForm.submit(function (e) {
        startIndex = 0
        booksGallery.empty(); 
        e.preventDefault();
        const searchTerm = booksInput.val();
        if (searchTerm === ''){
            console.log('Podaj tytuł');
        } else {
            loadBooks(searchTerm, startIndex, maxResults)
            startIndex = startIndex + maxResults
        };
    });

    window.onscroll = getMoreBookData // adding more books at the end of the page


    function loadBooks(searchTerm , startIndex, maxResults) {
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTerm}` ,
            method: 'GET',
            data: {
                startIndex: startIndex,
                maxResults: maxResults,
            }
        })
        .done(function(response) {
            // testy
            console.log('start index: ' + startIndex,'maxresult: '+ maxResults)
            console.log(response)
            console.log('wszystkie itemy:' + response.totalItems)
            console.log('search term: ' + searchTerm)
            getBooksInfo(response)

            console.log('wysokosc galerii: '+booksGallery.outerHeight(true)) 
            console.log('wysokosc na stronie: '+ (window.pageYOffset + window.innerHeight))

        }).fail(function(){
            console.log("NO DATA")
        });
    }

    function getBooksInfo(array) {
        $.each(array.items, function (i, value) { 
            let cover = getBookCover(value);
            let title = getBookTitle(value);
            let description = getBookDescription(value);

            populateGallery(cover, title, description)
        });
    } 

    function getBookCover(value) {
        if (value.volumeInfo.imageLinks !== undefined) {
            return value.volumeInfo.imageLinks.thumbnail
        } else {
            return "images/NO_IMG.png"
        } 
    }

    function getBookTitle(value) {
        return value.volumeInfo.title
    }


    function getBookDescription(value) {
        if (value.volumeInfo.description !== undefined) {
            if (value.volumeInfo.description.length > 120) {
                return value.volumeInfo.description.slice(0,120)+'...'
            } else {
                return value.volumeInfo.description
            }
        } else {
            return "NO DESCRIPTION AVAILABLE"
        }
    } 


    function populateGallery (cover, title, description) {
        booksGallery.append(
            `<div class ="books-gallery-book">
                <div class="book-img">
                    <img src=${cover}/>
                </div>
                <p class="book-title">${title}</p>
                <p class="books-description">${description}</p>
            </div>`
            );
    }

    function getMoreBookData() {
        let heightBookGallery = Math.round(booksGallery.outerHeight(true)/100);
        let yOffset = window.pageYOffset;
        let y = Math.round((yOffset + window.innerHeight)/10);
        let executed = true

        if (y >= heightBookGallery && executed === false) {
            // loadBooks(booksInput.val(), startIndex, maxResults)
            startIndex = startIndex + maxResults
            executed = true
            console.log('y:'+ y, 'bookgal: ' +heightBookGallery, 'yoffset: '+yOffset)
        } 
    }

 })