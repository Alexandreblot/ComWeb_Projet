'use strict';

let ws = null;

document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket('127.0.0.1', 12345);


    const chatInput = document.getElementById('chat-input');
    chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

function connectWebSocket(ip, port = 12345) {
    try {
        ws = new WebSocket(`ws://${ip}:${port}`);

        ws.onopen = () => setWsStatus(true);
        ws.onclose = () => setWsStatus(false);
        
        ws.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                // On n'affiche le message reçu que s'il ne vient pas de nous-même
                if (msg.login !== window.userLogin) {
                    const type = (msg.role === 'admin') ? 'admin' : 'client';
                    appendBubble(msg.login, msg.message, type, msg.role);
                }
            } catch (err) {
                console.error("Erreur format message reçu", err);
            }
        };
    } catch(err) {
        setWsStatus(false);
    }
}


function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input?.value?.trim();

    if (!text) return;

    appendBubble(window.userLogin || 'Vous', text, 'self');

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            login: window.userLogin || 'Visiteur',
            message: text,
            role: window.userRole || 'client'
        }));
    }

    input.value = '';
}


function appendBubble(login, text, type, role = 'client') {
    const box = document.getElementById('chat-box');
    if (!box) return;

    const welcome = box.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const adminBadge = (role === 'admin' && type !== 'self') 
        ? ` <span class="admin-badge-tag">ADMIN</span>` 
        : '';

    const div = document.createElement('div');
    div.className = `chat-bubble from-${type}`;
    div.innerHTML = `
        <div class="chat-bubble-meta">${login}${adminBadge} · ${time}</div>
        <div class="chat-bubble-text">${text}</div>
    `;

    box.appendChild(div);
    box.scrollTop = box.scrollHeight; // Scroll automatique vers le bas
}

function setWsStatus(online) {
    const badge = document.getElementById('ws-indicator');
    if (!badge) return;
    
    if (online) {
        badge.innerHTML = '<span class="ws-dot"></span>En ligne';
    } else {
        badge.innerHTML = '<span class="ws-dot offline"></span>Hors ligne';
    }
}