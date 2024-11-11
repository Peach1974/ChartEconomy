document.addEventListener('DOMContentLoaded', function () {
    setActiveMenuItem();
    initGlossaryFilter();
    initGlossaryReset();
    initializeCardStates();

    const glossaryResults = document.querySelector('.glossary__results');
    const glossaryTopOffset = glossaryResults.getBoundingClientRect().top;

    document.documentElement.style.setProperty('--glossary-top-offset', `${glossaryTopOffset}px`);

    const glossaryItems = document.querySelectorAll('.glossary__results__item .card__content');

    glossaryItems.forEach(item => {
        item.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor click behavior
            const wasExpanded = this.classList.contains('expanded');
            glossaryItems.forEach(card => {
                if (card !== this) {
                    card.classList.remove('expanded', 'hiding');
                    card.classList.add('collapsed');
                    card.nextElementSibling.style.visibility = 'hidden'; // Hide silhouette placeholder
                    card.parentElement.style.zIndex = '1'; // Reset z-index for all cards
                }
            });
            if (!wasExpanded) {
                this.classList.add('expanded');
                this.classList.remove('collapsed', 'hiding');
                this.nextElementSibling.style.visibility = 'visible'; // Show silhouette placeholder
                this.parentElement.style.zIndex = '10'; // Bring the clicked card to the top
                adjustScrollIfNeeded(this);
            } else {
                collapseCard(this);
            }
        });
    });

    // Add click event listener for silhouette placeholders
    const silhouettePlaceholders = document.querySelectorAll('.silhouette-placeholder');
    silhouettePlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const cardContent = this.previousElementSibling;
            collapseCard(cardContent);
        });
    });

    function adjustScrollIfNeeded(element) {
        const elemRect = element.getBoundingClientRect();
        const isVisible = (elemRect.top >= 0) && (elemRect.bottom <= window.innerHeight);
        if (!isVisible) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function collapseCard(card) {
        // Immediately remove the 'expanded' class to avoid the bounce effect
        card.classList.remove('expanded');
    
        // Add 'collapsed' class directly
        card.classList.add('collapsed');
    
        // Hide the silhouette placeholder if it exists
        if (card.nextElementSibling) {
            card.nextElementSibling.style.visibility = 'hidden';
        }
    }
    
});

function initializeCardStates() {
    const cards = document.querySelectorAll('.glossary__results__item .card__content');
    cards.forEach(card => {
        card.classList.add('collapsed'); // Initially add 'collapsed' class to all cards
        card.classList.remove('initial'); // Remove the initial class to display the cards
    });
}

function initGlossaryFilter() {
    $("#glossarySearchInput").on("keyup", filterGlossary);
    $(".glossary__nav button").click(function () {
        $(this).toggleClass("active").siblings().removeClass("active");
        filterGlossary();
    });
}

function filterGlossary() {
    const searchInputElement = $("#glossarySearchInput");
    var searchInputValue = searchInputElement.length ? searchInputElement.val().toUpperCase() : '';  // Check if the input exists
    var activeNav = $(".glossary__nav button.active").attr("data-nav");

    // Hide all the glossary items
    $(".glossary__results__item").hide();

    // Check if any nav button is active
    var isAnyNavActive = $(".glossary__nav button").hasClass("active");

    // Loop through all glossary items
    $(".glossary__results__item").each(function () {
        var item = $(this).attr("data-item").toUpperCase();
        var term = $(this).attr("data-term").toUpperCase();

        // Logic to determine if the item should be shown
        if (item.indexOf(searchInputValue) !== -1) {
            if (!isAnyNavActive || (activeNav === '#' && !isNaN(term.charAt(0))) || term.startsWith(activeNav)) {
                $(this).show();
            }
        }
    });
}


function initGlossaryReset() {
    $("#resetButton").click(function() {
        $(".glossary__nav__item").removeClass("active");
        $(".glossary__results__item").show();
        $("#glossarySearchInput").val(''); // Clear the search input
    });
}

function setActiveMenuItem() {
    var currentPath = window.location.pathname.split('/').pop(); // Gets the filename from the URL
    $('.sidebar ul li a').each(function() {
        var menuItem = $(this);
        var menuItemPath = menuItem.attr('href');
        if (menuItemPath === currentPath) {
            menuItem.closest('li').addClass('active');
        } else {
            menuItem.closest('li').removeClass('active');
        }
    });
}
