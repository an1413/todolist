const $ = (target) => document.querySelector(target);
const todos = JSON.parse(localStorage.getItem('todos')) || [];
const form = $('.input-form');
const input = form.querySelector('input');
const ul = $('.todo-lists');
const modal = $('dialog');
const MAX_LIST_COUNT = 5;


loadStorage();

// 페이지가 로드될 때 호출된다.
function loadStorage() {
  if (todos.length > 0) {
    todos.forEach((text, index) => createTodoElement(text, index));
  }
  // ul 요소의 스타일을 변경합니다. 기존에는 화면에 표시할 수 있는 최대 개수 이상의 할 일이 있을 때 스타일을 조정하여 스크롤이 표시
  if (todos.length >= MAX_LIST_COUNT) {
    ul.style.cssText = 'height: unset; min-height: 1000px';
  }
}

// 로컬 스토리지에 저장
function saveStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 메모생성함수
function createTodoElement(text, index) {
  if (text.trim() === '') return; // 내용이 없으면 메모생성 X

  const li = document.createElement('li'); // <li>요소생성
  li.classList.add('todo-content'); // todo-content class추가
  li.setAttribute('id', index); // id 속성 설정해주기 -> 항목을 식별하는데 사용

  // 텍스트와 버튼(수정 및 삭제)을 포함한 내용설정
  li.innerHTML = `
    <span>${text}</span>
    <div class="todo-btns">
      <button class="edit-Btn" type="button">
        <img src="./assets/editBtn.png" alt="할일수정버튼" />
      </button>
      <button class="delete-Btn" type="button">
        <img src="./assets/deleteBtn.png" alt="할일삭제버튼" />
      </button>
    </div>
  `;

  ul.appendChild(li); // 새로운 할 일 항목이 화면에 표시
}


// 사용자가 할 일을 입력하고 추가 버튼을 클릭했을 때 호출되는 함수
function addTodo() {
  const text = input.value;
  // 입력이 없거나 같은 내용의 할 일이 있는경우 입력창 초기화함.
  if (text === '' || todos.includes(text)) {
    input.value = '';
    return;
  }

  const index = todos.push(text) - 1;
  createTodoElement(text, index);
  saveStorage(); // 로컬 스토리지에 저장
  input.value = ''; // 입력창 초기화
}

// 삭제 혹은 수정
function deleteOrEditTodo(index) {
  const text = prompt('새로운 내용을 입력해주세요');
  if (text === null) return;

  if (text.trim()) {
    todos[index] = text;
    ul.children[index].querySelector('span').textContent = text;
    saveStorage();
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo();
});

ul.addEventListener('click', (event) => {
  const listItem = event.target.closest('.todo-content');
  if (!listItem) return;

  const index = parseInt(listItem.getAttribute('id'));

  if (event.target.classList.contains('delete-Btn')) {
    if (confirm('정말 삭제하시겠습니까?')) {
      todos.splice(index, 1);
      saveStorage();
      ul.removeChild(listItem);
      if (todos.length < MAX_LIST_COUNT) {
        ul.style.cssText = 'height: 561px; min-height: unset';
      }
    }
  } else if (event.target.classList.contains('edit-Btn')) { // 클릭한 요소가 "edit-Btn"인 경우
    deleteOrEditTodo(index);
  }
});

// window.addEventListener('load', loadStorage);

//[할 일]

//edit, delete 버튼
//  edit, delete 모달로 만들기?
//  edit 방식 고민해보기
//로컬스토리지 저장 기능
//listCount 따라서 height랑 min-height 속성 바꿔주기

//로컬스토리지에
//li span textContent값 저장하기
//listCount 저장하기

//todo 로컬 스토리지 전
//* 1. 입력할 수 있는 기능
//*  1-1 콘텐츠의 글자수 제한
//*  1-2 둘중 하나라도 입력을 안했을시 alert 을 띄움
//* 2. 저장을 누를수 있는 기능
//*   2-1 '현재 입력된 todo가 없습니다' 텍스트 사라짐
//*   2-2 저장한 값을 화면에 불러옴
//*   2-3 저장과 동시에 인풋창이 초기화
//*   2-4 저장을 누른 시점의 날짜 기록
//*   2-5 삭제버튼을 누르면 다시 '현재 입력된 todo가 없습니다' 텍스트가 돌아와야함
//* 3. 삭제 기능
//*   3-1 삭제하면 화면에서 사라짐