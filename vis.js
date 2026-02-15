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



  // ----------- REGIONAL SALES VS PLATFORM --------------
  const regionalSalesVPlatform = vl.vconcat(
    vl.markRect()
    .data(data)
      .transform(
        vl.filter('datum["Year"] > 1979 && datum["Year"] <= 2016 '),
        vl.filter('datum["NA_Sales"] > 0')
      )
    .encode(
      vl.x().fieldO('Year'),
      vl.y().fieldN('Platform'),
      vl.color().fieldQ('NA_Sales').aggregate('sum')
        .legend({ title: 'Regional Sales (millions)', orient: 'top' }),
      vl.tooltip([
          { field: 'Year', 
            type: 'ordinal', 
          },
          { field: 'Platform', 
            type: 'nominal', 
          },
          { field: 'NA_Sales', 
            type: 'quantitative', 
            aggregate: 'sum', 
            title: 'NA Sales (millions)',
            format: '$.2f'
          },
        ])  
    )
    .title('Regional Sales: North America (millions)')
    .height(400)
    .width("container"),

    vl.markRect()
    .data(data)
      .transform(
        vl.filter('datum["Year"] > 1979 && datum["Year"] <= 2016 '),
        vl.filter('datum["JP_Sales"] > 0')
      )
    .encode(
      vl.x().fieldO('Year'),
      vl.y().fieldN('Platform'),
      vl.color().fieldQ('JP_Sales').aggregate('sum')
        .legend({ title: 'Regional Sales (millions)', orient: 'top' }),
      vl.tooltip([
          { field: 'Year', 
            type: 'ordinal', 
          },
          { field: 'Platform', 
            type: 'nominal', 
          },
          { field: 'JP_Sales', 
            type: 'quantitative', 
            aggregate: 'sum', 
            title: 'JP Sales (millions)',
            format: '$.2f'
          },
        ])  
    )
    .title('Regional Sales: Japan (millions)')
    .height(400)
    .width("container"),

    vl.markRect()
    .data(data)
      .transform(
        vl.filter('datum["Year"] > 1979 && datum["Year"] <= 2016 '),
        vl.filter('datum["EU_Sales"] > 0')
      )
    .encode(
      vl.x().fieldO('Year'),
      vl.y().fieldN('Platform'),
      vl.color().fieldQ('EU_Sales').aggregate('sum')
        .legend({ title: 'Regional Sales (millions)', orient: 'top' }),
      vl.tooltip([
          { field: 'Year', 
            type: 'ordinal', 
          },
          { field: 'Platform', 
            type: 'nominal', 
          },
          { field: 'EU_Sales', 
            type: 'quantitative', 
            aggregate: 'sum', 
            title: 'EU Sales (millions)',
            format: '$.2f'
          },
        ])  
    )
    .title('Regional Sales: Europe (millions)')
    .height(400)
    .width("container")
  )
  .toSpec();


  render("#view", globalSalesByGenrePlatform);
  render("#view2", globalSalesByGenrePlatformV2);
  
  render("#view5", regionalSalesVPlatform);
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
