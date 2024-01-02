let bookList = [];
let basketList = [];

const toggleModal = () => {
  const basketModal = document.querySelector(".basket_modal");
  basketModal.classList.toggle("active");
};

const toggleMenu = (event) => {
  const menuToggle = document.querySelector(".menu");
  menuToggle.classList.toggle("active");
};

const getBooks = () => {
  fetch("./produckt.json")
    .then((res) => res.json())
    .then((books) => (bookList = books))
    .catch((err) => console.log(err));
};
getBooks();

const creatBookStars = (starRate) => {
  let starRateHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (Math.round(starRate) >= i) {
      starRateHtml += `<i class="bi bi-star-fill active"></i>`;
    } else {
      starRateHtml += `<i class="bi bi-star"></i>`;
    }
  }

  return starRateHtml;
};

const creatBookItemsHtml = () => {
  const bookListEl = document.querySelector(".book_list");

  let booksListHtml = "";
  bookList.forEach((book) => {
    booksListHtml += `
        <div class="book_card">
          <img src="${book.imgSource}" alt="" />
          <div class="book_details_container">
            <div class="book_details">
              <span>${book.author}</span>
              <p class="book-name">${book.name}</p>
              <div class="book_star-rate">
                ${creatBookStars(book.starRate)}
                <p>1232 reviews</p>
              </div>
            </div>
            <p class="book_description">
            ${book.description}
            </p>
            <div class="price_container">
              <span> ${book.price} tl</span>
              ${
                book.oldPrice
                  ? `<span class="old_price"> ${book.oldPrice} tl</span>`
                  : ""
              }
              
            </div>
            <button class="btn_purple" onClick="addBookToBasket(${
              book.id
            })">Sepete Ekle</button>
          </div>
        </div>
        `;
  });

  bookListEl.innerHTML = booksListHtml;
};

const BOOK_TYPES = {
  ALL: "Tümü",
  NOVEL: "Roman",
  CHILDREN: "Çocuk",
  HISTORY: "Tarih",
  FINANCE: "Finans",
  SCIENCE: "Bilim",
  SELFIMPROVEMENT: "Kişisel Gelişim",
  POETRY: "Şiir",
  HORROR: "Korku",
};

const creatBookTypesHtml = () => {
  const filterEle = document.querySelector(".filter");
  let filterHtml = "";
  let filterTypes = ["ALL"];
  bookList.forEach((book) => {
    if (filterTypes.findIndex((filter) => filter === book.type) == -1) {
      filterTypes.push(book.type);
    }
  });

  filterTypes.forEach((type, index) => {
    filterHtml += `<li onClick="filterBooks(this)"  data-types="${type}" class="${
      index == 0 ? "active" : null
    }">${BOOK_TYPES[type] || type}</li>`;
  });

  filterEle.innerHTML = filterHtml;
};

const filterBooks = (filterEl) => {
  document.querySelector(".filter .active").classList.remove("active");
  filterEl.classList.add("active");
  let bookType = filterEl.dataset.types;

  getBooks();
  if (bookType != "ALL") {
    bookList = bookList.filter((book) => book.type == bookType);
  }
  creatBookItemsHtml();
};

const listBasketItems = () => {
  const basketListEl = document.querySelector(".basket_list");
  const basketCountEl = document.querySelector(".basket_count");
  const totalQuantity = basketList.reduce((total,item) => total + item.quantity,0);
  basketCountEl.innerHTML = totalQuantity > 0 ? totalQuantity : "";
  // basketCountEl.innerHTML = basketList.length > 0 ? basketList.reduce(total,item) : null;
  const totalPriceEl = document.querySelector(".total-price");
  let totalPrice = 0;
  let basketListHtml = "";
  basketList.forEach((item) => {
    totalPrice += item.product.price * item.quantity;
    
    basketListHtml += `<li class="basket_item">
    <img src="${item.product.imgSource}" alt="" width="100" />
    <div class="basket_item-info">
      <h3>${item.product.name}</h3>
      <span> <span class="book_price">${item.product.price}</span> tl</span>
      <span class="book_remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
    </div>
    <div class="book_count">
      <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
      <span class="mx-2">${item.quantity}</span>
      <span class="increase" onClick="increaseItemToBasket(${item.product.id})">+</span>
    </div>
  </li>`;
  });

  basketListEl.innerHTML = basketListHtml
    ? basketListHtml
    : `<li class="basket_item empty_basket">Sepette herhangi bir ürün bulunmuyor.
  Sepete ürün ekleyin.</li> `;

 

  

  totalPriceEl.innerHTML = totalPrice > 0 ? totalPrice.toFixed(2) : 0;
};

const addBookToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);
  if (findedBook) {
    const basketAlreadyIndex = basketList.findIndex(
      (basket) => basket.product.id == bookId
    );
    if(findedBook.stock > 0){
      if (basketAlreadyIndex == -1) {
        let addItem = { quantity: 1, product: findedBook };
        basketList.push(addItem);
      } else{
        basketList[basketAlreadyIndex].quantity += 1;
      } 

      findedBook.stock -= 1;
    } else{
      alert("Üzgünüz bu ürünün stok durumu yetersiz")
    }
    console.log(findedBook.stock)
  }

  const basketPriceContainer = document.querySelector(".add-check");
  basketPriceContainer.style.visibility = "visible";

  listBasketItems();
};

const removeItemBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);

  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  console.log(basketList)

  if (findedIndex != -1) {
    if(basketList[findedIndex].quantity > 0){

    findedBook.stock += basketList[findedIndex].quantity

    basketList.splice(findedIndex, 1);

    }

  }else{
    const basketPriceContainer = document.querySelector(".add-check");
    basketPriceContainer.style.visibility = "hidden";

  }

  if(basketList.length === 0 ){
    const basketPriceContainer = document.querySelector(".add-check");
    basketPriceContainer.style.visibility = "hidden";
  }

  listBasketItems();
};

const decreaseItemToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);

  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );
  if (findedIndex != -1) {
    if (basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1;
      findedBook.stock += 1;
    } else {
      removeItemBasket(bookId);
      findedBook.stock += 1;

    }
  }

  listBasketItems();

};

const increaseItemToBasket = (bookId) => {
  let findedBook = bookList.find((book) => book.id == bookId);

  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == bookId
  );

  if(findedBook.stock > 0){
    if (findedIndex != -1) {
      basketList[findedIndex].quantity += 1;
    }

    findedBook.stock -= 1;
  } else{
    alert("Üzgünüz bu ürünün stok durumu yetersiz")
  }

  listBasketItems();
};

setTimeout(() => {
  creatBookTypesHtml();

  creatBookItemsHtml();
}, 100);
