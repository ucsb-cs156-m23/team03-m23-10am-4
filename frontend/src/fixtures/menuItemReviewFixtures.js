const menuItemReviewFixtures = {
    /*
    {
  "itemId": 0,
  "reviewerEmail": "string",
  "stars": 0,
  "dateReviewed": "2023-08-05T03:58:55.563Z",
  "comments": "string",
  "id": 0
}
    */

    oneMenuItemReview: {
        "id": 1,
        "itemId": 1,
        "reviewerEmail": "test@ucsb.edu",
        "stars": 5,
        "dateReviewed": "2023-08-05T03:58:55.563Z",
        "comments": "This is a test review"
    },

    threeMenuItemReviews: [
        {
            "id": 1,
            "itemId": 1,
            "reviewerEmail": "test1@ucsb.edu",
            "stars": 5,
            "dateReviewed": "2023-08-03T03:58:55.563Z",
            "comments": "This is a test review 1"
        },
        {
            "id": 2,
            "itemId": 1337,
            "reviewerEmail": "test2@ucsb.edu",
            "stars": 5,
            "dateReviewed": "2023-08-04T03:58:55.563Z",
            "comments": "This is a test review 2"
        },
        {
            "id": 3,
            "itemId": 123,
            "reviewerEmail": "test3@ucsb.edu",
            "stars": 5,
            "dateReviewed": "2023-08-05T03:58:55.563Z",
            "comments": "This is a test review 3"
        }
    ]
};

export { menuItemReviewFixtures };