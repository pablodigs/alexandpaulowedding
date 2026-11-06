
//    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodGNzemF0bmZtbnFqdHJqd2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE0MjUsImV4cCI6MjEwNjYwNzQyNX0.SiNVD3vDqt5sf_folcO1SKp9Hy46NMAIXI3fBT-Z0Kk";


/* =========================================
   WEDDING INVITATION ENVELOPE
   ========================================= */

const invitationGate = document.getElementById("invitationGate");
const invitationEnvelope = document.getElementById("invitationEnvelope");
const openInvitationButton = document.getElementById("openInvitation");
const invitationHint = document.getElementById("invitationHint");

let invitationOpened = false;

// Lock scrolling while the invitation is on screen
document.body.classList.add("password-locked");
window.scrollTo(0, 0);

// Open the invitation
openInvitationButton.addEventListener("click", function () {

    // Prevent repeated clicks during the animation
    if (invitationOpened) return;

    invitationOpened = true;
    openInvitationButton.disabled = true;

    invitationGate.classList.add("is-opening");

    invitationHint.textContent = "With love, Alex & Paulo";

    // Allow the envelope and letter animation to play
    setTimeout(function () {

        // Fade away the invitation overlay
        invitationGate.classList.add("invitation-dismissed");

        // Reveal the existing website and restore scrolling
        document.body.classList.remove("password-locked");

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto"
        });

        // Remove the overlay after its fade-out
        setTimeout(function () {
            invitationGate.style.display = "none";
        }, 850);

    }, 1500);

});


// =========================
// SUPABASE
// =========================

const SUPABASE_URL =
    "https://xhtcszatnfmnqjtrjwhh.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodGNzemF0bmZtbnFqdHJqd2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE0MjUsImV4cCI6MjEwNjYwNzQyNX0.SiNVD3vDqt5sf_folcO1SKp9Hy46NMAIXI3fBT-Z0Kk";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

// =========================
// STATE
// =========================

let currentGuest = null;
let guestToRemove = null;

// =========================
// ELEMENTS
// =========================

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const reservationCard =
    document.getElementById("reservationCard");

const partyCard =
    document.getElementById("partyCard");

const emailCard =
    document.getElementById("emailCard");

const guestName =
    document.getElementById("guestName");

const guest1Text =
    document.getElementById("guest1Text");

const seatCount =
    document.getElementById("seatCount");

const rsvpStatus =
    document.getElementById("rsvpStatus");

const partyInstructions =
    document.getElementById("partyInstructions");

const guest2Text =
    document.getElementById("guest2Text");

const guest3Text =
    document.getElementById("guest3Text");

const guest1Input =
    document.getElementById("guest1Input");

const guest2Input =
    document.getElementById("guest2Input");

const emailInput =
    document.getElementById("emailInput");

const rsvpError =
    document.getElementById("rsvpError");

const actionButtons =
    document.getElementById("actionButtons");

const confirmButton =
    document.getElementById("confirmButton");

const declineButton =
    document.getElementById("declineButton");

const removeGuest2 =
    document.getElementById("removeGuest2");

const removeGuest3 =
    document.getElementById("removeGuest3");

const removeGuestModal =
    document.getElementById("removeGuestModal");

const removeGuestMessage =
    document.getElementById("removeGuestMessage");

const cancelRemoveGuest =
    document.getElementById("cancelRemoveGuest");

const confirmRemoveGuest =
    document.getElementById("confirmRemoveGuest");

const emailConfirmationNotice =
    document.getElementById("emailConfirmationNotice");

const clearSearchButton = 
    document.getElementById("clearSearchButton");



/* =========================
    RSVP SUCCESS POPUP
========================= */

const rsvpSuccessOverlay =
    document.getElementById("rsvpSuccessOverlay");

const rsvpSuccessClose =
    document.getElementById("rsvpSuccessClose");

const rsvpSuccessContinue =
    document.getElementById("rsvpSuccessContinue");


/* ---------------------------------------------
   DYNAMIC RSVP STEP NUMBERS
   --------------------------------------------- */

function updateStepNumbers() {

    const cards = document.querySelectorAll(
        ".rsvp-card"
    );

    let stepNumber = 1;

    cards.forEach(card => {

        // Skip hidden cards
        if (
            card.classList.contains("hidden") ||
            card.style.display === "none"
        ) {
            return;
        }

        // Find the step number inside the card
        const stepElement = card.querySelector(
            ".step-number"
        );

        if (stepElement) {

            stepElement.textContent =
                String(stepNumber).padStart(2, "0");

            stepNumber++;

        }

    });

}

function showRsvpSuccessPopup() {

    rsvpSuccessOverlay.classList.add("show");

    document.body.style.overflow = "hidden";
}


function closeRsvpSuccessPopup() {

    rsvpSuccessOverlay.classList.remove("show");

    document.body.style.overflow = "";
}


/* CONTINUE BUTTON */

rsvpSuccessContinue.addEventListener(
    "click",
    closeRsvpSuccessPopup
);


/* X BUTTON */

rsvpSuccessClose.addEventListener(
    "click",
    closeRsvpSuccessPopup
);


/* CLICK OUTSIDE POPUP */

rsvpSuccessOverlay.addEventListener(
    "click",
    function (event) {

        if (event.target === rsvpSuccessOverlay) {
            closeRsvpSuccessPopup();
        }

    }
);


async function sendGuestConfirmation(
    status,
    message
) {

    //if (!currentGuest.email) return;

    try {
        if (status == "ATTENDING"){
            await emailjs.send(
            "service_w85dgwi",
            "template_gxjy2ft",
            {
                guest_name:
                    `${currentGuest.firstName} ${currentGuest.lastName}`,

                status,
                
                guest1: currentGuest.guest2 || "",

                guest2: currentGuest.guest3 || "",
                
                email: currentGuest.email

            }
            );
        }
        else{
            await emailjs.send(
            "service_w85dgwi",
            "template_59e75rw",
            {
                guest_name:
                    `${currentGuest.firstName} ${currentGuest.lastName}`,

                status,

                decline_message: message || "No message provided.",
                
                email: currentGuest.email || "kkopitea7@gmail.com"

            }
            );
        }
        

    } catch (error) {

        console.error(error);
    }
}

function show(el) {
    if (el) {
        el.classList.remove("hidden");
    }
}

function hide(el) {
    if (el) {
        el.classList.add("hidden");
    }
}

function capitalizeWords(str) {
    if (!str) {
        return "";
    }

    return str
        .trim()
        .split(/\s+/)
        .map(word =>
            word.charAt(0).toUpperCase() +
            word.slice(1).toLowerCase()
        )
        .join(" ");
}

function openRemoveGuestModal(guestNumber) {

    guestToRemove = guestNumber;

    let guestNameToRemove = "";

    if (
        guestNumber === 2 &&
        currentGuest &&
        currentGuest.guest2
    ) {
        guestNameToRemove =
            currentGuest.guest2;
    }

    if (
        guestNumber === 3 &&
        currentGuest &&
        currentGuest.guest3
    ) {
        guestNameToRemove =
            currentGuest.guest3;
    }

    removeGuestMessage.textContent =
        `Are you sure you want to remove ${guestNameToRemove} from your confirmed party?`;

    show(removeGuestModal);
}

function closeRemoveGuestModal() {

    hide(removeGuestModal);

    guestToRemove = null;
}

// =========================
// DISPLAY CONFIRMED SEATS
// =========================

function updateConfirmedSeatDisplay() {

    if (!currentGuest) {
        return;
    }

    const confirmedSeats =
        Number(currentGuest.seats) || 1;

    if (confirmedSeats === 1) {

        seatCount.textContent =
            "1 SEAT CONFIRMED";

    } else {

        seatCount.textContent =
            `${confirmedSeats} SEATS CONFIRMED`;
    }

    show(seatCount);
}

// =========================
// INITIAL UI
// =========================

function hideReservationSection() {

    hide(reservationCard);

    guestName.textContent = "";
    guest1Text.textContent = "";
    seatCount.textContent = "";
    rsvpStatus.textContent = "";
}

function hidePartySection() {

    hide(partyCard);

    partyInstructions.textContent = "";

    guest2Text.textContent = "";
    guest3Text.textContent = "";

    guest1Input.value = "";
    guest2Input.value = "";

    hide(guest2Text);
    hide(guest3Text);

    hide(removeGuest2);
    hide(removeGuest3);

    hide(guest1Input);
    hide(guest2Input);
}

function hideEmailSection() {

    hide(emailCard);

    emailInput.value = "";
}

function hideActionButtons() {

    hide(actionButtons);
    hide(confirmButton);
    hide(declineButton);
}

function resetUI() {

    hideReservationSection();
    hidePartySection();
    hideEmailSection();
    hideActionButtons();
    hide(emailConfirmationNotice);

    rsvpError.textContent = "";

    currentGuest = null;
}

resetUI();

// =========================
// SEARCH BUTTON
// =========================

searchButton.addEventListener(
    "click",
    async () => {
        searchButton.disabled = true;
        searchButton.classList.add("loading");

        searchButton.innerHTML = `
            <div class="button-loading">
                <div class="spinner"></div>
                <span>Looking up your reservation...</span>
            </div>
        `;

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();

        if (!searchText) {
            searchButton.disabled = false;
            searchButton.classList.remove("loading");
            searchButton.innerHTML = `<span class="button-text">Find My Invitation</span>`;
            searchInput.focus();
            return;
        }

        hidePartySection();
        hideEmailSection();
        hideActionButtons();
        hide(emailConfirmationNotice);

        guest1Input.value = "";
        guest2Input.value = "";

        rsvpError.textContent = "";

        // =========================
        // GET GUESTS
        // =========================

        const { data, error } =
            await supabaseClient
                .from("Guests")
                .select("*");

        if (error) {
            alert(error.message);
            searchButton.disabled = false;
            searchButton.classList.remove("loading");
            searchButton.innerHTML = `<span class="button-text">Find My Invitation</span>`;
            return;
        }

        let guest = null;

        // =========================
        // SEARCH
        // =========================

        data.some(item => {

            const firstLast =
                `${item.firstName || ""} ${item.lastName || ""}`
                    .trim()
                    .toLowerCase();

            const nickLast =
                `${item.nickName || ""} ${item.lastName || ""}`
                    .trim()
                    .toLowerCase();

            const guest2 =
                (item.guest2 || "")
                    .trim()
                    .toLowerCase();

            const guest3 =
                (item.guest3 || "")
                    .trim()
                    .toLowerCase();

            if (
                searchText === firstLast ||
                searchText === nickLast ||
                guest2.includes(searchText) ||
                guest3.includes(searchText)
            ) {
                searchButton.disabled = false;
                searchButton.classList.remove("loading");

                searchButton.innerHTML = `
                    <span class="button-text">Find My Invitation</span>
                `;
                guest = item;

                return true;
            }

            return false;
        });

        // =========================
        // GUEST NOT FOUND
        // =========================

        if (!guest) {
            searchButton.disabled = false;
            searchButton.classList.remove("loading");

            searchButton.innerHTML = `
                <span class="button-text">Find My Invitation</span>
            `;
            hidePartySection();
            hideEmailSection();
            hideActionButtons();

            show(reservationCard);

            guestName.textContent =
                "Invitation Not Found";

            guest1Text.textContent =
                "Please double-check the spelling of your name and try again. You may also search using your nickname and last name.\n\nIf you're still having trouble, please reach out to the couple.";

            show(guestName);
            show(guest1Text);

            hide(seatCount);
            hide(rsvpStatus);

            return;
        }

        currentGuest = guest;

        // =========================
        // RESERVATION
        // =========================

        show(reservationCard);

        const primaryGuestName =
            `${guest.firstName || ""} ${guest.lastName || ""}`
                .trim();

        guestName.textContent =
            primaryGuestName;

        show(guestName);

        // =========================
        // PRIMARY / INCLUDED GUEST
        // =========================

        const searchedGuest2 =
            (guest.guest2 || "")
                .trim()
                .toLowerCase();

        const searchedGuest3 =
            (guest.guest3 || "")
                .trim()
                .toLowerCase();

        if (
            searchText === searchedGuest2 ||
            searchText === searchedGuest3
        ) {

            guest1Text.textContent =
                "You are included in this reservation";

            show(guest1Text);

        } else if (
            guest.seats === 1 && guest.title === "Primary Guest"
        ) {

            hide(guest1Text);

        } else {

            guest1Text.textContent =
                guest.title;

            show(guest1Text);
        }

        // =========================
        // RSVP STATUS
        // =========================

        if (
            guest.rsvpStatus ===
            "Attending"
        ) {

            rsvpStatus.textContent =
                "ATTENDANCE CONFIRMED ✓";

            show(rsvpStatus);
            hide(removeGuest2);
            hide(removeGuest3);
            updateConfirmedSeatDisplay();

        } else if (
            guest.rsvpStatus ===
            "Not Attending"
        ) {

            rsvpStatus.textContent =
                "UNABLE TO ATTEND";

            show(rsvpStatus);

            hide(seatCount);
            hide(removeGuest2);
            hide(removeGuest3);

        } else {

            rsvpStatus.textContent =
                "AWAITING RESPONSE";

            show(rsvpStatus);

            if (
                guest.seats === 1
            ) {

                seatCount.textContent =
                    "1 SEAT RESERVED";

            } else {

                seatCount.textContent =
                    `${guest.seats} SEATS RESERVED`;
            }

            show(seatCount);
        }

        // =========================
        // NOT ATTENDING
        // =========================

        if (
            guest.rsvpStatus ===
            "Not Attending"
        ) {

            hideEmailSection();
            hideActionButtons();
            hidePartySection();

            return;
        }

        // =========================
        // ALREADY ATTENDING
        // =========================

        if (
            guest.rsvpStatus ===
            "Attending"
        ) {

            hideEmailSection();
            hideActionButtons();

            // Show party card only if
            // there are additional guests.
            if (
                guest.guest2 ||
                guest.guest3
            ) {

                show(partyCard);

                hide(partyInstructions);
                hide(removeGuest2);
                hide(removeGuest3);

                // =========================
                // GUEST #2
                // =========================

                if (
                    guest.guest2 &&
                    guest.guest2.trim() !== ""
                ) {

                    guest2Text.textContent =
                        "Guest #2: " +
                        guest.guest2;

                    show(guest2Text);

                } else {

                    hide(guest2Text);
                }

                // =========================
                // GUEST #3
                // =========================

                if (
                    guest.guest3 &&
                    guest.guest3.trim() !== ""
                ) {

                    guest3Text.textContent =
                        "Guest #3: " +
                        guest.guest3;

                    show(guest3Text);

                } else {

                    hide(guest3Text);
                }

                // No input boxes after
                // RSVP has been confirmed.
                hide(guest1Input);
                hide(guest2Input);

            } else {

                hidePartySection();
            }

            return;
        }

        // =========================
        // AWAITING RESPONSE
        // =========================

        show(emailCard);
        updateStepNumbers();

        emailInput.value =
            guest.email || "";

        // =========================
        // PARTY
        // =========================

        if (
            guest.seats >= 2
        ) {

            show(partyCard);
            updateStepNumbers();

            if(guest.guest2 || guest.guest3){
                partyInstructions.textContent =
                    "Please double-check the guest name provided. If they won't be joining you, click \"Remove\" to update your reservation."
            
            }
            else{
                partyInstructions.textContent =
                    "If you have a guest joining you, please enter their full name. Leaving this field blank confirms that you will be attending without an additional guest."
            }
            
            show(partyInstructions);

            // =========================
            // GUEST #2
            // =========================

            if (
                guest.guest2 &&
                guest.guest2.trim() !== ""
            ) {

                guest2Text.textContent =
                    "Guest #2: " +
                    guest.guest2;

                show(guest2Text);
                show(removeGuest2);
                hide(guest1Input);

            } else {

                hide(guest2Text);
                hide(removeGuest2);
                show(guest1Input);
            }

            // =========================
            // GUEST #3
            // =========================

            if (
                guest.seats >= 3
            ) {

                if (
                    guest.guest3 &&
                    guest.guest3.trim() !== ""
                ) {

                    guest3Text.textContent =
                        "Guest #3: " +
                        guest.guest3;

                    show(guest3Text);
                    show(removeGuest3);
                    hide(guest2Input);

                } else {

                    hide(guest3Text);
                    hide(removeGuest3);
                    show(guest2Input);
                }

            } else {

                hide(guest3Text);
                hide(removeGuest3);
                hide(guest2Input);
            }

        } else {

            hidePartySection();
        }

        // =========================
        // RSVP BUTTONS
        // =========================

        show(actionButtons);
        show(confirmButton);
        show(declineButton);

        confirmButton.textContent =
            "YES, I'll be there";

        confirmButton.disabled = false;

        declineButton.textContent =
            "I can't make it";

        declineButton.disabled = false;
    }
);

/* ---------------------------------------------
   CLEAR SEARCH AND RESET RESERVATION
   --------------------------------------------- */

// SHOW / HIDE CLEAR BUTTON
searchInput.addEventListener("input", function () {

    if (searchInput.value.trim() !== "") {
        clearSearchButton.classList.add("visible");
    } else {
        clearSearchButton.classList.remove("visible");
    }

});


// CLEAR SEARCH BUTTON
clearSearchButton.addEventListener("click", function () {

    // Clear search input
    searchInput.value = "";

    // Hide clear button
    clearSearchButton.classList.remove("visible");

    // Reset reservation display
    resetUI();

    // Return focus to search input
    searchInput.focus();

});


// =========================
// CONFIRM RSVP
// =========================

confirmButton.addEventListener(
    "click",
    async () => {

        if (!currentGuest) {
            return;
        }

        // =========================
        // EMAIL REQUIRED
        // =========================

        if (
            !emailInput.value.trim()
        ) {

            emailInput.focus();

            rsvpError.textContent =
                "PLEASE ENTER YOUR EMAIL ADDRESS";
            
            show(rsvpError);

            return;
        }

        // =========================
        // SAVE EMAIL
        // =========================

        currentGuest.email =
            emailInput.value.trim();

        currentGuest.rsvpStatus =
            "Attending";

        // =========================
        // SAVE GUEST #2
        // =========================

        if (
            currentGuest.seats >= 2 &&
            (
                !currentGuest.guest2 ||
                currentGuest.guest2.trim() === ""
            )
        ) {

            currentGuest.guest2 =
                capitalizeWords(
                    guest1Input.value
                ) || "";
        }

        // =========================
        // SAVE GUEST #3
        // =========================

        if (
            currentGuest.seats >= 3 &&
            (
                !currentGuest.guest3 ||
                currentGuest.guest3.trim() === ""
            )
        ) {

            currentGuest.guest3 =
                capitalizeWords(
                    guest2Input.value
                ) || "";
        }

        // =========================
        // CALCULATE CONFIRMED SEATS
        // =========================

        let confirmedSeats = 1;

        if (
            currentGuest.guest2 &&
            currentGuest.guest2.trim() !== ""
        ) {

            confirmedSeats++;
        }

        if (
            currentGuest.guest3 &&
            currentGuest.guest3.trim() !== ""
        ) {

            confirmedSeats++;
        }

        currentGuest.seats =
            confirmedSeats;

        // =========================
        // UPDATE SUPABASE
        // =========================

        const { error } =
            await supabaseClient
                .from("Guests")
                .update({
                    email:
                        currentGuest.email,

                    rsvpStatus:
                        currentGuest.rsvpStatus,

                    guest2:
                        currentGuest.guest2,

                    guest3:
                        currentGuest.guest3,

                    seats:
                        currentGuest.seats
                })
                .eq(
                    "id",
                    currentGuest.id
                );

        if (error) {

            alert(error.message);

            return;
        }

        showRsvpSuccessPopup();

        // =========================
        // UPDATE SEAT DISPLAY
        // =========================

        updateConfirmedSeatDisplay();

        rsvpStatus.textContent =
            "ATTENDANCE CONFIRMED ✓";

        // =========================
        // HIDE EMAIL
        // =========================

        hideEmailSection();

        // =========================
        // HIDE INSTRUCTIONS
        // =========================

        hide(partyInstructions);

        // =========================
        // HIDE INPUTS
        // =========================

        hide(guest1Input);
        hide(guest2Input);

        // =========================
        // GUEST #2 DISPLAY
        // =========================

        if (
            currentGuest.guest2 &&
            currentGuest.guest2.trim() !== ""
        ) {

            guest2Text.textContent =
                "Guest #2: " +
                currentGuest.guest2;

            show(guest2Text);

        } else {

            hide(guest2Text);
        }

        // =========================
        // GUEST #3 DISPLAY
        // =========================

        if (
            currentGuest.guest3 &&
            currentGuest.guest3.trim() !== ""
        ) {

            guest3Text.textContent =
                "Guest #3: " +
                currentGuest.guest3;

            show(guest3Text);

        } else {

            hide(guest3Text);
        }

        // =========================
        // SHOW REMOVE BUTTONS
        // =========================

        if (
            currentGuest.guest2 &&
            currentGuest.guest2.trim() !== ""
        ) {

            show(removeGuest2);

        } else {

            hide(removeGuest2);
        }

        if (
            currentGuest.guest3 &&
            currentGuest.guest3.trim() !== ""
        ) {

            show(removeGuest3);

        } else {

            hide(removeGuest3);
        }

        // =========================
        // CONFIRM BUTTON
        // =========================

        // confirmButton.textContent =
        //     "Attendance Confirmed ✓";

        // confirmButton.disabled = true;

        hide(confirmButton);
        hide(declineButton);
        hide(rsvpError);
        hide(removeGuest2);
        hide(removeGuest3);

        // =========================
        // HIDE PARTY IF ONLY
        // PRIMARY GUEST REMAINS
        // =========================

        if (
            currentGuest.seats === 1
        ) {

            hidePartySection();
        }

        // =========================
        //  SEND EMAIL NOTIFICATIONS
        // =========================
        // await sendRSVPNotification(
        //     "ATTENDING"
        // );

        await sendGuestConfirmation(
            "ATTENDING",
            ""
        );

        show(emailConfirmationNotice);

    }
);

// =========================
// DECLINE RSVP
// =========================

    declineButton.addEventListener("click", () => {

        openDeclineModal();

    });

    const declineModal =
        document.getElementById("declineModal");

    const declineMessage =
        document.getElementById("declineMessage");

    function openDeclineModal() {

        declineMessage.value = "";

        declineModal.classList.remove("hidden");
    }

    function closeDeclineModal() {

        declineModal.classList.add("hidden");
    }

    async function processDecline(message = "") {

        const email =
            emailInput.value.trim();

        const updateData = {

            email: email || null,

            rsvpStatus: "Not Attending",

            guest2: "",
            guest3: "",

            seats: 0,

            decline_message: message
        };

        const { error } =
            await supabaseClient
                .from("Guests")
                .update(updateData)
                .eq("id", currentGuest.id);

        if (error) {

            rsvpError.textContent =
                error.message;

            show(rsvpError);

            return;
        }
        showRsvpSuccessPopup();

        Object.assign(
            currentGuest,
            updateData
        );

        // Update UI

        rsvpStatus.textContent =
            "UNABLE TO ATTEND";

        hide(seatCount);

        hide(emailCard);

        hide(partyCard);

        hide(guest2Text);
        hide(guest3Text);

        hide(removeGuest2);
        hide(removeGuest3);

        hide(guest1Input);
        hide(guest2Input);

        hide(rsvpError);

        hide(confirmButton);
        hide(declineButton);

        closeDeclineModal();
        
        // =========================
        //  SEND EMAIL NOTIFICATIONS
        // =========================
        await sendGuestConfirmation(
            "NOT ATTENDING",
            declineMessage.value.trim()
        );

        if (currentGuest.email != null) {
            show(emailConfirmationNotice);
        }

    }
    document
        .getElementById("sendDeclineMessage")
        .addEventListener(
            "click",
            async () => {

                await processDecline(
                    declineMessage.value.trim()
                );
            }
        );

    document
        .getElementById("skipDeclineMessage")
        .addEventListener(
            "click",
            async () => {

                await processDecline("");
            }
        );

// =========================
// REMOVE GUEST #2 BUTTON
// =========================

removeGuest2.addEventListener(
    "click",
    () => {

        if (!currentGuest) {
            return;
        }

        openRemoveGuestModal(2);
    }
);

// =========================
// REMOVE GUEST #3 BUTTON
// =========================

removeGuest3.addEventListener(
    "click",
    () => {

        if (!currentGuest) {
            return;
        }

        openRemoveGuestModal(3);
    }
);

// =========================
// CANCEL REMOVE
// =========================

cancelRemoveGuest.addEventListener(
    "click",
    () => {

        closeRemoveGuestModal();
    }
);

// =========================
// CONFIRM REMOVE
// =========================

confirmRemoveGuest.addEventListener(
    "click",
    async () => {

        if (
            !currentGuest ||
            !guestToRemove
        ) {
            closeRemoveGuestModal();
            return;
        }

        // =========================
        // REMOVE GUEST #2
        // =========================

        if (
            guestToRemove === 2
        ) {

            // If Guest #3 exists,
            // move them into Guest #2.
            if (
                currentGuest.guest3 &&
                currentGuest.guest3.trim() !== ""
            ) {

                currentGuest.guest2 =
                    currentGuest.guest3;

                currentGuest.guest3 = "";

            } else {

                currentGuest.guest2 = "";
            }
        }

        // =========================
        // REMOVE GUEST #3
        // =========================

        if (
            guestToRemove === 3
        ) {

            currentGuest.guest3 = "";
        }

        // =========================
        // RECALCULATE SEATS
        // =========================

        let confirmedSeats = 1;

        if (
            currentGuest.guest2 &&
            currentGuest.guest2.trim() !== ""
        ) {

            confirmedSeats++;
        }

        if (
            currentGuest.guest3 &&
            currentGuest.guest3.trim() !== ""
        ) {

            confirmedSeats++;
        }

        currentGuest.seats =
            confirmedSeats;

        // =========================
        // UPDATE SUPABASE
        // =========================

        const { error } =
            await supabaseClient
                .from("Guests")
                .update({
                    guest2:
                        currentGuest.guest2,

                    guest3:
                        currentGuest.guest3,

                    seats:
                        currentGuest.seats
                })
                .eq(
                    "id",
                    currentGuest.id
                );

        if (error) {

            alert(error.message);

            return;
        }

        // =========================
        // CLOSE MODAL
        // =========================

        closeRemoveGuestModal();

        // =========================
        // UPDATE SEAT COUNT
        // =========================

        updateConfirmedSeatDisplay();

        // =========================
        // UPDATE GUEST #2
        // =========================

        if (
            currentGuest.guest2 &&
            currentGuest.guest2.trim() !== ""
        ) {

            guest2Text.textContent =
                "Guest #2: " +
                currentGuest.guest2;

            show(guest2Text);
            show(removeGuest2);

        } else {

            hide(guest2Text);
            hide(removeGuest2);
        }

        // =========================
        // UPDATE GUEST #3
        // =========================

        if (
            currentGuest.guest3 &&
            currentGuest.guest3.trim() !== ""
        ) {

            guest3Text.textContent =
                "Guest #3: " +
                currentGuest.guest3;

            show(guest3Text);
            show(removeGuest3);

        } else {

            hide(guest3Text);
            hide(removeGuest3);
        }

        // =========================
        // NEVER SHOW INPUTS
        // =========================

        hide(guest1Input);
        hide(guest2Input);

        // =========================
        // IF ONLY PRIMARY GUEST
        // REMAINS
        // =========================

        if (
            currentGuest.seats === 1
        ) {

            hidePartySection();
        }
    }
);

// =========================
// EVENT LISTENERS - PRESS ENTER
// =========================

[
    emailInput,
    guest1Input,
    guest2Input
].forEach(input => {

    input.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            confirmButton.click();
        }
    });
});

searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        searchButton.click();
    }
});


/* =========================================================
   WEDDING GALLERY
   MOBILE SWIPE STACK + LIGHTBOX
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE SWIPE GALLERY
       ===================================================== */

    const stack = document.querySelector(".mobile-gallery-stack");

    if (stack) {

        const cards = Array.from(
            stack.querySelectorAll(".mobile-gallery-card")
        );

        let currentIndex = 0;

        let startX = 0;
        let startY = 0;

        let currentX = 0;

        let isDragging = false;
        let isAnimating = false;

        const SWIPE_THRESHOLD = 80;


        /* ---------------------------------------------
        SET INITIAL CARD POSITIONS
        INSTAGRAM-STYLE LAYERED STACK
        --------------------------------------------- */

        function updateStack() {

            cards.forEach(function (card, index) {

                const relativeIndex =
                    (index - currentIndex + cards.length)
                    % cards.length;

                card.classList.remove(
                    "is-dragging",
                    "swipe-left",
                    "swipe-right"
                );

                card.style.opacity = "";
                card.style.pointerEvents = "";
                card.style.transition = "";

                if (relativeIndex === 0) {

                    /* TOP PHOTO */

                    card.style.zIndex = cards.length;

                    card.style.transform =
                        "translate(0px, 0px) rotate(0deg) scale(1)";

                    card.style.opacity = "1";
                    card.style.pointerEvents = "auto";

                } else if (relativeIndex === 1) {

                    /* SECOND PHOTO — UPPER RIGHT */

                    card.style.zIndex = cards.length - 1;

                    card.style.transform =
                        "translate(13px, -9px) rotate(5deg) scale(0.96)";

                    card.style.opacity = "1";
                    card.style.pointerEvents = "none";

                } else if (relativeIndex === 2) {

                    /* THIRD PHOTO — UPPER LEFT */

                    card.style.zIndex = cards.length - 2;

                    card.style.transform =
                        "translate(-12px, 7px) rotate(-4deg) scale(0.93)";

                    card.style.opacity = "1";
                    card.style.pointerEvents = "none";

                } else if (relativeIndex === 3) {

                    /* FOURTH PHOTO — LOWER RIGHT */

                    card.style.zIndex = cards.length - 3;

                    card.style.transform =
                        "translate(8px, 17px) rotate(7deg) scale(0.90)";

                    card.style.opacity = "1";
                    card.style.pointerEvents = "none";

                } else {

                    /* PHOTOS DEEPER IN THE STACK */

                    card.style.zIndex = 1;

                    card.style.transform =
                        "translate(-5px, 23px) rotate(-3deg) scale(0.88)";

                    card.style.opacity = "0";
                    card.style.pointerEvents = "none";
                }

            });

        }


        /* ---------------------------------------------
           MOVE TO NEXT PHOTO
           --------------------------------------------- */

        function nextCard(direction) {

            if (isAnimating) {
                return;
            }

            isAnimating = true;

            const topCard = cards[currentIndex];

            if (direction === "left") {

                topCard.classList.add("swipe-left");

            } else {

                topCard.classList.add("swipe-right");
            }


            /*
             * Wait for the card to finish leaving
             * before bringing the next card forward.
             */

            setTimeout(function () {

                currentIndex =
                    (currentIndex + 1) % cards.length;

                updateStack();

                isAnimating = false;

            }, 350);
        }


        /* ---------------------------------------------
           POINTER DOWN
           --------------------------------------------- */

        function pointerDown(event) {

            if (isAnimating) {
                return;
            }

            const topCard = cards[currentIndex];

            startX = event.clientX;
            startY = event.clientY;

            currentX = 0;

            isDragging = true;

            topCard.classList.add("is-dragging");
        }


        /* ---------------------------------------------
           POINTER MOVE
           --------------------------------------------- */

        function pointerMove(event) {

            if (!isDragging || isAnimating) {
                return;
            }

            const topCard = cards[currentIndex];

            currentX = event.clientX - startX;

            const currentY =
                event.clientY - startY;


            /*
             * Prevent vertical scrolling from being
             * affected by small horizontal movement.
             */

            if (
                Math.abs(currentX) <
                Math.abs(currentY)
            ) {
                return;
            }


            const rotation =
                currentX * 0.05;

            const movement =
                currentX * 1.05;

            topCard.style.transform =
                `translateX(${movement}px) rotate(${rotation}deg)`;

            /*
             * Slightly fade the card as it moves away.
             */

            const opacity =
                Math.max(
                    0.55,
                    1 - Math.abs(currentX) / 500
                );

            topCard.style.opacity = opacity;
        }


        /* ---------------------------------------------
           POINTER UP
           --------------------------------------------- */

        function pointerUp() {

            if (!isDragging || isAnimating) {
                return;
            }

            isDragging = false;

            const topCard = cards[currentIndex];

            topCard.classList.remove("is-dragging");


            if (Math.abs(currentX) >= SWIPE_THRESHOLD) {

                /*
                 * Swipe left OR right.
                 *
                 * Both directions advance to the
                 * next photograph, similar to a card deck.
                 */

                if (currentX < 0) {
                    nextCard("left");
                } else {
                    nextCard("right");
                }

            } else {

                /*
                 * Not enough movement.
                 * Return the card to its original position.
                 */

                topCard.style.transition =
                    "transform 0.3s ease, opacity 0.3s ease";

                topCard.style.transform =
                    "translateY(0px) scale(1)";

                topCard.style.opacity = "1";

                setTimeout(function () {

                    topCard.style.transition = "";

                }, 300);
            }

            currentX = 0;
        }


        /* ---------------------------------------------
           POINTER CANCEL
           --------------------------------------------- */

        function pointerCancel() {

            if (!isDragging) {
                return;
            }

            isDragging = false;

            const topCard = cards[currentIndex];

            topCard.classList.remove("is-dragging");

            topCard.style.transition =
                "transform 0.3s ease, opacity 0.3s ease";

            topCard.style.transform =
                "translateY(0px) scale(1)";

            topCard.style.opacity = "1";

            setTimeout(function () {

                topCard.style.transition = "";

            }, 300);

            currentX = 0;
        }


        /* ---------------------------------------------
           POINTER EVENTS
           --------------------------------------------- */

        stack.addEventListener(
            "pointerdown",
            pointerDown
        );

        stack.addEventListener(
            "pointermove",
            pointerMove
        );

        stack.addEventListener(
            "pointerup",
            pointerUp
        );

        stack.addEventListener(
            "pointercancel",
            pointerCancel
        );

        stack.addEventListener(
            "pointerleave",
            function (event) {

                /*
                 * Only cancel for mouse.
                 * Touch devices should continue normally.
                 */

                if (event.pointerType === "mouse") {
                    pointerCancel();
                }
            }
        );


        /* ---------------------------------------------
           PREVENT IMAGE DRAGGING
           --------------------------------------------- */

        cards.forEach(function (card) {

            const image = card.querySelector("img");

            if (image) {

                image.addEventListener(
                    "dragstart",
                    function (event) {
                        event.preventDefault();
                    }
                );

            }
        });


        /* ---------------------------------------------
           INITIALIZE
           --------------------------------------------- */

        updateStack();


        /* =================================================
           LIGHTBOX CLICK FROM MOBILE STACK
           ================================================= */

        cards.forEach(function (card, index) {

            card.addEventListener("click", function () {

                /*
                 * Only open lightbox if the card is
                 * currently the top card.
                 */

                if (index !== currentIndex) {
                    return;
                }

                // Reuse the actual lightbox in index.html; the legacy
                // galleryLightbox IDs are not present in this version.
                const desktopImage = document.querySelectorAll(".gallery img")[index];
                if (desktopImage) desktopImage.click();
            });

        });

    }


    /* =====================================================
       DESKTOP GALLERY
       ===================================================== */

    const desktopItems =
        document.querySelectorAll(".gallery-item");

    desktopItems.forEach(function (item, index) {

        item.addEventListener("click", function () {

            openLightbox(index);

        });

    });


    /* =====================================================
       LIGHTBOX
       ===================================================== */

    const lightbox =
        document.getElementById("galleryLightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const closeButton =
        document.querySelector(".lightbox-close");

    const previousButton =
        document.querySelector(".lightbox-prev");

    const nextButton =
        document.querySelector(".lightbox-next");


    const galleryImages = [];

    for (let i = 1; i <= 14; i++) {

        galleryImages.push(
            `images/gallery/gallery${i}.jpg`
        );

    }


    let lightboxIndex = 0;


    /* ---------------------------------------------
       OPEN LIGHTBOX
       --------------------------------------------- */

    function openLightbox(index) {

        lightboxIndex = index;

        lightboxImage.src =
            galleryImages[lightboxIndex];

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    /* ---------------------------------------------
       CLOSE LIGHTBOX
       --------------------------------------------- */

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

    }


    /* ---------------------------------------------
       SHOW LIGHTBOX IMAGE
       --------------------------------------------- */

    function showLightboxImage(index) {

        if (index < 0) {

            index =
                galleryImages.length - 1;
        }

        if (index >= galleryImages.length) {

            index = 0;
        }

        lightboxIndex = index;

        /*
         * Small fade animation.
         */

        lightboxImage.style.opacity = "0";

        setTimeout(function () {

            lightboxImage.src =
                galleryImages[lightboxIndex];

            lightboxImage.style.opacity = "1";

        }, 100);
    }


    /* ---------------------------------------------
       CLOSE BUTTON
       --------------------------------------------- */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

    }


    /* ---------------------------------------------
       PREVIOUS
       --------------------------------------------- */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                showLightboxImage(
                    lightboxIndex - 1
                );

            }
        );

    }


    /* ---------------------------------------------
       NEXT
       --------------------------------------------- */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                showLightboxImage(
                    lightboxIndex + 1
                );

            }
        );

    }


    /* ---------------------------------------------
       CLICK OUTSIDE IMAGE
       --------------------------------------------- */

    if (lightbox) {

        lightbox.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === lightbox
                ) {

                    closeLightbox();

                }

            }
        );

    }


    /* ---------------------------------------------
       KEYBOARD CONTROLS
       --------------------------------------------- */

    document.addEventListener(
        "keydown",
        function (event) {

            if (!lightbox ||
                !lightbox.classList.contains("active")
            ) {
                return;
            }


            if (event.key === "Escape") {

                closeLightbox();

            }


            if (event.key === "ArrowLeft") {

                showLightboxImage(
                    lightboxIndex - 1
                );

            }


            if (event.key === "ArrowRight") {

                showLightboxImage(
                    lightboxIndex + 1
                );

            }

        }
    );


    /* ---------------------------------------------
       LIGHTBOX SWIPE ON MOBILE
       --------------------------------------------- */

    let lightboxStartX = 0;

    let lightboxDragging = false;


    if (lightbox) {

        lightbox.addEventListener(
            "touchstart",
            function (event) {

                lightboxStartX =
                    event.touches[0].clientX;

                lightboxDragging = true;

            },
            { passive: true }
        );


        lightbox.addEventListener(
            "touchend",
            function (event) {

                if (!lightboxDragging) {
                    return;
                }

                const endX =
                    event.changedTouches[0].clientX;

                const difference =
                    endX - lightboxStartX;


                if (Math.abs(difference) > 60) {

                    if (difference < 0) {

                        showLightboxImage(
                            lightboxIndex + 1
                        );

                    } else {

                        showLightboxImage(
                            lightboxIndex - 1
                        );

                    }

                }

                lightboxDragging = false;

            },
            { passive: true }
        );

    }

});


/* =========================
   BACK TO TOP FUNCTION
========================= */

const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {

    // Show the button after scrolling down
    window.addEventListener("scroll", () => {

        if (window.scrollY > 400) {
            backToTopButton.classList.add("visible");
        } else {
            backToTopButton.classList.remove("visible");
        }

    }, { passive: true });

    // Smoothly return to the top
    backToTopButton.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

}


/* =========================================================
   SCROLL REVEAL OBSERVER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const revealElements = document.querySelectorAll(
        ".section-header, .section > .card, #pageBreak"
    );

    /* Fallback for browsers without IntersectionObserver */
    if (!("IntersectionObserver" in window)) {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
        });
        return;
    }

    const observer = new IntersectionObserver(
        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("is-visible");

                    /* Reveal only once */
                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach(function (element) {
        element.classList.add("reveal");
        observer.observe(element);
    });

});


/* =========================================================
   EDITORIAL NAVIGATION + WEDDING COUNTDOWN
========================================================= */
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    if (toggle && links) {
        toggle.addEventListener("click", function () {
            const isOpen = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
            toggle.classList.toggle("is-open", isOpen);
        });

        links.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                links.classList.remove("open");
                toggle.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.setAttribute("aria-label", "Open navigation");
            });
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                links.classList.remove("open");
                toggle.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    const weddingDate = new Date("2027-02-24T15:00:00+08:00").getTime();
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    function updateCountdown() {
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        const distance = weddingDate - Date.now();
        if (distance <= 0) {
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            return;
        }
        daysEl.textContent = String(Math.floor(distance / 86400000)).padStart(2, "0");
        hoursEl.textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
        minutesEl.textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
        secondsEl.textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
    }
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
});
