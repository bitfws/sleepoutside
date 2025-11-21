import { getLocalStorage, setLocalStorage } from "./utils.mjs";

const reviewsElement = document.querySelector("#reviews-content");
const addReviewBtn = document.getElementById("add-review-btn");

export default class Reviews {
  constructor(product_id) {
    this.product_id = product_id;
    this.reviews = [];
    this.loadReviews();
    this.renderInput();
  }

  loadReviews() {
    const data = getLocalStorage("reviews") || {};
    this.reviews = data[this.product_id] || [];
  }

  saveReviews() {
    const data = getLocalStorage("reviews") || {};
    data[this.product_id] = this.reviews;
    setLocalStorage("reviews", data);
  }

  show() {
    const cards = this.reviews
      .map(
        (review) => `
        <div class="review-card divider">
            <div class='review-avatar'></div>
            <p>${review.review}</p>

        </div>
      `,
        /* 
        <span>
          <button class="edit-btn" data-id="${review.id}">
            Edit
          </button>
          <button class="remove-btn" data-id="${review.id}">
            Remove
          </button>
        </span>, */
      )
      .join("");

    reviewsElement.innerHTML = cards || "There are no reviews yet.";

    this.addEventListeners();
  }

  addEventListeners() {
    const editButtons = reviewsElement.querySelectorAll(".edit-btn");
    editButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        this.edit(id);
      });
    });

    const removeButtons = reviewsElement.querySelectorAll(".remove-btn");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        this.remove(id);
      });
    });
  }

  renderInput() {
    addReviewBtn.addEventListener("click", () => {
      if (!document.getElementById("review-input")) {
        const input = document.createElement("textarea");
        input.id = "review-input";
        input.cols = "50";
        input.placeholder = "Write your review here...";

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Review";
        saveButton.id = "save-review-btn";

        saveButton.addEventListener("click", () => {
          const reviewText = input.value.trim();
          if (reviewText) {
            this.add(reviewText);
            input.value = "";
          } else {
            alert("Please enter a review.");
          }
        });

        reviewsElement.prepend(input);
        reviewsElement.prepend(saveButton);
      }
    });
  }

  add(review) {
    const newId = this.reviews.length
      ? this.reviews[this.reviews.length - 1].id + 1
      : 1;
    const newReview = { id: newId, review };
    this.reviews.unshift(newReview);
    this.saveReviews();
    this.show();
  }

  edit(id) {
    const newReviewText = prompt("Edit your review:");
    if (newReviewText) {
      const editReview = this.reviews.find((review) => review.id === id);
      if (editReview) {
        editReview.review = newReviewText;
        this.saveReviews();
        this.show();
      }
    }
  }

  remove(id) {
    if (confirm("Are you sure you want to delete this review?")) {
      this.reviews = this.reviews.filter((review) => review.id !== id);
      this.saveReviews();
      this.show();
    }
  }
}
