import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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

describe("HelpRequestCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 17,
            title: "Please help us",
            requester: "10am Team 4",
            localDateTime: "2022-02-02T00:00",
            requestBody: "We need help with testing"
        };

        axiosMock.onPost("/api/helprequest/post").reply( 202, helpRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("HelpRequestForm-title")).toBeInTheDocument();
        });

        const titleField = screen.getByTestId("HelpRequestForm-title");
        const requesterField = screen.getByTestId("HelpRequestForm-requester");
        const requestDateTimeField = screen.getByTestId("HelpRequestForm-requestDateTime");
        const requestBodyField = screen.getByTestId("HelpRequestForm-requestBody");
        const submitButton = screen.getByTestId("HelpRequestForm-submit");

        fireEvent.change(titleField, { target: { value: 'Please help us' } });
        fireEvent.change(requesterField, { target: { value: '10am Team 4' } });
        fireEvent.change(requestDateTimeField, { target: { value: '2022-02-02T00:00' } });
        fireEvent.change(requestBodyField, { target: { value: "We need help with testing" } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "title": "Please help us",
                "requester": "10am Team 4",
                "requestDateTime": "2022-02-02T00:00",
                "requestBody": "We need help with testing"
        });

        expect(mockToast).toBeCalledWith("New helpRequest Created - id: 17 title: Please help us");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
    });


});


