import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit HelpRequest");
            expect(screen.queryByTestId("HelpRequestForm-title")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "Please help us",
                requester: "10am Team 4",
                requestDateTime: "2022-02-02T00:00",
                requestBody: "We need help with testing"
            });
            axiosMock.onPut('/api/helprequest').reply(200, {
                id: "17",
                title: "Please help us instead",
                requester: "10am Team 2",
                requestDateTime: "2022-02-03T05:00",
                requestBody: "We need help with merging"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-title");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const titleField = screen.getByTestId("HelpRequestForm-title");
            const requesterField = screen.getByTestId("HelpRequestForm-requester");
            const requestDateTimeField = screen.getByTestId("HelpRequestForm-requestDateTime");
            const requestBodyField = screen.getByTestId("HelpRequestForm-requestBody");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("Please help us");
            expect(requesterField).toHaveValue("10am Team 4");
            expect(requestDateTimeField).toHaveValue("2022-02-02T00:00");
            expect(requestBodyField).toHaveValue("We need help with testing");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-title");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const titleField = screen.getByTestId("HelpRequestForm-title");
            const requesterField = screen.getByTestId("HelpRequestForm-requester");
            const requestDateTimeField = screen.getByTestId("HelpRequestForm-requestDateTime");
            const requestBodyField = screen.getByTestId("HelpRequestForm-requestBody");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("Please help us");
            expect(requesterField).toHaveValue("10am Team 4");
            expect(requestDateTimeField).toHaveValue("2022-02-02T00:00");
            expect(requestBodyField).toHaveValue("We need help with testing");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: "Please help us instead" } })
            fireEvent.change(requesterField, { target: { value: "10am Team 2" } })
            fireEvent.change(requestDateTimeField, { target: { value: "2022-02-03T05:00" } })
            fireEvent.change(requestBodyField, { target: { value: "We need help with merging" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("HelpRequest Updated - id: 17 title: Please help us instead");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "Please help us instead",
                requester: "10am Team 2",
                requestDateTime: "2022-02-03T05:00",
                requestBody: "We need help with merging"
            })); // posted object

        });

       
    });
});


