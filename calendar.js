	var monthList = {
		0:"Январь",
		1:"Февраль",
		2:"Март",
		3:"Апрель",
		4:"Май",
		5:"Июнь",
		6:"Июль",
		7:"Август",
		8:"Сентябрь",
		9:"Октябрь",
		10:"Ноябрь",
		11:"Декабрь"
	}
	
	var ShownMonth = function(month,year){
		this.CALENDAR_SIZE = 42;
		this.month = month;
		this.year = year;
		this.monthArray = new Array();
	}
	
	//gets number of days in "month"
	ShownMonth.prototype.daysInMonth = function(month){
       return 33 - new Date(this.year, month, 33).getDate();
	}
	
	//get the day of week for the 1st of current month	
	ShownMonth.prototype.getStartDay = function(){
		var firstDay = new Date (this.year,this.month,1);
		this.startDay = (firstDay.getDay()==0)?6:firstDay.getDay()-1; //getDay starts the week from Sunday, so the obtained value should be adjusted
		return this.startDay;
	}
	
	//creates a sequence of dates to be shown in calendar grid - <last part of previous month> + <current month> + <beginning of the next month>
	ShownMonth.prototype.setMonthArray = function(){
		var prevMonth = (this.month==0)?11:this.month-1;
		var lastDateofPrevious = this.daysInMonth(prevMonth);
		var lastDayOfPrevMonth = this.getStartDay()-1;
		
		var lastFilledDay = 0;
		//if current month starts not from Monday, then fill the part before starting day with last dates of the previous month 
		if (lastDayOfPrevMonth>=0){
			for (var i=0; i<=lastDayOfPrevMonth; i++){
				this.monthArray[i] = lastDateofPrevious-lastDayOfPrevMonth+i;
				lastFilledDay++;
			}
		}	
		//current month
		for (var j=1; j<=this.daysInMonth(this.month); j++){
			this.monthArray.push(j);
			lastFilledDay++;
		}
		//fill the remain place with the beginning of the next month
		var k =1;
		while (lastFilledDay<this.CALENDAR_SIZE){
			this.monthArray.push(k);
			k++;
			lastFilledDay++;
		}
	}
	
	//html representation
	var fillCalendar = function(monthObj){
		monthObj.setMonthArray();
		
		var monthTable = document.getElementById('month-table');
		var fragment = document.createDocumentFragment();
		
		monthTable.firstElementChild.textContent = monthList[monthObj.month]+' ' +monthObj.year;
		
		var k=0;
		var tdClassName = 'not_current'; //class for table cell
		for (var i=0; i<6; i++){
			var tr = document.createElement('tr');
			for (var j=0; j<7; j++){
				var td = document.createElement('td');
				if (monthObj.monthArray[k]==1){
					tdClassName = (tdClassName == 'not_current')?'current':'not_current';
				}
				td.textContent = monthObj.monthArray[k];
				td.className = tdClassName;
				tr.appendChild(td);
				k++;
			}
			fragment.appendChild(tr);
		}
		monthTable.appendChild(fragment);
		
		//remember currently shown month and year
		monthTable.setAttribute('month',monthObj.month);
		monthTable.setAttribute('year',monthObj.year);
	}
	
	var updateCalendar = function(monthObj){
		monthObj.setMonthArray();
		var monthTable = document.getElementById('month-table');
		//set caption - <month><year>
		monthTable.firstElementChild.textContent = monthList[monthObj.month]+' ' +monthObj.year;
	
		var k=0;
		var tdClassName = 'not_current';
		for (var i=1; i<7; i++){
			for (var j=0; j<7; j++){
				if (monthObj.monthArray[k]==1){
					tdClassName = (tdClassName == 'not_current')?'current':'not_current';
				}
				monthTable.rows[i].cells[j].textContent = monthObj.monthArray[k];
				monthTable.rows[i].cells[j].className = tdClassName;
				k++;
			}
		}
		//remember currently shown month and year
		monthTable.setAttribute('month',monthObj.month);
		monthTable.setAttribute('year',monthObj.year);
	}
	

	window.onload = function(){
		var monthTable = document.getElementById('month-table');
		var buttonPrev = document.getElementsByClassName('toggle-button')[0];
		var buttonNext = document.getElementsByClassName('toggle-button')[1];
		//position of toggle buttons - in the middle of table caption
		buttonPrev.style.top = getComputedStyle(monthTable.firstElementChild).height/2-getComputedStyle(buttonPrev).width/2;
		buttonNext.style.top = getComputedStyle(monthTable.firstElementChild).height/2-getComputedStyle(buttonNext).width/2;
		//show current month
		var currentDateObj = new Date();
		var currentMonth = currentDateObj.getMonth();
		var currentYear = currentDateObj.getFullYear();
		var shownMonth = new ShownMonth(currentMonth, currentYear);
		fillCalendar(shownMonth);
		//set hover state for cells
		monthTable.onmouseover = function(event) {
			var event = event || window.event;
			var target = event.target;
			while (target != this) {
				if (target.tagName == 'TD'&&target.className == 'current') {
					target.style.borderColor = '#000';
				}
				target = target.parentNode;
			}
		};

		monthTable.onmouseout = function(event) {
			var event = event || window.event;
			var target = event.target;
			target.style.borderColor = '';
		};
	}
	
	//fill the input field with chosen date
	var pickDate = function(chosenCell,shownMonth,shownYear){
		var inputField = document.getElementById('date');
		var date = (chosenCell.textContent.length>1)?chosenCell.textContent:'0'+chosenCell.textContent;
		var month = (shownMonth.length>1)?shownMonth:'0'+shownMonth;
		inputField.value = date + '/' + month +'/' + shownYear;
	}
	
	//toggle month to previous or next
	var toggleMonth = function(toBeShown,currentlyShownMonth,currentlyShownYear){
		var nextMonthToShow,
			nextYearToShow;
		if (toBeShown=='previous'){
			if (currentlyShownMonth==0){
				if (currentlyShownYear==1970) return;
				nextMonthToShow = 11;
				nextYearToShow = currentlyShownYear-1;
			} else  {
				nextMonthToShow = currentlyShownMonth-1;
				nextYearToShow = currentlyShownYear;
			}
		} else {
			if (toBeShown=='next'){
				if (currentlyShownMonth==11){
					nextMonthToShow = 0;
					nextYearToShow = +currentlyShownYear+1;
				} else  {
					nextMonthToShow = +currentlyShownMonth+1;
					nextYearToShow = currentlyShownYear;
				}
			} else return;
		}
		var shownMonth = new ShownMonth(nextMonthToShow, nextYearToShow);
		updateCalendar(shownMonth);
		
	}
	
	document.onclick = function(event){
		var event = event || window.event;
		var target = event.target;
		var monthTable = document.getElementById('month-table');
		var parentTarget = target;
		
		//click on table cell?
		while (parentTarget != this) {
			if (parentTarget.tagName == 'TD'&&parentTarget.className == 'current') {
			pickDate(parentTarget,+monthTable.getAttribute('month')+1, monthTable.getAttribute('year'));
			return;
		}
		parentTarget = parentTarget.parentNode;
		}
		//click on button?
		var toBeShown = target.getAttribute('data-toggle');
		if(!toBeShown) return;
		toggleMonth (toBeShown, monthTable.getAttribute('month'), monthTable.getAttribute('year'));
	
	}
	
