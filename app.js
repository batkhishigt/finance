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
        containerDiv: ".container"
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
        budgetDisplay: function (budget) {
            document.querySelector(DOMstrings.budgetLabel).textContent = budget.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = budget.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = budget.totalExp;

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
                html = ' <div class="item clearfix" id = "inc-%id%" ><div class="item__description" > %DESCRIPTION%</div><div class="right clearfix"><div class="item__value">+ %VALUE%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
            } else {
                list = DOMstrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description"> %DESCRIPTION%</div><div class="right clearfix"><div class="item__value">- %VALUE%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
            }
            html = html.replace('%id%', item.id);
            html = html.replace('%DESCRIPTION%', item.description);
            html = html.replace('%VALUE%', item.value);

            document.querySelector(list).insertAdjacentHTML('beforeend', html)

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
            data.percent = Math.round(data.total.exp / data.total.inc * 100);
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
            fnController.calculateBudget();
            var budget = fnController.getBudget()
            uiController.budgetDisplay(budget);
        }
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
        document.querySelector(DOM.containerDiv).addEventListener('click', function (e) {
            var id = e.target.parentNode.parentNode.parentNode.parentNode.id;
            if (id) {
                var arr = id.split("-")
                fnController.deleteItem(arr[0], parseInt(arr[1]));
                uiController.deleteListItem(id);
            }
        })
    }
    return {
        init: function () {
            setupEventListener();
            uiController.budgetDisplay({ budget: 0, totalInc: 0, totalExp: 0, percent: 0 })

        }
    }

})(uiController, financeController);


appController.init();