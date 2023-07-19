const openButton = document.querySelector('.chatbox__button');
const dio = document.querySelector('.chatbox__wrapper');
const sendButton = document.querySelector('.send__button');

let state = false;
let messages = [];

const toggleState = () => {
  state = !state;

  if (state) {
    dio.classList.add('chatbox--active');
  } else {
    dio.classList.remove('chatbox--active');
  }
};

const onSendButton = () => {
  const textField = dio.querySelector('input');
  const text = textField.value.trim();
  
  if (!text) {
    return;
  }

  const msg = { name: 'User', message: text };
  messages.push(msg);
  updateChatText();
  textField.value = '';

  showLoader();

  fetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message: text }),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(r => r.json())
    .then(({ message }) => {
      const msg = { name: "dio", message };
      messages.push(msg);
      updateChatText();
      removeLoader();
    })
    .catch((error) => {
      console.error('Error:', error);
      updateChatText();
      removeLoader();
    });
};

const updateChatText = () => {
  let html = '';
  messages
    .slice()
    .reverse()
    .forEach(function (item, index) {
      if (item.name === 'dio') {
        html +=
          '<div class="messages__item messages__item--mine">' +
          item.message +
          '</div>';
      } else {
        html +=
          '<div class="messages__item messages__item--operator">' +
          item.message +
          '</div>';
      }
    });

  const messagesElement = dio.querySelector('.chatbox__messages');
  messagesElement.innerHTML = html;
};

function showLoader() {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  loader.innerHTML = `
    <span class="loader__dot"></span>
    <span class="loader__dot"></span>
    <span class="loader__dot"></span>
  `;
  const chatMessage = dio.querySelector('.chatbox__messages');
  chatMessage.appendChild(loader);
}

function removeLoader() {
  const loader = dio.querySelector('.loader');
  if (loader) {
    const chatMessage = dio.querySelector('.chatbox__messages');
    chatMessage.removeChild(loader);
  }
}

openButton.addEventListener('click', toggleState);

sendButton.addEventListener('click', onSendButton);

const inputNode = dio.querySelector('input');
inputNode.addEventListener('keyup', ({ key }) => {
  if (key === 'Enter') {
    onSendButton();
  }
});
