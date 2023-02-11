'use strict';

/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-12-28T21:31:17.178Z',
    '2023-02-03T07:15:02.383Z',
    '2022-12-29T09:15:04.904Z',
    '2023-01-01T10:17:24.185Z',
    '2022-12-28T14:11:59.604Z',
    '2023-01-30T17:01:17.194Z',
    '2023-02-07T23:36:17.929Z',
    '2023-02-09T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Damilola Victoria ',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-12-28T21:31:17.178Z',
    '2023-02-03T07:15:02.383Z',
    '2022-12-29T09:15:04.904Z',
    '2023-01-01T10:17:24.185Z',
    '2022-12-28T14:11:59.604Z',
    '2023-01-30T17:01:17.194Z',
    '2023-02-07T23:36:17.929Z',
    '2023-02-09T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];


/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
//display Movement 
   //format date
const formatMovementDate = function (date, locale) {
     const calcDaysPassed = (date1,  date2) =>Math.round(Math.abs(date2 - date1)/ (1000 * 60 * 60 * 24));
     const daysPassed = calcDaysPassed(new Date(), date);
     console.log(daysPassed);
     
     if(daysPassed == 0) return 'Today';
     if(daysPassed == 1) return 'yesterday';
     if(daysPassed <= 7) return `${daysPassed} days ago`;
    
  /*  const day = `${date.getDate()}`.padStart(2,0);
const month = `${date.getMonth()+1}`.padStart(2,0);
const year = date.getFullYear();

return `${day}/${month}/${year}`; */

     return new Intl.DateTimeFormat(locale).format(date);       
};

const formatCurrency = function(value, locale, currency)  {
     return new Intl.NumberFormat(locale, {
         style: 'currency',
         currency: currency,
    }).format(value);
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
//sorting
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    
    //formated date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale)
    
    //formated movement
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);
    
    
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//print Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
 
  labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency);
};
//Display Summary
const calcDisplaySummary = function (acc) {
//income
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);
  
   
//outcome
  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCurrency(outcomes, acc.locale, acc.currency);
 
//Interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(interest, acc.locale, acc.currency);
  
};

//computing usernames
//using the for each will help create side effects by manipulating the current array and editing a username key
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//update UI when a transaction is made
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function() {
    const tick = function() {
       const min = String(Math.trunc(time / 60)).padStart(2, 0);
       const sec = String(time % 60).padStart(2, 0);
          //In each call,  print the remaining time to UI
          labelTimer.textContent = `${min}:${sec}`;
          
          //When 0 seconds,  stop timer and log out user
          if(time === 0) {
               clearInterval(timer);
               labelWelcome.textContent = 'Log in to get started';
    containerApp.style.opacity = 0;
    
          }
          
          //Decrease 1s
          time--;
          
     }
     //Set time to 5 minutes
     let time= 120;
     
     //Call the timer every second 
     tick();
     const timer = setInterval(tick, 1000)
     return timer;
}

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

//FAKE ALWAYS LOGGED IN
/*  
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;
 */

//Login
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    
    //create current date and time
    const now = new Date();
    
const options = {
     hour: 'numeric',
     minute: 'numeric',
     day: 'numeric',
     month: 'long',
     year: 'numeric',
     //weekday: 'long',
};
/*  const locale = navigator.language;
console.log("locale is",locale); */

labelDate.textContent = new Intl. DateTimeFormat(currentAccount.locale, options).format(now);

//this is a manual alternative to display date 
    /*    
const day = `${now.getDate()}`.padStart(2,0);
const month = `${now.getMonth()+1}`.padStart(2,0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();
labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`; */

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

//Timer
if(timer) clearInterval(timer);
timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
  //if you have a wrong username, you can display an error message and also hide ui
});

//TRANSFER MONEY
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  
//The following are conditions for transferring 
//1. amount to be transferred  must not be less than 0
//2. currentAccount (recipient) balance must be greater than or equal to the amount that is being transferred 
//3. current user (recipient)must not be the receiver 
//4. Check if receiver account exist

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
   
    // Doing the transfer
  currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }else {
         alert('Transfer Invalid ');
     } 
     
     //Reset Timer
     clearInterval(timer);
     timer = startLogOutTimer();
});

//LOAN REQUEST
//bank will only grant a loan if there's at least one deposit that has 10% of the loan you're requesting for
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
  alert('Hold On.Loan request is being processed')
   setTimeout(function () {
         alert('Loan request granted');
    // Add movement
    currentAccount.movements.push(amount);
    //Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
    
    // Update UI
    updateUI(currentAccount);
    
    //Reset Timer
     clearInterval(timer);
     timer = startLogOutTimer();
    }, 6000);
    
    //clear input field
  inputLoanAmount.value = '';
  }
  else{
          alert("Loan will be granted if there is at least one deposit that has 10% of the loan you're requesting for ")
     }
});

//Close Account 
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    
    // Delete account
    accounts.splice(index, 1);

    //hide/delete UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});
//Sort Button
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});


////////////////
const future = new Date(2037,10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1,  date2) =>Math.abs(date2 - date1)/ (1000 * 60 * 60 * 24);

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037,3, 24));
console.log(days1);

//logging the current time
setInterval(function () {
     const now = new Date();
     const hour = now.getHours();
     const min = now.getMinutes();
     const sec = now.getSeconds();
     console.log("The current time is =>",`${hour}:${min}:${sec}`);
}, 1000)
