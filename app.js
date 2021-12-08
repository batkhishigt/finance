var uiController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn",
        incomeList: ".income__list",
        expenseList: ".expenses__list",
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentLabel: ".budget__expenses--percentage",
        containerDiv: ".container",
        expensePercentageLabel: ".item__percentage",
        dateLabel: ".budget__title--month"
    }
    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i, list);
        }
    }
    var formatNumber = function (number, type) {
        number = '' + number;
        var x = number.split("").reverse().join("");
        var y = "";
        var count = 1;
        for (var i = 0; i < x.length; i++) {
            y = y + x[i];
            if (count % 3 === 0) y = y + ',';
            count++;
        }
        var z = y.split("").reverse().join("");
        if (z[0] === ',') z = z.substr(1, z.length - 1);
        if (type === 'inc') z = '+' + z; else z = '-' + z;
        return z;
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                descriotion: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        getDOMstrings: function () {
            return DOMstrings;
        },
        clearFields: function () {
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            var fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (el) {
                el.value = "";
            });
            fieldsArr[0].focus();
        },
        displayPercentages: function (allPercentages) {
            var elements = document.querySelectorAll(DOMstrings.expensePercentageLabel);
            nodeListForEach(elements, function (el, index) {
                el.textContent = allPercentages[index] + '%';
            })
        },
        changeType: function () {
            var fields = document.querySelectorAll(DOMstrings.inputType + ', ' + DOMstrings.inputDescription + ', ' + DOMstrings.inputValue)
            nodeListForEach(fields, function (el) {
                el.classList.toggle('red-focus');
            })
            document.querySelector(DOMstrings.addBtn).classList.toggle('red')
        },
        budgetDisplay: function (budget) {
            var type;
            if (budget.budget > 0) type = 'inc'; else type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(budget.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(budget.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(budget.totalExp, 'exp');

            if (budget.percent !== 0) {
                document.querySelector(DOMstrings.percentLabel).textContent = budget.percent + '%';
            } else {
                document.querySelector(DOMstrings.percentLabel).textContent = budget.percent;
            }

        },
        deleteListItem: function (id) {
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        addListItem: function (item, type) {
            var html, list;
            if (type === 'inc') {
                list = DOMstrings.incomeList;
                html = ' <div class="item clearfix" id = "inc-%id%" ><div class="item__description" > %DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
            } else {
                list = DOMstrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description"> %DESCRIPTION%</div><div class="right clearfix"><div class="item__value">%VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
            }
            html = html.replace('%id%', item.id);
            html = html.replace('%DESCRIPTION%', item.description);
            html = html.replace('%VALUE%', formatNumber(item.value, type));

            document.querySelector(list).insertAdjacentHTML('beforeend', html)

        },
        displayDate: function () {
            var today = new Date();
            document.querySelector(DOMstrings.dateLabel).textContent = today.getFullYear() + ' year' + today.getMonth() + ' month'
        }
    }
})();
var financeController = (function () {
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value
    }
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percent = -1;
    }
    Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc > 0)
            this.percent = Math.round((this.value / totalInc) * 100);
        else
            this.percent = 0;
    }
    Expense.prototype.getPercentage = function () {
        return this.percent;
    }
    var data = {
        items: {
            inc: [],
            exp: []
        },
        total: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percent: 0
    }
    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (el) {
            sum = sum + el.value;
        })
        data.total[type] = sum;

    }
    return {
        addItem: function (type, desc, val) {
            var item, id;
            if (data.items[type].length === 0) {
                id = 0;
            } else {
                id = data.items[type][data.items[type].length - 1].id + 1;
            }
            if (type === 'inc') {
                item = new Income(id, desc, val)
            } else {
                item = new Expense(id, desc, val)
            }
            data.items[type].push(item);
            return item;
        },
        data: function () {
            return data;
        },
        deleteItem: function (type, id) {
            var ids = data.items[type].map(function (el) {
                return el.id;
            })
            var index = ids.indexOf(id);
            if (index !== -1) data.items[type].splice(index, 1);
        },
        calculateBudget: function () {
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.total.inc - data.total.exp;
            if (data.total.inc > 0)
                data.percent = Math.round(data.total.exp / data.total.inc * 100);
            else data.percent = 0;
        },
        calcPercentages: function () {
            data.items.exp.forEach(function (el) {
                el.calcPercentage(data.total.inc)
            })
        },
        getPercentages: function () {
            var allPercentages = data.items.exp.map(function (el) {
                return el.getPercentage();
            })
            return allPercentages;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                percent: data.percent,
                totalInc: data.total.inc,
                totalExp: data.total.exp
            }
        }
    }

})();
var appController = (function (uiController, fnController) {
    var ctrlAddItem = function () {
        var input = uiController.getInput();
        if (input.descriotion !== "" && input.value !== "") {
            var item = fnController.addItem(input.type, input.descriotion, input.value)
            uiController.addListItem(item, input.type);
            uiController.clearFields();
            updateBudget();
        }
    }
    var updateBudget = function () {
        fnController.calculateBudget();
        var budget = fnController.getBudget()
        uiController.budgetDisplay(budget);
        fnController.calcPercentages();
        var allPercentages = fnController.getPercentages();
        uiController.displayPercentages(allPercentages);
    }
    var setupEventListener = function () {
        var DOM = uiController.getDOMstrings();
        document.querySelector(DOM.addBtn).addEventListener('click', function () {
            ctrlAddItem();
        });
        document.querySelector(DOM.inputValue).addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.inputType), addEventListener('change', uiController.changeType)
        document.querySelector(DOM.containerDiv).addEventListener('click', function (e) {
            var id = e.target.parentNode.parentNode.parentNode.parentNode.id;
            if (id) {
                var arr = id.split("-")
                fnController.deleteItem(arr[0], parseInt(arr[1]));
                uiController.deleteListItem(id);
                updateBudget();
            }
        })
    }
    return {
        init: function () {
            uiController.displayDate();
            setupEventListener();
            uiController.budgetDisplay({ budget: 0, totalInc: 0, totalExp: 0, percent: 0 })

        }
    }

})(uiController, financeController);


appController.init();