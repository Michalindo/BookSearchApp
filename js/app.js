$(function () { 

    const $booksGallery = $(".books-gallery");
    const $booksForm = $(".books-form");
    const $booksInput = $(".books-form-search");
    
    let startIndex = 0;
    let maxResults = 12;
    let resizeable = true;


    $booksForm.submit(function (e) {
        startIndex = 0;
        $booksGallery.empty(); 
        e.preventDefault();
        const searchTerm = $booksInput.val();
        if (searchTerm === ''){
            console.log("Type book's title");
        } else {
            loadBooks(searchTerm, startIndex, maxResults);
        };
    });


    $(window).scroll(getMoreBookData); // adding more books to gallery
    

    function loadBooks(searchTerm , startIndex, maxResults) {
        $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTerm}`,
            method: 'GET',
            data: {
                startIndex: startIndex,
                maxResults: maxResults,
            }
        })
        .done(function(response) {
            getBooksInfo(response);
            resizeable = true;
        }).fail(function(){
            console.log("NO DATA");
        });
    }


    function getBooksInfo(array) {
        $.each(array.items, function (i, value) { 
            let cover = getBookCover(value);
            let title = getBookTitle(value);
            let description = getBookDescription(value);

            populateGallery(cover, title, description);
        });
    } 


    function getBookCover(value) {
        if (value.volumeInfo.imageLinks !== undefined) {
            return value.volumeInfo.imageLinks.thumbnail;
        } else {
            return "images/NO_IMG.png";
        } 
    }


    function getBookTitle(value) {
        return value.volumeInfo.title;
    }


    function getBookDescription(value) {
        if (value.volumeInfo.description !== undefined) {
            if (value.volumeInfo.description.length > 120) {
                return value.volumeInfo.description.slice(0,120)+'...';
            } else {
                return value.volumeInfo.description;
            }
        } else {
            return "NO DESCRIPTION AVAILABLE";
        }
    } 


    function populateGallery (cover, title, description) {
        $booksGallery.append(
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
        if (($(window).scrollTop() + $(window).height() > $booksGallery.outerHeight(true)-100) && resizeable) {
            startIndex = startIndex + maxResults;
            loadBooks($booksInput.val(), startIndex, maxResults);
            resizeable = false
        }
    }

 })