//Função para carregar o header


function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o header:', error));
}

// Carregar o header ao carregar a página
window.addEventListener('DOMContentLoaded', loadHeader);
