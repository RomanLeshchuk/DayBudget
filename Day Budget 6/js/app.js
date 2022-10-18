function getPromptData(request, additionalCondition = result => true) {
    while (true) {
        const result = prompt(request, "");
        if (result != null && result != "" && additionalCondition(result)) {
            return result;
        } else {
            alert("Неправильний ввід");
        }
    }
}

const isPositiveNumber = result => !isNaN(parseFloat(result)) 
                                     && parseFloat(result) == result
                                     && parseFloat(result) >= 0;

const appData = {
    start() {
        appData.budget = document.querySelector(".choose-budget").value;
        appData.budget = isPositiveNumber(appData.budget) ? Math.round(parseFloat(appData.budget) * 10) / 10 : "Помилка!";

        appData.timeData = document.querySelector(".choose-date").value;
        appData.timeData = function (dateStr) {
            const regex = /^\d{4}-\d{2}-\d{2}$/;
              
            if (dateStr.match(regex) === null) {
                return false;
            }
          
            const date = new Date(dateStr);
          
            const timestamp = date.getTime();
          
            if (typeof timestamp !== 'number' || isNaN(timestamp)) {
                return false;
            }
          
            return date.toISOString().startsWith(dateStr);
        }(appData.timeData) ? appData.timeData : false;

        const time = (appData.timeData === false) ? new Date() : new Date(appData.timeData);

        document.querySelector(".year-value").value = time.getFullYear();
        document.querySelector(".month-value").value = time.getMonth() + 1;
        document.querySelector(".day-value").value = time.getDate();

        document.querySelector(".budget-value").innerText = appData.budget;
    },
    
    chooseExpenses() {
        const expensesList = document.querySelectorAll(".expenses-item");

        let expenseSum = 0;
        for (let i = 1; i < expensesList.length; i += 2) {
            if (isPositiveNumber(expensesList[i].value)) {
                expenseSum += parseFloat(expensesList[i].value)
            } else if (expensesList[i].value !== "") {
                expenseSum = "Помилка!";
                break;
            }
        }

        document.querySelector(".expenses-value").innerText = expenseSum;
    },

    chooseOptExpenses() {
        const optionalExpensesList = document.querySelectorAll(".optionalexpenses-item");

        let optExpenses = "";
        for (let i = 0; i < optionalExpensesList.length; i++) {
            const expenseName = optionalExpensesList[i].value;
            if (expenseName) {
                appData.optionalExpenses[i + 1] = expenseName;
                optExpenses += `${i + 1}: ${expenseName}, `;
            }
        }

        document.querySelector(".optionalexpenses-value").innerText = optExpenses.slice(0, -2) || "Відсутні";
    },

    detectDayBudget() {
        appData.dailyBudget = Math.round(appData.budget / 3) / 10 || "Помилка!";
        let wageLevel;
    
        if (!isPositiveNumber(appData.dailyBudget)) {
            wageLevel = "Помилка!";
        } else if (appData.dailyBudget < 300) {
            wageLevel = "Мінімальний рівень доходів";
        } else if (appData.dailyBudget < 1000) {
            wageLevel = "Середній рівень доходів";
        } else {
            wageLevel = "Високий рівень доходів";
        }
    
        document.querySelector(".level-value").innerText = wageLevel;
        document.querySelector(".daybudget-value").innerText = appData.dailyBudget;
    },
    
    checkSavings() {
        if (appData.savings == true) {
            const save = document.querySelector(".choose-sum").value;
            const percent = document.querySelector(".choose-percent").value;

            appData.monthIncome = Math.round(percent / 120 * save) / 10;
            appData.yearIncome = Math.round(percent / 10 * save) / 10;

            appData.monthIncome = isNaN(appData.monthIncome) ? "Помилка!" : appData.monthIncome;
            appData.yearIncome = isNaN(appData.yearIncome) ? "Помилка!" : appData.yearIncome;
        } else {
            appData.yearIncome = appData.monthIncome = "Відсутні";
        }

        document.querySelector(".monthsavings-value").innerText = appData.monthIncome;
        document.querySelector(".yearsavings-value").innerText = appData.yearIncome;
    },

    chooseIncome() {
        const incomeList = document.querySelector(".choose-income").value;
        appData.income = incomeList.replace(/\s+/g, "").split(",");
        appData.income.sort();
        
        document.querySelector(".income-value").innerText = appData.income.join(", ") || "Відсутній";
    },

    budget: undefined,
    dataTime: undefined,
    expenses: {},
    optionalExpenses: {},
    income: [],
    savings: true
};

document.querySelector(".start").addEventListener("click", () => {
    appData.start();
    appData.detectDayBudget();
    appData.chooseExpenses();
    appData.chooseOptExpenses();
    appData.chooseIncome();
    appData.checkSavings();
});

document.querySelector(".expenses-item-btn").addEventListener("click", appData.chooseExpenses);

document.querySelector(".optionalexpenses-btn").addEventListener("click", appData.chooseOptExpenses);

document.querySelector(".count-budget-btn").addEventListener("click", () => {
    appData.start();
    appData.detectDayBudget();
});

document.querySelector(".choose-income").addEventListener("input", appData.chooseIncome);

document.querySelector("#savings").addEventListener("click", () => {
    appData.savings = !appData.savings;
    appData.checkSavings();
});