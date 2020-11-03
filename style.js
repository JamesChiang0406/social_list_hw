// URL
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'

// 資料
const users = []
let filterUsers = []
const USER_PER_PAGE = 10

// 要監聽的地方
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

// 此為主頁呈現資料
function renderSocialList(listData) {
  let rawHTML = ''
  listData.forEach((item) => {
    rawHTML += `<div class="card text-left rounded m-2" style="width: 10rem;">
                  <img src="${item.avatar}" class="card-img-top" alt="user-card">
                  <div class="card-body p-2">
                    <div class="d-flex justify-content-start">
                      <h5 class="card-title text-secondary">${item.name}</h5>
                      <button type="button" class="d-flex justify-content-center align-middle btn ml-2 p-0 btn-outline-success rounded-circle btn-add-favorite" data-id="${item.id}" style="height: 23px; width: 23px; line-height: 50%; font-size: 30px;">+</button>
                    </div>
                    <div class="text-right mt-3">
                      <button class="btn btn-primary ml-2 btn-detail" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
                    </div>
                  </div>
                </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// 此為點擊按鈕時，呈現個人資料
function showDetail(id) {
  const detailData = users.find((user) => user.id === id)
  const modalTitle = document.querySelector('#modal-title')
  const modalGender = document.querySelector('#modal-gender')
  const modalAge = document.querySelector('#modal-age')
  const modalBirthday = document.querySelector('#modal-birthday')
  const modalRegion = document.querySelector('#modal-region')
  const modalEmail = document.querySelector('#modal-email')
  const modalImg = document.querySelector('#modal-image')

  modalTitle.textContent = detailData.name
  modalGender.innerText = 'Gender：' + detailData.gender
  modalAge.innerText = 'Age：' + detailData.age
  modalBirthday.innerText = 'Birthday：' + detailData.birthday
  modalRegion.innerText = 'Region：' + detailData.region
  modalEmail.innerText = 'Email：' + detailData.email
  modalImg.innerHTML = `<img id="modal-image" src="${detailData.avatar}" alt="user-img" class="rounded-circle mb-2">`
}

// 增添至喜歡名單的函式
function addToFavorite(id) {
  const favoriteList = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const favoriteUser = users.find((user) => user.id === id)

  if (favoriteList.some((user) => user.id === id)) {
    return alert('This person had been added !!!')
  }

  favoriteList.push(favoriteUser)
  localStorage.setItem('favoriteUsers', JSON.stringify(favoriteList))
}

// 分頁有幾頁
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USER_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

// 從分頁取出應顯示的使用戶
function getUserByPage(page) {
  const data = filterUsers.length ? filterUsers : users
  const startIndex = (page - 1) * USER_PER_PAGE

  if (startIndex < 0) {
    filterUsers = []
  }

  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

// 事件監聽器
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-detail')) {
    showDetail(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('input', function onSearchFormSubmitted(event) {
  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()

  filterUsers = users.filter((user) => user.name.toLowerCase().includes(keyword))

  if (filterUsers.length === 0) {
    renderSocialList(getUserByPage(0))
    renderPaginator(0)
  } else {
    renderSocialList(getUserByPage(1))
    renderPaginator(filterUsers.length)
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderSocialList(getUserByPage(page))
})

// 獲取主要資料
axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderSocialList(getUserByPage(1))
    renderPaginator(users.length)
  })
  .catch((err) => console.log(err))