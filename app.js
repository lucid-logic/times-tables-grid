const app = Vue.createApp({
    data(){
        return {
            multiplierSelected: [],
            questionArray: [],
            gameStarted: false,
            answerResult: [],
            currentQuestion: -1,
            suppliedAnswer: "",
            lastGameResult: "",
            correctCount: 0,
            incorrectCount: 0
        
        };
    },
    computed: {
        startButtonText() {
            return this.gameStarted?"Reset the Game":"Start the Game";
        },
        questionText(){
            if(this.lastGameResult != ''){
                return this.lastGameResult;
            }
            if(this.currentQuestion == -1){
                return "";
            }
            return this.questionArray[this.currentQuestion].number1 + " x " + this.questionArray[this.currentQuestion].number2;
        }
    },
    methods: {
        focusInput(){
            console.log(this.$refs.answerTextBox);
            if(this.$refs.answerTextBox!= undefined){
                this.$refs.answerTextBox.focus();  
            }

        },

        resultClass(column,row){
            
            if(this.answerResult[column+"-"+row]===true){
                return {correctBox: true};
            }
            if(this.answerResult[column+"-"+row]===false){
                return {incorrectBox: true};
            }
            return {
                activeBox: !(this.multiplierSelected[column]===false),
                inActiveBox: (this.multiplierSelected[column]===false),
            
            };
        },
        toggleMultiplier(multiplier){
            if(this.gameStarted){
                return;
            }
            if(this.multiplierSelected[multiplier]===false){
                this.multiplierSelected[multiplier] =true;
            }else{
                this.multiplierSelected[multiplier] = false;
            }
            console.log(multiplier);
        },
        startButtonClick(){
            this.gameStarted = !this.gameStarted;
            if(this.gameStarted){
                this.initialiseGame();
                this.setQuestion();
                Vue.nextTick(() => {
                    this.focusInput();
                  })
            }else{
                this.clearGame();
            }
        },
        clearGame(){
            this.questionArray = [];
            this.lastGameResult="";
            this.answerResult = [];
            this.incorrectCount= 0;
            this.correctCount = 0;
            this.suppliedAnswer = "";

        },
        initialiseGame(){
            this.clearGame();
            var c = 0;
            for(i=1;i<13;i++){
                if(!(this.multiplierSelected[i]===false)){
                    for(m = 1;m < 13; ++m ){
                        this.questionArray[c++] = {number1: i, number2: m}
                    }
                }
            }
        },
        setQuestion(){
            if(this.questionArray.length==0){
                this.currentQuestion = -1;
                this.lastGameResult = "You scored " + this.correctCount + " out of " + (this.correctCount+this.incorrectCount) + " (" +Math.floor(this.correctCount/(this.correctCount+this.incorrectCount)*100) + "%)";
                
            }else{
                this.currentQuestion = Math.floor(Math.random() * this.questionArray.length);
            }

        },
        submitAnswer(){
            this.focusInput();
            if(this.suppliedAnswer==""){
                return;
            }
            const num1 = this.questionArray[this.currentQuestion].number1;
            const num2 = this.questionArray[this.currentQuestion].number2;
            const result = (""+this.suppliedAnswer) == (""+(num1 * num2));
            this.answerResult[num1+"-"+num2] = result;
            this.questionArray.splice(this.currentQuestion,1);
            this.suppliedAnswer = "";
            if(result){
                this.correctCount++;
            }else{
                this.incorrectCount++;
            }
            this.setQuestion();
        }
    }


});

app.mount('#timesTableApp');