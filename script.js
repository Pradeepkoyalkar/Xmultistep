let currentStep = 1;

let selectedPlan = null;

let isYearly = false;


// DOM ELEMENTS

const steps = document.querySelectorAll(".form-step");

const stepIndicators = document.querySelectorAll(".step-indicator");

const nextButton = document.getElementById("next-button");

const backButton = document.getElementById("back-button");

const billingToggle = document.getElementById("billing-toggle");


// --------------------------------------------------
// SHOW STEP
// --------------------------------------------------

function showStep(stepNumber) {

    currentStep = stepNumber;

    steps.forEach((step) => {
        step.classList.remove("active");
    });

    const selectedStep = document.getElementById(
        `step-${stepNumber}`
    );

    if (selectedStep) {
        selectedStep.classList.add("active");
    }


    // Update sidebar

    stepIndicators.forEach((indicator) => {

        const indicatorStep = Number(
            indicator.dataset.step
        );

        indicator.classList.remove("active");

        if (indicatorStep === stepNumber) {
            indicator.classList.add("active");
        }
    });


    // Back button

    if (stepNumber === 1) {
        backButton.style.visibility = "hidden";
    } else {
        backButton.style.visibility = "visible";
    }


    // Next button

    if (stepNumber === 4) {
        nextButton.textContent = "Confirm";
    } else if (stepNumber === 5) {
        nextButton.style.display = "none";
        backButton.style.display = "none";
    } else {
        nextButton.textContent = "Next Step";
        nextButton.style.display = "block";
    }
}


// --------------------------------------------------
// STEP 1 VALIDATION
// --------------------------------------------------

function validateStepOne() {

    const userName = document.querySelector(
        'input[name="userName"]'
    );

    const email = document.querySelector(
        'input[name="email"]'
    );

    const phone = document.querySelector(
        'input[name="phone"]'
    );


    // Native browser validation

    if (!userName.reportValidity()) {
        return false;
    }


    if (!email.reportValidity()) {
        return false;
    }


    if (!phone.reportValidity()) {
        return false;
    }


    return true;
}


// --------------------------------------------------
// PLAN SELECTION
// --------------------------------------------------

const planCards = document.querySelectorAll(".plan_card");

planCards.forEach((card) => {

    card.addEventListener("click", () => {

        // Remove selected from all

        planCards.forEach((plan) => {
            plan.classList.remove("selected");
        });


        // Select clicked plan

        card.classList.add("selected");


        selectedPlan = {
            name: card.dataset.plan,
            monthly: Number(card.dataset.monthly),
            yearly: Number(card.dataset.yearly)
        };


        document.getElementById(
            "plan-error"
        ).style.display = "none";

    });

});


// --------------------------------------------------
// BILLING TOGGLE
// --------------------------------------------------

billingToggle.addEventListener("change", () => {

    isYearly = billingToggle.checked;


    planCards.forEach((card) => {

        const monthlyPrice = card.querySelector(
            ".plan-price"
        );

        const yearlyPrice = card.querySelector(
            ".yearly-price"
        );


        if (isYearly) {

            monthlyPrice.style.display = "none";

            yearlyPrice.style.display = "block";

        } else {

            monthlyPrice.style.display = "block";

            yearlyPrice.style.display = "none";

        }

    });


    document.getElementById(
        "monthly-label"
    ).classList.toggle(
        "billing-active",
        !isYearly
    );


    document.getElementById(
        "yearly-label"
    ).classList.toggle(
        "billing-active",
        isYearly
    );

});


// --------------------------------------------------
// ADD-ON SELECTION
// --------------------------------------------------

const addonCards = document.querySelectorAll(
    ".addon_card"
);


addonCards.forEach((card) => {

    const checkbox = card.querySelector(
        'input[type="checkbox"]'
    );


    card.addEventListener("click", (event) => {

        /*
         * If Cypress/user clicks the card,
         * toggle the checkbox manually.
         *
         * If the checkbox itself was clicked,
         * browser already changes its state.
         */

        if (event.target !== checkbox) {
            checkbox.checked = !checkbox.checked;
        }


        card.classList.toggle(
            "selected",
            checkbox.checked
        );

    });

});


// --------------------------------------------------
// GET SELECTED ADDONS
// --------------------------------------------------

function getSelectedAddons() {

    const selectedAddons = [];


    document
        .querySelectorAll(
            ".addon-checkbox:checked"
        )
        .forEach((checkbox) => {

            selectedAddons.push({
                name: checkbox.dataset.addon,
                monthly: Number(
                    checkbox.dataset.monthly
                ),
                yearly: Number(
                    checkbox.dataset.yearly
                )
            });

        });


    return selectedAddons;
}


// --------------------------------------------------
// UPDATE SUMMARY
// --------------------------------------------------

function updateSummary() {

    if (!selectedPlan) {
        return;
    }


    const planPrice = isYearly
        ? selectedPlan.yearly
        : selectedPlan.monthly;


    document.getElementById(
        "summary-plan-name"
    ).textContent = selectedPlan.name;


    document.getElementById(
        "summary-plan-price"
    ).textContent = isYearly
        ? `$${planPrice}/yr`
        : `$${planPrice}/mo`;


    // Addons

    const summaryAddons =
        document.getElementById(
            "summary-addons"
        );


    summaryAddons.innerHTML = "";


    const addons = getSelectedAddons();


    let total = planPrice;


    addons.forEach((addon) => {

        const addonPrice = isYearly
            ? addon.yearly
            : addon.monthly;


        total += addonPrice;


        const addonElement =
            document.createElement("div");


        addonElement.className =
            "summary-addon";


        addonElement.innerHTML = `
            <span>${addon.name}</span>
            <span>+$${addonPrice}/${isYearly ? "yr" : "mo"}</span>
        `;


        summaryAddons.appendChild(
            addonElement
        );

    });


    document.getElementById(
        "total-label"
    ).textContent = isYearly
        ? "Total per year"
        : "Total per month";


    document.getElementById(
        "summary-total"
    ).textContent = isYearly
        ? `$${total}/yr`
        : `$${total}/mo`;
}


// --------------------------------------------------
// NEXT BUTTON
// --------------------------------------------------

nextButton.addEventListener("click", () => {


    // STEP 1

    if (currentStep === 1) {

        if (!validateStepOne()) {
            return;
        }


        showStep(2);

        return;
    }


    // STEP 2

    if (currentStep === 2) {

        if (!selectedPlan) {

            document.getElementById(
                "plan-error"
            ).style.display = "block";

            return;
        }


        updateSummary();

        showStep(3);

        return;
    }


    // STEP 3

    if (currentStep === 3) {

        updateSummary();

        showStep(4);

        return;
    }


    // STEP 4

    if (currentStep === 4) {

        showStep(5);

        // Hide all normal steps

        steps.forEach((step) => {
            step.classList.remove("active");
        });


        document
            .getElementById("thank-you")
            .classList.add("active");


        nextButton.style.display = "none";

        backButton.style.display = "none";

        return;
    }

});


// --------------------------------------------------
// BACK BUTTON
// --------------------------------------------------

backButton.addEventListener("click", () => {

    if (currentStep > 1) {

        showStep(
            currentStep - 1
        );

    }

});


// --------------------------------------------------
// CHANGE PLAN
// --------------------------------------------------

document
    .getElementById("change-plan")
    .addEventListener("click", () => {

        showStep(2);

    });


// --------------------------------------------------
// INITIAL STATE
// --------------------------------------------------

showStep(1);