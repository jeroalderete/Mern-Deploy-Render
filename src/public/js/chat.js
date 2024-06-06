const socket = io();

let user;
let chatBox = document.getElementById('chatBox');
let log = document.getElementById("messageLogs");
let data;

let username = document.getElementById('chatBox').value

socket.on('message', msg => {
    data = msg;
});

socket.on('messageLogs', msgs => {
    renderizar(msgs);
});

const renderizar = (messages) => {
    let messageHTML = "";

    messages.forEach(message => {
        const isCurrentUser = message.user === user;
        const messageClass = isCurrentUser ? 'my-message' : 'other-message';
        messageHTML += `<div class="${messageClass}">${message.user} : ${message.message}</div>`;
    });

    log.innerHTML = messageHTML;
    chatBox.scrollIntoView(false);
};

Swal.fire({
    title: "Identificate",
    input: "email",
    inputLabel: "Your email address",
    inputPlaceholder: "Ingresa un correo electrónico para identificarte",
    inputValidator: (value) => {
        if (!value) {
            return 'Necesitas un correo para ingresar';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            return 'Ingresa un correo electrónico válido';
        }

        return null;
    },
    allowOutsideClick: false
}).then(result => {
    if (result.isConfirmed) {
        user = result.value;
        renderizar(data);
    }
});

chatBox.addEventListener('keyup', evt => {
    if (evt.key === 'Enter') {
        if (chatBox.value.trim().length > 0) {
            const message = chatBox.value;

            socket.emit('message', { user, message });
            chatBox.value = '';
        }
    }
});

socket.on('nuevo_user', data => {
   Swal.fire({
    text: `Nuevo usuario se ha conectado`,
    toast: true,
    position: 'top-right'
   });
});
