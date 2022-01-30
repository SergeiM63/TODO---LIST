(function () {
	const defaultArray = [
		{ name: "Оплатить счета", done: true },
		{ name: "Помыть кошку", done: false },
		{ name: "Пропылесосить", done: true },
		{ name: "Почистить картошку", done: false },
		{ name: "Погладить кота", done: true },
	];

	function createAppTitle(title) {
		const appTitle = document.createElement("h2");
		appTitle.innerHTML = title;
		return appTitle;
	}

	function createTodoItemForm() {
		const form = document.createElement("form");
		const input = document.createElement("input");
		const buttonWrapper = document.createElement("div");
		const button = document.createElement("button");

		form.classList.add("input-group", "mb-3");
		input.classList.add("form-control");
		input.placeholder = "Введите название нового дела";
		buttonWrapper.classList.add("input-group-append");
		button.classList.add("btn", "btn-primary");
		button.textContent = "Добавить дело";
		button.disabled = "true";

		buttonWrapper.append(button);
		form.append(input);
		form.append(buttonWrapper);

		return {
			form,
			input,
			button,
		};
	}

	function createTodoList() {
		const list = document.createElement("ul");
		list.classList.add("list-group");
		return list;
	}

	function createTodoItem(name) {
		const item = document.createElement("li");
		const wrapper = document.createElement("p");
		const buttonGroup = document.createElement("div");
		const doneButton = document.createElement("button");
		const deleteButton = document.createElement("button");

		item.classList.add(
			"list-group-item",
			"d-flex",
			"justify-content-between",
			"align-items-center"
		);

		if (typeof name === "object") {
			const done = name.done;
			if (done) item.classList.add("list-group-item-success");
			name = name.name;
		}

		wrapper.textContent = name;

		buttonGroup.classList.add("btn-group", "btn-group-sm");
		doneButton.classList.add("btn", "btn-success");
		doneButton.textContent = "Готово";
		deleteButton.classList.add("btn", "btn-danger");
		deleteButton.textContent = "Удалить";

		buttonGroup.append(doneButton);
		buttonGroup.append(deleteButton);
		item.append(wrapper);
		item.append(buttonGroup);

		return {
			item,
			wrapper,
			doneButton,
			deleteButton,
		};
	}

	function createTodoApp(container, title = "Список дел", array) {
		const todoAppTitle = createAppTitle(title);
		const todoItemForm = createTodoItemForm();
		const todoList = createTodoList();

		container.append(todoAppTitle);
		container.append(todoItemForm.form);
		container.append(todoList);

		array = JSON.parse(localStorage.getItem(title)) || [...defaultArray];

		if (localStorage.getItem(title) !== null) {
			localStorage.setItem(title, JSON.stringify(array));
		}

		array.forEach((item) => {
			const deal = createTodoItem(item);
			const doneButton = deal.item.querySelector(".btn-success");
			const deleteButton = deal.item.querySelector(".btn-danger");

			doneButton.addEventListener("click", () => {
				deal.item.classList.toggle("list-group-item-success");

				array.filter(item => {
					if (item.name === deal.item.firstChild.textContent) {
						item.done === true ?
						item.done = false :
						item.done = true;
					}
				});
				localStorage.setItem(title, JSON.stringify(array));
			});

			deleteButton.addEventListener("click", () => {
				if (confirm("Вы уверены?")) {
					deal.item.remove();
					array.filter((item, index) => {
						if (item.name === deal.item.firstChild.textContent) {
							array.splice(index, 1);
						}
					});
					localStorage.setItem(title, JSON.stringify(array));
				}
			});
			todoList.append(deal.item);
			localStorage.setItem(title, JSON.stringify(array));
		});

		todoItemForm.form.addEventListener("input", () => {
			todoItemForm.button.removeAttribute("disabled");
			if (todoItemForm.input.value === "")
				todoItemForm.button.disabled = "true";
		});

		todoItemForm.form.addEventListener("submit", function (event) {
			event.preventDefault();

			if (!todoItemForm.input.value) return;

			const todoItem = createTodoItem(todoItemForm.input.value);

			todoItem.doneButton.addEventListener("click", () => {
				todoItem.item.classList.toggle("list-group-item-success");

				array.filter(item => {
					if (item.name === todoItem.item.firstChild.textContent) {
						item.done === true ?
						item.done = false :
						item.done = true;
					}
				});
			});
			
			todoItem.deleteButton.addEventListener("click", () => {
				if (confirm("Вы уверены?")) {
					todoItem.item.remove();
					array.filter((item, index) => {
						if (item.name === todoItem.item.firstChild.textContent) {
							array.splice(index, 1);
						}
					});
					localStorage.setItem(title, JSON.stringify(array));
				}
			});

			todoList.append(todoItem.item);
			todoItemForm.input.value = "";
			todoItemForm.button.disabled = "true";

			const storageDeal = todoItem.item.firstChild.textContent;
			array.push({ name: storageDeal, done: false });
			localStorage.setItem(title, JSON.stringify(array));
		});
	}

	window.createTodoApp = createTodoApp;
})();
