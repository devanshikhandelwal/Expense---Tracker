if(
    window.location.pathname.includes(
        "dashboard.html"
    )
){

    const isLoggedIn =
    localStorage.getItem("isLoggedIn");

    if(!isLoggedIn){

        window.location.href =
        "login.html";
    }

}


const toggleBtn =
document.querySelector(".theme-toggle");

if(toggleBtn){

    toggleBtn.addEventListener("click", () => {

        document.body.classList.toggle(
            "light-mode"
        );

    });

}


const passwordInput =
document.querySelector("#password");

const eyeIcon =
document.querySelector("#eye-icon");

if(eyeIcon){

    eyeIcon.addEventListener("click", () => {

        if(passwordInput.type === "password"){

            passwordInput.type = "text";

            eyeIcon.classList.replace(
                "fa-eye",
                "fa-eye-slash"
            );

        }

        else{

            passwordInput.type = "password";

            eyeIcon.classList.replace(
                "fa-eye-slash",
                "fa-eye"
            );

        }

    });

}


const confirmPasswordInput =
document.querySelector("#confirm-password");

const confirmEyeIcon =
document.querySelector("#confirm-eye-icon");

if(confirmEyeIcon){

    confirmEyeIcon.addEventListener("click", () => {

        if(confirmPasswordInput.type === "password"){

            confirmPasswordInput.type = "text";

            confirmEyeIcon.classList.replace(
                "fa-eye",
                "fa-eye-slash"
            );

        }

        else{

            confirmPasswordInput.type = "password";

            confirmEyeIcon.classList.replace(
                "fa-eye-slash",
                "fa-eye"
            );

        }

    });

}


const loginForm =
document.querySelector("#login-form");

if(loginForm){

    const emailInput =
    document.querySelector("#email");

    const errorMessage =
    document.querySelector(".error-message");

    loginForm.addEventListener("submit", (e) => {

        e.preventDefault();

        if(emailInput.value === ""){

            errorMessage.textContent =
            "Please enter your email";

            return;
        }

        if(passwordInput.value === ""){

            errorMessage.textContent =
            "Please enter your password";

            return;
        }

        const savedUser =
        JSON.parse(
            localStorage.getItem("userData")
        );

        if(!savedUser){

            errorMessage.textContent =
            "No account found";

            return;
        }

        if(emailInput.value !== savedUser.email){

            errorMessage.textContent =
            "Email not found";

            return;
        }

        if(passwordInput.value !== savedUser.password){

            errorMessage.textContent =
            "Incorrect password";

            return;
        }

        localStorage.setItem(
            "isLoggedIn",
            true
        );

        window.location.href =
        "dashboard.html";

    });

}


const signupForm =
document.querySelector("#signup-form");

if(signupForm){

    const nameInput =
    document.querySelector("#name");

    const emailInput =
    document.querySelector("#email");

    const errorMessage =
    document.querySelector(".error-message");

    signupForm.addEventListener("submit", (e) => {

        e.preventDefault();

        if(nameInput.value === ""){

            errorMessage.textContent =
            "Please enter your name";

            return;
        }

        if(emailInput.value === ""){

            errorMessage.textContent =
            "Please enter your email";

            return;
        }

        if(passwordInput.value === ""){

            errorMessage.textContent =
            "Please enter your password";

            return;
        }

        if(confirmPasswordInput.value === ""){

            errorMessage.textContent =
            "Please confirm your password";

            return;
        }

        if(
            passwordInput.value !==
            confirmPasswordInput.value
        ){

            errorMessage.textContent =
            "Passwords do not match";

            return;
        }

        const userData = {

            name: nameInput.value,

            email: emailInput.value,

            password: passwordInput.value

        };

        localStorage.setItem(

            "userData",

            JSON.stringify(userData)

        );

        alert(
            "Account Created Successfully"
        );

        window.location.href =
        "login.html";

    });

}


const logoutBtn =
document.querySelector(".logout-btn");

if(logoutBtn){

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem(
            "isLoggedIn"
        );

        window.location.href =
        "login.html";

    });

}


const saveTransactionBtn =
document.querySelector("#save-transaction");

const titleInput =
document.querySelector("#title");

const amountInput =
document.querySelector("#amount");

const typeInput =
document.querySelector("#type");

const categoryInput =
document.querySelector("#category");

const transactionList =
document.querySelector(".transaction-list");

const balance =
document.querySelector("#balance");

const income =
document.querySelector("#income");

const expense =
document.querySelector("#expense");

const welcomeMessage =
document.querySelector("#welcome-message");

const expenseChartCanvas =
document.querySelector("#expenseChart");


const savedUser =
JSON.parse(
    localStorage.getItem("userData")
);

if(savedUser && welcomeMessage){

    welcomeMessage.textContent =

    `Welcome Back, ${savedUser.name} 👋`;

}


let totalBalance = 0;

let totalIncome = 0;

let totalExpense = 0;


let transactions = JSON.parse(

    localStorage.getItem("transactions")

) || [];


let categoryTotals = {

    Food: 0,

    Shopping: 0,

    Travel: 0,

    Bills: 0,

    Salary: 0

};


function updateUI(){

    balance.textContent =
    `₹${totalBalance}`;

    income.textContent =
    `₹${totalIncome}`;

    expense.textContent =
    `₹${totalExpense}`;

}


let expenseChart;


function renderChart(){

    if(!expenseChartCanvas){

        return;
    }


    const labels =
    Object.keys(categoryTotals);

    const data =
    Object.values(categoryTotals);


    if(expenseChart){

        expenseChart.destroy();
    }


    expenseChart = new Chart(

        expenseChartCanvas,

        {

            type: "pie",

            data: {

                labels: labels,

                datasets: [

                    {

                        data: data,

                        borderWidth: 1

                    }

                ]

            }

        }

    );

}


function addTransactionToPage(transaction){

    const transactionItem =
    document.createElement("div");

    transactionItem.classList.add(
        "transaction-item"
    );


    transactionItem.innerHTML = `

        <div>

            <h4>${transaction.title}</h4>

            <p>

                ${transaction.type}
                •
                ${transaction.category}

            </p>

        </div>

        <div class="transaction-actions">

            <span class="${
                transaction.type === "income"
                ? "income"
                : ""
            }">

                ${
                    transaction.type === "income"
                    ? "+"
                    : "-"
                }

                ₹${transaction.amount}

            </span>

            <button class="delete-btn">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

    `;


    transactionList.appendChild(
        transactionItem
    );


    if(transaction.type === "income"){

        totalIncome += transaction.amount;

        totalBalance += transaction.amount;

    }

    else{

        totalExpense += transaction.amount;

        totalBalance -= transaction.amount;

    }


    categoryTotals[
        transaction.category
    ] += transaction.amount;


    updateUI();

    renderChart();


    const deleteBtn =
    transactionItem.querySelector(
        ".delete-btn"
    );


    deleteBtn.addEventListener("click", () => {

        if(transaction.type === "income"){

            totalIncome -= transaction.amount;

            totalBalance -= transaction.amount;

        }

        else{

            totalExpense -= transaction.amount;

            totalBalance += transaction.amount;

        }


        categoryTotals[
            transaction.category
        ] -= transaction.amount;


        updateUI();

        renderChart();


        transactions =
        transactions.filter((item) => {

            return !(

                item.title === transaction.title &&

                item.amount === transaction.amount &&

                item.type === transaction.type

            );

        });


        localStorage.setItem(

            "transactions",

            JSON.stringify(transactions)

        );


        transactionItem.remove();

    });

}


transactions.forEach((transaction) => {

    addTransactionToPage(transaction);

});


if(saveTransactionBtn){

    saveTransactionBtn.addEventListener("click", () => {

        const title =
        titleInput.value.trim();

        const amount =
        Number(amountInput.value);

        const type =
        typeInput.value;


        if(title === "" || amount <= 0){

            return;

        }


        const transactionData = {

            title: title,

            amount: amount,

            type: type,

            category: categoryInput.value

        };


        transactions.push(
            transactionData
        );


        localStorage.setItem(

            "transactions",

            JSON.stringify(transactions)

        );


        addTransactionToPage(
            transactionData
        );


        titleInput.value = "";

        amountInput.value = "";

    });

}
/* SETTINGS PAGE */

const saveSettingsBtn =
document.querySelector("#save-settings");

const changeNameInput =
document.querySelector("#change-name");

const changeEmailInput =
document.querySelector("#change-email");

const changePasswordInput =
document.querySelector("#change-password");

if(saveSettingsBtn){

    saveSettingsBtn.addEventListener("click", () => {

        const updatedUser = {

            name:
            changeNameInput.value || savedUser.name,

            email:
            changeEmailInput.value || savedUser.email,

            password:
            changePasswordInput.value || savedUser.password

        };


        localStorage.setItem(

            "userData",

            JSON.stringify(updatedUser)

        );


        alert(
            "Settings Updated Successfully"
        );

    });

}


/* RESET TRANSACTIONS */

const resetTransactionsBtn =
document.querySelector("#reset-transactions");

if(resetTransactionsBtn){

    resetTransactionsBtn.addEventListener("click", () => {

        localStorage.removeItem(
            "transactions"
        );

        location.reload();

    });

}


/* ANALYTICS PAGE */

const highestExpense =
document.querySelector("#highest-expense");

const totalTransactions =
document.querySelector("#total-transactions");

const monthlySpending =
document.querySelector("#monthly-spending");


if(highestExpense){

    let maxExpense = 0;

    let totalSpent = 0;


    transactions.forEach((transaction) => {

        if(transaction.type === "expense"){

            totalSpent += transaction.amount;

            if(transaction.amount > maxExpense){

                maxExpense =
                transaction.amount;
            }

        }

    });


    highestExpense.textContent =
    `₹${maxExpense}`;


    totalTransactions.textContent =
    transactions.length;


    monthlySpending.textContent =
    `₹${totalSpent}`;

}


/* TRANSACTIONS PAGE */

const searchTransaction =
document.querySelector("#search-transaction");

const filterType =
document.querySelector("#filter-type");

const filterCategory =
document.querySelector("#filter-category");


function renderFilteredTransactions(){

    if(!transactionList){

        return;
    }


    transactionList.innerHTML = "";


    const searchValue =
    searchTransaction.value.toLowerCase();

    const typeValue =
    filterType.value;

    const categoryValue =
    filterCategory.value;


    const filteredTransactions =

    transactions.filter((transaction) => {

        const matchesSearch =

        transaction.title
        .toLowerCase()
        .includes(searchValue);


        const matchesType =

        typeValue === "all" ||

        transaction.type === typeValue;


        const matchesCategory =

        categoryValue === "all" ||

        transaction.category === categoryValue;


        return (

            matchesSearch &&

            matchesType &&

            matchesCategory

        );

    });


    if(filteredTransactions.length === 0){

        transactionList.innerHTML =

        `

        <div class="empty-state">

            No Transactions Found

        </div>

        `;

        return;
    }


    filteredTransactions.forEach((transaction) => {

        addTransactionToPage(transaction);

    });

}


if(searchTransaction){

    searchTransaction.addEventListener(

        "input",

        renderFilteredTransactions

    );

}


if(filterType){

    filterType.addEventListener(

        "change",

        renderFilteredTransactions

    );

}


if(filterCategory){

    filterCategory.addEventListener(

        "change",

        renderFilteredTransactions

    );

}