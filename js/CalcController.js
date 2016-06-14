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

        $.ajax({
            url: "/hello/",
            type: 'GET',
            //data: payload,
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
		
		if(this.mathAction === '+'){
			this.currentTotal = parseFloat(this.currentTotal) + parseFloat(this.currentNumber);
		}
		else if(this.mathAction === '-'){
			this.currentTotal = parseFloat(this.currentTotal) - parseFloat(this.currentNumber);
		}
		else if(this.mathAction === '*'){
			this.currentTotal = parseFloat(this.currentTotal) * parseFloat(this.currentNumber);
		}
		else if(this.mathAction === '/'){
			this.currentTotal = parseFloat(this.currentTotal) / parseFloat(this.currentNumber);
		}
		
		this.previousMathAction = this.mathAction;
		this.mathAction = "";
		this.previousNumber = this.currentNumber;
		this.currentNumber = "";
		
		this.displayThis = this.currentTotal;

        $("#display").html(this.displayThis);
	}

    CalcController.prototype.ClearAll = function(){
		this.currentTotal = "0";
		this.currentNumber = "";
		this.displayThis = "0";
		this.mathAction = "";

        $("#display").html(this.displayThis);
        $("#operation").html("Operation: " + this.mathAction);
	}

    $(document).ready(function() {
        window.CalcController = new CalcController();
    });
})(jQuery);