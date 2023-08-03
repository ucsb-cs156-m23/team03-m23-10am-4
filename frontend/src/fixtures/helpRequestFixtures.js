const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "title": "Help",
        "requestDateTime": "2023-08-03T12:00:00",
        "requester": "Iain",
        "requestBody": "Help me please"
    },
    threeHelpRequests: [
        {
          "id": 1,
          "title": "Help",
          "requestDateTime": "2023-08-03T12:00:00",
          "requester": "Iain",
          "requestBody": "Help me please"
        },
        {
          "id": 2,
          "title": "Help Again",
          "requestDateTime": "2023-08-03T12:05:00",
          "requester": "Iain",
          "requestBody": "Help me please again"
        },
        {
          "id": 3,
          "title": "Help Final",
          "requestDateTime": "2023-08-03T12:15:00",
          "requester": "Iain",
          "requestBody": "Help me please I'm asking one last time"
        }
    ]
};


export { helpRequestFixtures };