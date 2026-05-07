// Firebase 모듈 import
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    push, 
    remove, 
    update, 
    onValue 
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-database.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyCtwX-qQerUbCe4_4u89r-SHA6HWwVh0oc",
    authDomain: "scemo-todo-backend.firebaseapp.com",
    databaseURL: "https://scemo-todo-backend-default-rtdb.firebaseio.com",
    projectId: "scemo-todo-backend",
    storageBucket: "scemo-todo-backend.firebasestorage.app",
    messagingSenderId: "719765357217",
    appId: "1:719765357217:web:b026753ac647f01423e6e0"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const todosRef = ref(database, 'todos');

let todos = [];
let currentFilter = 'all';
let currentSort = 'dueDate';

const todoInput = document.getElementById('todoInput');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const quickDateBtns = document.querySelectorAll('.quick-date-btn');
const toast = document.getElementById('toast');

// 모달 요소
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalConfirm = document.getElementById('modalConfirm');
const modalCancel = document.getElementById('modalCancel');

// 오늘 날짜를 기본값으로 설정
const today = new Date().toISOString().split('T')[0];
startDate.value = today;

// 토스트 알림 함수
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 커스텀 모달 함수
function showModal(title, message, type = 'alert') {
    return new Promise((resolve) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.add('show');
        
        if (type === 'alert') {
            modalCancel.style.display = 'none';
            modalConfirm.textContent = '확인';
        } else if (type === 'confirm') {
            modalCancel.style.display = 'inline-block';
            modalConfirm.textContent = '확인';
        }
        
        const handleConfirm = () => {
            modal.classList.remove('show');
            cleanup();
            resolve(true);
        };
        
        const handleCancel = () => {
            modal.classList.remove('show');
            cleanup();
            resolve(false);
        };
        
        const handleBackdropClick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                cleanup();
                resolve(false);
            }
        };
        
        const cleanup = () => {
            modalConfirm.removeEventListener('click', handleConfirm);
            modalCancel.removeEventListener('click', handleCancel);
            modal.removeEventListener('click', handleBackdropClick);
        };
        
        modalConfirm.addEventListener('click', handleConfirm);
        modalCancel.addEventListener('click', handleCancel);
        modal.addEventListener('click', handleBackdropClick);
    });
}

function customAlert(message, title = '알림') {
    return showModal(title, message, 'alert');
}

function customConfirm(message, title = '확인') {
    return showModal(title, message, 'confirm');
}

// Realtime Database 실시간 리스너 설정
onValue(todosRef, (snapshot) => {
    todos = [];
    const data = snapshot.val();
    if (data) {
        Object.keys(data).forEach((key) => {
            todos.push({
                id: key,
                ...data[key]
            });
        });
    }
    renderTodos();
});

// 이벤트 리스너
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderTodos();
});

quickDateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const days = parseInt(btn.dataset.days);
        const date = new Date();
        date.setDate(date.getDate() + days);
        endDate.value = date.toISOString().split('T')[0];
    });
});

async function addTodo() {
    const text = todoInput.value.trim();
    const start = startDate.value;
    const end = endDate.value;
    
    if (text === '') {
        await customAlert('할일을 입력해주세요!');
        return;
    }
    
    if (!start || !end) {
        await customAlert('시작일과 종료일을 입력해주세요!');
        return;
    }
    
    if (new Date(start) > new Date(end)) {
        await customAlert('시작일은 종료일보다 이전이어야 합니다!');
        return;
    }
    
    try {
        await push(todosRef, {
            text: text,
            startDate: start,
            endDate: end,
            createdAt: Date.now()
        });
        
        todoInput.value = '';
        startDate.value = today;
        endDate.value = '';
        todoInput.focus();
        
        showToast('할일이 추가되었습니다!', 'success');
    } catch (error) {
        console.error('할일 추가 오류:', error);
        await customAlert('할일 추가에 실패했습니다.', '오류');
    }
}

async function deleteTodo(id) {
    const result = await customConfirm('정말로 삭제하시겠습니까?', '삭제 확인');
    if (result) {
        try {
            const todoRef = ref(database, `todos/${id}`);
            await remove(todoRef);
            showToast('할일이 삭제되었습니다!', 'info');
        } catch (error) {
            console.error('할일 삭제 오류:', error);
            await customAlert('할일 삭제에 실패했습니다.', '오류');
        }
    }
}

function startEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const todoText = todoItem.querySelector('.todo-text');
    const editInput = todoItem.querySelector('.todo-edit-input');
    
    todoItem.classList.add('editing');
    todoText.style.display = 'none';
    editInput.classList.add('active');
    editInput.value = todoText.textContent;
    editInput.focus();
    editInput.select();
}

async function saveEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const editInput = todoItem.querySelector('.todo-edit-input');
    const newText = editInput.value.trim();
    
    if (newText === '') {
        await customAlert('할일을 입력해주세요!');
        return;
    }
    
    try {
        const todoRef = ref(database, `todos/${id}`);
        await update(todoRef, {
            text: newText
        });
        showToast('할일이 수정되었습니다!', 'success');
    } catch (error) {
        console.error('할일 수정 오류:', error);
        await customAlert('할일 수정에 실패했습니다.', '오류');
    }
}

function cancelEdit(id) {
    renderTodos();
}

// 현재 날짜 기준으로 자동으로 상태 계산
function calculateStatus(startDate, endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    if (today < start) {
        return 'pending';
    } else if (today >= start && today <= end) {
        return 'inProgress';
    } else {
        return 'completed';
    }
}

// D-day 계산
function calculateDday(endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        return { text: `D-${diffDays}`, class: 'upcoming' };
    } else if (diffDays === 0) {
        return { text: 'D-Day', class: 'today' };
    } else {
        return { text: `D+${Math.abs(diffDays)}`, class: 'overdue' };
    }
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
}

function getStatusLabel(status) {
    switch (status) {
        case 'pending':
            return '대기';
        case 'inProgress':
            return '진행중';
        case 'completed':
            return '완료';
        default:
            return '대기';
    }
}

function getFilteredTodos() {
    let filtered = todos;
    
    switch (currentFilter) {
        case 'pending':
            filtered = todos.filter(todo => calculateStatus(todo.startDate, todo.endDate) === 'pending');
            break;
        case 'inProgress':
            filtered = todos.filter(todo => calculateStatus(todo.startDate, todo.endDate) === 'inProgress');
            break;
        case 'completed':
            filtered = todos.filter(todo => calculateStatus(todo.startDate, todo.endDate) === 'completed');
            break;
    }
    
    return filtered;
}

function sortTodos(todoList) {
    const sorted = [...todoList];
    
    switch (currentSort) {
        case 'dueDate':
            sorted.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
            break;
        case 'created':
            sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            break;
        case 'status':
            sorted.sort((a, b) => {
                const statusOrder = { 'inProgress': 0, 'pending': 1, 'completed': 2 };
                const statusA = calculateStatus(a.startDate, a.endDate);
                const statusB = calculateStatus(b.startDate, b.endDate);
                return statusOrder[statusA] - statusOrder[statusB];
            });
            break;
    }
    
    return sorted;
}

function renderTodos() {
    const filteredTodos = getFilteredTodos();
    const sortedTodos = sortTodos(filteredTodos);
    
    if (sortedTodos.length === 0) {
        const emptyIcon = currentFilter === 'all' ? '📝' : 
                         currentFilter === 'pending' ? '⏳' :
                         currentFilter === 'inProgress' ? '🚀' : '✅';
        const emptyText = currentFilter === 'all' ? '등록된 할일이 없습니다' :
                         currentFilter === 'pending' ? '대기 중인 할일이 없습니다' :
                         currentFilter === 'inProgress' ? '진행 중인 할일이 없습니다' : '완료된 할일이 없습니다';
        
        todoList.innerHTML = `
            <li class="empty-message">
                <div class="empty-message-icon">${emptyIcon}</div>
                <div class="empty-message-text">${emptyText}</div>
                <div class="empty-message-subtext">새로운 할일을 추가해보세요!</div>
            </li>
        `;
    } else {
        todoList.innerHTML = sortedTodos.map(todo => {
            const status = calculateStatus(todo.startDate, todo.endDate);
            const dday = calculateDday(todo.endDate);
            const statusClass = status === 'completed' && dday.class === 'overdue' ? 'overdue' : status;
            
            return `
                <li class="todo-item ${statusClass}" data-id="${todo.id}">
                    <span class="status-badge ${status}">${getStatusLabel(status)}</span>
                    <div class="todo-content">
                        <span class="todo-text">${escapeHtml(todo.text)}</span>
                        <input type="text" class="todo-edit-input" value="${escapeHtml(todo.text)}">
                        <div class="todo-date-info">
                            <span>📅 ${formatDate(todo.startDate)} ~ ${formatDate(todo.endDate)}</span>
                            <span class="d-day ${dday.class}">${dday.text}</span>
                        </div>
                    </div>
                    <div class="todo-actions">
                        <button class="btn-edit" onclick="startEdit('${todo.id}')">수정</button>
                        <button class="btn-save" onclick="saveEdit('${todo.id}')">저장</button>
                        <button class="btn-cancel" onclick="cancelEdit('${todo.id}')">취소</button>
                        <button class="btn-delete" onclick="deleteTodo('${todo.id}')">삭제</button>
                    </div>
                </li>
            `;
        }).join('');
    }
    
    updateFilterCounts();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateFilterCounts() {
    const all = todos.length;
    const pending = todos.filter(todo => calculateStatus(todo.startDate, todo.endDate) === 'pending').length;
    const inProgress = todos.filter(todo => calculateStatus(todo.startDate, todo.endDate) === 'inProgress').length;
    const completed = todos.filter(todo => calculateStatus(todo.startDate, todo.endDate) === 'completed').length;
    
    document.getElementById('filterAllCount').textContent = all;
    document.getElementById('filterPendingCount').textContent = pending;
    document.getElementById('filterInProgressCount').textContent = inProgress;
    document.getElementById('filterCompletedCount').textContent = completed;
}

// 전역 함수로 등록 (HTML onclick에서 사용)
window.deleteTodo = deleteTodo;
window.startEdit = startEdit;
window.saveEdit = saveEdit;
window.cancelEdit = cancelEdit;
