const buttons = document.querySelectorAll(".button");
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const clickedButton = event.target;
    const firstChildValue = clickedButton.firstElementChild.innerText;
    const firstPTagContent = clickedButton.closest(".nww-bet-slip-wrp-col3").querySelector(".nww-bet-slip-wrp-col3-txt1 p").innerText;
    const nextTR = clickedButton.closest("tr").nextElementSibling;
    const secondPTag = nextTR.querySelector(".nww-bet-slip-wrp-col3-txt1 p:last-child");
    secondPTag.textContent = `${firstPTagContent} ${firstChildValue}`;
  });
});