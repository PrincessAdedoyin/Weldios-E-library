// When the document is ready, do the following
$(document).ready(function () {
    // When the 'Read' button is clicked, show the modal with the book details
    $('.btn-read').click(function () {
        var title = $(this).data('title');
        var author = $(this).data('author');
        var summary = $(this).data('summary');
        var modal = $('#book-details-modal');
        modal.find('.modal-title').text(title);
        modal.find('.modal-author').text(author);
        modal.find('.modal-summary').text(summary);
        modal.modal('show');
    });

    // When the 'Borrow' button is clicked, show the confirmation modal
    $('.btn-borrow').click(function () {
        var title = $(this).data('title');
        var author = $(this).data('author');
        var modal = $('#borrow-modal');
        modal.find('.modal-title').text(title);
        modal.find('.modal-author').text(author);
        modal.modal('show');
    });
});

// Get all the book cards on the page
const bookCards = document.querySelectorAll(".book-card");

// Attach a click event listener to each book card
bookCards.forEach((card) => {
    card.addEventListener("click", (event) => {
        // Get the book ID from the data-id attribute on the card
        const bookId = card.dataset.id;

        // Make an AJAX request to fetch the book details
        fetch(`/book/${bookId}`)
            .then((response) => response.json())
            .then((data) => {
                // Fill in the book details on the modal
                const modalTitle = document.querySelector(".modal-title");
                const modalBody = document.querySelector(".modal-body");
                modalTitle.textContent = data.title;
                modalBody.innerHTML = `
          <p><strong>Author:</strong> ${data.author}</p>
          <p><strong>Genre:</strong> ${data.genre}</p>
          <p><strong>Description:</strong> ${data.description}</p>
        `;

                // Show the modal
                const modal = new bootstrap.Modal(
                    document.querySelector("#book-modal")
                );
                modal.show();
            })
            .catch((error) => {
                console.error(error);
            });
    });
});
