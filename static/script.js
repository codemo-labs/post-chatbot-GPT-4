class DioArafi {
  constructor() {
    this.args = {
      openButton: document.querySelector('.chatbox__button'),
      dio: document.querySelector('.chatbox__wrapper'),
      sendButton: document.querySelector('.send__button'),
    };

    this.state = false;
    this.messages = [];
  }

  display() {
    const { openButton, dio, sendButton } = this.args;

    openButton.addEventListener('click', () => this.toggleState(dio));

    sendButton.addEventListener('click', () => this.onSendButton(dio));

    const node = dio.querySelector('input');
    node.addEventListener('keyup', ({ key }) => {
      if (key === 'Enter') {
        this.onSendButton(dio);
      }
    });
  }

  toggleState(dio) {
    this.state = !this.state;

    if (this.state) {
      dio.classList.add('chatbox--active');
    } else {
      dio.classList.remove('chatbox--active');
    }
  }

  onSendButton(dio) {
    var textField = dio.querySelector('input');
    let text1 = textField.value;
    if (text1 === '') {
      return;
    }

    let msg1 = { name: 'User', message: text1 };
    this.messages.push(msg1);
    this.updateChatText();
    textField.value = '';

    this.showLoader();

    fetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text1 }),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(r => r.json())
      .then(r => {
         let msg2 = { name: "dio", message:     r.message };
         this.messages.push(msg2);
         this.updateChatText();
         textField.value = '';

         this.removeLoader();
      })
       .catch((error) => {
        console.error('Error:', error);
        this.updateChatText();
        textField.value = '';

        this.removeLoader();
      });
    }

  updateChatText() {
    var html = '';
    this.messages
      .slice()
      .reverse()
      .forEach(function (item, index) {
        if (item.name === 'dio') {
          html +=
            '<div class="messages__item messages__item--visitor">' +
            item.message +
            '</div>';
        } else {
          html +=
            '<div class="messages__item messages__item--oprator">' +
            item.message +
            '</div>';
        }
      });

    const dio = this.args.dio;
    const chatmessage = dio.querySelector('.chatbox__messages');
    chatmessage.innerHTML = html;
  }

  showLoader() {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    loader.innerHTML = `
      <span class="loader__dot"></span>
      <span class="loader__dot"></span>
      <span class="loader__dot"></span>
    `;
    const chatmessage = this.args.dio.querySelector('.chatbox__messages');
    chatmessage.appendChild(loader);
  }

  removeLoader() {
    const loader = this.args.dio.querySelector('.loader');
    if (loader) {
      const chatmessage = this.args.dio.querySelector('.chatbox__messages');
      chatmessage.removeChild(loader);
    }
  }
}

const dio = new DioArafi();
dio.display();    
    
