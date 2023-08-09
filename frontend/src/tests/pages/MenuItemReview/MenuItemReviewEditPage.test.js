import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", {params: {id: 1}}).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const restoreConsole = mockConsole();
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("MenuItemReview-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    /*
        Example:
        {
        "id": 1,
        "itemId": 1,
        "reviewerEmail": "test@ucsb.edu",
        "stars": 5,
        "dateReviewed": "2023-08-05T03:58:55.563Z",
        "comments": "This is a test review"
        },
    */
    describe("tests where backend is working normally", () => {
        const axiosMock = new AxiosMockAdapter(axios);
        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", {params: {id: 1}}).reply(200, {
                "id": 1,
                "itemId": 1,
                "reviewerEmail": "test@ucsb.edu",
                "stars": 5,
                "dateReviewed": "2023-08-05T03:58",
                "comments": "This is a test review"
            });
            axiosMock.onPut("/api/menuitemreview").reply(200, {
                "id": 1,
                "itemId": 2,
                "reviewerEmail": "test2@ucsb.edu",
                "stars": 4,
                "dateReviewed": "2023-08-04T03:58",
                "comments": "This is a test review 2"
            });
        });

        const queryClient = new QueryClient();

        test("Is populated with the data provided", async () => {
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-item-id");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewer-email");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-date-reviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

            expect(idField).toBeInTheDocument();
            expect(itemIdField).toBeInTheDocument();
            expect(reviewerEmailField).toBeInTheDocument();
            expect(starsField).toBeInTheDocument();
            expect(dateReviewedField).toBeInTheDocument();
            expect(commentsField).toBeInTheDocument();

            expect(idField).toHaveValue("1");
            expect(itemIdField).toHaveValue("1");
            expect(reviewerEmailField).toHaveValue("test@ucsb.edu");
            expect(starsField).toHaveValue("5");
            expect(dateReviewedField).toHaveValue("2023-08-05T03:58");
            expect(commentsField).toHaveValue("This is a test review");

            const newItemId = "2";
            const newReviewerEmail = "test2@ucsb.edu";
            const newStars = "4";
            const newDateReviewed = "2023-08-04T03:58";
            const newComments = "This is a test review 2";

            // change all the fields
            fireEvent.change(itemIdField, { target: { value: newItemId } });
            fireEvent.change(reviewerEmailField, { target: { value: newReviewerEmail } });
            fireEvent.change(starsField, { target: { value: newStars } });
            fireEvent.change(dateReviewedField, { target: { value: newDateReviewed } });
            fireEvent.change(commentsField, { target: { value: newComments } });

            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith(`MenuItemReview Updated - id: 1 itemId: ${newItemId} reviewerEmail: ${newReviewerEmail} stars: ${newStars} dateReviewed: ${newDateReviewed} comments: ${newComments}`);
            expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview"});

            expect(axiosMock.history.put.length).toBe(1); // one call
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
                "itemId": newItemId,
                "reviewerEmail": newReviewerEmail,
                "stars": newStars,
                "dateReviewed": newDateReviewed,
                "comments": newComments
            });
        });
    });
});
