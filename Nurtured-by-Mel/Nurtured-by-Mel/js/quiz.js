/* =====================================================
   NURTURED BY MEL
   Hair Quiz
   Vanilla JavaScript
   ===================================================== */


/* =====================================================
   DOM ELEMENTS
   ===================================================== */

const quiz =
    document.querySelector("#hair-quiz");

const result =
    document.querySelector("#quiz-result");

const resultTitle =
    document.querySelector("#result-title");

const resultDescription =
    document.querySelector("#result-description");

const resultRecommendations =
    document.querySelector(
        "#result-recommendations"
    );

const resetButton =
    document.querySelector("#quiz-reset");


/* =====================================================
   HAIR-CARE RESULTS
   ===================================================== */

const hairResults = {

    moisture: {

        title: "Moisture & Nourishment",

        description:
            "Your answers suggest that a moisture-focused routine may be a good starting point for your hair-care journey.",

        recommendations: [
            "Use a gentle, moisturising cleanser.",
            "Follow with a nourishing conditioner.",
            "Consider a weekly deep-conditioning treatment.",
            "Protect your hair from excessive heat and dryness."
        ]

    },


    growth: {

        title: "Healthy Growth Support",

        description:
            "A consistent and gentle routine can help you focus on maintaining healthy hair while supporting your growth goals.",

        recommendations: [
            "Keep your scalp clean and comfortable.",
            "Focus on gentle handling to reduce unnecessary breakage.",
            "Moisturise your hair regularly.",
            "Protect your ends and avoid excessive manipulation."
        ]

    },


    strength: {

        title: "Strength & Protection",

        description:
            "Your answers suggest that strengthening and protecting your hair could be useful priorities.",

        recommendations: [
            "Use a gentle cleansing routine.",
            "Include conditioning treatments regularly.",
            "Be gentle when detangling.",
            "Limit excessive heat and harsh styling."
        ]

    },


    definition: {

        title: "Definition & Manageability",

        description:
            "Your routine can focus on keeping your hair moisturised, manageable and easy to style.",

        recommendations: [
            "Start with a moisturising cleanser.",
            "Use a conditioner that supports slip.",
            "Apply a leave-in product when needed.",
            "Use gentle styling techniques to maintain definition."
        ]

    },

    balanced: {

        title: "Balanced Hair-Care Routine",

        description:
            "Your answers suggest that a balanced routine with consistent cleansing, conditioning and protection may work well for you.",

        recommendations: [
            "Keep a consistent cleansing schedule.",
            "Condition your hair after washing.",
            "Pay attention to how your hair responds to products.",
            "Adjust your routine when your hair needs change."
        ]

    }

};


/* =====================================================
   GET FORM VALUE
   ===================================================== */

function getAnswer(name) {

    const selected =
        document.querySelector(
            `input[name="${name}"]:checked`
        );

    return selected ? selected.value : "";

}


/* =====================================================
   DETERMINE RESULT
   ===================================================== */

function determineResult() {

    const scalp =
        getAnswer("scalp");

    const goal =
        getAnswer("goal");

    const wash =
        getAnswer("wash");

    const feel =
        getAnswer("feel");

    const routine =
        getAnswer("routine");


    const scores = {

        moisture: 0,

        growth: 0,

        strength: 0,

        definition: 0,

        balanced: 0

    };


    /* Goal */

    if (goal === "moisture") {
        scores.moisture += 4;
    }

    if (goal === "growth") {
        scores.growth += 4;
    }

    if (goal === "strength") {
        scores.strength += 4;
    }

    if (goal === "definition") {
        scores.definition += 4;
    }


    /* Scalp */

    if (scalp === "dry") {
        scores.moisture += 2;
    }

    if (scalp === "oily") {
        scores.balanced += 2;
    }

    if (scalp === "normal") {
        scores.balanced += 2;
    }


    /* Hair feeling */

    if (feel === "dry") {
        scores.moisture += 2;
        scores.strength += 1;
    }

    if (feel === "oily") {
        scores.balanced += 2;
    }

    if (feel === "balanced") {
        scores.definition += 1;
        scores.balanced += 2;
    }


    /* Washing frequency */

    if (wash === "often") {
        scores.balanced += 1;
    }

    if (wash === "weekly") {
        scores.moisture += 1;
    }

    if (wash === "less") {
        scores.moisture += 1;
    }


    /* Routine preference */

    if (routine === "simple") {
        scores.balanced += 1;
    }

    if (routine === "balanced") {
        scores.balanced += 2;
    }

    if (routine === "detailed") {
        scores.definition += 1;
        scores.strength += 1;
    }


    /* Find highest score */

    let winningType = "balanced";

    let highestScore = 0;

    Object.entries(scores).forEach(
        ([type, score]) => {

            if (score > highestScore) {

                highestScore = score;

                winningType = type;

            }

        }
    );


    return winningType;

}


/* =====================================================
   DISPLAY RESULT
   ===================================================== */

function displayResult(type) {

    const selectedResult =
        hairResults[type] ||
        hairResults.balanced;


    resultTitle.textContent =
        selectedResult.title;


    resultDescription.textContent =
        selectedResult.description;


    resultRecommendations.innerHTML =
        "";


    selectedResult.recommendations.forEach(
        (recommendation) => {

            const item =
                document.createElement("div");

            item.classList.add(
                "recommendation-item"
            );


            const icon =
                document.createElement("span");

            icon.setAttribute(
                "aria-hidden",
                "true"
            );

            icon.textContent = "✿";


            const text =
                document.createElement("p");

            text.textContent =
                recommendation;


            item.append(
                icon,
                text
            );


            resultRecommendations.appendChild(
                item
            );

        }
    );


    result.hidden = false;

    quiz.hidden = true;


    /* Save result for later use */

    localStorage.setItem(
        "nurturedByMelQuizResult",
        type
    );


    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =====================================================
   QUIZ SUBMISSION
   ===================================================== */

quiz?.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();


        if (!quiz.checkValidity()) {

            quiz.reportValidity();

            return;

        }


        const resultType =
            determineResult();


        displayResult(resultType);

    }
);


/* =====================================================
   RESET QUIZ
   ===================================================== */

resetButton?.addEventListener(
    "click",
    () => {

        quiz.reset();

        result.hidden = true;

        quiz.hidden = false;

        localStorage.removeItem(
            "nurturedByMelQuizResult"
        );


        quiz.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);