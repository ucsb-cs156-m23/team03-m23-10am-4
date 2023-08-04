const recommendationRequestFixtures = {
    oneRequest: [
        {
            "id": 1,
            "requesterEmail": "testing1@ucsb.edu",
            "professorEmail": "request1@ucsb.edu",
            "explanation": "I need a recommendation for a job",
            "dateRequested": "2021-05-01T00:00:00.000+00:00",
            "dateNeeded": "2021-05-15T00:00:00.000+00:00",
            "done": false
        }
    ],

    threeRequests: [
        {
            "id": 1,
            "requesterEmail": "testing1@ucsb.edu",
            "professorEmail": "request1@ucsb.edu",
            "explanation": "I need a recommendation for a job",
            "dateRequested": "2021-05-01T00:00:00.000+00:00",
            "dateNeeded": "2021-08-15T00:00:00.000+00:00",
            "done": false
        },

        {
            "id": 2,
            "requesterEmail": "testing2@ucsb.edu",
            "professorEmail": "request2@ucsb.edu",
            "explanation": "I need a recommendation for a job part 2",
            "dateRequested": "2021-06-01T00:00:00.000+00:00",
            "dateNeeded": "2021-07-15T00:00:00.000+00:00",
            "done": false

        },
        {
            "id": 3,
            "requesterEmail": "testing3@ucsb.edu",
            "professorEmail": "request3@ucsb.edu",
            "explanation": "I need a recommendation for a job part 3",
            "dateRequested": "2021-1-01T00:00:00.000+00:00",
            "dateNeeded": "2021-10-15T00:00:00.000+00:00",
            "done": false
        }
    ]


};

export {recommendationRequestFixtures};