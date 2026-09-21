/* =========================================================
   DREAM CAREERS - MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       ACTIVE NAVIGATION LINK
    ===================================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "home.html";

    const normalizedPage =
        decodeURIComponent(currentPage);

    const navLinks =
        document.querySelectorAll("nav ul li a");


    navLinks.forEach(function (link) {

        const href =
            decodeURIComponent(
                link.getAttribute("href") || ""
            );


        if (!href || href === "#") {
            return;
        }


        if (
            href === normalizedPage ||
            (
                normalizedPage === "index.html" &&
                href === "home.html"
            ) ||
            (
                normalizedPage === "" &&
                href === "home.html"
            )
        ) {

            link.classList.add("active");


            const parentDropdown =
                link.closest(".dropdown");


            if (parentDropdown) {

                const parentLink =
                    parentDropdown.querySelector(":scope > a");


                if (parentLink) {
                    parentLink.classList.add("active");
                }

            }

        }

    });



    /* =====================================================
       FEATURED REVIEWS
       INFINITE / CIRCULAR SLIDER
    ===================================================== */

    const track =
        document.getElementById("frCarouselTrack");

    const dots =
        document.querySelectorAll(".fr-dot");


    /*
     * Slider does not exist on this page
     */
    if (track) {

        /*
         * Get ONLY original cards
         */
        const originalCards =
            Array.from(
                track.querySelectorAll(
                    ".fr-card:not(.fr-clone)"
                )
            );


        if (originalCards.length > 0) {


            let currentIndex = 0;

            let visibleCards = 3;

            let autoSlide = null;

            let isAnimating = false;



            /* =====================================================
               GET NUMBER OF VISIBLE CARDS
            ===================================================== */

            function getVisibleCards() {

                if (window.innerWidth <= 768) {
                    return 1;
                }

                if (window.innerWidth <= 900) {
                    return 2;
                }

                return 3;

            }



            /* =====================================================
               CREATE CLONES
            ===================================================== */

            function createClones() {

                /*
                 * Remove old clones
                 */

                track
                    .querySelectorAll(".fr-clone")
                    .forEach(function (clone) {

                        clone.remove();

                    });


                visibleCards =
                    getVisibleCards();


                /*
                 * -----------------------------------------------
                 * PREPEND LAST CARDS
                 * -----------------------------------------------
                 */

                const previousCards = [];


                for (
                    let i = 0;
                    i < visibleCards;
                    i++
                ) {

                    const index =
                        originalCards.length -
                        visibleCards +
                        i;


                    const clone =
                        originalCards[
                            (index + originalCards.length) %
                            originalCards.length
                        ].cloneNode(true);


                    clone.classList.add("fr-clone");


                    previousCards.push(clone);

                }


                /*
                 * Add previous clones before originals
                 */

                previousCards.forEach(function (clone) {

                    track.insertBefore(
                        clone,
                        track.firstChild
                    );

                });


                /*
                 * -----------------------------------------------
                 * APPEND FIRST CARDS
                 * -----------------------------------------------
                 */

                for (
                    let i = 0;
                    i < visibleCards;
                    i++
                ) {

                    const clone =
                        originalCards[
                            i % originalCards.length
                        ].cloneNode(true);


                    clone.classList.add("fr-clone");


                    track.appendChild(clone);

                }

            }



            /* =====================================================
               GET CARD STEP
            ===================================================== */

            function getCardStep() {

                const card =
                    track.querySelector(".fr-card");


                if (!card) {
                    return 0;
                }


                const cardWidth =
                    card.getBoundingClientRect().width;


                /*
                 * CSS gap
                 */

                const gap = 24;


                return cardWidth + gap;

            }



            /* =====================================================
               UPDATE DOTS
            ===================================================== */

            function updateDots() {

                if (!dots.length) {
                    return;
                }


                let realIndex =
                    currentIndex - visibleCards;


                realIndex =
                    (
                        realIndex %
                        originalCards.length +
                        originalCards.length
                    ) %
                    originalCards.length;


                dots.forEach(function (dot, index) {

                    dot.classList.toggle(
                        "active",
                        index === realIndex
                    );

                });

            }



            /* =====================================================
               MOVE SLIDER
            ===================================================== */

            function moveSlider(instant = false) {

                const step =
                    getCardStep();


                if (!step) {
                    return;
                }


                if (instant) {

                    track.style.transition =
                        "none";

                } else {

                    track.style.transition =
                        "transform 0.6s ease-in-out";

                }


                track.style.transform =
                    `translateX(-${currentIndex * step}px)`;


                updateDots();

            }



            /* =====================================================
               START POSITION
            ===================================================== */

            function setInitialPosition() {

                currentIndex =
                    visibleCards;


                moveSlider(true);

            }



            /* =====================================================
               NEXT SLIDE
            ===================================================== */

            function nextSlide() {

                if (isAnimating) {
                    return;
                }


                isAnimating = true;


                currentIndex++;


                moveSlider(false);


                const endIndex =
                    visibleCards +
                    originalCards.length;


                if (currentIndex >= endIndex) {

                    setTimeout(function () {

                        track.style.transition =
                            "none";


                        currentIndex =
                            visibleCards;


                        moveSlider(true);


                        requestAnimationFrame(function () {

                            requestAnimationFrame(function () {

                                track.style.transition =
                                    "transform 0.6s ease-in-out";


                                isAnimating = false;

                            });

                        });

                    }, 650);

                } else {

                    setTimeout(function () {

                        isAnimating = false;

                    }, 650);

                }

            }



            /* =====================================================
               DOT CLICK
            ===================================================== */

            dots.forEach(function (dot, index) {

                dot.addEventListener(
                    "click",
                    function () {

                        if (isAnimating) {
                            return;
                        }


                        currentIndex =
                            visibleCards + index;


                        moveSlider(false);

                    }
                );

            });



            /* =====================================================
               INITIALIZE SLIDER
            ===================================================== */

            createClones();

            setInitialPosition();



            /* =====================================================
               AUTO SLIDE
            ===================================================== */

            autoSlide =
                setInterval(
                    function () {

                        nextSlide();

                    },
                    3000
                );



            /* =====================================================
               PAUSE ON HOVER
            ===================================================== */

            const carouselWrapper =
                document.querySelector(
                    ".fr-carousel-wrapper"
                );


            if (carouselWrapper) {

                carouselWrapper.addEventListener(
                    "mouseenter",
                    function () {

                        clearInterval(autoSlide);

                    }
                );


                carouselWrapper.addEventListener(
                    "mouseleave",
                    function () {

                        clearInterval(autoSlide);


                        autoSlide =
                            setInterval(
                                function () {

                                    nextSlide();

                                },
                                3000
                            );

                    }
                );

            }



            /* =====================================================
               RESIZE
            ===================================================== */

            let resizeTimer;


            window.addEventListener(
                "resize",
                function () {

                    clearTimeout(resizeTimer);


                    resizeTimer =
                        setTimeout(
                            function () {

                                createClones();


                                currentIndex =
                                    visibleCards;


                                moveSlider(true);


                                isAnimating = false;

                            },
                            250
                        );

                }
            );

        }

    }



    /* =====================================================
       HAMBURGER MENU
    ===================================================== */

    const hamburger =
        document.getElementById("hamburger");

    const mainNav =
        document.getElementById("main-nav");


    if (hamburger && mainNav) {


        /* =================================================
           HAMBURGER OPEN / CLOSE
        ================================================= */

        hamburger.addEventListener(
            "click",
            function (e) {

                e.stopPropagation();


                hamburger.classList.toggle(
                    "active"
                );


                mainNav.classList.toggle(
                    "open"
                );

            }
        );



        /* =================================================
           MOBILE DROPDOWN
        ================================================= */

        const dropdownToggles =
            document.querySelectorAll(
                ".dropdown-toggle"
            );


        dropdownToggles.forEach(function (toggle) {

            toggle.addEventListener(
                "click",
                function (e) {

                    /*
                     * Only mobile
                     */

                    if (window.innerWidth <= 768) {

                        e.preventDefault();

                        e.stopPropagation();


                        const currentDropdown =
                            this.closest(".dropdown");


                        /*
                         * Close all OTHER dropdowns
                         */

                        document
                            .querySelectorAll(".dropdown")
                            .forEach(function (dropdown) {

                                if (
                                    dropdown !== currentDropdown
                                ) {

                                    dropdown.classList.remove(
                                        "dropdown-open"
                                    );

                                }

                            });


                        /*
                         * Open / Close current dropdown
                         */

                        currentDropdown.classList.toggle(
                            "dropdown-open"
                        );

                    }

                }
            );

        });



        /* =================================================
           CLOSE DROPDOWN WHEN CLICKING SUBMENU LINK
        ================================================= */

        mainNav
            .querySelectorAll(".dropdown-menu a")
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        if (window.innerWidth <= 768) {

                            mainNav
                                .querySelectorAll(".dropdown")
                                .forEach(function (dropdown) {

                                    dropdown.classList.remove(
                                        "dropdown-open"
                                    );

                                });

                        }

                    }
                );

            });



        /* =================================================
           CLOSE MOBILE MENU OUTSIDE CLICK
        ================================================= */

        document.addEventListener(
            "click",
            function (e) {

                /*
                 * If click is outside navbar
                 * and outside hamburger
                 */

                if (
                    !mainNav.contains(e.target) &&
                    !hamburger.contains(e.target)
                ) {

                    /*
                     * Close navbar
                     */

                    mainNav.classList.remove(
                        "open"
                    );


                    hamburger.classList.remove(
                        "active"
                    );


                    /*
                     * Close ALL dropdowns
                     */

                    mainNav
                        .querySelectorAll(".dropdown")
                        .forEach(function (dropdown) {

                            dropdown.classList.remove(
                                "dropdown-open"
                            );

                        });

                }

            }
        );



        /* =================================================
           CLOSE DROPDOWNS WHEN RESIZING TO DESKTOP
        ================================================= */

        window.addEventListener(
            "resize",
            function () {

                if (window.innerWidth > 768) {

                    mainNav
                        .querySelectorAll(".dropdown")
                        .forEach(function (dropdown) {

                            dropdown.classList.remove(
                                "dropdown-open"
                            );

                        });

                }

            }
        );

    }

});