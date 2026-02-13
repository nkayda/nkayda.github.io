async function fetchData() {
  const data = await d3.csv("/datasets/videogames_wide.csv");
  return data;
}

async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec);
  result.view.run();
}

fetchData().then(async (data) => {
  const vlSpec = vl
    .markBar()
    .data(data)
    .encode(
      vl.y().fieldN("Platform").sort("-x"),
      vl.x().fieldQ("Global_Sales").aggregate("sum")
    )
    .width("container")
    .height(400)
    .toSpec();

  render("#view", vlSpec);
});







// --- ASSIGNMENT 1 -----------------------------------------------------------

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