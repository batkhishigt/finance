var uiController = (function () {

})();



var financeController = (function () {

})();


var appController = (function (uoController, fnController) {
    var ctrlAddItem = function () {
        console.log("add item")
    }

    document.querySelector(".add__btn").addEventListener('click', function () {
        ctrlAddItem();
    })
    document.querySelector(".add__value").addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    })

})(uiController, financeController);