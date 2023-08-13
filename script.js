const inputSlider = document.querySelector('[data-length-slider]');
const lengthDisplay = document.querySelector('[data-lengthNo]');
const copyMessage = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector(".copyBtn");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const uppercase = document.querySelector('#uppercase');
const lowercase = document.querySelector('#lowercase');
const numbers = document.querySelector('#number');
const symbols = document.querySelector('#symbol');
const indicator = document.querySelector('.indicator');
const generateBtn = document.querySelector('.generate-button');
const allCheckBox = document.querySelectorAll("input[type=checkbox]");



let password = "";
let passwordLength = 10;
let checkCount = 0;
// set circle color to gray

handleSlider();
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    //shadow
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateNumber() {
    return getRandomInt(0, 9);
}

const symbol = '!@#$%^&*()_+-=:;"/[}]{|<>,';
function generateSymbol() {
    const randomSym = getRandomInt(0, symbol.length);
    return symbol.charAt(randomSym);
}

function generateLowercase() {
    return String.fromCharCode(getRandomInt(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRandomInt(65, 95));
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNumber = true;
    if (symbols.checked) hasSymbol = true;
    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    // copyText.select();
    // copyText.setSelectionRange(0, 99999);
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = "copied"
    }
    catch (e) {
        copyMessage.innerText = "failed";
    }
    copyMessage.classList.add('active');
    setTimeout(() => {
        copyMessage.classList.remove('active');
    }, 2000);
}

function handelCheckboxCheck() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handelCheckboxCheck);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

function shuffelPassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


generateBtn.addEventListener('click', () => {
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // remove old password
    password = "";

    // let put stuff mention in checkbox
    let funcArr = [];
    if (uppercase.checked)
        funcArr.push(generateUppercase);
    if (lowercase.checked)
        funcArr.push(generateLowercase);
    if (numbers.checked)
        funcArr.push(generateNumber);
    if (symbols.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for (let i = 0; i < funcArr.length; i++)
        password += funcArr[i]();

    // remaining addition 
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInt(0, funcArr.length);
        password += funcArr[randIndex]();
    }


    //shuffel
    password = shuffelPassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrength();

})