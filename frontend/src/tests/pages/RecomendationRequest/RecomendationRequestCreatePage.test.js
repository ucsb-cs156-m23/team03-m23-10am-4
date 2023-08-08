import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecomendationRequestCreatePage from "main/pages/RecomendationRequest/RecomendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecomendationRequestCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecomendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /recommendationrequest", async () => {

        const queryClient = new QueryClient();
        const request = {
            id: 12,
            requesterEmail: "testing12@ucsb.edu",
            professorEmail: "request12@ucsb.edu",
            explanation: "I need a job",
            dateRequested: "2021-05-01T00:00:00.000",
            dateNeeded: "2021-05-15T00:00:00.000",
            done: false
        };

        axiosMock.onPost("/api/recommendationrequest/post").reply(202, request);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecomendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Email")).toBeInTheDocument();
        });

        const email = screen.getByLabelText("Email");
        expect(email).toBeInTheDocument();
        const prof = screen.getByLabelText("Professor Email");
        expect(prof).toBeInTheDocument();
        const exp = screen.getByLabelText("Explanation/Request");
        expect(exp).toBeInTheDocument();
        const dateR = screen.getByLabelText("Date Requested");
        expect(dateR).toBeInTheDocument();
        const dateE = screen.getByLabelText("Date Needed");
        expect(dateE).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(email, { target: { value: 'testing12@ucsb.edu' } })
        fireEvent.change(prof, { target: { value: 'request12@ucsb.edu' } })
        fireEvent.change(exp, { target: { value: 'I need a job' } })
        fireEvent.change(dateR, { target: { value: '2021-05-01T00:00:00.000' } })
        fireEvent.change(dateE, { target: { value: '2021-05-15T00:00:00.000' } })
        
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "testing12@ucsb.edu",
            professorEmail: "request12@ucsb.edu",
            explanation: "I need a job",
            id: undefined,
            dateRequested: "2021-05-01T00:00",
            dateNeeded: "2021-05-15T00:00",
            done: false
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New request Created - email: testing12@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });

    });
});


