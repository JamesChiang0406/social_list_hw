// 資料來源
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users'
const favoriteList = JSON.parse(localStorage.getItem('favoriteUsers'))
let filterUsers = []

// 要監聽的地方
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// 此為主頁呈現資料
function renderSocialList(listData) {
  let rawHTML = ''
  listData.forEach((item) => {
    rawHTML += `<div class="card text-left rounded m-2" style="width: 10rem;">
                <img src="${item.avatar}" class="card-img-top" alt="user-card">
                <div class="card-body p-2">
                  <h5 class="card-title">${item.name}</h5>
                  <div class="text-right mt-3">
                    <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
                    <button class="btn btn-primary btn-detail" data-toggle="modal" data-target="#user-modal" data-id="${item.id}">More</button>
                  </div>
                </div>
              </div>`
  })
  dataPanel.innerHTML = rawHTML
}

// 此為點擊按鈕時，呈現個人資料
function showDetail(id) {
  const detailData = favoriteList.find((user) => user.id === id)
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

// 刪除的方程式
function removeFromFavorite(id) {
  if (!favoriteList) return

  const listIndex = favoriteList.findIndex((user) => user.id === id)
  if (listIndex === -1) return
  favoriteList.splice(listIndex, 1)

  localStorage.setItem('favoriteUsers', JSON.stringify(favoriteList))
  renderSocialList(favoriteList)
}

// 事件監聽器
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-detail')) {
    showDetail(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

// 搜尋的監聽器
searchForm.addEventListener('input', function onSearchFormSubmitted(event) {
  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()
  filterUsers = favoriteList.filter((user) => user.name.toLowerCase().includes(keyword))

  renderSocialList(filterUsers)
})

renderSocialList(favoriteList)