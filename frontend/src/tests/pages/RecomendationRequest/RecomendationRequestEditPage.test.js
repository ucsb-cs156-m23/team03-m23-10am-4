import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecomendationRequestEditPage from "main/pages/RecomendationRequest/RecomendationRequestEditPage";

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

describe("RecomendationRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/recommendationrequest", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecomendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Recommendation Request");
            expect(screen.queryByTestId("requestorEmail")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/recommendationrequest", { params: { id: 17 } }).reply(200, {
                id: 17,
                requesterEmail: "testing1@ucsb.edu",
                professorEmail: "request1@ucsb.edu",
                explanation: "I need a recommendation for a job",
                dateRequested: "2021-05-01T00:00:00.000",
                dateNeeded: "2021-05-15T00:00:00.000",
                done: false
            });
            axiosMock.onPut('/api/recommendationrequest').reply(200, {
                id: 17,
                requesterEmail: "testing17@ucsb.edu",
                professorEmail: "request17@ucsb.edu",
                explanation: "I don't need anything anymore",
                dateRequested: "2021-05-01T00:00:00.000",
                dateNeeded: "2021-05-15T00:00:00.000",
                done: false
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RecomendationRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RecommendationRequestForm-id");

            const idField = screen.getByTestId("RecommendationRequestForm-id");
            const emailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
            const profField = screen.getByTestId("RecommendationRequestForm-professorEmail");
            const descriptionField = screen.getByTestId("RecommendationRequestForm-explanation");
            const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("testing1@ucsb.edu");
            expect(profField).toBeInTheDocument();
            expect(profField).toHaveValue("request1@ucsb.edu");
            expect(descriptionField).toBeInTheDocument();
            expect(descriptionField).toHaveValue("I need a recommendation for a job");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(emailField, { target: { value: 'testing17@ucsb.edu' } });
            fireEvent.change(profField, { target: { value: 'request17@ucsb.edu' } });
            fireEvent.change(descriptionField, { target: { value: 'I don\'t need anything anymore' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Recommendation Request Updated - id: 17");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "testing17@ucsb.edu",
                professorEmail: "request17@ucsb.edu",
                explanation: "I don't need anything anymore",
                dateRequested: "2021-05-01T00:00:00.000",
                dateNeeded: "2021-05-15T00:00:00.000",
                done: false
            })); // posted object


        });

        // test("Changes when you click Update", async () => {

        //     render(
        //         <QueryClientProvider client={queryClient}>
        //             <MemoryRouter>
        //                 <RecomendationRequestEditPage />
        //             </MemoryRouter>
        //         </QueryClientProvider>
        //     );

        //     await screen.findByTestId("RecommendationRequestForm-id");

        //     const idField = screen.getByTestId("RecommendationRequestForm-id");
        //     const nameField = screen.getByTestId("RecommendationRequestForm-name");
        //     const descriptionField = screen.getByTestId("RecommendationRequestForm-description");
        //     const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        //     expect(idField).toHaveValue("17");
        //     expect(nameField).toHaveValue("Freebirds");
        //     expect(descriptionField).toHaveValue("Burritos");
        //     expect(submitButton).toBeInTheDocument();

        //     fireEvent.change(nameField, { target: { value: 'Freebirds World Burrito' } })
        //     fireEvent.change(descriptionField, { target: { value: 'Big Burritos' } })

        //     fireEvent.click(submitButton);

        //     await waitFor(() => expect(mockToast).toBeCalled());
        //     expect(mockToast).toBeCalledWith("Restaurant Updated - id: 17 name: Freebirds World Burrito");
        //     expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });
        // });

       
    });
});
