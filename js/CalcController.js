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
        switch(this.mathAction){
            case '+':
                ajaxURL = "/API/Add/";
                break;
            case '-':
                ajaxURL = "/API/Subtract/";
                break;
            case '*':
                ajaxURL = "/API/Multiply/";
                break;
            case '/':
                ajaxURL = "/API/Divide/";
                break;
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
                //console.log(result);
                this.currentTotal = result;

                this.displayThis = this.currentTotal;

                $("#display").html(this.displayThis);
                CalcController.GetHistory();
            }
        });

        this.previousMathAction = this.mathAction;
        this.mathAction = "";
        this.previousNumber = this.currentNumber;
        this.currentNumber = "";
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
                    historyNice += result[i].operand1+ " " + result[i].operator + " " + result[i].operand2 + " = " + result[i].answer + "<br>";
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