import bot from './assets/bot.png';
import user from './assets/user.png';

const form = document.querySelector('form');                            // using the tag name
const chatContainer = document.querySelector('#chat_container');        // using the id 

let loadInterval;

// 3 dots loader while loading the content
function loader(element) {
  element.textContent = '';

  loadInterval = setInterval(() => {
    element.textContent += '.';

    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300)     // 300ms
}

// Typing the content one letter by letter
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20)    // 20ms
}

// Generate unique id for every single message
function generateUniqueId() { 
  const timestamp = Date.now();       // Unique for in all languages
  const randomNumber = Math.random();     // even more random
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

// To show the chat message
function chatStripe(isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img 
              src="${isAi ? bot : user}" 
              alt="${isAi ? 'Bot' : 'User'}"
            >
          </div>
          <div class="message" id="${uniqueId}">${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();

  // Get the data that we type into the form
  const data = new FormData(form);

  // user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  // Clear the form area input
  form.reset();

  // AI's chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, '', uniqueId);

  // As the user is going to type, we want to keep scrolling down to be able to see the message
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Fetch newly created div
  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  // Fetch the response from the server -> Bot's response
  const response = await fetch('http://localhost:5000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    // Passing the object
    body: JSON.stringify({
      prompt: data.get('prompt')    // comming from textarea input
    })
  })

  clearInterval(loadInterval);
  messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();   // Actual response coming from the backend
    const parsedData = data.bot.trim();

    console.log(parsedData);

    typeText(messageDiv, parsedData);     // pass it to the function
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong!";
    alert(err)
  }
}

// Once we submit, We want to call the handleSubmit fuction
form.addEventListener('submit', handleSubmit);
// Press enter to submit
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {       // 13 is the enter key
    handleSubmit(e);
  }
})