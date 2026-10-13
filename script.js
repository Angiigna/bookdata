
$(document).ready(function () {

    let booksLoaded = false;
    let allBooks = [];

    // Open the book list
    $(".cta-btn").on("click", function () {

        $(".book-list").stop(true, true).slideDown(400);

        $("html, body").animate({
            scrollTop: $("#book-list").offset().top
        }, 500);

        // Fetch only once
        if (booksLoaded) {
            return;
        }

        $(".status").text("Finding your next favorite read...");

        $.ajax({
            url: "https://openlibrary.org/search.json",
            method: "GET",
            data: {
                q: "fiction",
                limit: 20,
                fields: "key,title,author_name,cover_i"
            },
            dataType: "json",

            success: function (response) {
                allBooks = response.docs || [];
                booksLoaded = true;

                displayBooks(allBooks);
            },

            error: function () {
                $(".status").text(
                    "We couldn't load the books. Please try again."
                );
            }
        });
    });

    // Render book cards
    function displayBooks(books) {

        $(".books").empty();

        if (books.length === 0) {
            $(".status").text("No books found. Try another search.");
            return;
        }

        $(".status").text(
            "A collection of " + books.length + " books to explore."
        );

        $.each(books, function (index, book) {

            const title = book.title || "Untitled";
            const author = book.author_name
                ? book.author_name.join(", ")
                : "Unknown author";

            const bookItem = $("<li>").addClass("book-card");

            if (book.cover_i) {
                $("<img>")
                    .addClass("book-cover")
                    .attr(
                        "src",
                        "https://covers.openlibrary.org/b/id/" +
                        book.cover_i + "-M.jpg"
                    )
                    .attr("alt", "Cover of " + title)
                    .attr("loading", "lazy")
                    .appendTo(bookItem);
            } else {
                $("<div>")
                    .addClass("book-cover no-cover")
                    .text("Cover unavailable")
                    .appendTo(bookItem);
            }

            $("<h3>")
                .text(title)
                .appendTo(bookItem);

            $("<p>")
                .text("By " + author)
                .appendTo(bookItem);

            if (book.key) {
                $("<a>")
                    .addClass("book-link")
                    .attr(
                        "href",
                        "https://openlibrary.org" + book.key
                    )
                    .attr("target", "_blank")
                    .attr("rel", "noopener noreferrer")
                    .text("View details →")
                    .appendTo(bookItem);
            }

            $(".books").append(bookItem);
        });
    }

    // Search through books already fetched
    $(".search-bar").on("submit", function (event) {
        event.preventDefault();

        if (!booksLoaded) {
            $(".cta-btn").trigger("click");
            return;
        }

        const query = $("#book-search").val().trim().toLowerCase();

        const filteredBooks = allBooks.filter(function (book) {
            const title = book.title || "";
            const authors = (book.author_name || []).join(" ");

            return (title + " " + authors)
                .toLowerCase()
                .includes(query);
        });

        displayBooks(filteredBooks);
    });

});
