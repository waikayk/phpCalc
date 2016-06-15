var CalcController;

(function($) {
    CalcController = function () {
        this.currentNumber = "";
        this.currentTotal = "0";
        this.displayThis = "0";
        this.mathAction = "";
        this.previousMathAction = "";
        this.previousNumber = "";
    }

    CalcController.prototype.AjaxTest = function (){
        //Send it!
        console.log("Attempting to send data...");

        var payload = {};
        payload["operand1"] = 1.4;
        payload["operator"] = "*";
        payload["operand2"] = 5.5;

        $.ajax({
            url: "/insert/",
            type: 'POST',
            data: payload,
            async: true,
            success: function(result) {
               console.log(result);
            }
        });
    }

	CalcController.prototype.CreateNumber = function(digit){
		this.currentNumber += digit;
		this.displayThis = this.currentNumber;
        $("#display").html(this.displayThis);
	}

    CalcController.prototype.SetMathAction = function(symbol){
		if(this.mathAction !== ""){
			this.Process();
		}
		else if(this.currentNumber !== ""){
			this.currentTotal = this.currentNumber;
		}
		
		this.currentNumber = "";
		this.mathAction = symbol;

        $("#operation").html("Operation: " + symbol);
	}

    CalcController.prototype.Equals = function(){
		if(this.currentNumber === ""){
			this.mathAction = this.previousMathAction;
			this.currentNumber = this.previousNumber;
		}

		CalcController.Process();
	}

    CalcController.prototype.Process = function(){
		if(this.mathAction === "" || this.currentNumber === "") return;

        var ajaxURL = "";
		if(this.mathAction === '+'){
			//this.currentTotal = parseFloat(this.currentTotal) + parseFloat(this.currentNumber);
            ajaxURL = "/API/Add/";
		}
		else if(this.mathAction === '-'){
			//this.currentTotal = parseFloat(this.currentTotal) - parseFloat(this.currentNumber);
            ajaxURL = "/API/Subtract/";
		}
		else if(this.mathAction === '*'){
			//this.currentTotal = parseFloat(this.currentTotal) * parseFloat(this.currentNumber);
            ajaxURL = "/API/Multiply/";
		}
		else if(this.mathAction === '/'){
			//this.currentTotal = parseFloat(this.currentTotal) / parseFloat(this.currentNumber);
            ajaxURL = "/API/Divide/";
		}

        //Send it!
        var payload = {};
        payload["operand1"] = parseFloat(this.currentTotal);
        payload["operand2"] = parseFloat(this.currentNumber);

        $.ajax({
            url: ajaxURL,
            type: 'POST',
            data: payload,
            success: function(result) {
                this.currentTotal = result;

                this.previousMathAction = this.mathAction;
                this.mathAction = "";
                this.previousNumber = this.currentNumber;
                this.currentNumber = "";

                this.displayThis = this.currentTotal;

                $("#display").html(this.displayThis);
                CalcController.GetHistory();
            }
        });
	}

    CalcController.prototype.GetHistory = function(){
        $.ajax({
            url: "/API/History/",
            type: 'GET',
            async: true,
            success: function(result){
                result = JSON.parse(result);
                var historyNice = "";
                for(var i = result.length - 1; i >= 0; i--){
                    historyNice += result[i].operand1+ " " + result[i].operator + " " + result[i].operand2+ "<br>";
                }

                $("#history").html(historyNice);
            }
        });
    }

    CalcController.prototype.ClearAll = function(){
		this.currentTotal = "0";
		this.currentNumber = "";
		this.displayThis = "0";
		this.mathAction = "";
        $("#display").html(this.displayThis);
        $("#operation").html("Operation: " + this.mathAction);

        $.ajax({
            url: "/API/Clear/",
            type: 'POST',
            async: true,
            success: function(result){
                CalcController.GetHistory();
            }
        });
	}

    $(document).ready(function() {
        window.CalcController = new CalcController();
        CalcController.GetHistory();
    });
})(jQuery);