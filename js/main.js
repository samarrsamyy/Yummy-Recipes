/// <reference types="../@types/@types/jquery" />

const showData = $("#showData");
const btnNav = $(".close-open");
const menu = $(".nav-side");

$(getMeals("c=Chicken"));

function openMenu() {
  btnNav.removeClass("fa-bars");
  btnNav.addClass("fa-x");
  menu.animate(
    {
      left: 0,
    },
    500
  );

  for (let i = 0; i < 5; i++) {
    $(".links li").animate(
      {
        top: 0,
      },
      (i + 5) * 100
    );
  }
}

function closeMenu() {
  btnNav.addClass("fa-bars");
  btnNav.removeClass("fa-x");
  menu.animate(
    {
      left: -$(".nav-menu").outerWidth(),
    },
    500
  );

  $(".links li").animate(
    {
      top: 300,
    },
    500
  );
}

closeMenu();
btnNav.on("click", function () {
  if ($(this).hasClass("fa-bars")) {
    openMenu();
  } else {
    closeMenu();
  }
});

// ! get Meals by Category/Area
async function getMeals(request) {
  $(".loading").fadeIn(500);

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${request}`
  );
  const response = await api.json();

  displayData(response.meals.slice(0, 20));
  $(".loading").fadeOut(500);
}
function displayData(response) {
  let data = ``;
  for (let i = 0; i < response.length; i++) {
    data += `
      <div class="col col-12 col-sm-6 col-md-4 col-lg-3 ">
              <div onclick="getMealRecipe(${response[i].idMeal})" class="box position-relative rounded-3 overflow-hidden" >
                <img
                  src=${response[i].strMealThumb}
                  alt="recipe"
                  class="img-fluid w-100"
                />
                <div
                  class="layer text-black"
                >
                  <h3>${response[i].strMeal}</h3>
                </div>
              </div>
            </div>`;

    showData.html(data);
  }
}

//! Get Recipe by ID
function displayRecipe(meal) {
  let ingredients = ``;

  for (let i = 0; i < 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let data = `
   <div class="col col-12 col-sm-4">
              <div class="image">
                <img
                  src=${meal.strMealThumb}
                  class="rounded-3 w-100"
                  alt=""
                />
              </div>
              <h2 class="title">${meal.strMeal}</h2>
            </div>
            <div class="col col-12 col-md-8">
              <div class="information">
                <h3>Instructions</h3>
                <p>
                  ${meal.strInstructions}
                </p>
                <h3><span class="fw-bolder">Area: </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category: </span>${meal.strCategory}</h3>
                <h3><span class="fw-bolder">Recipes: </span></h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredients}
                </ul>
                <h3><span class="fw-bolder">Tags: </span></h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                  <li class="alert alert-danger m-2 p-1">${meal.strTags}</li>
                </ul>
                <a class="btn btn-success" href="${meal.strSource}" target="_blank">Source</a>
                <a class="btn btn-danger"  href="${meal.strYoutube}" target="_blank">Youtube</a>
              </div>
            </div>
  
  `;
  showData.html(data);
}
async function getMealRecipe(mealID) {
  $(".loading").fadeIn(500);

  const api = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  const response = await api.json();
  displayRecipe(response.meals[0]);

  $(".loading").fadeOut(500);
}

// ! get contact us input
$(".nav-menu .contact").on("click", function () {
  showData.addClass("d-none");
  $(".contact-us").removeClass("d-none");
  $(".contact-us").addClass("d-flex");
  closeMenu();
  $(".search").addClass("d-none");
});

//! get seacrh input
$(".nav-menu .searchbtn").on("click", function () {
  showData.html("");
  closeMenu();
  $(".search").removeClass("d-none");
  $(".contact-us").addClass("d-none");
});

//! search by Name
async function searchByName(mealName) {
  if (mealName) {
    $(".loading").fadeIn(500);
    const api = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    );
    const response = await api.json();

    $(".loading").fadeOut(500);

    if (response.meals) {
      displayData(response.meals.slice(0, 20));
    } else {
      showData.html(
        "<p class='alert alert-danger w-25 m-auto text-center fs-2 fw-bolder'> Not Found</p>"
      );
    }
  }
}

$("#searchByName").on("blur", function () {
  searchByName($("#searchByName").val());
});

$("#searchByName").on("keyup", function (e) {
  if (e.key == "Enter") {
    searchByName($("#searchByName").val());
  }
});

//! search by First letter

async function searchByLetter(Letter) {
  showData.html("");
  if (Letter) {
    $(".loading").fadeIn(500);
    const api = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${Letter}`
    );
    const response = await api.json();

    $(".loading").fadeOut(500);

    if (response.meals) {
      displayData(response.meals.slice(0, 20));
    } else {
      showData.html(
        "<p class='alert alert-danger w-25 m-auto text-center fs-2 fw-bolder'> Not Found</p>"
      );
    }
  }
}

const letter = $("#searchByLetter");
letter.attr("maxlength", "1");
letter.on("keyup", function () {
  showData.removeClass("d-none");

  searchByLetter(letter.val());
});

//! get Categories

async function getCategories() {
  $(".loading").fadeIn(500);

  const api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  const response = await api.json();

  displayCategory(response.categories.slice(0, 20));
  $(".loading").fadeOut(500);
}

function displayCategory(response) {
  let data = ``;
  for (let i = 0; i < response.length; i++) {
    data += `
       <div class="col col-12 col-sm-3">
              <div onclick="getMeals('c=${response[i].strCategory}')" class="box position-relative rounded-3 overflow-hidden">
                <img
                  src=${response[i].strCategoryThumb}
                  alt="recipe"
                  class="img-fluid"
                />
                <div class="layer2 text-black">
                  <h3>${response[i].strCategory}</h3>
                  <p>
                   ${response[i].strCategoryDescription}
                  </p>
                </div>
              </div>
            </div>`;

    showData.html(data);
  }
}

$(".categories").on("click", function () {
  getCategories();
  showData.removeClass("d-none");
  closeMenu();
  $(".contact-us").addClass("d-none");
  $(".search").addClass("d-none");
});

//! get Areas

async function getAreas() {
  $(".loading").fadeIn(500);

  const api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
  );
  const response = await api.json();

  displayAreas(response.meals);
  $(".loading").fadeOut(500);
}

function displayAreas(response) {
  let data = ``;
  for (let i = 0; i < response.length; i++) {
    data += `
       <div class="col col-12 col-sm-3">
              <div  onclick="getMeals('a=${response[i].strArea}')" class="box position-relative rounded-3 overflow-hidden text-center">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${response[i].strArea}</h3>
              </div>
            </div>`;

    showData.html(data);
  }
}

$(".area").on("click", function () {
  getAreas();
  closeMenu();
  showData.removeClass("d-none");
  $(".search").addClass("d-none");
  $(".contact-us").addClass("d-none");
});

//! get Ingredients
async function getIngredients() {
  $(".loading").fadeIn(500);

  const api = await fetch(
    "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
  );
  const response = await api.json();

  displayIngredients(response.meals.slice(0, 20));
  $(".loading").fadeOut(500);
}

function displayIngredients(response) {
  let data = ``;
  for (let i = 0; i < response.length; i++) {
    data += `
       <div class="col col-12 col-sm-3">
        <div onclick="getMeals('i=${
          response[i].strIngredient
        }')"   class="box position-relative rounded-3 overflow-hidden text-center">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${response[i].strIngredient}</h3>
          <p>${response[i].strDescription.split(" ", 20).join(" ")} </p>
      </div>
      </div>`;
    showData.html(data);
  }
}

$(".ingredients").on("click", function () {
  getIngredients();
  closeMenu();
  showData.removeClass("d-none");
  $(".search").addClass("d-none");
  $(".contact-us").addClass("d-none");
});

//! input validations

function inputValidation(input, errID) {
  let text = input.val();
  const regex = {
    nameInput: /^[a-zA-Z ]+$/,
    emailInput:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phoneInput: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    ageInput: /^[1-9][0-9]?$/,
    passInput: /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/,
  };

  if (regex[input.attr("id")].test(text)) {
    $(errID).addClass("d-none");
    return true;
  } else {
    $(errID).removeClass("d-none");
    return false;
  }
}

function confirmPassword(pass, repass) {
  if (repass.val() === pass.val()) {
    $("#rePassErr").addClass("d-none");
    return true;
  } else {
    $("#rePassErr").removeClass("d-none");
    return false;
  }
}

$("#nameInput").on("keyup", function () {
  // inputValidation($(this), "#nameErr");
  submitInput();
});
$("#emailInput").on("keyup", function () {
  // inputValidation($(this), "#emailErr");
  submitInput();
});
$("#phoneInput").on("keyup", function () {
  // inputValidation($(this), "#phoneErr");
  submitInput();
});
$("#ageInput").on("keyup", function () {
  // inputValidation($(this), "#ageErr");
  submitInput();
});
$("#passInput").on("keyup", function () {
  // inputValidation($(this), "#passErr");
  submitInput();
});
$("#confirmPassInput").on("keyup", function () {
  // confirmPassword($("#passInput"), $(this));
  submitInput();
});

function submitInput() {
  if (
    inputValidation($("#nameInput"), "#nameErr") &&
    inputValidation($("#emailInput"), "#emailErr") &&
    inputValidation($("#phoneInput"), "#phoneErr") &&
    inputValidation($("#ageInput"), "#ageErr") &&
    inputValidation($("#passInput"), "#passErr") &&
    confirmPassword($("#passInput"), $("#confirmPassInput"))
  ) {
    $("#submitBtn").removeAttr("disabled");
  } else {
    $("#submitBtn").attr("disabled", true);
  }
}

$("#submitBtn").on("click", function () {
  $("input").val("");
  $(this).attr("disabled", true);
});
