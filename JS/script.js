// Инициализация состояния приложения
document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-links a');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Кнопки входа/регистрации
    const desktopLoginBtn = document.getElementById('desktopLoginBtn');
    const desktopRegisterBtn = document.getElementById('desktopRegisterBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    const showLoginFromHero = document.getElementById('showLoginFromHero');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    
    // Элементы профиля пользователя
    const logoutBtnMobile = document.getElementById('logoutBtnMobile');
    const logoutBtnDesktop = document.getElementById('logoutBtnDesktop');
    const userGreetingMobile = document.getElementById('userGreetingMobile');
    const userGreetingDesktop = document.getElementById('userGreetingDesktop');
    const desktopAuthButtons = document.getElementById('desktopAuthButtons');
    const mobileAuthButtons = document.getElementById('mobileAuthButtons');
    const desktopUserProfile = document.getElementById('desktopUserProfile');
    const mobileUserProfile = document.getElementById('mobileUserProfile');
    
    // Другие элементы
    const loader = document.getElementById('loader');
    const notification = document.getElementById('notification');
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const markAllCompletedBtn = document.getElementById('markAllCompleted');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const exportTasksBtn = document.getElementById('exportTasks');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');
    const footerLinks = document.querySelectorAll('.footer-section a[data-page]');
    
    // Бургер меню
    const burgerMenu = document.getElementById('burgerMenu');
    const navLinksContainer = document.getElementById('navLinks');
    
    // Модальное окно редактирования
    const editModal = document.getElementById('editModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editTodoForm = document.getElementById('editTodoForm');
    const editTodoText = document.getElementById('editTodoText');

    // Состояние приложения
    let currentUser = null;
    let todos = [];
    let editingTodoId = null;
    let isMobileMenuOpen = false;

    // Инициализация
    initApp();

    // Инициализация приложения
    function initApp() {
        checkAuth();
        setupEventListeners();
        updateStats();
        updateUserUI(); // Инициализация правильного отображения UI
    }

    // Проверка авторизации
    function checkAuth() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
            loadUserTodos();
            showPage('todo');
        } else {
            showPage('home');
        }
        updateUserUI();
    }

    // Загрузка задач пользователя
    function loadUserTodos() {
        if (!currentUser) return;
        
        const userTodos = localStorage.getItem(`todos_${currentUser.username}`);
        if (userTodos) {
            todos = JSON.parse(userTodos);
            renderTodos();
        } else {
            todos = [];
        }
    }

    // Сохранение задач пользователя
    function saveUserTodos() {
        if (!currentUser) return;
        localStorage.setItem(`todos_${currentUser.username}`, JSON.stringify(todos));
    }

    // Обновление UI пользователя
    function updateUserUI() {
        const isMobile = window.innerWidth <= 1024;
        
        if (currentUser) {
            // Пользователь авторизован
            
            // Обновляем приветствия
            const greetingText = `Привет, ${currentUser.username}!`;
            userGreetingMobile.textContent = greetingText;
            userGreetingDesktop.textContent = greetingText;
            
            // На мобильных устройствах
            if (isMobile) {
                // Показываем мобильный профиль, скрываем мобильные кнопки входа
                mobileUserProfile.style.display = 'flex';
                mobileAuthButtons.style.display = 'none';
                
                // Скрываем десктопные элементы
                desktopUserProfile.style.display = 'none';
                desktopAuthButtons.style.display = 'none';
            } 
            // На десктопах
            else {
                // Показываем десктопный профиль, скрываем десктопные кнопки входа
                desktopUserProfile.style.display = 'flex';
                desktopAuthButtons.style.display = 'none';
                
                // Скрываем мобильные элементы (они находятся внутри меню)
                mobileUserProfile.style.display = 'none';
                mobileAuthButtons.style.display = 'none';
            }
        } else {
            // Пользователь не авторизован
            
            // Очищаем приветствия
            userGreetingMobile.textContent = '';
            userGreetingDesktop.textContent = '';
            
            // На мобильных устройствах
            if (isMobile) {
                // Показываем мобильные кнопки входа, скрываем мобильный профиль
                mobileAuthButtons.style.display = 'flex';
                mobileUserProfile.style.display = 'none';
                
                // Скрываем десктопные элементы
                desktopUserProfile.style.display = 'none';
                desktopAuthButtons.style.display = 'none';
            } 
            // На десктопах
            else {
                // Показываем десктопные кнопки входа, скрываем десктопный профиль
                desktopAuthButtons.style.display = 'flex';
                desktopUserProfile.style.display = 'none';
                
                // Скрываем мобильные элементы (они находятся внутри меню)
                mobileAuthButtons.style.display = 'none';
                mobileUserProfile.style.display = 'none';
            }
        }
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Бургер меню
        burgerMenu.addEventListener('click', toggleMobileMenu);
        
        // Закрытие мобильного меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    closeMobileMenu();
                }
            });
        });

        // Навигация
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                
                if (page === 'todo' && !currentUser) {
                    showPage('auth');
                    showNotification('Для доступа к задачам необходимо войти в аккаунт', 'info');
                } else {
                    showPage(page);
                }
            });
        });

        // Ссылки в подвале
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                
                if (page === 'todo' && !currentUser) {
                    showPage('auth');
                    showNotification('Для доступа к задачам необходимо войти в аккаунт', 'info');
                } else {
                    showPage(page);
                }
            });
        });

        // Кнопки входа
        desktopLoginBtn.addEventListener('click', () => {
            showPage('auth');
            document.querySelector('[data-form="login"]').click();
        });
        
        mobileLoginBtn.addEventListener('click', () => {
            showPage('auth');
            document.querySelector('[data-form="login"]').click();
            if (window.innerWidth <= 1024) {
                closeMobileMenu();
            }
        });
        
        showLoginFromHero.addEventListener('click', () => {
            showPage('auth');
            document.querySelector('[data-form="login"]').click();
        });

        // Кнопки регистрации
        desktopRegisterBtn.addEventListener('click', () => {
            showPage('auth');
            document.querySelector('[data-form="register"]').click();
        });
        
        mobileRegisterBtn.addEventListener('click', () => {
            showPage('auth');
            document.querySelector('[data-form="register"]').click();
            if (window.innerWidth <= 1024) {
                closeMobileMenu();
            }
        });
        
        showRegisterBtn.addEventListener('click', () => {
            showPage('auth');
            document.querySelector('[data-form="register"]').click();
        });

        // Вкладки авторизации
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const form = tab.getAttribute('data-form');
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                authForms.forEach(f => f.classList.remove('active'));
                document.getElementById(`${form}Form`).classList.add('active');
            });
        });

        // Форма входа
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            
            loginUser(username, password);
        });

        // Форма регистрации
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            registerUser(username, email, password, confirmPassword);
        });

        // Выход из аккаунта
        logoutBtnMobile.addEventListener('click', logoutUser);
        logoutBtnDesktop.addEventListener('click', logoutUser);

        // Добавление задачи
        addTodoBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });

        // Пометить все как выполненное
        markAllCompletedBtn.addEventListener('click', markAllCompleted);

        // Очистка выполненных задач
        clearCompletedBtn.addEventListener('click', clearCompleted);

        // Экспорт задач
        exportTasksBtn.addEventListener('click', exportTasks);
        
        // Модальное окно редактирования
        closeEditModal.addEventListener('click', () => {
            editModal.classList.remove('active');
        });
        
        cancelEdit.addEventListener('click', () => {
            editModal.classList.remove('active');
        });
        
        editTodoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEditedTodo();
        });
        
        // Закрытие модального окна при клике вне его
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                editModal.classList.remove('active');
            }
        });
        
        // Закрытие мобильного меню при клике вне его
        document.addEventListener('click', (e) => {
            if (isMobileMenuOpen && 
                !navLinksContainer.contains(e.target) && 
                !burgerMenu.contains(e.target) &&
                window.innerWidth <= 1024) {
                closeMobileMenu();
            }
        });
        
        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            updateUserUI();
            // Закрываем мобильное меню при переходе на десктоп
            if (window.innerWidth > 1024 && isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    }

    // Переключение мобильного меню
    function toggleMobileMenu() {
        if (!isMobileMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }

    // Открытие мобильного меню
    function openMobileMenu() {
        navLinksContainer.classList.add('active');
        burgerMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        isMobileMenuOpen = true;
    }

    // Закрытие мобильного меню
    function closeMobileMenu() {
        navLinksContainer.classList.remove('active');
        burgerMenu.classList.remove('active');
        document.body.style.overflow = '';
        isMobileMenuOpen = false;
    }

    // Показать страницу
    function showPage(pageId) {
        if (!currentUser && (pageId === 'todo')) {
            pageId = 'auth';
        }
        
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });
        
        // Прокрутка вверх при смене страницы
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Показать уведомление
    window.showNotification = function(message, type = 'success') {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Добавить иконку в зависимости от типа
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'warning' ? 'fa-exclamation-triangle' :
                    'fa-info-circle';
        notification.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Показать/скрыть загрузчик
    function showLoader(show) {
        if (show) {
            loader.classList.add('active');
        } else {
            setTimeout(() => {
                loader.classList.remove('active');
            }, 300);
        }
    }

    // Регистрация пользователя
    function registerUser(username, email, password, confirmPassword) {
        showLoader(true);
        
        // Валидация
        if (password !== confirmPassword) {
            showLoader(false);
            showNotification('Пароли не совпадают', 'error');
            return;
        }
        
        if (password.length < 6) {
            showLoader(false);
            showNotification('Пароль должен содержать минимум 6 символов', 'error');
            return;
        }
        
        // Проверка существующего пользователя
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        if (existingUsers.find(u => u.username === username)) {
            showLoader(false);
            showNotification('Пользователь с таким именем уже существует', 'error');
            return;
        }
        
        // Создание нового пользователя
        const newUser = {
            username,
            email,
            password: btoa(password),
            createdAt: new Date().toISOString()
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        
        showLoader(false);
        showNotification('Регистрация успешна! Теперь вы можете войти.', 'success');
        
        // Автоматический вход после регистрации
        loginUser(username, password);
    }

    // Вход пользователя
    function loginUser(username, password) {
        showLoader(true);
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === btoa(password));
        
        if (user) {
            currentUser = {
                username: user.username,
                email: user.email
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loadUserTodos();
            updateUserUI();
            showPage('todo');
            showLoader(false);
            showNotification(`Добро пожаловать, ${username}!`, 'success');
            
            // Закрываем мобильное меню если открыто
            if (window.innerWidth <= 1024) {
                closeMobileMenu();
            }
        } else {
            showLoader(false);
            showNotification('Неверное имя пользователя или пароль', 'error');
        }
    }

    // Выход пользователя
    function logoutUser() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        todos = [];
        renderTodos();
        updateUserUI();
        showPage('home');
        showNotification('Вы успешно вышли из аккаунта', 'success');
        
        // Закрываем мобильное меню если открыто
        if (window.innerWidth <= 1024) {
            closeMobileMenu();
        }
    }

    // Добавление задачи
    function addTodo() {
        if (!currentUser) {
            showPage('auth');
            showNotification('Для добавления задач необходимо войти в аккаунт', 'info');
            return;
        }
        
        const text = todoInput.value.trim();
        if (!text) {
            showNotification('Введите текст задачи', 'error');
            return;
        }
        
        const newTodo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: 'medium'
        };
        
        todos.unshift(newTodo);
        saveUserTodos();
        renderTodos();
        updateStats();
        
        todoInput.value = '';
        todoInput.focus();
        
        // Анимация добавления
        const firstTodo = document.querySelector('.todo-item');
        if (firstTodo) {
            firstTodo.style.animation = 'pulse 0.5s ease-out';
            setTimeout(() => {
                firstTodo.style.animation = '';
            }, 500);
        }
        
        showNotification('Задача добавлена', 'success');
    }

    // Рендер задач
    function renderTodos() {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            todoList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--gray);">
                    <i class="fas fa-tasks" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Задач пока нет. Добавьте первую!</p>
                </div>
            `;
            return;
        }
        
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', todo.id);
            
            const date = new Date(todo.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            li.innerHTML = `
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}">
                    ${todo.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="todo-text">${todo.text}</div>
                <div class="todo-date">${date}</div>
                <div class="todo-actions">
                    <button class="todo-edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="todo-delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            todoList.appendChild(li);
            
            // Обработчики для элементов задачи
            const checkbox = li.querySelector('.todo-checkbox');
            const deleteBtn = li.querySelector('.todo-delete');
            const editBtn = li.querySelector('.todo-edit');
            
            checkbox.addEventListener('click', () => toggleTodo(todo.id));
            deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            editBtn.addEventListener('click', () => openEditModal(todo.id));
        });
    }

    // Открытие модального окна редактирования
    function openEditModal(todoId) {
        const todo = todos.find(t => t.id === todoId);
        if (!todo) return;
        
        editingTodoId = todoId;
        editTodoText.value = todo.text;
        
        editModal.classList.add('active');
    }

    // Сохранение отредактированной задачи
    function saveEditedTodo() {
        if (editingTodoId === null) return;
        
        const todoIndex = todos.findIndex(t => t.id === editingTodoId);
        if (todoIndex === -1) return;
        
        const newText = editTodoText.value.trim();
        if (!newText) {
            showNotification('Текст задачи не может быть пустым', 'error');
            return;
        }
        
        todos[todoIndex].text = newText;
        
        saveUserTodos();
        renderTodos();
        updateStats();
        editModal.classList.remove('active');
        editingTodoId = null;
        
        showNotification('Задача обновлена', 'success');
    }

    // Переключение статуса задачи
    function toggleTodo(id) {
        const todoIndex = todos.findIndex(t => t.id === id);
        if (todoIndex !== -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            saveUserTodos();
            renderTodos();
            updateStats();
            
            // Анимация переключения
            const todoItem = document.querySelector(`[data-id="${id}"]`);
            if (todoItem) {
                todoItem.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    todoItem.style.transform = '';
                }, 300);
            }
        }
    }

    // Удаление задачи
    function deleteTodo(id) {
        if (!confirm('Удалить эту задачу?')) return;
        
        todos = todos.filter(t => t.id !== id);
        saveUserTodos();
        renderTodos();
        updateStats();
        showNotification('Задача удалена', 'success');
    }

    // Пометить все задачи как выполненные
    function markAllCompleted() {
        if (todos.length === 0) {
            showNotification('Нет задач для отметки', 'info');
            return;
        }
        
        let updated = false;
        todos.forEach(todo => {
            if (!todo.completed) {
                todo.completed = true;
                updated = true;
            }
        });
        
        if (updated) {
            saveUserTodos();
            renderTodos();
            updateStats();
            showNotification('Все задачи отмечены как выполненные', 'success');
        } else {
            showNotification('Все задачи уже выполнены', 'info');
        }
    }

    // Очистка выполненных задач
    function clearCompleted() {
        const completedCount = todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            showNotification('Нет выполненных задач для очистки', 'info');
            return;
        }
        
        if (!confirm(`Удалить ${completedCount} выполненных задач?`)) return;
        
        todos = todos.filter(t => !t.completed);
        saveUserTodos();
        renderTodos();
        updateStats();
        showNotification(`Удалено ${completedCount} выполненных задач`, 'success');
    }

    // Экспорт задач
    function exportTasks() {
        if (todos.length === 0) {
            showNotification('Нет задач для экспорта', 'info');
            return;
        }
        
        const exportData = {
            user: currentUser.username,
            exportDate: new Date().toISOString(),
            totalTasks: todos.length,
            completedTasks: todos.filter(t => t.completed).length,
            todos: todos
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `ToDoList_${currentUser.username}_${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('Задачи успешно экспортированы', 'success');
    }

    // Обновление статистики
    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        
        totalTasksSpan.textContent = `Всего задач: ${total}`;
        completedTasksSpan.textContent = `Выполнено: ${completed}`;
    }
});