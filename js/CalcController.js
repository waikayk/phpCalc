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
        //payload["time"] = new Date().getTime();

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
                    //Equation
                    historyNice += result[i].operand1+ " " + result[i].operator + " " + result[i].operand2 + " = " + result[i].answer;

                    //Time Since Entry
                    historyNice += " (" + result[i].tStamp + ")<br>";
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

    //http://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time-eg-2-seconds-ago-one-week-ago-etc-best
    function timeDifference(previous) {
        var current = new Date().getTime();
        var sPerMinute = 60 * 1000;
        var sPerHour = sPerMinute * 60;
        var sPerDay = sPerHour * 24;
        var sPerMonth = sPerDay * 30;
        var sPerYear = sPerDay * 365;

        var elapsed = current - previous;

        console.log(current + " " + previous + " " + elapsed);

        if (elapsed < sPerMinute) {
            return elapsed/1000 + ' seconds ago';
        }
        else if (elapsed < sPerHour) {
            return Math.round(elapsed/sPerMinute) + ' minutes ago';
        }
        else if (elapsed < sPerDay ) {
            return Math.round(elapsed/sPerHour ) + ' hours ago';
        }
        else if (elapsed < sPerMonth) {
            return 'approximately ' + Math.round(elapsed/sPerDay) + ' days ago';
        }
        else if (elapsed < sPerYear) {
            return 'approximately ' + Math.round(elapsed/sPerMonth) + ' months ago';
        }
        else {
            return 'approximately ' + Math.round(elapsed/sPerYear ) + ' years ago';
        }
    }

    $(document).ready(function() {
        window.CalcController = new CalcController();
        CalcController.GetHistory();
    });
})(jQuery);