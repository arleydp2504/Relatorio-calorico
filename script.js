// Definindo a constante para a conversão de calorias para peso
const CALORIAS_PARA_1KG = 7700; // Aproximadamente 7700 calorias para perder ou ganhar 1kg

// Função para gerar os dias do mês
function gerarTabela() {
    let tabela = '';
    for (let i = 1; i <= 31; i++) {
        tabela += `
            <tr>
                <td>${i}</td>
                <td><input type="number" id="calorias-gastas-${i}" value="0"></td>
                <td><input type="number" id="calorias-ingeridas-${i}" value="0"></td>
                <td id="deficit-${i}" class="deficit-zero">0</td>
                <td id="peso-${i}" class="peso-zero">0</td>
            </tr>
        `;
    }
    document.getElementById('days-table').innerHTML = tabela;
}

// Função para carregar os dados salvos do localStorage
function carregarDados() {
    for (let i = 1; i <= 31; i++) {
        let caloriasGastas = localStorage.getItem(`calorias-gastas-${i}`);
        let caloriasIngeridas = localStorage.getItem(`calorias-ingeridas-${i}`);
        let deficit = localStorage.getItem(`deficit-${i}`);
        let peso = localStorage.getItem(`peso-${i}`);
        
        if (caloriasGastas !== null) {
            document.getElementById(`calorias-gastas-${i}`).value = caloriasGastas;
        }
        if (caloriasIngeridas !== null) {
            document.getElementById(`calorias-ingeridas-${i}`).value = caloriasIngeridas;
        }
        if (deficit !== null) {
            document.getElementById(`deficit-${i}`).innerText = deficit;
        }
        if (peso !== null) {
            document.getElementById(`peso-${i}`).innerText = peso;
        }
    }
    
    // Carregar o valor total de peso perdido/ganho
    let totalPeso = localStorage.getItem('total-peso');
    if (totalPeso !== null) {
        document.getElementById('total-weight').innerText = totalPeso;
    } else {
        document.getElementById('total-weight').innerText = '0.0 Kg';
    }
}

// Função para salvar os dados no localStorage
function salvarDados() {
    for (let i = 1; i <= 31; i++) {
        let caloriasGastas = document.getElementById(`calorias-gastas-${i}`).value;
        let caloriasIngeridas = document.getElementById(`calorias-ingeridas-${i}`).value;
        let deficit = document.getElementById(`deficit-${i}`).innerText;
        let peso = document.getElementById(`peso-${i}`).innerText;
        
        localStorage.setItem(`calorias-gastas-${i}`, caloriasGastas);
        localStorage.setItem(`calorias-ingeridas-${i}`, caloriasIngeridas);
        localStorage.setItem(`deficit-${i}`, deficit);
        localStorage.setItem(`peso-${i}`, peso);
    }
    
    // Salvar o valor total de peso perdido/ganho
    let totalPeso = document.getElementById('total-weight').innerText;
    localStorage.setItem('total-peso', totalPeso);
}

// Função para calcular o peso perdido ou ganho
function calcularPeso() {
    let totalPeso = 0;
    for (let i = 1; i <= 31; i++) {
        let caloriasGastas = parseFloat(document.getElementById(`calorias-gastas-${i}`).value);
        let caloriasIngeridas = parseFloat(document.getElementById(`calorias-ingeridas-${i}`).value);
        let deficit = caloriasIngeridas - caloriasGastas; // Se positivo, é excesso de calorias; se negativo, déficit
        let pesoAlterado = deficit / CALORIAS_PARA_1KG;

        // Atualizando o campo de déficit e peso
        document.getElementById(`deficit-${i}`).innerText = deficit.toFixed(2);
        document.getElementById(`peso-${i}`).innerText = pesoAlterado.toFixed(4);

        // Mudando a cor com base no valor
        if (deficit > 0) {
            document.getElementById(`deficit-${i}`).className = 'deficit-positive';
        } else if (deficit < 0) {
            document.getElementById(`deficit-${i}`).className = 'deficit-negative';
        } else {
            document.getElementById(`deficit-${i}`).className = 'deficit-zero';
        }

        if (pesoAlterado > 0) {
            document.getElementById(`peso-${i}`).className = 'peso-positive';
        } else if (pesoAlterado < 0) {
            document.getElementById(`peso-${i}`).className = 'peso-negative';
        } else {
            document.getElementById(`peso-${i}`).className = 'peso-zero';
        }

        totalPeso += pesoAlterado;
    }

    // Exibindo o total de peso perdido ou ganho
    document.getElementById('total-weight').innerText = totalPeso.toFixed(2) + " Kg";

    // Salvar os dados de calorias, déficit e peso
    salvarDados();
}

// Função para resetar os dados (limpar todos os campos e localStorage)
function resetarDados() {
    for (let i = 1; i <= 31; i++) {
        document.getElementById(`calorias-gastas-${i}`).value = 0;
        document.getElementById(`calorias-ingeridas-${i}`).value = 0;
        document.getElementById(`deficit-${i}`).innerText = 0;
        document.getElementById(`peso-${i}`).innerText = 0;
        document.getElementById(`deficit-${i}`).className = 'deficit-zero';
        document.getElementById(`peso-${i}`).className = 'peso-zero';
    }

    document.getElementById('total-weight').innerText = '0.0 Kg';

    localStorage.clear();

    // Chamar a função para recalcular após resetar
    calcularPeso();
}

// Inicializa a tabela e os cálculos
gerarTabela();

// Carrega os dados do localStorage
carregarDados();

// Atualiza os cálculos sempre que os inputs forem alterados
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
        calcularPeso();
        salvarDados(); // Salva os dados sempre que o input for alterado
    });
});

