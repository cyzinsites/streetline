const form = document.getElementById("formProduto");
const lista = document.getElementById("listaProdutos");
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let produtoParaRemover = null;

function renderizarProdutos() {
  lista.innerHTML = "";
  produtos.forEach((prod, index) => {
    const div = document.createElement("div");
    div.className = "produto-item";
    div.innerHTML = `
      <img src="${prod.imagem}" alt="Imagem" onerror="this.src='https://via.placeholder.com/80?text=?';">
      <div class="produto-info">
        <strong>${prod.nome}</strong><br>
        R$ ${prod.preco}
      </div>
      <div class="produto-actions">
        <button class="menu-btn" onclick="toggleMenu(${index})">⋮</button>
        <div class="menu-popup" id="menu-${index}">
          <button onclick="editarProduto(${index})">✏️ Editar</button>
          <button onclick="confirmarRemocao(${index})">❌ Remover</button>
        </div>
      </div>
    `;
    lista.appendChild(div);
  });
}

function removerProduto(index) {
  produtos.splice(index, 1);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  renderizarProdutos();
}

function confirmarRemocao(index) {
  produtoParaRemover = index;
  document.getElementById("modalRemover").style.display = "flex";
}

function removerConfirmado() {
  if (produtoParaRemover !== null) {
    removerProduto(produtoParaRemover);
    produtoParaRemover = null;
    fecharModal();
  }
}

function fecharModal() {
  document.getElementById("modalRemover").style.display = "none";
}

function editarProduto(index) {
  const p = produtos[index];
  document.getElementById("editNome").value = p.nome;
  document.getElementById("editPreco").value = p.preco;
  document.getElementById("editImagemUrl").value = "";
  document.getElementById("editIndexFinal").value = index;
  document.getElementById("modalEditar").style.display = "flex";
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  console.log("Form submitted"); // DEBUG
  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
  const imagemUrl = document.getElementById("imagemUrl").value.trim();
  const imagemUpload = document.getElementById("imagemUpload").files[0];
  const editIndex = document.getElementById("editIndex").value;

  let imagemFinal = "https://via.placeholder.com/250x250.png?text=Sem+Imagem";
  if (imagemUrl) {
    imagemFinal = imagemUrl;
  } else if (imagemUpload) {
    imagemFinal = await readFileAsDataURL(imagemUpload);
  }

  const novoProduto = { nome, preco, imagem: imagemFinal };

  if (editIndex === "") {
    produtos.push(novoProduto);
    console.log("Produto adicionado:", novoProduto); // DEBUG
  } else {
    produtos[editIndex] = novoProduto;
    document.getElementById("editIndex").value = "";
  }

  localStorage.setItem("produtos", JSON.stringify(produtos));
  console.log("LocalStorage atualizado:", produtos); // DEBUG
  form.reset();
  renderizarProdutos();
});

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

document.getElementById("searchProduto").addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const itens = document.querySelectorAll(".produto-item");
  itens.forEach(item => {
    const nome = item.querySelector(".produto-info strong").textContent.toLowerCase();
    item.style.display = nome.includes(termo) ? "flex" : "none";
  });
});

function toggleMenu(index) {
  const menu = document.getElementById("menu-" + index);
  const isVisible = menu.style.display === "flex";
  document.querySelectorAll(".menu-popup").forEach(m => m.style.display = "none");
  menu.style.display = isVisible ? "none" : "flex";
}

document.addEventListener("click", function (e) {
  if (!e.target.closest(".produto-actions")) {
    document.querySelectorAll(".menu-popup").forEach(m => m.style.display = "none");
  }
});

function fecharModalEditar() {
  document.getElementById("modalEditar").style.display = "none";
}

document.getElementById("formEditar").addEventListener("submit", async function (e) {
  e.preventDefault();
  const nome = document.getElementById("editNome").value;
  const preco = document.getElementById("editPreco").value;
  const imagemUrl = document.getElementById("editImagemUrl").value.trim();
  const imagemUpload = document.getElementById("editImagemUpload").files[0];
  const index = document.getElementById("editIndexFinal").value;

  let imagemFinal = produtos[index].imagem;

  if (imagemUrl) {
    imagemFinal = imagemUrl;
  } else if (imagemUpload) {
    imagemFinal = await readFileAsDataURL(imagemUpload);
  }

  produtos[index] = { nome, preco, imagem: imagemFinal };
  localStorage.setItem("produtos", JSON.stringify(produtos));
  renderizarProdutos();
  fecharModalEditar();
});

renderizarProdutos();

// Init completo
console.log("Cadastro carregado. Produtos:", produtos.length);

