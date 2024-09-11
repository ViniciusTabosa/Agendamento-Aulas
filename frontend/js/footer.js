//Função para carregar o footer


function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o footer:', error));
}

// Carregar o Footer ao carregar a página
window.addEventListener('DOMContentLoaded', loadFooter);
