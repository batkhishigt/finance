var uiController = (function () {
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        addBtn: ".add__btn"
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                descriotion: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        getDOMstrings: function () {
            return DOMstrings;
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
        }
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
        },
        data: function () {
            return data;
        }
    }

})();


var appController = (function (uiController, fnController) {
    var ctrlAddItem = function () {
        var input = uiController.getInput();
        fnController.addItem(input.type, input.descriotion, input.value)
        console.log(fnController.data())
    }
    var setupEventListener = function () {
        var DOM = uiController.getDOMstrings();
        document.querySelector(DOM.addBtn).addEventListener('click', function () {
            ctrlAddItem();
        })
        document.querySelector(DOM.inputValue).addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
    }
    return {
        init: function () {
            setupEventListener();

        }
    }

})(uiController, financeController);


appController.init();