function searchProduct() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const products = document.querySelectorAll('#catalogo .card');
  const mensagemBusca = document.getElementById('mensagemBusca');
  let found = false;
  let firstMatch = null;

  if (input.trim() === "") {
    products.forEach(product => {
      product.style.display = "block";
    });
    mensagemBusca.classList.remove('show');
  } else {
    products.forEach(product => {
      const title = product.querySelector('h3').textContent.toLowerCase();
      if (title.includes(input)) {
        product.style.display = "block";
        if (!found) firstMatch = product;
        found = true;
      } else {
        product.style.display = "none";
      }
    });

    if (!found) {
      mensagemBusca.textContent = `Nenhum produto encontrado para: "${input}"`;
      mensagemBusca.classList.add('show');
    } else {
      mensagemBusca.classList.remove('show');
      if (firstMatch) {
        setTimeout(() => {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      }
    }
  }
}

document.getElementById('searchInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    searchProduct();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  const cardsContainer = document.querySelector("#catalogo");
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  produtos.forEach((prod, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.animationDelay = `${index * 0.1}s`;
    div.innerHTML = `
      <img src="${prod.imagem}" alt="${prod.nome}">
      <h3>${prod.nome}</h3>
      <p>R$ ${prod.preco}</p>
    `;
    cardsContainer.appendChild(div);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(element => {
  observer.observe(element);
});
