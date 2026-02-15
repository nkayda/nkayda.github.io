async function fetchData() {
  const data = await d3.csv("/datasets/videogames_wide.csv");
  return data;
}

async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec);
  result.view.run();
}

// Specified colours for the genres, per built-in JS colours
genreColours = [
  "crimson",
  "darkcyan",
  "cornsilk",
  "darkseagreen",
  "deeppink",
  "lavendar",
  "lightblue",
  "darkred",
  "sandybrown",
  "slategray",
  "turquoise",
  "darkmagenta",
];

fetchData().then(async (data) => {

  // ----------- GLOBAL SALES BY GENRE AND PLATFORM --------------

  const globalSalesByGenrePlatform = vl
    .markBar()
    .data(data)
    .encode(
      vl.y().fieldQ('Global_Sales').aggregate('sum')
        .axis({ title: "Global Sales (millions)" }),
      vl.x().fieldO('Platform'),
      vl.color().fieldN('Genre').scale({range: genreColours}),
      vl.tooltip([
        { field: 'Genre', 
          type: 'nominal', 
          title: 'Genre'
        },
        { field: 'Global_Sales', 
          type: 'quantitative', 
          aggregate: 'sum', 
          title: 'Global Sales (millions)',
          format: '$.2f'
        }
      ])
    )
    .title('Global Sales by Genre and Platform')
    .width("container")
    .height(400)
    .toSpec();

  const globalSalesByGenrePlatformV2 = vl
    .markBar()
    .data(data)
    .transform(
      vl.filter('datum["Genre"] == "Puzzle"'),
      vl.filter('datum["Publisher"] == "Nintendo"'),
    )
    .encode(
      vl.y().fieldQ('Global_Sales').aggregate('sum')
        .axis({ title: "Global Sales (millions)" }),
      vl.x().fieldO('Platform').sort("-y"),
      vl.color().fieldN("Name").sort("-y")
        .legend({ title: 'Game Title', symbolLimit: 100, columns: 3, labelLimit: 300, orient: 'bottom' }),
      vl.tooltip([
        { field: 'Genre', 
          type: 'nominal', 
          title: 'Genre'
        },
        { field: 'Name', 
          type: 'nominal', 
          title: 'Name'
        },
        { field: 'Global_Sales', 
          type: 'quantitative', 
          aggregate: 'sum', 
          title: 'Global Sales (millions)',
          format: '$.2f'
        }
      ])
    )
    .title('Global Sales of Nintendo Puzzle Games by Platform')
    .width("container")
    .height(400)
    .toSpec();



  // ----------- GLOBAL SALES BY GENRE AND PLATFORM --------------


  
  render("#view", globalSalesByGenrePlatform);
  render("#view2", globalSalesByGenrePlatformV2);
});

// --- ASSIGNMENT 2 -----------------------------------------------------------

let circles = document.querySelectorAll("circle");

circles.forEach((circle) => {
  circle.addEventListener("click", () => {
    if (circle.getAttribute("fill") == "red") {
      circle.setAttribute("fill", "black");
    } else {
      circle.setAttribute("fill", "red");
    }
  });
});
