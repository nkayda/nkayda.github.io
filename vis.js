let circles = document.querySelectorAll('circle');

circles.forEach((circle) => {
  circle.addEventListener('click', () => {
    if (circle.getAttribute("fill") == 'red'){
        circle.setAttribute("fill", 'black');
    }
    else {
        circle.setAttribute('fill', 'red');
    }
  });
});