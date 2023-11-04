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
  // ul 요소의 스타일을 변경합니다. 화면에 표시할 수 있는 최대 개수 이상의 할 일이 있을 때 스타일을 조정함.
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