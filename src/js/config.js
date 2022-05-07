let config = {
  style: 'mapbox://styles/dream3r/cl2qevrud002814qofnoztzx7',
  accessToken: 'pk.eyJ1IjoiZHJlYW0zciIsImEiOiJjaXZpZW9xc3owMGduMnlueGo2bTh6aXM0In0.3NH7FMpEYuajlUakJdun7g',
  showMarkers: false,
  markerColor: '#3FB1CE',
  // projection: 'equirectangular',
  // Read more about available projections here
  // https://docs.mapbox.com/mapbox-gl-js/example/projections/
  inset: true,
  theme: 'dark',
  use3dTerrain: false, // set true for enabling 3D maps.
  title: 'Brief introduction of West Nile Virus',
  subtitle: '',
  byline: 'West Nile virus (WNV) is a single-stranded RNA virus that causes West Nile fever, that often breaks out in tropical and temperate regions. It primarily infects birds, but it also infects humans, horses, cats, skunks, squirrels, and domestic rabbits. It is most spread to people by the bite of an infected mosquito.',
  image: "./images/WNVcycle.jpeg",
  footer: 'Source: Data powered by <a href="https://data.cityofchicago.org/Health-Human-Services/West-Nile-Virus-WNV-Mosquito-Test-Results/jqe8-8r6s" target="_blank">Chicago data portal</a> <br> Created using <a href="https://www.mapbox.com/" target="_blank">Mapbox</a>. and <a href="http://turfjs.org/" target="_blank">Turf.js</a>.',
  chapters: [
    {
      id: 'slug-style-id',
      alignment: 'left',
      hidden: false,
      title: 'WNV in United States',
      description: 'The map shows West Nile Virus Disease Cases by State 2021. West Nile virus (WNV) is the leading cause of mosquito-borne disease in the continental United States. ',
      location: {
        center: [-93.70308, 40.10108],
        zoom: 3,
        pitch: 0.00,
        bearing: 0.00
      },
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      callback: '',
      onChapterEnter: [
        {
          layer: 'choropleth-fill',
          opacity: 1,
          duration: 5000
        }
      ],
      onChapterExit: [
        {
          layer: 'choropleth-fill',
          opacity: 0,
          duration: 5000
        }
      ]
    },
    {
      id: 'second-identifier',
      alignment: 'right',
      hidden: false,
      title: 'Data available in Chicago', // zoom in chicago
      image: './path/to/image/source.png',
      description: 'The public health department in Chicago has a decent number of records of WNV and virus around the city.',
      location: {
        center: [-87.69587, 41.85025],
        zoom: 10.03,
        pitch: 0.00,
        bearing: 0.00
        // flyTo additional controls-
        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        // speed: 2, // make the flying slow
        // curve: 1, // change the speed at which it zooms out
      },
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      callback: '',
      onChapterEnter: [
        {
          layer: 'boundary-ajoa1y',
          opacity: 1,
          duration: 5000
        }
      ],
      onChapterExit: [
        {
          layer: 'boundary-ajoa1y',
          opacity: 0.5,
          duration: 5000
        }
      ],
    },
    {
      id: 'third-identifier',
      alignment: 'left',
      hidden: false,
      title: 'Traps',
      image: './images/BG-Sentinel2_Entomologist.jpeg',
      description: 'CDPH places up to 83 traps throughout the city and tests mosquito samples every week. This information guides CDPH’s efforts throughout the season, allowing teams to respond quickly in specific geographic areas to further reduce risks through neighborhood outreach and spraying.',
      location: {
        center: [-87.69513, 41.86336],
        zoom: 10.71,
        pitch: 64.89,
        bearing: -73.58
      },
      mapAnimation: 'flyTo',
      rotateAnimation: true,
      speed: 0.5,
      curve: 0.5,
      callback: '',
      onChapterEnter: [
        {
          layer: 'trap-by-year-1z6xff',
          opacity: 0.5
        },
        {
          layer: 'trap-by-year-1z6xff',
          opacity: 0.95
        },
        {
          layer: 'trap-by-year-1z6xff',
          opacity: 0.5
        },
        {
          layer: 'trap-by-year-1z6xff',
          opacity: 0.95
        }
      ],
      onChapterExit: [
        {
          layer: 'trap-by-year-1z6xff',
          opacity: 0.75
        }
      ],
    },
    {
      id: 'fourth-chapter',
      alignment: 'left',
      hidden: false,
      title: 'Number of mosuiqtoes in each trap by years',
      description: 'This chart shows the total number of moquitoes every year from 2007 to 2021',
      location: {
        center: [-87.70199, 41.86622],
        zoom: 11.07,
        pitch: 72.60,
        bearing: 148.59
      },
      mapAnimation: 'flyTo',
      rotateAnimation: true,
      onChapterEnter: [
        {
          layer: '3D-extrusions',
          opacity: 1
        },
        {
          layer: '3D-extrusions-labels',
          opacity: 1
        }
      ],
      onChapterExit: [
        {
          layer: '3D-extrusions',
          opacity: 0
        }
      ]
    },
    {
      id: 'five-chapter',
      alignment: 'fully',
      hidden: false,
      title: 'Heatmap: Sanitation report',
      description: '311 request data from <a href="https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Sanitation-Code-Complaints-Hi/me59-5fac" target="_blank">Chicago data portal</a>',
      location: {
        center: [-87.70199, 41.86622],
        zoom: 12.03,
        pitch: 0,
        bearing: 0
      },
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      callback: '',
      onChapterEnter: [
        {
          layer: 'heatmap',
          opacity: 1,
          duration: 5000
        }
      ],
      onChapterExit: [
        {
          layer: 'heatmap',
          opacity: 0,
          duration: 5000
        }
      ]
    },
    {
      id: 'sixth-chapter',
      alignment: 'right',
      hidden: false,
      title: 'Spatial features',
      description: 'Parks and water bodies make a pleasant daytime hangout for mosquitoes.',
      location: {
        center: [-87.70199, 41.86622],
        zoom: 10,
        pitch: 0,
        bearing: 0
      },
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      callback: '',
      onChapterEnter: [{
        layer: 'boundary-ajoa1y',
        opacity: 0.1,
        duration: 5000
      },
      {
        layer: 'parks-chicago-park-district-4esozu',
        opacity: 1,
        duration: 5000
      },
      {
        layer: 'waterways-dek4nw',
        opacity: 1,
        duration: 5000
      }
      ],
      onChapterExit: [
        {
          layer: 'parks-chicago-park-district-4esozu',
          opacity: 0,
          duration: 5000,
          hex: 1
        },
        {
          layer: 'waterways-dek4nw',
          opacity: 0,
          duration: 5000
        }]
    },
    {
      id: 'five-chapter',
      alignment: 'right',
      hidden: false,
      title: 'CPHD mosquitoes control',
      image: './images/spray.jpeg',
      description: 'Based on results from its citywide mosquito surveillance program, CDPH has determined the need to spray to kill adult mosquitoes in these communities from 2011 to 2013 (This is all the data I have.). The spray is not harmful to people or pets and is routinely sprayed in residential areas across the nation.',
      location: {
        center: [-58.54195, -34.71600],
        zoom: 4,
        pitch: 0,
        bearing: 0
      },
      mapAnimation: 'flyTo',
      rotateAnimation: false,
      callback: '',
      onChapterEnter: [],
      onChapterExit: []
    }
  ]
};
