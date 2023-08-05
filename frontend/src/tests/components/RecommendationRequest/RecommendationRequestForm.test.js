import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("RecommendationRequestForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Email", "Professor Email", "Explanation/Request", "Date Requested", "Date Needed", "Resolved?"];
    const testId = "RecommendationRequestForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-professorEmail`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-explanation`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-dateRequested`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-dateNeeded`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-done`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm initialContents={recommendationRequestFixtures.oneRequest} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RecommendationRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Your email is required./);
        expect(screen.getByText(/Professor Email is required/)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
        expect(screen.getByText(/Date Requested is required/)).toBeInTheDocument();
        expect(screen.getByText(/Date Needed is required/)).toBeInTheDocument();

        fireEvent.change(screen.getByTestId(`${testId}-requesterEmail`), { target: { value: "a".repeat(101) } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Max length 100 characters/)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByTestId(`${testId}-professorEmail`), { target: { value: "a".repeat(201) } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Max length 200 characters/)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByTestId(`${testId}-explanation`), { target: { value: "a".repeat(1001) } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Max length 1000 characters/)).toBeInTheDocument();
        });

    });

});